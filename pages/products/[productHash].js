// pages/product/[productId].js

import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Button,
  Divider,
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Container,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Rating,
  Breadcrumbs,
  Link,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import PropTypes from 'prop-types';
import { sdk } from '../../lib/medusa';
import Recommendations from '../../components/Recommendations';
import { transformProduct } from '../../utils';
import { useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import SubmitButton from '../../components/SubmitButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAnalytics } from '../../lib/useAnalytics';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { storage } from '../../utils/storage';


export async function getServerSideProps({ params }) {
  try {
    // Fetch the product using the product handle/hash
    const { products } = await sdk.store.product.list({
      handle: params.productHash,
      fields:
        '+metadata,+variants.inventory_quantity,*variants.calculated_price',
      limit: 1,
    });

    // Fetch recommended products
    const { products: recommendedProducts } = await sdk.store.product.list({
      limit: 4,
      fields: '+metadata,+variants.inventory_quantity,*variants.calculated_price',
    });

    return {
      props: {
        product: transformProduct(products[0]),
        recommendedProducts: recommendedProducts.map(transformProduct).filter(p => p.id !== products[0].id),
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

const ProductDetail = ({ product, recommendedProducts }) => {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const { handleCartOperation, isItemLoading, cart } = useCart();
  const item = cart?.items?.find((item) => item?.product_id === product?.id);
  //const theme = useMediaQuery(theme => theme);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  // const isTablet = useMediaQuery(theme => theme.breakpoints.down('lg'));

  // State management
  const [selectedSize, setSelectedSize] = useState(
    product?.quantities_available?.[0] || ''
  );
  const [activeTab, setActiveTab] = useState(0);
  // Favorite state, check if the product is in the local storage
  const [isFavorite, setIsFavorite] = useState(
    storage.get('FAVORITES')?.includes(product?.id)
  );
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showShareSnackbar, setShowShareSnackbar] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const imageContainerRef = useRef(null);
  const [quantity, setQuantity] = useState(1);

  // Mock data for multiple images (in a real app, this would come from the product data)
  const productImages = [
    product?.image,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
  ].filter(Boolean);

  // Mock reviews data
  const reviews = {
    average: 4.7,
    count: 124,
    distribution: [
      { stars: 5, percentage: 75 },
      { stars: 4, percentage: 15 },
      { stars: 3, percentage: 5 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 },
    ],
  };

  const isProductOutOfStock = product?.inventory?.[selectedSize] === 0;


  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (item, action) => {
    const newQuantity = action === 'increase' ? 1 : -1;
    handleCartOperation(item, item.variant_title, newQuantity, 'cart');
  };

  const handleAddToCart = async () => {
    await handleCartOperation(product, selectedSize, quantity);
    trackEvent({
      action: 'add_to_cart',
      category: 'Product',
      label: product.name,
      value: product.id,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    trackEvent({
      action: newFavoriteState ? 'add_to_favorites' : 'remove_from_favorites',
      category: 'Product',
      label: product.name,
      value: product.id,
    });
    // Save this info in local storage
    const favorites = storage.get('FAVORITES') || [];
    if (newFavoriteState) {
      storage.set('FAVORITES', [...favorites, product.id]);
    } else {
      storage.set('FAVORITES', favorites.filter(id => id !== product.id));
    }
    // In a real app, you would save this to user preferences
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      setShowShareSnackbar(true);
    }
  };

  const handleImageZoom = (imageUrl) => {
    setZoomedImage(imageUrl === zoomedImage ? null : imageUrl);
  };

  const handleMouseMove = (e) => {
    if (!zoomedImage || !imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    imageContainerRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  };

  const getButtonLabel = () => {
    if (isProductOutOfStock) return 'Out of Stock';
    if (selectedSize) return `Add to Cart`;
    return 'Add to Cart';
  };

  if (!product) return (
    <Container maxWidth="lg">
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Product not found.</Typography>
        <Button variant="contained" onClick={() => router.push('/products')} sx={{ mt: 2 }}>
          Browse Products
        </Button>
      </Box>
    </Container>
  );

  return (
    <>
      <Head>
        <title>{`${product.name} | Suchitra Foods`}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} | Suchitra Foods`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://www.suchitrafoods.com/products/${product.hash}`} />
      </Head>

      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ my: 2 }}
        >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/category">
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Product Images Section */}
          <Grid item xs={12} md={6} lg={5}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {/* Main Image Swiper */}
              <Swiper
                spaceBetween={10}
                navigation={!isMobile}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Pagination, Thumbs]}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '10px',
                  width: '100%',
                  height: '400px',
                  maxWidth: '100%',
                }}
              >
                {productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      ref={imageContainerRef}
                      onClick={() => handleImageZoom(image)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setZoomedImage(null)}
                      sx={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        cursor: 'zoom-in',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease',
                        transform: zoomedImage === image ? 'scale(1.5)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={`${product.name} - view ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          maxHeight: '400px',
                        }}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnail Swiper */}
              {productImages.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Thumbs]}
                  style={{
                    height: '80px',
                    width: '100%',
                    maxWidth: '100%',
                    marginTop: '10px'
                  }}
                >
                  {productImages.map((image, index) => (
                    <SwiperSlide key={index} style={{ opacity: 0.6 }}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </Box>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={6} lg={7}>
            <Box sx={{
              pl: { md: 4 },
              width: '100%'
            }}>
              {/* Product Title and Rating */}
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  {product.name}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Rating value={reviews.average} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {reviews.average} ({reviews.count} reviews)
                  </Typography>
                </Stack>
              </Box>

              {/* Price and Badges */}
              <Box sx={{ mb: 3, width: '100%' }}>
                <Typography variant="h4" component="p" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {selectedSize ? `₹${product.prices[selectedSize]}` : `From ₹${Math.min(...Object.values(product.prices))}`}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Authentic"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<LocalShippingIcon />}
                    label="Free Shipping"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3, maxWidth: '600px' }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="p"
                >
                  {product.metadata?.large_description || product.description}
                </Typography>
              </Box>

              {/* Best Used For */}
              {product?.metadata?.best_used_for && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, maxWidth: '600px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Best Used For
                  </Typography>
                  <Typography variant="body2">
                    {product.metadata.best_used_for}
                  </Typography>
                </Box>
              )}

              {/* Size Selection and Add to Cart */}
              <Box sx={{ mb: 3, width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Pack Size
                </Typography>
                <FormControl fullWidth variant="outlined" size="medium" sx={{ mb: 2 }}>
                  <Select
                    value={selectedSize}
                    onChange={(e) => handleSizeSelect(e.target.value)}
                    displayEmpty
                    disabled={isProductOutOfStock}
                    sx={{ borderRadius: '8px', width: `${isMobile ? '100%' : '450px'}` }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Pack Size</em>
                    </MenuItem>
                    {product.quantities_available.map((size) => (
                      <MenuItem key={size} value={size}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography>{size}</Typography>
                          <Typography sx={{ fontWeight: 600 }}>₹{product.prices[size]}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Quantity
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4} sm={3} md={2}>
                    <Box
                      sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        height: '100%'
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || !selectedSize || isProductOutOfStock}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={!selectedSize || isProductOutOfStock}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>

                  <Grid item xs={8} sm={9} md={10}>
                    <SubmitButton
                      startIcon={<ShoppingCartIcon />}
                      disabled={!selectedSize || isItemLoading || isProductOutOfStock}
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{
                        borderRadius: '8px',
                        py: 1.5,
                        height: '100%',
                        width: `${isMobile ? '100%' : '300px'}`
                      }}
                      onClick={handleAddToCart}
                    >
                      {getButtonLabel()}
                    </SubmitButton>
                  </Grid>
                  <Grid item xs={4} sm={3} md={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IconButton
                        color="primary"
                        sx={{
                          border: '1px solid',
                          borderColor: 'primary.main',
                          p: 1.5
                        }}
                        onClick={handleToggleFavorite}
                      >
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>

                      {isMobile && <IconButton
                        color="primary"
                        sx={{
                          border: '1px solid',
                          borderColor: 'primary.main',
                          p: 1.5
                        }}
                        onClick={handleShare}
                      >
                        <ShareIcon />
                      </IconButton>}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mb: 4, width: '100%' }}>

                {item && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'primary.light',
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      width: '100%'
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Currently in Cart
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.variant_title} × {item.quantity}
                        </Typography>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item, 'decrease')}
                          disabled={item.quantity <= 1 || isItemLoading}
                          sx={{ bgcolor: 'background.paper' }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item, 'increase')}
                          disabled={isItemLoading}
                          sx={{ bgcolor: 'background.paper' }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                )}
              </Box>

              {/* Product Details Tabs */}
              <Box sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="product details tabs"
                    variant={isMobile ? "fullWidth" : "standard"}
                  >
                    <Tab label="Ingredients" />
                    <Tab label="Nutrition" />
                    {/* <Tab label="Reviews" /> */}
                  </Tabs>
                </Box>

                {/* Ingredients Tab */}
                <Box role="tabpanel" hidden={activeTab !== 0} sx={{ py: 3 }}>
                  {activeTab === 0 && (
                    <Box sx={{ width: `${isMobile ? '100%' : '500px'}` }}>
                      {product.material ? (
                        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Ingredients List
                          </Typography>

                          {/* Check if material is a string that can be split by commas or new lines */}
                          {typeof product.material === 'string' &&
                            (product.material.includes(',') || product.material.includes('\n')) ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                              {product.material.split(/[,\n]+/).map((ingredient, index) => {
                                const trimmedIngredient = ingredient.trim();
                                if (!trimmedIngredient) return null;

                                return (
                                  <Chip
                                    key={index}
                                    label={trimmedIngredient}
                                    variant="outlined"
                                    sx={{
                                      borderRadius: '16px',
                                      bgcolor: 'background.paper',
                                      '& .MuiChip-label': { px: 1.5 }
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          ) : (
                            // If it's not easily splittable, display as formatted text
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                                {product.material}
                              </Typography>
                            </Box>
                          )}

                          {/* Additional information about allergens if available */}
                          {product.metadata?.allergens && (
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
                                Allergen Information
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                {product.metadata.allergens}
                              </Typography>
                            </Box>
                          )}

                          {/* Sourcing information if available */}
                          {product.metadata?.sourcing && (
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                                Sourcing
                              </Typography>
                              <Typography variant="body2">
                                {product.metadata.sourcing}
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      ) : (
                        <Typography variant="body1">No ingredient information available.</Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Nutrition Tab */}
                <Box role="tabpanel" hidden={activeTab !== 1} sx={{ py: 3 }}>
                  {activeTab === 1 && (
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                      {product?.nutritionalInfo && Object.entries(product.nutritionalInfo).length > 0 ? (
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                          <Box sx={{
                            width: '100%',
                            display: 'table',
                            borderCollapse: 'collapse',
                          }}>
                            <Box sx={{ display: 'table-header-group', bgcolor: 'primary.lighter' }}>
                              <Box sx={{ display: 'table-row' }}>
                                <Box sx={{
                                  display: 'table-cell',
                                  p: 2,
                                  fontWeight: 600,
                                  borderBottom: '1px solid',
                                  borderColor: 'divider'
                                }}>
                                  <Typography variant="subtitle2">Nutrient</Typography>
                                </Box>
                                <Box sx={{
                                  display: 'table-cell',
                                  p: 2,
                                  fontWeight: 600,
                                  borderBottom: '1px solid',
                                  borderColor: 'divider'
                                }}>
                                  <Typography variant="subtitle2">Amount</Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'table-row-group' }}>
                              {Object.entries(product.nutritionalInfo).map(([key, value], index) => (
                                <Box
                                  key={key}
                                  sx={{
                                    display: 'table-row',
                                    bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'table-cell',
                                    p: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                  }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </Typography>
                                  </Box>
                                  <Box sx={{
                                    display: 'table-cell',
                                    p: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                  }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {value}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Paper>
                      ) : (
                        <Typography variant="body1">No nutritional information available.</Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Reviews Tab */}
                <Box role="tabpanel" hidden={activeTab !== 2} sx={{ py: 3 }}>
                  {activeTab === 2 && (
                    <Box>
                      <Stack direction={isMobile ? "column" : "row"} spacing={4} sx={{ mb: 4 }}>
                        <Box sx={{ textAlign: 'center', minWidth: 200 }}>
                          <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {reviews.average}
                          </Typography>
                          <Rating value={reviews.average} precision={0.1} size="large" readOnly sx={{ mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Based on {reviews.count} reviews
                          </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          {reviews.distribution.map((item) => (
                            <Stack key={item.stars} direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 60 }}>
                                {item.stars} stars
                              </Typography>
                              <Box sx={{ flex: 1, bgcolor: 'grey.200', height: 8, borderRadius: 4 }}>
                                <Box
                                  sx={{
                                    width: `${item.percentage}%`,
                                    bgcolor: 'primary.main',
                                    height: '100%',
                                    borderRadius: 4
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {item.percentage}%
                              </Typography>
                            </Stack>
                          ))}
                        </Box>
                      </Stack>

                      <Button variant="outlined" fullWidth>
                        Write a Review
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Recommendations Section */}
        <Recommendations products={recommendedProducts} />
      </Container>

      {/* Share Snackbar */}
      <Snackbar
        open={showShareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowShareSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  product: PropTypes.object,
  recommendedProducts: PropTypes.array,
};
