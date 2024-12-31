import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  MenuItem,
  Select,
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
  const { cart, setCart, refreshCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [shippingOptions, setShippingOptions] = useState(null);
  const [calculatedPrices, setCalculatedPrices] = useState({});
  const [selectedShippingOption, setSelectedShippingOption] = useState('');
  const [paymentProviders, setPaymentProviders] = useState(null);
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
      mobile: '',
      first_name: '',
      last_name: '',
      address_name: '',
      address_1: '',
      address_2: '',
      city: '',
      postal_code: '',
      country_code: '',
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

  // Memoize cart values to avoid unnecessary re-renders
  const memoizedCartValues = useMemo(() => {
    if (cart) {
      return {
        email: cart?.email || '',
        mobile: cart?.shipping_address?.phone || '',
        first_name: cart?.shipping_address?.first_name || '',
        last_name: cart?.shipping_address?.last_name || '',
        address_1: cart?.shipping_address?.address_1 || '',
        address_2: cart?.shipping_address?.address_2 || '',
        city: cart?.shipping_address?.city || '',
        postal_code: cart?.shipping_address?.postal_code || '',
        country_code: cart?.shipping_address?.country_code || '',
        province: cart?.shipping_address?.province || '',
        shipping_method: cart?.shipping_methods || '',
      };
    }
    return {};
  }, [cart]);

  useEffect(() => {
    if (cart) {
      setValue('email', memoizedCartValues.email);
      setValue('mobile', memoizedCartValues.mobile);
      setValue('first_name', memoizedCartValues.first_name);
      setValue('last_name', memoizedCartValues.last_name);
      setValue('address_1', memoizedCartValues.address_1);
      setValue('address_2', memoizedCartValues.address_2);
      setValue('city', memoizedCartValues.city);
      setValue('postal_code', memoizedCartValues.postal_code);
      setValue('country_code', memoizedCartValues.country_code);
      setValue('province', memoizedCartValues.province);
    }
  }, [memoizedCartValues, setValue]);

  useEffect(() => {
    if (!cart) {
      return;
    }
    const getShipping = async (cartId) => {
      try {
        const response = await getShippingOptions(cartId);
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

    // Create a flag to check if we need to fetch data
    const shouldFetchShipping = !shippingOptions;
    const shouldFetchProviders = !paymentProviders;
    if (cart?.id) {
      if (shouldFetchShipping) {
        getShipping(cart.id);
      }
      if (shouldFetchProviders) {
        getProviders();
      }
    }
  }, [cart]);

  useEffect(() => {
    if (!cart || !shippingOptions) {
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

    const getUpdatedCart = async () => {
      const response = await getCart(cart?.id);
      setCart(response);
    };

    const init_payment_session = async (collectionId) => {
      const session = await initPaymentSession(
        collectionId,
        selectedPaymentProvider
      );
      getUpdatedCart();
    };

    const create_paymet_collection = async () => {
      if (!paymentCollectionId) {
        const paymentCollection = await createPaymentCollection(cart?.id);
        paymentCollectionId = paymentCollection.id;
      }
      init_payment_session(paymentCollectionId);
    };

    create_paymet_collection();
  }, [selectedPaymentProvider]);

  const handleShippingOptionChange = async (event) => {
    setSelectedShippingOption(event.target.value);
    try {
      const updatedCart = await addShippingOptionToCart(cart.id, {
        option_id: event.target.value,
      });
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
      const address = {
        first_name: getValues('first_name'),
        last_name: getValues('last_name'),
        address_1: getValues('address_1'),
        address_2: getValues('address_2'),
        city: getValues('city'),
        postal_code: getValues('postal_code'),
        country_code: getValues('country_code'),
        province: getValues('province'),
        phone: getValues('mobile'),
      };
      let billingAddress = {};
      if (!sameAsBilling) {
        billingAddress['first_name'] = getValues('billing_first_name');
        billingAddress['last_name'] = getValues('billing_last_name');
        billingAddress['address_1'] = getValues('billing_address_1');
        billingAddress['address_2'] = getValues('billing_address_2');
        billingAddress['city'] = getValues('billing_city');
        billingAddress['postal_code'] = getValues('billing_postal_code');
        billingAddress['province'] = getValues('billing_province');
      }
      const response = await updateCustomerDetailsToCart(cart?.id, {
        shipping_address: address,
        billing_address: sameAsBilling ? address : billingAddress,
        email: getValues('email'),
      });
      console.log('Cart updated successfully:', response);
      setCart(response);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const countries = useMemo(() => {
    if (!cart?.region) return [];
    return cart?.region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [cart?.region]);

  console.log(`cart`, cart);
  // Calculate cart totals
  const subtotal = cart?.item_total || 0;
  const shipping = cart?.shipping_total || 0; // Example shipping cost
  const discount = cart?.discount_total || 0;
  const total = subtotal + shipping - discount;

  const onSubmit = async (data) => {
    try {
      const orderResponse = await placeOrder(cart.id);
      console.log(orderResponse);
      if (orderResponse.type === 'cart' && orderResponse?.cart) {
        console.log('Order Failed');
      } else if (orderResponse.type === 'order' && orderResponse?.order) {
        console.log('Order Placed', orderResponse?.order);
        refreshCart();
        router.push({
          pathname: '/order-success',
          query: {
            order_id: orderResponse?.order?.id,
          },
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleSameAsBillingChange = (event) => {
    setSameAsBilling(event.target.checked);
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.email,
                        }}
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.mobile,
                        }}
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.first_name,
                        }}
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.last_name,
                        }}
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.address_1,
                        }}
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.address_2,
                        }}
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.city,
                        }}
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
                        label="State / Province"
                        fullWidth
                        margin="normal"
                        error={!!errors.province}
                        helperText={
                          errors.province ? errors.province.message : ''
                        }
                        InputProps={{
                          readOnly: !!memoizedCartValues.province,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="country_code"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        labelId="country-select-label"
                        id="country-select"
                        label="Country"
                        fullWidth
                        margin="normal"
                        {...field}
                        sx={{ mt: 2 }}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.value} value={country.value}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </Select>
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
                        InputProps={{
                          readOnly: !!memoizedCartValues.postal_code,
                        }}
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
                    {shippingOptions &&
                      shippingOptions.map((option) => (
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
                    {paymentProviders &&
                      paymentProviders.map((provider) => (
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
