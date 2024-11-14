import React from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Link,
} from '@mui/material';
import { useAnalytics } from '../lib/useAnalytics';
import { useRouter } from 'next/router';

const products = [
  {
    product_id: 'SF-01',
    product_image: '/images/kandi.jpg',
    product_name: 'Kandi Podi',
    product_description:
      'Our Kandi Podi is a traditional Andhra spice powder made from premium quality lentils, carefully roasted and ground to perfection. It has a savory, rich flavor that makes it a comforting addition to any meal.',
    best_used_for:
      'Mixing with rice, ghee, and pickles or as a flavorful topping for dosa and idli.',
    quantities_available: ['250gms', '500gms', '1Kg'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1Kg   ': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1Kg   ': 525,
    },
  },
  {
    product_id: 'SF-02',
    product_image: '/images/nuvulla.jpg',
    product_name: 'Nuvvula Podi',
    product_description:
      'Finely ground from roasted sesame seeds, this podi adds a nutty richness and health benefits. A sprinkle transforms simple dishes with depth and a hint of sesame.',
    best_used_for:
      'Mixing with rice, seasoning salads, or adding richness to curries.',
    quantities_available: ['250gms', '500gms', '1Kg'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1Kg   ': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1Kg   ': 525,
    },
  },
  {
    product_id: 'SF-03',
    product_image: '/images/karam.jpg',
    product_name: 'Karam Podi/Idli Karam',
    product_description:
      'Spicy and smoky, this chili powder packs an intense flavor, ideal for adding heat. Made in a clean environment, it’s a delicious way to spice up your breakfast dishes or curries.',
    best_used_for: 'Pairing with ghee on idli, dosa, or upma.',
    quantities_available: ['250gms', '500gms', '1Kg'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1Kg   ': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1Kg   ': 525,
    },
  },
  // {
  //   product_id: 'SF-04',
  //   product_image: '/images/karam.jpg',
  //   product_name: 'Kura Podi',
  //   product_description:
  //     'A special blend of spices, Kura Podi infuses curries and vegetable dishes with warmth and depth. This spice mix captures the traditional flavors of Andhra and Telangana.',
  //   best_used_for:
  //     'Flavoring vegetable curries, enhancing gravies, and adding aroma to stir-fries.',
  //   quantities_available: ['250gms', '500gms', '1Kg'],
  //   prices: {
  //
  //     '200gms': 165,
  //   },
  //   discountedPrices: {
  //
  //     '200gms': 145,
  //   },
  // },
];

const SignatureProducts = () => {
  const router = useRouter();
  const { trackEvent } = useAnalytics();

  const handleLearnMore = () => {
    trackEvent({
      action: 'click',
      category: 'button',
      label: 'SignatureProducts | Learn More',
    });
    router.push('/products'); // Adjust the path based on your routing setup
  };
  const handleViewDetailsClick = (product) => {
    trackEvent({
      action: 'click_view_details',
      category: 'Product',
      label: product.product_name,
      value: product.product_id,
    });
  };
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: { xs: '1em', md: '2em' },
        width: '100%',
        backgroundColor: '#E04F00',
      }}
    >
      <Box sx={{ padding: '2em', backgroundColor: '#fff' }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            marginBottom: '1em',
            textAlign: 'center',
            fontSize: { xs: '1.8rem' },
          }}
        >
          Signature Products
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.product_image}
                  alt={product.product_name}
                />
                <CardContent>
                  <Typography variant="h6">{product.product_name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: '1em', maxWidth: '300px' }}
                  >
                    {product.product_description}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ maxWidth: '300px' }}
                  >
                    <strong>Best used for:</strong> {product.best_used_for}
                  </Typography>
                  {/* Display Quantities and Prices */}
                  <Box sx={{ marginTop: '1em' }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Pack Sizes:</strong>
                    </Typography>
                    <Box sx={{ marginTop: '0.5em' }}>
                      {product.quantities_available.map((quantity) => (
                        <Box
                          key={quantity}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5em 0',
                            borderBottom: '1px solid #eee',
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            {quantity}
                          </Typography>
                          <Chip
                            label="Launch Offer"
                            color="primary"
                            sx={{ alignSelf: 'start', marginBottom: '0.5em' }}
                            size="small"
                          />
                          {/* Show Original Price with Strikethrough if Discounted Price is Available */}
                          {product?.discountedPrices[quantity] ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5em',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through' }}
                              >
                                ₹{product.prices[quantity]}
                              </Typography>
                              <Typography variant="body2" color="primary">
                                ₹{product.discountedPrices[quantity]}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="primary">
                              ₹{product.prices[quantity]}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    padding: '1em',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <Button
                    variant="text"
                    component={Link}
                    href={`/product/${product.product_id}`}
                    onClick={() => handleViewDetailsClick(product)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLearnMore}
          sx={{
            alignSelf: { xs: 'center', md: 'flex-start' },
            marginTop: { xs: '1em', md: '1em' },
            padding: '0.5em 2em',
            backgroundColor: '#E04F00',
            color: 'white',
            '&:hover': {
              backgroundColor: '#c43d00',
            },
          }}
        >
          Explore More
        </Button>
      </Box>
    </Box>
  );
};

export default SignatureProducts;
