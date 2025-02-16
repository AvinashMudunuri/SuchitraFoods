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
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Container,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { sdk } from '../../lib/medusa';
import Recommendations from '../../components/Recommendations';
import { transformProduct } from '../../utils';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import SubmitButton from '../../components/SubmitButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAnalytics } from '../../lib/useAnalytics';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

export async function getServerSideProps({ params }) {
  try {
    // Fetch the product using the product handle/hash
    const { products } = await sdk.store.product.list({
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
  const { trackEvent } = useAnalytics();
  const { handleCartOperation, isItemLoading, cart } = useCart();
  const item = cart?.items?.find((item) => item?.product_id === product.id);

  const [selectedSize, setSelectedSize] = useState(
    product.quantities_available[0]
  );

  const isProductOutOfStock = product.inventory[selectedSize] === 0;
  const handleBackClick = () => {
    router.back(); // Adjust the path to your products page if different
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (item, action) => {
    const newQuantity = action === 'increase' ? 1 : -1;
    handleCartOperation(item, item.variant_title, newQuantity, 'cart');
  };

  const handleAddToCart = async () => {
    await handleCartOperation(product, selectedSize, 1);
    trackEvent({
      action: 'add_to_cart',
      category: 'Product',
      label: product.name,
      value: product.id,
    });
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
      <Container maxWidth="lg">
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
                <strong>Best Used For:</strong>{' '}
                {product?.metadata?.best_used_for}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth size="small">
                  {/* <InputLabel id="pack-size-label">Select Pack Size</InputLabel> */}
                  <Select
                    displayEmpty
                    labelId="pack-size-label"
                    value={selectedSize || ''}
                    onChange={(e) => handleSizeSelect(e.target.value)}
                    disabled={isProductOutOfStock}

                  >
                    {product.quantities_available.length > 0 &&
                      product.quantities_available.map((size) => (
                        <MenuItem key={size} value={size} disabled={isProductOutOfStock}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography>{size}</Typography>
                            <Typography>
                              {/* {discountedPrices[size] ? (
                            <>
                              <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                                ₹{prices[size]}
                              </span>
                              <strong>₹{discountedPrices[size]}</strong>
                            </>
                          ) : (
                            <strong>₹{prices[size]}</strong>
                          )} */}
                              <strong>₹{product.prices[size]}</strong>
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Add to Cart Button */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SubmitButton
                  startIcon={<ShoppingCartIcon />}
                  disabled={!selectedSize || isItemLoading || isProductOutOfStock}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={handleAddToCart}
                >
                  {isProductOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </SubmitButton>
                {item && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 2,
                      gap: 2,
                      mt: 2,
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      p: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item, 'decrease')}
                      disabled={item.quantity <= 1 || isItemLoading}
                    >
                      <Remove
                        fontSize="small"
                        color="primary"
                        fontWeight="600"
                      />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item, 'increase')}
                      disabled={isItemLoading}
                    >
                      <Add fontSize="small" color="primary" fontWeight="600" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          {/* Ingredients Section */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Ingredients Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 4,
                      height: 24,
                      backgroundColor: 'primary.main',
                      display: 'inline-block',
                      borderRadius: 1,
                      mr: 1,
                    }}
                  />
                  Ingredients
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mt: 2,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line', // Preserves line breaks if any
                  }}
                >
                  {product.material}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Nutritional Information Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                backgroundColor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 4,
                    height: 24,
                    backgroundColor: 'primary.main',
                    display: 'inline-block',
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
                Nutritional Information
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {product?.nutritionalInfo &&
                    Object.entries(product.nutritionalInfo).length > 0 ? (
                    Object.entries(product.nutritionalInfo).map(
                      ([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: 'background.default',
                              gap: 2,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                textTransform: 'capitalize',
                              }}
                            >
                              {key
                                .split('_')
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(' ')}
                            </Typography>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ fontWeight: 500, textAlign: 'right' }}
                            >
                              {value}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No nutritional information available
                    </Typography>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Grid>
          {/* Recommendations */}
          {/* <Recommendations products={} /> */}
        </Box>
      </Container>
    </>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  product: PropTypes.object,
};
