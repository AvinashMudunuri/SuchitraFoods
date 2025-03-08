import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Container,
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
    router.push('/category');
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#E04F00' }}>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          p: 3,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              textAlign: 'center',
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            Top Selling Products
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            Discover our most popular and beloved products
          </Typography>
        </Box>

        {/* Horizontal Scrolling Container */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2, // Space for scrollbar
            mb: 3,
            '::-webkit-scrollbar': {
              height: '8px',
              WebkitAppearance: 'none',
            },
            '::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: '#E04F00',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#c43d00',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#E04F00 #f1f1f1',
            msOverflowStyle: 'none',
          }}
        >
          {isLoading ? (
            // Skeleton loading state
            [...Array(4)].map((_, index) => (
              <Box
                key={`skeleton-${index}`}
                sx={{
                  minWidth: {
                    xs: '200px',
                    sm: '250px',
                    md: '280px'
                  },
                  flexShrink: 0
                }}
              >
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{
                    borderRadius: 1,
                    mb: 1
                  }}
                />
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="40%" height={24} />
              </Box>
            ))
          ) : (
            // Actual products
            products.map((product) => (
              <Box
                key={product.product_id}
                sx={{
                  minWidth: {
                    xs: '200px',
                    sm: '250px',
                    md: '280px'
                  },
                  flexShrink: 0
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            onClick={handleLearnMore}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              backgroundColor: '#E04F00',
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#c43d00',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Explore More
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignatureProducts;
