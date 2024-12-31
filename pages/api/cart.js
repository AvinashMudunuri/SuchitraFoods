import axiosClient from '../../lib/axiosClient';

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
    const response = await axiosClient.get(`/store/shipping-options?cart_id=${cartId}`);
    return response.data.shipping_options;
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
    const response = await axiosClient.post(
      `/store/carts/${cartId}/shipping-methods`,
      {
        option_id: data.option_id,
      }
    );
    return response.data.cart;
  } catch (error) {
    console.log(`Error Add Shipping Option To Cart==>`, error);
    throw error;
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
