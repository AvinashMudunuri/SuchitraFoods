import axiosClient from '../../lib/axiosClient';

const getPaymentProviders = async (regionId) => {
  try {
    const response = await axiosClient.get(
      `/store/payment-providers?region_id=${regionId}`
    );
    return response.data.payment_providers;
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

const initPaymentSession = async (
  paymentCollectionId,
  selectedPaymentProviderId
) => {
  try {
    const response = await axiosClient.post(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        provider_id: selectedPaymentProviderId,
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error Init Payment Session==>`, error);
    throw error;
  }
};

export { getPaymentProviders, createPaymentCollection, initPaymentSession };
