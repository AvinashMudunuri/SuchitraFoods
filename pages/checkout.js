import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid2 as Grid,
  Button,
  Checkbox,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  useTheme,
  useMediaQuery,
  FormHelperText,
  Skeleton,
  Stack,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from '../context/CartContext';
import {
  getCart,
  getShippingOptions,
  calculateShippingPrice,
  addShippingOptionToCart,
  updateCustomerDetailsToCart,
  placeOrder,
} from './api/cart';

import {
  createPaymentCollection,
  getPaymentProviders,
  initPaymentSession,
} from '../pages/api/payment';

const ContentWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const StickyBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    position: 'static',
  },
}));

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  address_1: yup.string().required('Address is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  province: yup.string().required('Province is required'),
  postal_code: yup.string().required('Postal code is required'),
  shipping_method: yup.string().required('Shipping method is required'),
  payment_method: yup.string().required('Payment method is required'),
});

const CheckoutPage = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const { cart, setCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [calculatedPrices, setCalculatedPrices] = useState({});
  const [selectedShippingOption, setSelectedShippingOption] = useState('');
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      mpbile: '',
      first_name: '',
      last_name: '',
      address_name: '',
      address_1: '',
      address_2: '',
      city: '',
      postalCode: '',
      province: '',
    },
  });
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (cart) {
      setValue('email', cart.email || '');
      setValue('mobile', cart.shipping_address?.phone || '');
      setValue('first_name', cart.shipping_address?.first_name || '');
      setValue('last_name', cart.shipping_address?.last_name || '');
      setValue('address_1', cart.shipping_address?.address_1 || '');
      setValue('address_2', cart.shipping_address?.address_2 || '');
      setValue('city', cart.shipping_address?.city || '');
      setValue('postal_code', cart.shipping_address?.postal_code || '');
      setValue('province', cart.shipping_address?.province || '');
    }
  }, [cart, setValue]);

  useEffect(() => {
    if (!cart) {
      return;
    }
    const getShipping = async (cartId) => {
      try {
        const response = await getShippingOptions(cartId);
        console.log(response);
        setShippingOptions(response);
        if (cart?.shipping_methods.length > 0) {
          const x = response.find(
            (r) => r.id === cart?.shipping_methods[0].shipping_option_id
          );
          setSelectedShippingOption(x?.id || '');
        }
      } catch (error) {
        console.error('Error fetching shipping options:', error);
      }
    };
    const getProviders = async () => {
      const data = await getPaymentProviders(cart.region_id);
      setPaymentProviders(data);
    };
    if (cart?.id) {
      getShipping(cart.id);
      getProviders();
    }
  }, [cart]);

  useEffect(() => {
    if (!cart || !shippingOptions.length) {
      return;
    }
    const calculatedShipping = shippingOptions.filter(
      (shippingOption) => shippingOption.price_type === 'calculated'
    );
    let promises;
    if (calculatedShipping.length > 0) {
      promises = calculatedShipping.map((shippingOption) =>
        calculateShippingPrice(cart.id, shippingOption.id)
      );
      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap = {};
          res
            .filter((r) => r.status === 'fulfilled')
            .forEach(
              (p) =>
                (pricesMap[p.value?.shipping_option.id || ''] =
                  p.value?.shipping_option.amount)
            );
          setCalculatedPrices(pricesMap);
        });
      }
    }
  }, [shippingOptions, cart]);

  useEffect(() => {
    if (!cart || !selectedPaymentProvider) return;
    let paymentCollectionId = cart.payment_collection?.id;

    const init_payment_session = async (collectionId) => {
      const session = await initPaymentSession(
        collectionId,
        selectedPaymentProvider
      );
      console.log(session);
      getUpdatedCart();
    };

    const create_paymet_collection = async () => {
      if (!paymentCollectionId) {
        const paymentCollection = await createPaymentCollection(cart?.id);
        paymentCollectionId = paymentCollection.id;
      }
      init_payment_session(paymentCollectionId);
    };

    const getUpdatedCart = async () => {
      const response = await getCart(cart?.id);
      setCart(response);
    };

    create_paymet_collection();
  }, [selectedPaymentProvider]);

  const handleShippingOptionChange = async (event) => {
    setSelectedShippingOption(event.target.value);
    console.log(`optionId`, event.target.value);
    try {
      const updatedCart = await addShippingOptionToCart(cart.id, {
        option_id: event.target.value,
      });
      console.log(`updated cart`, updatedCart);
      setCart(updatedCart);
    } catch (error) {
      console.error(`Error updating shopping method`, error);
      throw error;
    }
  };

  const handleSaveAddressChange = (event) => {
    setSaveAddress(event.target.checked);
  };

  const handlePaymentOptionChange = async (event) => {
    setSelectedPaymentProvider(event.target.value);
  };

  const handleUpdateAddress = async () => {
    try {
      const cartId = localStorage.getItem('cart_id');
      if (!cartId) {
        console.error('Cart ID not found in localStorage');
        return;
      }
      const address = {
        first_name: getValues('first_name'),
        last_name: getValues('last_name'),
        address_1: getValues('address_1'),
        address_2: getValues('address_2'),
        city: getValues('city'),
        postal_code: getValues('postal_code'),
        province: getValues('province'),
        phone: getValues('mobile'),
      };
      const response = await updateCustomerDetailsToCart(cartId, {
        shipping_address: address,
        billing_address: address,
      });
      console.log('Cart updated successfully:', response);
      setCart(response);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  console.log(`cart`, cart);
  // Calculate cart totals
  const subtotal = cart?.item_total || 0;
  const shipping = cart?.shipping_total || 0; // Example shipping cost
  const discount = cart?.discount_total || 0;
  const total = subtotal + shipping - discount;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const orderResponse = await placeOrder(cart.id);
      console.log(orderResponse);
      if (orderResponse.type === 'cart' && orderResponse?.cart) {
        console.log('Order Failed');
      } else if (orderResponse.type === 'order' && orderResponse?.order) {
        console.log('Order Placed', orderResponse?.order);
        router.push('/order-success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleSameAsBillingChange = (event) => {
    setSameAsBilling(event.target.checked);
    if (event.target.checked) {
      const values = getValues([
        'first_name',
        'last_name',
        'address_1',
        'address_2',
        'city',
        'postal_code',
      ]);
      setValue('billing_first_name', values[0]);
      setValue('billing_last_name', values[1]);
      setValue('billing_address_1', values[2]);
      setValue('billing_address_2', values[3]);
      setValue('billing_city', values[4]);
      setValue('billing_postal_code', values[5]);
    }
  };

  const getPaymentUI = useCallback(() => {
    const activePaymentSession =
      cart?.payment_collection?.payment_sessions?.[0];
    if (!activePaymentSession) return;
    switch (true) {
      case activePaymentSession.provider_id.startsWith('pp_system_paypal'):
        return (
          <span>
            You chose PayPal! You will be redirected to PayPal to complete your
            payment.
          </span>
        );
      case activePaymentSession.provider_id.startsWith('pp_system_default'):
        return (
          <span>You chose manual payment! No additional actions required.</span>
        );
      default:
        return (
          <span>
            You chose {activePaymentSession.provider_id} which is in
            development.
          </span>
        );
    }
  }, [cart]);

  if (isLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="text" width="200px" height={40} />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ContentWrapper>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={cart?.email || ''}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="mobile"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mobile Number"
                        fullWidth
                        margin="normal"
                        error={!!errors.mobile}
                        helperText={errors.mobile ? errors.mobile.message : ''}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="first_name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        margin="normal"
                        error={!!errors.first_name}
                        helperText={
                          errors.first_name ? errors.first_name.message : ''
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="last_name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        fullWidth
                        margin="normal"
                        error={!!errors.last_name}
                        helperText={
                          errors.last_name ? errors.last_name.message : ''
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="address_1"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address Line 1"
                        fullWidth
                        margin="normal"
                        error={!!errors.address_1}
                        helperText={
                          errors.address_1 ? errors.address_1.message : ''
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="address_2"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address Line 2"
                        fullWidth
                        margin="normal"
                        error={!!errors.address_2}
                        helperText={
                          errors.address_2 ? errors.address_2.message : ''
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        margin="normal"
                        error={!!errors.city}
                        helperText={errors.city ? errors.city.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="province"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        fullWidth
                        margin="normal"
                        error={!!errors.province}
                        helperText={
                          errors.province ? errors.province.message : ''
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="postal_code"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Postal Code"
                        fullWidth
                        margin="normal"
                        error={!!errors.postal_code}
                        helperText={
                          errors.postal_code ? errors.postal_code.message : ''
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsBilling}
                      onChange={handleSameAsBillingChange}
                    />
                  }
                  label="Billing address is the same as shipping address"
                />

                {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={saveAddress}
                    onChange={handleSaveAddressChange}
                  />
                }
                label="Save this address for future orders"
              /> */}

                <Button
                  variant="outlined"
                  onClick={handleUpdateAddress}
                  sx={{ ml: 2 }}
                >
                  Update Address
                </Button>
              </Box>

              {!sameAsBilling && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Billing Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_first_name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_first_name}
                            helperText={
                              errors.billing_first_name
                                ? errors.billing_first_name.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_last_name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_last_name}
                            helperText={
                              errors.billing_last_name
                                ? errors.billing_last_name.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_address_1"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Address Line 1"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_address_1}
                            helperText={
                              errors.billing_address_1
                                ? errors.billing_address_1.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_address_2"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Address Line 2"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_address_2}
                            helperText={
                              errors.billing_address_2
                                ? errors.billing_address_2.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_city"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="City"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_city}
                            helperText={
                              errors.billing_city
                                ? errors.billing_city.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_province"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="State"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_province}
                            helperText={
                              errors.billing_province
                                ? errors.billing_province.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="billing_postal_code"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Postal Code"
                            fullWidth
                            margin="normal"
                            error={!!errors.billing_postal_code}
                            helperText={
                              errors.billing_postal_code
                                ? errors.billing_postal_code.message
                                : ''
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Shipping Method
              </Typography>
              <Controller
                name="shipping_method"
                control={control}
                defaultValue="standard"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={selectedShippingOption}
                    onChange={handleShippingOptionChange}
                  >
                    {shippingOptions.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={`${option.name} - ₹${option.amount}`}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors.shipping_method}>
                {errors.shipping_method ? errors.shipping_method.message : ''}
              </FormHelperText>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Controller
                name="payment_method"
                control={control}
                defaultValue="creditCard"
                render={({ field }) => (
                  <RadioGroup
                    aria-label="payment-method"
                    name="payment-method"
                    value={selectedPaymentProvider}
                    onChange={handlePaymentOptionChange}
                  >
                    {paymentProviders.map((provider) => (
                      <FormControlLabel
                        key={provider.id}
                        value={provider.id}
                        control={<Radio />}
                        label={
                          provider.id === 'pp_system_default'
                            ? 'Cash'
                            : provider.id
                        }
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              {getPaymentUI()}
              <FormHelperText error={!!errors.payment_method}>
                {errors.payment_method ? errors.payment_method.message : ''}
              </FormHelperText>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Place Order
              </Button>
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
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography variant="subtitle1">
                      ₹{subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
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
                        -₹{discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Divider />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </StickyBox>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CheckoutPage;
