import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Divider,
  CardMedia,
  Stack,
  Link,
  Skeleton,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { getCountry, convertToLocale } from '../utils';
import { partialSaveCart } from '../pages/api/cart';
import { useRouter } from 'next/router';

const CartPage = () => {
  const router = useRouter();
  const {
    state,
    handleCartOperation,
    cart,
    shippingMethods,
    paymentMethods,
    setCart,
  } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const { cartItems: items } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [isPartialSaveLoading, setIsPartialSaveLoading] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    const setupCart = async () => {
      if (
        !isLoading &&
        cart?.items?.length > 0 &&
        isAuthenticated &&
        customer?.addresses?.length > 0 &&
        cart?.shipping_address?.address_1 === null &&
        cart?.shipping_methods?.length === 0
      ) {
        setIsPartialSaveLoading(true);
        const customerAddress =
          customer?.addresses.find((address) => address.is_default_shipping) ||
          customer?.addresses[0];
        const countryCode = customerAddress?.country_code;
        const countryObj = getCountry(countryCode);
        const shippingOptions = shippingMethods?.find(
          (so) => so.name === `SO-${countryObj.code.toUpperCase()}`
        );
        const result = await partialSaveCart(
          customer,
          customerAddress,
          shippingOptions,
          paymentMethods[0]
        );
        console.log('result', result);
        if (result?.success) {
          setCart(result?.cart);
        }
        setIsPartialSaveLoading(false);
      }
    };
    setupCart();
  }, [cart, isLoading, isAuthenticated, customer]);

  // Calculate cart totals
  const subtotal = cart?.item_subtotal || 0;
  const shipping = cart?.shipping_subtotal || 0;
  const discount = cart?.discount_total || 0;
  const total = cart?.total || 0;
  const currencyCode = cart?.currency_code;

  const handleQuantityChange = (item, action) => {
    const newQuantity = action === 'increase' ? 1 : -1;
    handleCartOperation(item, item.variant_title, newQuantity, 'cart');
  };

  const handleRemoveItem = (item) => {
    handleCartOperation(item, item.variant_title, -item.quantity, 'cart');
  };

  const handleAuthNavigation = (view) => {
    // Encode the current URL to redirect back after authentication
    const redirectUrl = encodeURIComponent('/cart');
    router.push(`/account?view=${view}&redirect=${redirectUrl}`);
  };

  if (isLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="text" width="200px" height={40} />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed #ccc',
            borderRadius: 2,
          }}
        >
          <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added anything to your cart yet.
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {!isAuthenticated && (
        <Box
          sx={{
            mb: 2,
            backgroundColor: 'primary.main',
            p: 2,
            color: 'white',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" gutterBottom>
            Already have an account? Sign in for a better experience.
            <Button
              color="white"
              sx={{ textDecoration: 'underline' }}
              onClick={() => handleAuthNavigation('sign-in')}
            >
              Sign in
            </Button>{' '}
          </Typography>
        </Box>
      )}
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Cart Items Table */}
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="left">
                  Weight
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CardMedia
                        component="img"
                        image={item.thumbnail}
                        alt={item.product_title}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle1">
                          {item.product_title}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle2">
                      {item.variant_title}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, 'decrease')}
                        disabled={item.quantity <= 1}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, 'increase')}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                      ₹{item.unit_price * item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Cart Summary - Right Aligned */}
        <Box
          sx={{
            width: { xs: '100%', md: '380px' },
            alignSelf: 'flex-start',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: { md: '24px' },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                pb: 2,
                borderBottom: '2px solid #eee',
              }}
            >
              Cart Summary
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography variant="subtitle1">
                  {convertToLocale({
                    amount: subtotal,
                    currency_code: currencyCode,
                  })}
                </Typography>
              </Box>

              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Discount</Typography>
                  <Typography color="error.main" variant="subtitle1">
                    -
                    {convertToLocale({
                      amount: discount,
                      currency_code: currencyCode,
                    })}
                  </Typography>
                </Box>
              )}
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  {convertToLocale({
                    amount: subtotal,
                    currency_code: currencyCode,
                  })}
                </Typography>
              </Box>
              <Button
                component={Link}
                href={'/checkout'}
                variant="contained"
                size="large"
                fullWidth
                disabled={isPartialSaveLoading}
                sx={{ py: 1.5 }}
              >
                Proceed to Checkout
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Continue Shopping Button - Below Table */}
      <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        <Button
          component={Link}
          href="/products"
          variant="outlined"
          startIcon={<ShoppingBag />}
          size="large"
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;
