import axiosClient from '../../lib/axiosClient';

export const getOrders = async () => {
  try {
    const response = await axiosClient.get('/store/orders');
    return response.data.orders;
  } catch (error) {
    console.log(`Error Get Orders==>`, error);
    throw error;
  }
};
