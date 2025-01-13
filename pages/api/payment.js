import axiosClient from '../../lib/axiosClient';
import { sdk } from '../../lib/medusa';

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
    const response = await axiosClient.post(`/store/payment-collections`, {
      cart_id: cartId,
    });
    return response.data.payment_collection;
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

export { getPaymentProviders, createPaymentCollection, initPaymentSession };
