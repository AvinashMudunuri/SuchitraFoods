import { sdk } from '../../lib/medusa';
import { transformedProducts } from '../../utils';

const getProductCategories = async () => {
  try {
    const { product_categories } = await sdk.store.category.list({
      fields: '*products'
    });
    return product_categories;
  } catch (error) {
    console.log(`Error Categories ==>`, error);
    throw error;
  }
};

const getProductCategory = async (handle) => {
  try {
    const { product_categories } = await sdk.store.category.list({ handle });
    return product_categories[0];
  } catch (error) {
    console.log(`Error Categories ==>`, error);
    throw error;
  }
};

const getProductsByCategory = async (categoryId) => {
  const { products } = await sdk.store.product.list({
    category_id: categoryId,
    fields: '+categories,+metadata,+variants.inventory_quantity,*variants.calculated_price',
  });
  return transformedProducts(products);
};

const getAllProducts = async () => {
  const { products } = await sdk.store.product.list({
    fields: '+categories,+metadata,+variants.inventory_quantity,*variants.calculated_price',
  });
  return transformedProducts(products);
};

const getSignatureProducts = async () => {
  try {
    const { products } = await sdk.store.product.list({
      fields:
        '+metadata,+variants.inventory_quantity,*variants.calculated_price',
    });
    const signatureProducts = products.filter(
      (product) => product.metadata && product.metadata.signature_dish === true
    );
    return transformedProducts(signatureProducts);
  } catch (error) {
    console.log(`Error Signature Products ==>`, error);
    throw error;
  }
};

export { getSignatureProducts, getProductCategories, getProductCategory, getProductsByCategory, getAllProducts };
