// pages/product/[productId].js

import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Typography,
  Grid2 as Grid,
  CardMedia,
  Button,
  Divider,
} from '@mui/material';
import PropTypes from 'prop-types';
import medusaClient from '../../lib/medusa';
import Recommendations from '../../components/Recommendations';
import { transformProduct } from '../../utils';

export async function getServerSideProps({ params }) {
  try {
    console.log(`params`, params.productHash);
    // Fetch the product using the product handle/hash
    const { products } = await medusaClient.products.list({
      handle: params.productHash,
      fields:
        '+metadata,+variants.inventory_quantity,*variants.calculated_price',
      limit: 1,
    });
    console.log(`params`, products[0]);
    return {
      props: {
        product: transformProduct(products[0]),
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        product: null,
        recommendedProducts: [],
      },
    };
  }
}

const ProductDetail = ({ product }) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/products'); // Adjust the path to your products page if different
  };

  if (!product) return <Typography>Product not found.</Typography>;
  return (
    <>
      <Head>
        <title>{`${product.name} | Suchitra Foods`}</title>
        <meta name="description" content={product.description} />
        <meta
          property="og:title"
          content={`${product.product_name} | Suchitra Foods`}
        />
        <meta property="og:description" content={product.product_description} />
        <meta property="og:image" content={product.image} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/product/${product.hash}`}
        />
      </Head>
      <Box sx={{ p: 4 }}>
        <Button
          variant="contained"
          onClick={handleBackClick}
          sx={{ marginBottom: '1rem' }}
        >
          &larr; Back to Products
        </Button>
        <Grid container spacing={4} alignItems="center">
          {/* Image on left in md and lg */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
            />
          </Grid>

          {/* Content on right */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ maxWidth: { md: '400px', lg: '550px' } }}
            >
              {product.metadata?.large_description || product.description}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 2, maxWidth: { md: '400px', lg: '500px' } }}
            >
              <strong>Best Used For:</strong> {product?.metadata?.best_used_for}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Available Quantities:</strong>{' '}
              {product.quantities_available.join(', ')}
            </Typography>

            {/* Price Section */}
            <Box sx={{ mt: 3 }}>
              {product.quantities_available.map((quantity) => (
                <Box
                  key={quantity}
                  sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                >
                  <Typography variant="body1">{quantity}:&nbsp;</Typography>
                  {product.discountedPrices[quantity] ? (
                    <>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through', mr: 1 }}
                      >
                        ₹{product.prices[quantity]}
                      </Typography>
                      <Typography variant="body1" color="primary">
                        ₹{product.discountedPrices[quantity]}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="primary">
                      ₹{product.prices[quantity]}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Add to Cart Button */}
            {/* <Button variant="contained" color="primary" sx={{ mt: 3 }}>
              Add to Cart
            </Button> */}
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        {/* Ingredients Section */}
        <Box sx={{ mt: 4, maxWidth: { xs: '100%', md: '600px' }, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Ingredients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.material}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Nutritional Information Section */}
        <Box sx={{ mt: 4, maxWidth: { xs: '100%', md: '600px' }, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Nutritional Information
          </Typography>
          <Box sx={{ mt: 1 }}>
            {Object.entries(product.nutritionalInfo).map(([key, value]) => (
              <Box
                key={key}
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Recommendations */}
        {/* <Recommendations products={} /> */}
      </Box>
    </>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  product: PropTypes.object,
};
