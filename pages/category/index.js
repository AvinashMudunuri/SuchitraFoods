// This is the same component as [handle].js but handles the base route
import { CategoryDetail } from './[handle]';
import { getProductCategories, getProductsByCategory, getAllProducts } from '../api/products';

export const getServerSideProps = async () => {
  try {
    const categoriesResponse = await getProductCategories();
    const categories = await Promise.all(
      categoriesResponse.map(async (cat) => {
        const products = await getProductsByCategory(cat.id);
        return {
          ...cat,
          products_count: products.length
        };
      })
    );

    // Get all products when no category is selected
    const products = await getAllProducts();

    return {
      props: {
        categories,
        products,
        currentCategory: null
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        categories: [],
        products: [],
        error: 'Failed to load products',
      },
    };
  }
};

export default CategoryDetail;
