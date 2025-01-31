import axiosClient from '../../lib/axiosClient';
import { transformedProducts } from '../../utils';

const getSignatureProducts = async () => {
  try {
    const response = await axiosClient.get('/store/products', {
      params: {
        fields:
          '+metadata,+variants.inventory_quantity,*variants.calculated_price',
      },
    });
    const products = response.data.products;
    const signatureProducts = products.filter(
      (product) => product.metadata && product.metadata.signature_dish === true
    );
    return transformedProducts(signatureProducts);
  } catch (error) {
    console.log(`Error Register Customer==>`, error);
    throw error;
  }
};

export { getSignatureProducts };
