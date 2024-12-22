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
import { products } from '../../lib/constants';
import Recommendations from '../../components/Recommendations';

export async function getStaticPaths() {
  const paths = products.map((product) => ({
    params: { productHash: product.product_hash },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = products.find((p) => p.product_hash === params.productHash);
  return { props: { product } };
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
        <title>{`${product.product_name} | Suchitra Foods`}</title>
        <meta name="description" content={product.product_description} />
        <meta
          property="og:title"
          content={`${product.product_name} | Suchitra Foods`}
        />
        <meta property="og:description" content={product.product_description} />
        <meta property="og:image" content={product.product_image} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/product/${product.product_id}`}
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
              image={product.product_image}
              alt={product.product_name}
              sx={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
            />
          </Grid>

          {/* Content on right */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.product_name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ maxWidth: { md: '400px', lg: '550px' } }}
            >
              {product.product_description}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 2, maxWidth: { md: '400px', lg: '500px' } }}
            >
              <strong>Best Used For:</strong> {product.best_used_for}
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
            {product.ingredients.join(', ')}
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
        <Recommendations
          products={products.filter((f) => f.product_id !== product.product_id)}
        />
      </Box>
    </>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  product: PropTypes.object,
};
