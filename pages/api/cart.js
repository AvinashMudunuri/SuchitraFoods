import axiosClient from '../../lib/axiosClient';
import { sdk } from '../../lib/medusa';
import { storage } from '../../utils/storage';
import { initPaymentSession } from './payment';

export const createCart = async (regionId) => {
  try {
    const response = await axiosClient.post('/store/carts', {
      region_id: regionId,
    });
    return response.data.cart;
  } catch (error) {
    console.log(`Error Create Cart==>`, error);
    throw error;
  }
};
export const getCart = async (cartId) => {
  try {
    const response = await axiosClient.get(`/store/carts/${cartId}`, {
      params: {
        fields: '*items.product.variants.options',
      },
    });
    return response.data.cart;
  } catch (error) {
    console.log(`Error Get Cart==>`, error);
    throw error;
  }
};

export const updateCart = async (data) => {
  const cartId = storage.get('CART_ID');
  if (!cartId) {
    throw new Error('No existing cart found when updating cart');
  }
  try {
    const { cart } = await sdk.store.cart.update(cartId, data);
    return cart;
  } catch (error) {
    console.log(`Error Update Cart==>`, error);
    throw error;
  }
};

export const addItemToCart = async (cartId, data) => {
  try {
    const response = await axiosClient.post(
      `/store/carts/${cartId}/line-items`,
      {
        variant_id: data.variant_id,
        quantity: data.quantity,
      }
    );
    return response.data.cart;
  } catch (error) {
    console.log(`Error Add To Cart==>`, error);
    throw error;
  }
};

export const updateItemToCart = async (cartId, data) => {
  try {
    const response = await axiosClient.post(
      `/store/carts/${cartId}/line-items/${data.line_item_id}`,
      {
        quantity: data.quantity,
      }
    );
    return response.data.cart;
  } catch (error) {
    console.log(`Error Update To Cart==>`, error);
    throw error;
  }
};

export const deleteItemFromCart = async (cartId, lineItemId) => {
  try {
    const response = await axiosClient.delete(
      `/store/carts/${cartId}/line-items/${lineItemId}`
    );
    return response.data.parent;
  } catch (error) {
    console.log(`Error Delete Item From Cart==>`, error);
    throw error;
  }
};

export const getShippingOptions = async (cartId) => {
  try {
    const response = await sdk.store.fulfillment.listCartOptions({
      cart_id: cartId,
    });
    return response.shipping_options;
  } catch (error) {
    console.log(`Error getting shipping options ==>`, error);
    throw error;
  }
};

export const calculateShippingPrice = async (cartId, shippingOptionId) => {
  try {
    const response = await axiosClient.post(
      `/store/shipping-options/${shippingOptionId}/calculate`,
      {
        cart_id: cartId,
      }
    );
    return response.data.shipping_option;
  } catch (error) {
    console.log(`Error calculating price ==>`, error);
    throw error;
  }
};

export const addShippingOptionToCart = async (cartId, data) => {
  try {
    const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
      option_id: data.shippingMethodId,
    });
    return cart;
  } catch (error) {
    console.log(`Error Add Shipping Option To Cart==>`, error);
    throw error;
  }
};

export const partialSaveCart = async (
  customer,
  selectedAddress,
  shippingMethod,
  paymentMethod
) => {
  const cartId = storage.get('CART_ID');
  if (!cartId) {
    throw new Error('No existing cart found when setting addresses');
  }

  let data = {
    shipping_address: {},
    billing_address: {},
    email: '',
  };

  if (customer) {
    data.email = customer.email;
  }
  if (customer && customer.addresses.length > 0 && selectedAddress) {
    data.shipping_address = {
      first_name: selectedAddress.first_name,
      last_name: selectedAddress.last_name,
      address_1: selectedAddress.address_1,
      address_2: selectedAddress?.address_2 || '',
      company: '',
      postal_code: selectedAddress.postal_code,
      city: selectedAddress.city,
      country_code: selectedAddress.country_code,
      province: selectedAddress.province,
      phone: selectedAddress.phone,
    };
    data.billing_address = data.shipping_address;
  }

  try {
    const updatedCart = await updateCart(data);
    const updatedCartWithShippingMethod = await addShippingOptionToCart(
      updatedCart.id,
      {
        shippingMethodId: shippingMethod.id,
      }
    );
    const paymentCollection = await initPaymentSession(
      updatedCartWithShippingMethod,
      paymentMethod.id
    );
    const updatedCartWithPaymentCollection = await getCart(
      updatedCartWithShippingMethod.id
    );
    return {
      success: true,
      cart: updatedCartWithPaymentCollection,
      message: 'Cart updated partially',
    };
  } catch (error) {
    console.log(`Error Partial Save Cart==>`, error);
    throw error;
  }
};

export const setAddresses = async (currentState, formData) => {
  try {
    if (!formData) {
      throw new Error('No form data found when setting addresses');
    }
    const cartId = storage.get('CART_ID');
    if (!cartId) {
      throw new Error('No existing cart found when setting addresses');
    }
    const data = {
      shipping_address: {
        first_name: formData.get('shipping_address.first_name'),
        last_name: formData.get('shipping_address.last_name'),
        address_1: formData.get('shipping_address.address_1'),
        address_2: formData.get('shipping_address.address_2'),
        company: formData.get('shipping_address.company'),
        postal_code: formData.get('shipping_address.postal_code'),
        city: formData.get('shipping_address.city'),
        country_code: formData.get('shipping_address.country_code'),
        province: formData.get('shipping_address.province'),
        phone: formData.get('shipping_address.phone'),
      },
      email: formData.get('email'),
    };
    const sameAsBilling = formData.get('same_as_billing');
    if (sameAsBilling) data.billing_address = data.shipping_address;
    if (!sameAsBilling)
      data.billing_address = {
        first_name: formData.get('billing_address.first_name'),
        last_name: formData.get('billing_address.last_name'),
        address_1: formData.get('billing_address.address_1'),
        address_2: formData.get('billing_address.address_2'),
        company: formData.get('billing_address.company'),
        postal_code: formData.get('billing_address.postal_code'),
        city: formData.get('billing_address.city'),
        country_code: formData.get('billing_address.country_code'),
        province: formData.get('billing_address.province'),
        phone: formData.get('billing_address.phone'),
      };
    const cart = await updateCart(data);
    return { success: true, cart };
  } catch (error) {
    console.log(`Error setting addresses==>`, error);
    return { success: false, error: error.message };
  }
};

export const updateCustomerDetailsToCart = async (cartId, data) => {
  let payload = {};
  if (data?.email) {
    payload.email = data.email;
  }
  if (data?.billing_address) {
    payload.billing_address = data.billing_address;
  }
  if (data?.shipping_address) {
    payload.shipping_address = data.shipping_address;
  }
  try {
    const response = await axiosClient.post(`/store/carts/${cartId}`, payload);
    return response.data.cart;
  } catch (error) {
    console.log(`Error Update Customer Details==>`, error);
    throw error;
  }
};

export const placeOrder = async (cartId) => {
  try {
    const response = await axiosClient.post(`/store/carts/${cartId}/complete`);
    return response.data;
  } catch (error) {
    console.log(`Error Place Order==>`, error);
    throw error;
  }
};
