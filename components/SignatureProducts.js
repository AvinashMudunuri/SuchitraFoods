
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Link,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useAnalytics } from '../lib/useAnalytics';
import { useRouter } from 'next/router';
import { getSignatureProducts } from '../pages/api/products';
import Counter from './Counter';
import ProductCard from './ProductCard';


const SignatureProducts = () => {
  const [products, setProducts] = useState([]);
  // State to handle selected quantity for each product
  const [selectedQuantities, setSelectedQuantities] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getSignatureProducts();
        setProducts(response);
        // Initialize quantities when products are loaded
        const initialQuantities = response.reduce((acc, product) => {
          acc[product.id] = product.quantities_available[0];
          return acc;
        }, {});
        setSelectedQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, event) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [productId]: event.target.value,
    });
  };
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const signatureProducts = products.filter(
    (product) => product.signature_dish === true
  );
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
          Top Selling Products
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {signatureProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.product_id}>
              <ProductCard product={product} />
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
