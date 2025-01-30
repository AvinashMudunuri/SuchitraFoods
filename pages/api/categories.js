import axiosClient from '../../lib/axiosClient';
import { transformedProducts } from '../../utils';

const getCategories = async () => {
  try {
    const response = await axiosClient.get('/store/product-categories',{
        credentials: "include"
      })  
    
    const categories = response.data.product_categories;
    
    console.log(categories)

    // return transformedProducts(categories);
    return categories;
  } catch (error) {
    console.log(`Error Register Customer==>`, error);
    throw error;
  }
};

export { getCategories };
