import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Grid2 as Grid,
  IconButton,
  Checkbox,
  RadioGroup,
  Radio,
  Paper,
  Link,
  Divider,
  Button,
  Collapse,
  Popper,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  FormHelperText,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import in_states from '../../lib/in_states.json';
import us_ca_states from '../../lib/us_ca_states.json';
import {
  convertToLocale,
  countries,
  getShippingMethodLabel,
  getCountry,
  getShippingStateLabel,
  getShippingPostalLabel,
} from '../../utils';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useActionState, useCallback } from 'react';
import { Phone } from '../Phone';
import ErrorMessage from '../ErrorMessage';
import SubmitButton from '../SubmitButton';
import { toast } from 'react-toastify';
import { useRazorpay } from 'react-razorpay';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cartValidation } from './CartValidation';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {
  updateCustomerAddress,
  addCustomerAddress,
  deleteCustomerAddress,
} from '../../pages/api/customer';

import { placeOrder, partialSaveCart, updateCart } from '../../pages/api/cart';
import { prepareOrder } from '../../pages/api/payment';
import { SummaryContent } from './CheckoutSummary';
// Define the validation schema
const addressSchema = z
  .object({
    mode: z.enum(['add', 'edit']),
    address_id: z.string().optional(),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    address_1: z.string().min(1, 'Address is required'),
    address_2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'State is required'),
    postal_code: z
      .string()
      .min(1, 'PIN code is required')
      .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .transform((val) => {
        // First check if it starts with +91
        if (val.startsWith('+91')) {
          return val.slice(3).replace(/\D/g, ''); // Remove +91 and clean
        }
        // Otherwise just clean non-digits
        return val.replace(/\D/g, '');
      })
      .refine((val) => /^[6-9]\d{9}$/.test(val), {
        message: 'Please enter a valid 10-digit phone number starting with 6-9',
      }),
    country_code: z.string().min(1, 'Country is required'),
    shipping_address: z.object({
      first_name: z.string().min(1, 'First name is required'),
      last_name: z.string().min(1, 'Last name is required'),
      address_1: z.string().min(1, 'Address is required'),
      address_2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      province: z.string().min(1, 'State is required'),
      postal_code: z
        .string()
        .min(1, 'PIN code is required')
        .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code'),
      phone: z
        .string()
        .min(1, 'Phone number is required')
        .refine((value) => {
          const phoneNumber = parsePhoneNumberFromString(value);
          return phoneNumber?.isValid();
        }, 'Invalid phone number for the selected country'),
      country_code: z.string().min(1, 'Country is required'),
    }),
    save_address: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.mode === 'edit') {
        return !!data.address_id;
      }
      return true;
    },
    {
      message: 'Address ID is required for edit mode',
      path: ['address_id'],
    }
  );

const CheckoutForm = ({
  cart,
  setCart,
  refreshCart,
  customer,
  setCustomer,
  isAuthenticated,
  logout,
  shippingMethods,
  paymentMethods,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const [isShipToExpanded, setIsShipToExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Add new states for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  // By default set billing type to same
  const [billingType, setBillingType] = useState('same');
  // customer has address and set country to customer's country
  const [country, setCountry] = useState(
    countries.find((c) => c.code === customer?.addresses?.[0]?.country_code) ||
    countries[0]
  );

  const [selectedAddress, setSelectedAddress] = useState(
    customer?.addresses?.find((addr) => addr.is_default_shipping) || ''
  );

  const [shippingMethod, setShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [showBackDropMessage, setShowBackDropMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [statesMap, setStatesMap] = useState([]);

  const {
    register,
    formState: { errors, isValid, dirtyFields },
    setValue,
    watch,
    reset,
    getValues,
    trigger,
    control,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      mode: 'add',
      address_id: '',
      country_code: 'in',
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      province: 'Telangana',
      postal_code: '',
      phone: '',
      shipping_address: {
        country_code: 'in',
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        address_1: '',
        address_2: '',
        city: '',
        province: 'Telangana',
        postal_code: '',
        phone: customer?.phone || '',
      },
      save_address: true,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  // Watch all shipping address fields
  const shippingAddress = watch('shipping_address');
  const saveAddress = watch('save_address');

  const { Razorpay } = useRazorpay();
  const router = useRouter();

  const open = Boolean(anchorEl);

  // Handle delete click from popper
  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
    handleClose(); // Close the popper
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setLoading(true);
    // Add your delete logic here
    try {
      const result = await deleteCustomerAddress(addressToDelete.id);
      if (result.success) {
        setCustomer(result.customer);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setLoading(false);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.log(`Error Delete Customer Address Details ==>`, error);
      toast.error('Something went wrong');
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (address) => {
    reset({
      address_id: address?.id || '',
      country_code: address?.country_code || 'in',
      first_name: address?.first_name || '',
      last_name: address?.last_name || '',
      address_1: address?.address_1 || '',
      address_2: address?.address_2 || '',
      city: address?.city || '',
      province: address?.province || '',
      postal_code: address?.postal_code || '',
      phone: address?.phone || '',
      mode: 'edit',
    });
    handleClose(); // Close the popper
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleAddNewAddress = (event) => {
    event.preventDefault();
    reset({
      country_code: 'in',
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      address_id: '',
      address_1: '',
      address_2: '',
      city: '',
      province: 'Telangana',
      postal_code: '',
      phone: '',
      mode: 'add',
    });
    setOpenDialog(true);
  };

  // Set country code to country code
  useEffect(() => {
    setValue('shipping_address.country_code', country.code);
  }, [country]);

  // Set selected address to default address
  useEffect(() => {
    if (customer?.addresses?.length === 1) {
      setSelectedAddress(customer?.addresses?.[0]);
    } else if (customer?.addresses?.length > 1) {
      const defaultShippingAddress = customer?.addresses?.find(
        (addr) => addr.is_default_shipping
      );
      setSelectedAddress(defaultShippingAddress);
    } else {
      setSelectedAddress(null);
    }
  }, [customer]);

  const triggerPartialSaveCart = async (
    selectedAddress,
    shippingMethod,
    paymentMethod
  ) => {
    try {
      const result = await partialSaveCart(
        customer,
        selectedAddress,
        shippingMethod,
        paymentMethod,
        true
      );
      if (result.success) {
        setCart(result.cart);
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(`Error Partial Save Cart Details ==>`, error);
    }
  };

  // Trigger PartialSave to cart when there is a selectedAddress,
  // shipping_method and payment session and cart does not have
  // missing steps
  useEffect(() => {
    if (
      selectedAddress?.country_code &&
      shippingMethods &&
      paymentMethods &&
      !cartValidation.hasShippingMethod(cart) &&
      !cartValidation.hasPaymentSession(cart)
    ) {
      const countryCode = selectedAddress?.country_code;
      const countryObj = getCountry(countryCode);
      const shippingOptions = shippingMethods?.find(
        (so) => so.name === `SO-${countryObj.code.toUpperCase()}`
      );
      setShippingMethod(shippingOptions);
      setPaymentMethod(paymentMethods[0]);
      triggerPartialSaveCart(
        selectedAddress,
        shippingOptions,
        paymentMethods[0]
      );
    }
  }, [selectedAddress, shippingMethods, paymentMethods, cart, customer]);

  const handlePayNow = async () => {
    setLoading(true);
    setError(null);
    setShowBackDrop(true);
    setShowBackDropMessage('Please wait while we are processing your order');
    const { isReady } = cartValidation.isReadyForCheckout(cart);
    let result = {
      updatedCart: cart,
      success: false,
    };
    try {
      if (!isReady) {
        result = await prepareOrder(
          cart,
          customer,
          selectedAddress,
          shippingMethod,
          paymentMethod,
          billingType,
          formData
        );
      }
      if (result?.success || isReady) {
        setShowBackDropMessage('Processing Payment');
        const options = {
          callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? '',
          amount:
            result.updatedCart?.payment_collection?.payment_sessions[0]
              ?.amount *
            100 *
            100,
          order_id:
            result.updatedCart?.payment_collection?.payment_sessions[0]?.data
              ?.id,
          currency: result.updatedCart?.currency_code.toUpperCase(),
          name: process.env.COMPANY_NAME ?? 'SUCHITRA FOODS ',
          description: `Order number ${result.updatedCart?.payment_collection?.payment_sessions[0]?.data?.id}`,
          remember_customer: true,

          image: 'https://example.com/your_logo',
          modal: {
            backdropclose: true,
            escape: true,
            handleback: true,
            confirm_close: true,
            ondismiss: async () => {
              await onPaymentCancelled();
            },
            animation: true,
          },

          handler: async () => {
            onPaymentCompleted();
          },
          prefill: {
            name:
              result.updatedCart?.billing_address?.first_name +
              ' ' +
              result.updatedCart?.billing_address?.last_name,
            email: result.updatedCart?.email,
            contact: result.updatedCart?.shipping_address?.phone ?? undefined,
          },
        };
        const razorpay = new Razorpay(options);
        if (
          result.updatedCart?.payment_collection?.payment_sessions[0]?.data?.id
        ) {
          razorpay.open();
          razorpay.on('payment.failed', function (response) {
            setError(JSON.stringify(response.error));
          });
          razorpay.on('payment.authorized', function (response) {
            onPaymentCompleted();
          });
        }
      }
    } catch (error) {
      console.log(`Error Create Order Details ==>`, error);
    }
  };

  const onPaymentCompleted = async () => {
    console.log('Placing order...');
    setShowBackDropMessage('Placing order...');
    // setSubmitting(true);
    const orderResponse = await placeOrder(cart.id);
    if (orderResponse.type === 'cart' && orderResponse?.cart) {
      console.log('Order Failed');
      toast.error('Order failed. Please try again.');
    } else if (orderResponse.type === 'order' && orderResponse?.order) {
      console.log('Order Placed', orderResponse?.order);
      toast.success('Order placed successfully!');
      await router.push({
        pathname: '/order-success',
        query: {
          order_id: orderResponse?.order?.id,
        },
      }, undefined, { shallow: true });
      setTimeout(() => {
        refreshCart();
      }, 1000);
    }
  };

  const PaymentMethodIcons = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <img src="/images/upi.svg" alt="UPI" />
      <img src="/images/visa.svg" alt="Visa" />
      <img src="/images/master.svg" alt="Mastercard" />
      <img src="/images/rupay.svg" alt="RuPay" />
      {/* <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
        +16
      </Typography> */}
    </Box>
  );

  const mode = watch('mode');
  const countryCode = watch('shipping_address.country_code');
  const editCountryCode = watch('country_code');
  const stateName = watch('shipping_address.province');
  const postalCode = watch('shipping_address.postal_code');
  const isProvinceRequired = ['in', 'us', 'ca'].includes(countryCode);

  const { missingSteps } = cartValidation.isReadyForCheckout(cart);

  useEffect(() => {
    console.log('missingSteps', missingSteps);
  }, [missingSteps]);

  const isFormValid = useCallback(() => {
    const values = getValues('shipping_address');
    const requiredFields = [
      'first_name',
      'last_name',
      'address_1',
      'city',
      'province',
      'postal_code',
      'country_code',
      'phone',
    ];

    // Check if all required fields have values
    const hasAllFields = requiredFields.every((field) => {
      const value = values[field];
      const isDirty = dirtyFields.shipping_address?.[field];
      return value && value.trim() !== '' && isDirty;
    });

    // Check if there are any errors
    const hasNoErrors = Object.keys(errors.shipping_address || {}).length === 0;

    return hasAllFields && hasNoErrors;
  }, [getValues, errors, dirtyFields]);

  useEffect(() => {
    const requiredFields = [
      'first_name',
      'last_name',
      'address_1',
      'city',
      'province',
      'postal_code',
      'country_code',
      'phone',
    ];

    // Check if all required fields have values and are dirty
    const hasAllRequiredFields = requiredFields.every((field) => {
      const value = shippingAddress[field];
      return value && value.trim() !== '';
    });

    // Debug logging
    console.log('Form state:', {
      hasAllRequiredFields,
      errors,
      values: shippingAddress,
      customer: customer?.addresses?.length,
    });

    // Auto-submit if all conditions are met
    if (
      hasAllRequiredFields &&
      Object?.keys(errors)?.length === 0 &&
      customer?.addresses?.length === 0
    ) {
      handleFormSubmit();
    }
  }, [
    shippingAddress.first_name,
    shippingAddress.last_name,
    shippingAddress.address_1,
    shippingAddress.address_2,
    shippingAddress.city,
    shippingAddress.province,
    shippingAddress.postal_code,
    shippingAddress.country_code,
    shippingAddress.phone,
    customer?.addresses?.length,
    errors,
  ]);

  // Reset phone field when country changes and when country code is changed in edit mode or country code is changed in add mode
  useEffect(() => {
    if (countryCode) {
      setValue('shipping_address.phone', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('shipping_address.postal_code', '', {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
    if (editCountryCode || countryCode) {
      const code = editCountryCode || countryCode;
      const states =
        code === 'in'
          ? in_states.records
          : us_ca_states.find(
            (country) => country.abbreviation.toLowerCase() === code
          )?.states;
      setStatesMap(states);
    }
  }, [countryCode, setValue, editCountryCode]);

  // When country-code, province and post_code are set, set shipping method
  useEffect(() => {
    if (
      countryCode &&
      stateName &&
      postalCode.length === 6 &&
      shippingMethods
    ) {
      const countryObj = getCountry(countryCode);
      const shippingOptions = shippingMethods?.find(
        (so) => so.name === `SO-${countryObj.code.toUpperCase()}`
      );
      setShippingMethod(shippingOptions);
    }
  }, [countryCode, stateName, postalCode, shippingMethods]);

  const [editState, editFormAction] = useActionState(
    async (prevState, formData) => {
      let result;
      if (mode === 'add') {
        result = await addCustomerAddress(prevState, formData);
      } else {
        result = await updateCustomerAddress(prevState, formData);
      }
      if (result.success) {
        setCustomer(result.customer);
        handleDialogClose();
        toast.success(result.message);
      }
      return result;
    },
    null
  );

  const [newAddressState, newFormAction] = useActionState(
    async (prevState, formData) => {
      const shippingAddress = getValues('shipping_address');
      console.log('Submitting shipping address:', shippingAddress);

      const address = {
        first_name: shippingAddress.first_name,
        last_name: shippingAddress.last_name,
        address_1: shippingAddress.address_1,
        address_2: shippingAddress?.address_2 || '',
        company: shippingAddress?.company || '',
        postal_code: shippingAddress.postal_code,
        city: shippingAddress.city,
        country_code: shippingAddress.country_code,
        province: shippingAddress.province,
        phone: shippingAddress.phone,
      }

      const updatedCart = await updateCart({
        email: customer?.email,
        shipping_address: address,
        billing_address: address,
      });
      setCart(updatedCart);

      if (saveAddress) {
        const result = await addCustomerAddress(prevState, {
          first_name: shippingAddress.first_name,
          last_name: shippingAddress.last_name,
          address_1: shippingAddress.address_1,
          address_2: shippingAddress?.address_2 || '',
          company: shippingAddress?.company || '',
          postal_code: shippingAddress.postal_code,
          city: shippingAddress.city,
          country_code: shippingAddress.country_code,
          province: shippingAddress.province,
          phone: shippingAddress.phone,
          is_default_shipping: true,
          is_default_billing: true,
        });
        if (result.success) {
          setCustomer(result.customer);
        }
      }
    },
    null
  );

  const handleFormSubmit = async () => {
    const isValid = await trigger('shipping_address', { shouldFocus: true });
    if (!isValid) {
      console.log('Form validation failed', errors);
      return;
    }

    await newFormAction();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Validate form before submission
    const isValid = await trigger('address-dialog-form', { shouldFocus: true });
    console.log('Form validation:', {
      isFormValid,
      isValid,
      errors,
      values: getValues(),
    });
    if (!isValid) {
      console.log('Form validation failed', errors);
      return;
    }
    await editFormAction(e);
  };

  const handlePhoneChange = (phone) => {
    // Remove any non-digit characters before setting value
    const cleanPhone = phone.replace(/\D/g, '');
    setValue('phone', cleanPhone, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleShippingPhoneChange = (phone) => {
    // Remove any non-digit characters before setting value
    // const cleanPhone = phone.replace(/\D/g, '');
    console.log('handleShippingPhoneChange', phone);
    setValue('shipping_address.phone', phone, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleBillingPhoneChange = (phone) => {
    setValue('billing_address.phone', phone, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={showBackDrop}
        onClick={() => setShowBackDrop(false)}
      >
        <Typography variant="h6">{showBackDropMessage}</Typography>
      </Backdrop>
      {/* Contact Section */}
      {!isAuthenticated ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Link href="/account?view=sign-in" sx={{ ml: 'auto' }}>
              Login
            </Link>
          </Box>
          <TextField
            fullWidth
            placeholder="Email or mobile phone number"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setIsAccountExpanded(!isAccountExpanded)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: '1rem', color: 'primary.main' }}
            >
              Account
            </Typography>
            <IconButton size="small">
              {isAccountExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontWeight: 'bold' }}
          >
            {customer?.email}
          </Typography>
          <Collapse in={isAccountExpanded} timeout="auto">
            <Link
              component="button"
              variant="body2"
              onClick={() => logout()}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                mt: 1,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Log out
            </Link>
          </Collapse>
        </Box>
      )}

      {isAuthenticated && <Divider sx={{ my: 3 }} />}

      {isAuthenticated && selectedAddress && (
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setIsShipToExpanded(!isShipToExpanded)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: '1rem', color: 'primary.main' }}
            >
              Ship To
            </Typography>
            <IconButton size="small">
              {isShipToExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.5rem',
              display: `${isShipToExpanded ? 'none' : 'flex'}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              {selectedAddress?.first_name} {selectedAddress?.last_name},
              {<br />}
              {selectedAddress?.address_1}, {<br />}
              {selectedAddress?.address_2 &&
                selectedAddress.address_2 !== null &&
                selectedAddress.address_2.trim().length > 0 && (
                  <>
                    {selectedAddress.address_2},{<br />}
                  </>
                )}
              {selectedAddress?.city},{selectedAddress?.province.toUpperCase()},{' '}
              {selectedAddress?.postal_code},
              {selectedAddress?.country_code.toUpperCase()}
            </Typography>
          </Box>
          {/* Popper for more options */}
          {customer?.addresses?.length > 1 ? (
            // Show radio group for multiple addresses with popper
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="top"
              sx={{ zIndex: 1000 }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Paper
                  elevation={2}
                  sx={{
                    mt: 1,
                    borderRadius: 1,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      py: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box
                      onClick={() => {
                        handleEditClick(selectedAddress);
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        color: 'text.secondary',
                      }}
                    >
                      Edit
                    </Box>
                    <Divider />
                    <Box
                      onClick={() => handleDeleteClick(selectedAddress)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        color: 'error.main',
                      }}
                    >
                      Delete
                    </Box>
                  </Box>
                </Paper>
              </ClickAwayListener>
            </Popper>
          ) : (
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="top"
              sx={{ zIndex: 1000 }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Paper
                  elevation={2}
                  sx={{
                    mt: 1,
                    borderRadius: 1,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      py: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box
                      onClick={() => {
                        handleEditClick(selectedAddress);
                        // Add your edit action here
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        color: 'primary.main',
                      }}
                    >
                      Edit
                    </Box>
                  </Box>
                </Paper>
              </ClickAwayListener>
            </Popper>
          )}
          <Collapse in={isShipToExpanded} timeout="auto">
            {customer?.addresses?.length > 1 ? (
              // Show radio group for multiple addresses
              <RadioGroup
                value={selectedAddress.id}
                onChange={(e) => {
                  const address = customer?.addresses?.find(
                    (addr) => addr.id === e.target.value
                  );
                  setSelectedAddress(address);
                }}
              >
                {customer?.addresses.map((address) => (
                  <Box
                    key={address.id}
                    sx={{
                      mt: 1,
                      bgcolor: `${selectedAddress?.id === address?.id ? 'rgba(245, 245, 245)' : ''}`,
                      borderRadius: '0.5rem',
                      position: 'relative',
                    }}
                  >
                    <FormControlLabel
                      value={address.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ py: 1 }}>
                          <Typography variant="body2">
                            {address.first_name} {address.last_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}
                          >
                            {address.address_1}
                            {address.address_2 && `, ${address.address_2}`}
                            <br />
                            {address.city}, {address.province.toUpperCase()},{' '}
                            {address.postal_code},{' '}
                            {address.country_code.toUpperCase()}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mx: 1,
                        width: 'calc(100% - 48px)', // Make space for more options button
                      }}
                    />
                    <IconButton
                      onClick={handleClick}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <MoreVertIcon
                        sx={{
                          color: `${selectedAddress?.id === address?.id ? 'primary.main' : 'text.secondary'}`,
                          display: `${selectedAddress?.id === address?.id ? 'block' : 'none'}`,
                        }}
                      />
                    </IconButton>
                  </Box>
                ))}
              </RadioGroup>
            ) : (
              // Show single address with edit option
              <Box
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(245, 245, 245)',
                  borderRadius: '0.5rem',
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}
                >
                  {selectedAddress?.first_name} {selectedAddress?.last_name},
                  {selectedAddress?.address_1}, {<br />}
                  {selectedAddress?.address_2 &&
                    selectedAddress.address_2 !== null &&
                    selectedAddress.address_2.trim().length > 0 && (
                      <>
                        {selectedAddress.address_2},{<br />}
                      </>
                    )}
                  {selectedAddress?.city},
                  {selectedAddress?.province.toUpperCase()},{' '}
                  {selectedAddress?.postal_code},
                  {selectedAddress?.country_code.toUpperCase()}
                </Typography>
                <IconButton onClick={handleClick}>
                  <MoreVertIcon sx={{ color: 'primary.main' }} />
                </IconButton>
              </Box>
            )}

            <Box
              onClick={handleAddNewAddress}
              sx={{
                color: 'primary.main',
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <AddIcon /> Use a different address
            </Box>
          </Collapse>
          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Delete Address</DialogTitle>
            <DialogContent>
              <Typography id="delete-dialog-description">
                Are you sure you want to delete this address? This action cannot
                be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                autoFocus
                disabled={loading}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {/* Address Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              {mode === 'edit' ? 'Edit Address' : 'Add New Address'}
              <IconButton
                onClick={handleDialogClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'text.secondary',
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <form
                id="address-dialog-form"
                onSubmit={handleEditSubmit}
                noValidate
                method="post"
                action="javascript:void(0);"
              >
                <ErrorMessage error={editState?.error} sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Country/Region</InputLabel>
                  <Select
                    {...register('country_code')}
                    name="country_code"
                    value={watch('country_code')}
                    label="Country/Region"
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.country_code && (
                    <FormHelperText>
                      {errors.country_code.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('first_name')}
                      fullWidth
                      name="first_name"
                      label="First name"
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('last_name')}
                      fullWidth
                      name="last_name"
                      label="Last name"
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                    />
                  </Grid>
                </Grid>

                <TextField
                  {...register('address_1')}
                  fullWidth
                  name="address_1"
                  label="Address"
                  error={!!errors.address_1}
                  helperText={errors.address_1?.message}
                  sx={{ mb: 2 }}
                />

                <TextField
                  {...register('address_2')}
                  fullWidth
                  name="address_2"
                  label="Apartment, suite, etc. (optional)"
                  error={!!errors.address_2}
                  helperText={errors.address_2?.message}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register('city')}
                      fullWidth
                      name="city"
                      label="City"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  </Grid>
                  {['in', 'us', 'ca'].includes(watch('country_code')) && (
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          {...register('province')}
                          name="province"
                          value={watch('province')}
                          label="State"
                        >
                          {statesMap.map((state) => (
                            <MenuItem
                              key={state.state_name_english}
                              value={state.state_name_english}
                            >
                              {state.state_name_english}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.province && (
                          <FormHelperText>
                            {errors.province.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register('postal_code')}
                      fullWidth
                      name="postal_code"
                      label="PIN code"
                      error={!!errors.postal_code}
                      helperText={errors.postal_code?.message}
                    />
                  </Grid>
                </Grid>

                <Phone
                  value={watch('phone')}
                  onChange={handlePhoneChange}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  label="Phone number"
                  name="phone"
                  placeholder="Phone number"
                  color="primary"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                />

                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={handleDialogClose} color="inherit">
                    Cancel
                  </Button>
                  <SubmitButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditSubmit(e);
                    }}
                  >
                    Save Changes
                  </SubmitButton>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      )}
      {isAuthenticated && customer?.addresses?.length > 0 && (
        <Divider sx={{ my: 3 }} />
      )}
      {isAuthenticated && customer?.addresses?.length === 0 && (
        <>
          {/* Delivery Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Delivery
          </Typography>
          <form
            id="address-dialog-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFormSubmit();
            }}
            noValidate
            method="post"
            action="javascript:void(0);"
          >
            <ErrorMessage error={newAddressState?.error} sx={{ mb: 2 }} />
            <Controller
              name="shipping_address.country_code"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.shipping_address?.country_code}
                  sx={{ mb: 2 }}
                >
                  <InputLabel>Country/Region</InputLabel>
                  <Select {...field} label="Country/Region">
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.shipping_address?.country_code?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('shipping_address.first_name')}
                  fullWidth
                  label="First name"
                  error={!!errors.shipping_address?.first_name}
                  helperText={errors.shipping_address?.first_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('shipping_address.last_name')}
                  fullWidth
                  label="Last name"
                  error={!!errors.shipping_address?.last_name}
                  helperText={errors.shipping_address?.last_name?.message}
                />
              </Grid>
            </Grid>

            <TextField
              {...register('shipping_address.address_1')}
              fullWidth
              label="Address"
              error={!!errors.shipping_address?.address_1}
              helperText={errors.shipping_address?.address_1?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register('shipping_address.address_2')}
              fullWidth
              label="Apartment, suite, etc. (optional)"
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{ width: `${isProvinceRequired ? '150px' : '48.5%'}` }}
              >
                <TextField
                  {...register('shipping_address.city')}
                  fullWidth
                  label="City"
                  error={!!errors.shipping_address?.city}
                  helperText={errors.shipping_address?.city?.message}
                />
              </Grid>
              {isProvinceRequired && (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ width: `${isProvinceRequired ? '194px' : '48.5%'}` }}
                >
                  <Controller
                    name="shipping_address.province"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.shipping_address?.province}
                      >
                        <InputLabel>
                          {getShippingStateLabel(
                            watch('shipping_address.country_code')
                          )}
                        </InputLabel>
                        <Select
                          {...field}
                          label={getShippingStateLabel(
                            watch('shipping_address.country_code')
                          )}
                        >
                          {statesMap.map((state) => (
                            <MenuItem
                              key={state.state_name_english}
                              value={state.state_name_english}
                            >
                              {state.state_name_english}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.shipping_address?.province && (
                          <FormHelperText>
                            {errors.shipping_address.province.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sm={4}
                sx={{ width: `${isProvinceRequired ? '160px' : '48.5%'}` }}
              >
                <TextField
                  {...register('shipping_address.postal_code')}
                  fullWidth
                  label={getShippingPostalLabel(
                    watch('shipping_address.country_code')
                  )}
                  error={!!errors.shipping_address?.postal_code}
                  helperText={errors.shipping_address?.postal_code?.message}
                />
              </Grid>
            </Grid>

            <Controller
              name="shipping_address.phone"
              control={control}
              render={({ field }) => (
                <Phone
                  value={watch('shipping_address.phone')}
                  onChange={handleShippingPhoneChange}
                  error={!!errors.shipping_address?.phone}
                  helperText={errors.shipping_address?.phone?.message}
                  label="Phone number"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />

            {isAuthenticated && (
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('save_address')}
                    checked={watch('save_address')}
                    onChange={(e) => setValue('save_address', e.target.checked)}
                  />
                }
                label="Save this information for next time"
                sx={{ mb: 2 }}
              />
            )}
          </form>
        </>
      )}

      {/* Shipping Method */}
      {cart?.shipping_methods?.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                color: `${cart?.shipping_methods?.[0]?.amount > 0
                  ? 'primary.main'
                  : 'text.secondary'
                  }`,
              }}
            >
              Shipping Method
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.5rem',
              display: `flex`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              {getShippingMethodLabel('SO-IN')}:{' '}
              {convertToLocale({
                amount: cart?.shipping_methods?.[0]?.amount,
                currency_code: cart?.currency_code,
              })}
            </Typography>
          </Box>
        </>
      )}
      {cart?.shipping_methods?.length === 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shipping Method
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              mb: 1,
              p: 2,
              bgcolor: 'rgb(245, 245, 245)',
              borderColor: 'primary.main',
            }}
          >
            {!shippingMethod ? (
              <Typography>
                Enter your shipping address to view available shipping methods.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>
                  {getShippingMethodLabel(shippingMethod.name)}
                </Typography>
                <Typography>
                  {convertToLocale({
                    amount: shippingMethod.amount,
                    currency_code: cart.currency_code,
                  })}
                </Typography>
              </Box>
            )}
          </Paper>
        </>
      )}
      {isAuthenticated && cart?.shipping_methods?.length > 0 && (
        <Divider sx={{ my: 3 }} />
      )}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Payment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        All transactions are secure and encrypted.
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          bgcolor: 'rgb(245, 245, 245)',
          borderColor: 'primary.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.875rem' }}>
            Razorpay Secure (UPI, Cards, Wallets, NetBanking)
          </Typography>
          <PaymentMethodIcons />
        </Box>
      </Paper>
      <Box
        sx={{
          bgcolor: 'grey.100',
          p: 3,
          borderRadius: 1,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src="/images/redirect.svg"
          alt="Redirect Icon"
          sx={{ mb: 2, width: '100px' }}
        />
        <Typography variant="body2" color="text.secondary">
          After clicking "Pay now", you will be redirected to Razorpay Secure
          (UPI, Cards, Wallets, NetBanking) to complete your purchase securely.
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        Billing address
      </Typography>
      <RadioGroup
        value={billingType}
        onChange={(e) => setBillingType(e.target.value)}
      >
        <Paper
          variant="outlined"
          sx={{
            mb: 1,
            p: 2,
            bgcolor: billingType === 'same' ? 'primary.50' : 'transparent',
            borderColor: billingType === 'same' ? 'primary.main' : 'divider',
          }}
        >
          <FormControlLabel
            value="same"
            control={<Radio />}
            label="Same as shipping address"
          />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            bgcolor: billingType === 'different' ? 'primary.50' : 'transparent',
            borderColor:
              billingType === 'different' ? 'primary.main' : 'divider',
          }}
        >
          <FormControlLabel
            value="different"
            control={<Radio />}
            label="Use a different billing address"
          />
        </Paper>
      </RadioGroup>
      {billingType === 'different' && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Country/Region</InputLabel>
            <Select
              name="billing_address.country_code"
              value={country?.value}
              onChange={(e) => setCountry(getCountry(e.target.value))}
              label="Country/Region"
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="billing_address.first_name"
                label="First name"
                value={formData['billing_address.first_name']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="billing_address.last_name"
                label="Last name"
                value={formData['billing_address.last_name']}
              />
            </Grid>
          </Grid>

          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label="Address"
              name="billing_address.address_1"
              value={formData['billing_address.address_1']}
            />
            {/* <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <SearchIcon />
        </IconButton> */}
          </Box>

          <TextField
            fullWidth
            label="Apartment, suite, etc. (optional)"
            name="billing_address.address_2"
            value={formData['billing_address.address_2']}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="billing_address.city"
                value={formData['billing_address.city']}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  name="billing_address.province"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                >
                  {statesMap.records.map((state) => (
                    <MenuItem
                      key={state.state_name_english}
                      value={state.state_name_english}
                    >
                      {state.state_name_english}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="billing_address.postal_code"
                label="PIN code"
                value={formData['billing_address.postal_code']}
              />
            </Grid>
          </Grid>

          <Phone
            value={formData['billing_address.phone']}
            onChange={(phone) =>
              setFormData((prevState) => ({
                ...prevState,
                'billing_address.phone': phone,
              }))
            }
            label="Phone number"
            sx={{ mb: 2 }}
            name="billing_address.phone"
            placeholder="Phone number"
            color="primary"
            variant="outlined"
            fullWidth
          />
        </>
      )}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mt: 2, mb: 1, display: { xs: 'block', md: 'none' } }}
      >
        Order summary
      </Typography>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <SummaryContent cart={cart} />
      </Box>
      <Button
        onClick={handlePayNow}
        variant="contained"
        fullWidth
        size="large"
        disabled={loading || missingSteps.length > 0}
        sx={{
          mt: 2,
          mb: 4,
          py: 1.5,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        Pay now
      </Button>
      <ErrorMessage error={error} sx={{ mt: 2 }} />
    </Box>
  );
};

CheckoutForm.propTypes = {
  customer: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  shippingMethods: PropTypes.array.isRequired,
  paymentMethods: PropTypes.array.isRequired,
};

export default CheckoutForm;
