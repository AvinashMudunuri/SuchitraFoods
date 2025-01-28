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
import { styled } from '@mui/material/styles';

// Update the StickyBox styled component
const StickyBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(2),
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    position: 'static',
    marginTop: theme.spacing(2),
  },
}));

// Update the ContentWrapper styled component
const ContentWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('md')]: {
    minHeight: '600px', // Ensure enough content for scrolling
  },
}));

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
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ContentWrapper>
            <Addresses
              cart={cart}
              setCart={setCart}
              customer={customer}
              isAuthenticated={isAuthenticated}
            />
            <Shipping
              cart={cart}
              setCart={setCart}
              availableShippingMethods={shippingMethods}
            />
            <Payment
              cart={cart}
              setCart={setCart}
              availablePaymentMethods={paymentMethods}
            />
            <Review cart={cart} />
          </ContentWrapper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StickyBox>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider />
              {/* Add order summary details here */}
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography variant="subtitle1">
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cart?.currency_code,
                    })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography variant="subtitle1">
                    ₹{shipping.toFixed(2)}
                  </Typography>
                </Box>
                {discount > 0 && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography color="text.secondary">Discount</Typography>
                    <Typography color="error.main" variant="subtitle1">
                      {convertToLocale({
                        amount: discount,
                        currency_code: cart?.currency_code,
                      })}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    {convertToLocale({
                      amount: total,
                      currency_code: cart?.currency_code,
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </StickyBox>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
