import { sdk } from '../../lib/medusa';
import { transformedProducts } from '../../utils';

const getProductCategories = async () => {
  try {
    // Check if SDK is properly initialized
    if (!sdk || !sdk.store) {
      console.warn('Medusa SDK not properly initialized during build');
      return [];
    }

    const { product_categories } = await sdk.store.category.list({
      fields: '*products'
    });
    return product_categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.log(`Error Categories ==>`, error);
    // Return empty array during build to prevent build failure
    return [];
  }
};

const getProductCategory = async (handle) => {
  try {
    // Check if SDK is properly initialized
    if (!sdk || !sdk.store) {
      console.warn('Medusa SDK not properly initialized during build');
      return null;
    }

    const { product_categories } = await sdk.store.category.list({ handle });
    return product_categories[0];
  } catch (error) {
    console.log(`Error Categories ==>`, error);
    return null;
  }
};

const getProductsByCategory = async (categoryId) => {
  try {
    // Check if SDK is properly initialized
    if (!sdk || !sdk.store) {
      console.warn('Medusa SDK not properly initialized during build');
      return [];
    }

    const { products } = await sdk.store.product.list({
      category_id: categoryId,
      fields: '+categories,+metadata,+variants.inventory_quantity,*variants.calculated_price',
    });
    return transformedProducts(products).sort((a, b) => a.hash.localeCompare(b.hash));
  } catch (error) {
    console.log(`Error Products by Category ==>`, error);
    return [];
  }
};

const getAllProducts = async () => {
  try {
    // Check if SDK is properly initialized
    if (!sdk || !sdk.store) {
      console.warn('Medusa SDK not properly initialized during build');
      return [];
    }

    const { products } = await sdk.store.product.list({
      fields: '+type,+categories,+metadata,+variants.inventory_quantity,*variants.calculated_price',
      order: 'handle',
    });
    console.log(`Products ==>`, products);
    return transformedProducts(products).sort((a, b) => a.type.localeCompare(b.type));
  } catch (error) {
    console.log(`Error All Products ==>`, error);
    return [];
  }
};

const getSignatureProducts = async () => {
  try {
    // Check if SDK is properly initialized
    if (!sdk || !sdk.store) {
      console.warn('Medusa SDK not properly initialized during build');
      return [];
    }

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
    return [];
  }
};

export const searchProducts = async (query) => {
  try {
    // Check if SDK is properly initialized
    if (!sdk || !sdk.store) {
      console.warn('Medusa SDK not properly initialized during build');
      return [];
    }

    const { hits: products } = await sdk.store.product.search({
      q: query,
    });
    return transformedProducts(products);
  } catch (error) {
    console.log(`Error searching products ==>`, error);
    return [];
  }
}

export { getSignatureProducts, getProductCategories, getProductCategory, getProductsByCategory, getAllProducts };
