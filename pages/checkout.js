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
  TextField,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ShoppingBag,
  LockOutlined,
  PersonAddOutlined,
  CheckCircleOutline,
  LocalShippingOutlined,
  HistoryOutlined,
  SpeedOutlined,
  Visibility,
  VisibilityOff,
  EmailOutlined,
  VpnKeyOutlined
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { signIn } from '../pages/api/customer';
const CheckoutPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, cart, setCart, refreshCart, shippingMethods, paymentMethods } = useCart();
  const { customer, setCustomer, isAuthenticated, logout, fetchCustomer } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const { cartItems: items } = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthNavigation = (view) => {
    // Encode the current URL to redirect back after authentication
    const redirectUrl = encodeURIComponent('/checkout');
    router.push(`/account?view=${view}&redirect=${redirectUrl}`);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      // Call your login function from AuthContext
      const login = new FormData();
      login.append('email', loginData.email);
      login.append('password', loginData.password);
      const result = await signIn(null, login);
      if (!result.message) {
        await fetchCustomer();
      }
      // If successful, the isAuthenticated state will update and the page will re-render
    } catch (error) {
      setLoginError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (isLoading) {
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
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 4,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px'
            }
          }}
        >
          Complete Your Purchase
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Benefits Section */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    py: 2,
                    px: 3
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Create an Account
                  </Typography>
                  <Typography variant="body2">
                    Join us for a better shopping experience
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Sign up today and enjoy these exclusive benefits:
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleOutline sx={{ color: theme.palette.success.main, mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Save multiple shipping addresses</strong> for faster checkout
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalShippingOutlined sx={{ color: theme.palette.success.main, mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Track your orders</strong> in real-time
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SpeedOutlined sx={{ color: theme.palette.success.main, mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Faster checkout process</strong> with saved information
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <HistoryOutlined sx={{ color: theme.palette.success.main, mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Access to order history</strong> and easy reordering
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<PersonAddOutlined />}
                    onClick={() => handleAuthNavigation('sign-up')}
                    sx={{
                      py: 1.5,
                      borderRadius: '8px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Login Section */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: 'white',
                    py: 2,
                    px: 3
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Already Have an Account?
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    Sign in to continue your checkout
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  {loginError && (
                    <Alert
                      severity="error"
                      sx={{ mb: 3, borderRadius: '8px' }}
                      onClose={() => setLoginError('')}
                    >
                      {loginError}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleLoginSubmit}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      margin="normal"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlined color="action" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px' }
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      margin="normal"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKeyOutlined color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px' }
                        }
                      }}
                    />

                    <Box sx={{ textAlign: 'right', mb: 2, mt: 1 }}>
                      <Link href="/account?view=reset-password" passHref>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            cursor: 'pointer'
                          }}
                        >
                          Forgot your password?
                        </Typography>
                      </Link>
                    </Box>

                    <LoadingButton
                      loading={loginLoading}
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      type="submit"
                      startIcon={<LockOutlined />}
                      sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      Sign In
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
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
            mb: 2
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
            href="/category"
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
    <Container maxWidth="xl" sx={{ py: 4, maxWidth: { md: '1000px' } }}>
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        sx={{
          flexDirection: { xs: 'column-reverse', md: 'row' },
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          position: 'relative',
          justifyContent: 'space-evenly',
        }}
      >
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            maxWidth: { md: '600px' },
            width: '100%',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              height: '100%',
            }}
          >
            <CheckoutForm
              cart={cart}
              setCart={setCart}
              refreshCart={refreshCart}
              customer={customer}
              setCustomer={setCustomer}
              isAuthenticated={isAuthenticated}
              logout={logout}
              shippingMethods={shippingMethods}
              paymentMethods={paymentMethods}
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
            maxWidth: { md: '400px' },
          }}
        >
          <CheckoutSummary cart={cart} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
