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
