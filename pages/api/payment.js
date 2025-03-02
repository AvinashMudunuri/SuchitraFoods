import { sdk } from '../../lib/medusa';
import { updateCart, addShippingOptionToCart, getCart } from './cart';
const getPaymentProviders = async (regionId) => {
  try {
    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: regionId,
    });
    return payment_providers;
  } catch (error) {
    console.log(`Error Get Payment Providers==>`, error);
    throw error;
  }
};

/**
 * Create Payment collection
 * data: {
 *  "cart_id": cart.id
 * }
 */
const createPaymentCollection = async (cartId) => {
  try {
    const { payment_collection } =
      await sdk.store.payment.createPaymentCollection(cartId);
    return payment_collection;
  } catch (error) {
    console.log(`Error Create Payment Collection==>`, error);
    throw error;
  }
};

/**
 * Init Payment Session
 * @param {*} paymentCollectionId
 * @param {*} selectedPaymentProviderId
 * @returns
 */

const initPaymentSession = async (cart, selectedPaymentProviderId) => {
  try {
    const { payment_collection } =
      await sdk.store.payment.initiatePaymentSession(cart, {
        provider_id: selectedPaymentProviderId,
        context: {
          extra: cart,
        },
      });
    return payment_collection;
  } catch (error) {
    console.log(`Error Init Payment Session==>`, error);
    throw error;
  }
};

const prepareOrder = async (
  cart,
  customer,
  selectedAddress,
  shippingMethod,
  paymentMethod,
  billingType,
  formData
) => {
  try {
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
        address_2: selectedAddress.address_2,
        company: '',
        postal_code: selectedAddress.postal_code,
        city: selectedAddress.city,
        country_code: selectedAddress.country_code,
        province: selectedAddress.province,
        phone: selectedAddress.phone,
      };
    }
    if (customer && customer.addresses.length === 0 && formData) {
      data.shipping_address = {
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
      };
    }
    if (billingType === 'same') {
      data.billing_address = data.shipping_address;
    }
    const updatedCart = await updateCart(data);
    const updatedCartWithShippingMethod = await addShippingOptionToCart(
      updatedCart.id,
      {
        shippingMethodId: shippingMethod.id,
      }
    );
    // const paymentCollection = await createPaymentCollection(updatedCartWithShippingMethod.id);
    const paymentCollection = await initPaymentSession(
      updatedCartWithShippingMethod,
      paymentMethod.id
    );
    const updatedCartWithPaymentCollection = await getCart(
      updatedCartWithShippingMethod.id
    );
    return { success: true, updatedCart: updatedCartWithPaymentCollection };
  } catch (error) {
    console.log(`Error Orchestrate Payment==>`, error);
    throw error;
  }
};

export {
  getPaymentProviders,
  createPaymentCollection,
  initPaymentSession,
  prepareOrder,
};
