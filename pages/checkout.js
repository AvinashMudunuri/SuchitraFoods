'use client';
import { useEffect, useState } from 'react';
import {
  Container,
  Skeleton,
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import { getShippingOptions } from './api/cart';
import { getPaymentProviders } from './api/payment';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Addresses from '../components/checkout/Addresses';
import Shipping from '../components/checkout/Shipping';
import Payment from '../components/checkout/Payment';
import Review from '../components/checkout/Review';
import { convertToLocale } from '../utils';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import CheckoutForm from '../components/checkout/CheckoutForm';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const { customer, isAuthenticated } = useAuth();
  const [shippingMethods, setShippingMethods] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate cart totals
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount_total || 0;
  const shipping = cart?.shipping_subtotal || 0;
  const total = cart?.total || 0;

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setIsLoading(true);
        if (cart?.id) {
          const shipping = await getShippingOptions(cart.id);
          const payments = await getPaymentProviders(cart.region?.id ?? '');
          setShippingMethods(shipping);
          setPaymentMethods(payments);
        }
      } catch (error) {
        console.error('Error fetching checkout data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, [cart]);

  const handleAuthNavigation = (view) => {
    // Encode the current URL to redirect back after authentication
    const redirectUrl = encodeURIComponent('/checkout?step=address');
    router.push(`/account?view=${view}&redirect=${redirectUrl}`);
  };

  if (isLoading || !shippingMethods || !paymentMethods) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="text" width="200px" height={40} />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (!cart) {
    return <Container>No items in cart</Container>;
  }

  if (!isAuthenticated) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            maxWidth: '600px',
            margin: 'auto',
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'white',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Sign in or Register to Continue
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Create an account or sign in to enjoy these benefits:
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • Save multiple shipping addresses
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • Track your orders easily
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • Faster checkout process
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • Access to order history
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAuthNavigation('sign-in')}
              sx={{ flex: 1 }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAuthNavigation('sign-up')}
              sx={{ flex: 1 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        sx={{
          flexDirection: { xs: 'column-reverse', md: 'row' },
          position: 'relative',
          justifyContent: 'space-evenly',
        }}
      >
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              height: '100%',
            }}
          >
            <CheckoutForm
              cart={cart}
              customer={customer}
              isAuthenticated={isAuthenticated}
            />
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            position: { md: 'sticky' },
            top: { md: '24px' },
            alignSelf: { md: 'flex-start' },
            height: { md: 'fit-content' },
          }}
        >
          <CheckoutSummary cart={cart} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
