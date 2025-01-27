'use client';
import { useEffect, useState } from 'react';
import { Container, Skeleton, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { getShippingOptions } from './api/cart';
import { getPaymentProviders } from './api/payment';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Addresses from '../components/checkout/Addresses';
import Shipping from '../components/checkout/Shipping';
import Payment from '../components/checkout/Payment';
import Review from '../components/checkout/Review';
const CheckoutPage = () => {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const { customer, isAuthenticated } = useAuth();
  const [shippingMethods, setShippingMethods] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const redirectUrl = encodeURIComponent('/checkout?step=addresses');
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
    <Container sx={{ mt: 4 }}>
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
    </Container>
  );
};

export default CheckoutPage;
