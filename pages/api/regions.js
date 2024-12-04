import axiosClient from '../../lib/axiosClient';
const getRegions = async () => {
  try {
    const response = await axiosClient.get('/store/regions');
    return response.data.regions;
  } catch (error) {
    console.log(`Error Register Customer==>`, error);
    throw error;
  }
};

const getRegion = async (id) => {
  try {
    const response = await axiosClient.get(`/store/regions/${id}`);
    return response.data.region;
  } catch (error) {
    console.log(`Error Register Customer==>`, error);
    throw error;
  }
};

export { getRegions, getRegion };
