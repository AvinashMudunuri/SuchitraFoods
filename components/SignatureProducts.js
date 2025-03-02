import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Button,
  Skeleton,
} from '@mui/material';
import { useAnalytics } from '../lib/useAnalytics';
import { useRouter } from 'next/router';
import { getSignatureProducts } from '../pages/api/products';
import ProductCard from './ProductCard';

const SignatureProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getSignatureProducts();
        setProducts(response);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const handleLearnMore = () => {
    trackEvent({
      action: 'click',
      category: 'button',
      label: 'SignatureProducts | Learn More',
    });
    router.push('/category'); // Adjust the path based on your routing setup
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
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          Top Selling Products
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {isLoading && [
            <Grid item xs={12} sm={6} md={3} key={'asas_123Q'}>
              <Skeleton variant="text" width="200px" height={40} />
              <Skeleton variant="rectangular" height={200} />
            </Grid>,
            <Grid item xs={12} sm={6} md={3} key={'asas_123Y'}>
              <Skeleton variant="text" width="200px" height={40} />
              <Skeleton variant="rectangular" height={200} />
            </Grid>,
          ]}
          {!isLoading &&
            products.length > 0 &&
            products.map((product) => (
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
