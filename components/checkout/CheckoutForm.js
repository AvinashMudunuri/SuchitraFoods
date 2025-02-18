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
  Skeleton,
  FormHelperText,
  CircularProgress,
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
  getShippingMethodLabel,
  getShippingStateLabel,
  getShippingPostalLabel,
} from '../../utils';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useActionState, useCallback, useRef } from 'react';
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

import { placeOrder, getCart, updateCart, addShippingOptionToCart } from '../../pages/api/cart';
import { initPaymentSession, prepareOrder } from '../../pages/api/payment';
import { SummaryContent } from './CheckoutSummary';
import { useRegion } from '../../context/RegionContext';

const postalCodeSchemas = {
  IN: z.string().regex(/^\d{6}$/, "Invalid Indian PIN code (6 digits)"),
  US: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid US ZIP code"),
  CA: z.string().regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, "Invalid Canadian Postal Code"),
  GB: z.string().regex(/^[A-Za-z]{1,2}\d{1,2}[A-Za-z]? ?\d[A-Za-z]{2}$/, "Invalid UK Postal Code"),
  DE: z.string().regex(/^\d{5}$/, "Invalid German Postal Code"),
  AU: z.string().regex(/^\d{4}$/, "Invalid Australian Postal Code"),
};


const addressFieldsSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address_1: z.string().min(1, 'Address is required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'State is required'),
  country_code: z.string().min(1, 'Country is required'),
  postal_code: z.string().trim(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid();
    }, 'Invalid phone number for the selected country'),
}).superRefine((data, ctx) => {
  // Apply postal code validation dynamically based on country
  const countryCode = data.country_code.toUpperCase();
  if (postalCodeSchemas[countryCode]) {
    const result = postalCodeSchemas[countryCode].safeParse(data.postal_code);
    if (!result.success) {
      ctx.addIssue({
        path: ["postal_code"],
        message: result.error.errors[0].message,
      });
    }
  }
});
// Define the validation schema
const addressSchema = z
  .object({
    mode: z.enum(['add', 'edit']),
    address_id: z.string().optional(),
    ...addressFieldsSchema.shape, // Use .shape to spread the schema fields
    shipping_address: addressFieldsSchema,
    billing_address: addressFieldsSchema,
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
      message: 'Address ID is required for edit mode'
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

  // States
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [showBackDropMessage, setShowBackDropMessage] = useState('');
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const [isShipToExpanded, setIsShipToExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  // Add new states for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(
    customer?.addresses?.find((addr) => addr.is_default_shipping) || ''
  );
  const [statesMap, setStatesMap] = useState([]);
  const [billingType, setBillingType] = useState('same');
  const [shippingMethod, setShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  // form
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
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // hooks
  const router = useRouter();
  const { Razorpay } = useRazorpay();
  const { countries } = useRegion();

  // watchers
  const saveAddress = watch('save_address');
  const mode = watch('mode');
  const shippingCountryCode = watch('shipping_address.country_code');
  const shippingPostalCode = watch('shipping_address.postal_code');
  const editCountryCode = watch('country_code');
  const isProvinceRequired = ['in', 'us', 'ca'].includes(shippingCountryCode || editCountryCode);


  // Refs

  // API's

  const updateCartWithShippingOption = async () => {
    try {
      setLoadingId('shipping-method');
      const response = await addShippingOptionToCart(cart.id, {
        shippingMethodId: shippingMethod.id,
      });
      setCart(response);
      setLoadingId(null);
      setPaymentMethod(paymentMethods[0]);
    } catch (error) {
      console.log('error', error);
      setLoadingId(null);
    }
  }

  const updateCartWithEmailAndAddressAndPaymentSession = async (data) => {
    try {
      setLoadingId('update-cart');
      const updatedCart = await updateCart(data);
      const updatedCartWithPaymentSession = await updateCartWithPaymentSession(updatedCart);
      setLoadingId(null);
      return updatedCartWithPaymentSession;
    } catch (error) {
      console.log('error', error);
      setLoadingId(null);
    }
  }

  const updateCartWithPaymentSession = async (updatedCart) => {
    try {
      setLoadingId('update-payment-session');
      const response = await initPaymentSession(updatedCart, paymentMethod.id);
      const updatedCartWithPaymentSession = await getCart(updatedCart.id);
      setLoadingId(null);
      return updatedCartWithPaymentSession;
    } catch (error) {
      console.log('error', error);
      setLoadingId(null);
    }
  }

  const initateOrder = async (cart) => {
    try {
      setLoadingId('initate-order');
      setShowBackDrop(true);
      setShowBackDropMessage('Processing Payment');
      const options = {
        callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? '',
        amount:
          cart?.payment_collection?.payment_sessions[0]?.amount *
          100 *
          100,
        order_id:
          cart?.payment_collection?.payment_sessions[0]?.data?.id,
        currency: cart?.currency_code.toUpperCase(),
        name: process.env.COMPANY_NAME ?? 'SUCHITRA FOODS ',
        description: `Order number ${cart?.payment_collection?.payment_sessions[0]?.data?.id}`,
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
          await onPaymentCompleted();
        },
        prefill: {
          name:
            cart?.billing_address?.first_name +
            ' ' +
            cart?.billing_address?.last_name,
          email: cart?.email,
          contact: cart?.shipping_address?.phone ?? undefined,
        },
      };
      const razorpay = new Razorpay(options);
      if (
        cart?.payment_collection?.payment_sessions[0]?.data?.id
      ) {
        razorpay.open();
        razorpay.on('payment.failed', function (response) {
          setError(JSON.stringify(response.error));
        });
        razorpay.on('payment.authorized', function (response) {
          onPaymentCompleted();
        });
      }
    } catch (error) {
      console.log('error', error);
      setLoadingId(null);
    }
  }

  const onPaymentCompleted = async () => {
    try {
      setLoadingId('place-order');
      setShowBackDropMessage('Placing order...');
      const orderResponse = await placeOrder(cart.id);
      if (orderResponse.type === 'cart' && orderResponse?.cart) {
        toast.error('Order failed. Please try again.');
        setLoadingId(null);
      } else if (orderResponse.type === 'order' && orderResponse?.order) {
        // Disable all API calls and event listeners
        router.events.emit('preventRefresh', true);
        toast.success('Order placed successfully!');
        await router.push({
          pathname: '/order-success',
          query: {
            order_id: orderResponse?.order?.id,
          },
        }, undefined, { shallow: true });
        setTimeout(() => {
          setLoadingId(null);
          setShowBackDrop(false);
          refreshCart();
          router.events.emit('preventRefresh', false);
        }, 1000);
      }
    } catch (error) {
      console.log(`Error Placing Order Details ==>`, error);
      toast.error('Something went wrong. Please try again.');
      setLoadingId(null);
      setShowBackDrop(false);
    } finally {
      setShowBackDrop(false);
      setLoadingId(null);
    }
  }

  const onPaymentCancelled = async () => {
    setLoadingId(null);
    setShowBackDrop(false);
    toast.error('Payment cancelled. Please try again.');
  }
  // UseEffects

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

  useEffect(() => {
    if (selectedAddress) {
      const countryCode = selectedAddress?.country_code?.toLowerCase() || 'in';
      const isSameShippingMethod = shippingMethod?.name === `SO-${countryCode.toUpperCase()}`;
      if (!isSameShippingMethod) {  // If the shipping method is not the same as the selected address
        setShippingMethod(shippingMethods?.find(
          (so) => so.name === `SO-${countryCode.toUpperCase()}`
        ));
      }
    }
  }, [selectedAddress, shippingMethods, shippingMethod]);

  useEffect(() => {
    if (countries.length > 0) {
      const code = shippingCountryCode || editCountryCode;
      if (code !== 'in') {
        reset({
          country_code: code,
          shipping_address: {
            country_code: code,
            address_1: '',
            address_2: '',
            city: '',
            province: '',
            postal_code: '',
            phone: '',
          }
        })
      }
      if (code && isProvinceRequired) {
        const states =
          code === 'in'
            ? in_states.records
            : us_ca_states.find(
              (country) => country.abbreviation.toLowerCase() === code
            )?.states;
        setStatesMap(states);
      }
      if (code) {
        const shippingOptions = shippingMethods?.find(
          (so) => so.name === `SO-${code.toUpperCase()}`
        );
        if (shippingOptions) {
          setShippingMethod(shippingOptions);
        }
      }
    }
  }, [countries, shippingCountryCode, setValue, shippingMethods]);

  useEffect(() => {
    if (shippingMethod) {
      updateCartWithShippingOption();
    }
  }, [shippingMethod]);

  useEffect(() => {
    if (shippingPostalCode) {
      trigger('shipping_address.postal_code');
    }
  }, [shippingCountryCode, shippingPostalCode, trigger]);

  useEffect(() => {
    if (loadingId) {
      console.log('loadingId', loadingId);
    }
    if (showBackDrop) {
      console.log('showBackDrop', showBackDrop);
    }
    if (showBackDropMessage) {
      console.log('showBackDropMessage', showBackDropMessage);
    }
  }, [loadingId, showBackDrop, showBackDropMessage]);

  useEffect(() => {
    if (openDialog && editingAddress) {
      reset({
        mode: 'edit',
        address_id: editingAddress?.id || '',
        country_code: editingAddress?.country_code?.toLowerCase() || 'in',
        first_name: editingAddress?.first_name || '',
        last_name: editingAddress?.last_name || '',
        address_1: editingAddress?.address_1 || '',
        address_2: editingAddress?.address_2 || '',
        city: editingAddress?.city || '',
        province: editingAddress?.province || '',
        postal_code: editingAddress?.postal_code || '',
        phone: editingAddress?.phone || '',
      }, {
        keepDefaultValues: true,
      });
      // Explicitly set values for country_code and phone
      setValue('country_code', editingAddress?.country_code?.toLowerCase() || 'in', {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue('phone', editingAddress?.phone || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [openDialog, editingAddress, reset]);

  // Handlers
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleEditClick = (address) => {
    setEditingAddress(address); // Store the address being edited
    handleClose(); // Close the popper
    setOpenDialog(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingAddress(null);
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

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
    handleClose(); // Close the popper
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setLoadingId('delete-address');
    // Add your delete logic here
    try {
      const result = await deleteCustomerAddress(addressToDelete.id);
      if (result.success) {
        setCustomer(result.customer);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setLoadingId(null);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.log(`Error Delete Customer Address Details ==>`, error);
      toast.error('Something went wrong');
    }
  };

  const handlePhoneChange = (key, phone) => {
    // Remove any non-digit characters before setting value
    setValue(key, phone, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleEditSubmit = async () => {
    // Validate form before submission
    const isValid = await trigger('address-dialog-form', { shouldFocus: true });
    console.log('Form validation:', {
      isValid,
      errors,
      values: getValues(),
    });
    if (!isValid) {
      console.log('Form validation failed', errors);
      return;
    }
    await editFormAction();
  };

  // formActions

  const [editState, editFormAction] = useActionState(
    async (prevState, formData) => {
      const newAddress = getValues();

      let address = {
        first_name: newAddress.first_name,
        last_name: newAddress.last_name,
        address_1: newAddress.address_1,
        address_2: newAddress?.address_2 || '',
        company: newAddress?.company || '',
        postal_code: newAddress.postal_code,
        city: newAddress.city,
        country_code: newAddress.country_code,
        province: newAddress.province,
        phone: newAddress.phone,
      }
      let result;
      if (mode === 'add') {
        result = await addCustomerAddress(prevState, address);
      } else {
        address['address_id'] = newAddress.address_id;
        result = await updateCustomerAddress(prevState, address);
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

  const handleCartUpdate = async (data, isNewAddress = false) => {
    try {
      // Set backdrop states and wait for render
      await new Promise(resolve => {
        setShowBackDrop(true);
        setShowBackDropMessage('Processing your order');
        setTimeout(resolve, 0);
      });

      const updatedCart = await updateCartWithEmailAndAddressAndPaymentSession(data);
      if (!updatedCart) {
        throw new Error('Failed to update cart');
      }

      setCart(updatedCart);
      const { isReady, missingSteps } = cartValidation.isReadyForCheckout(updatedCart);

      if (!isReady) {
        toast.error(`Please complete: ${missingSteps.join(', ')}`);
        return null;
      }

      // Handle saving new address if needed
      if (isNewAddress && saveAddress) {
        try {
          const result = await addCustomerAddress(customer, {
            ...getValues('shipping_address'),
            is_default_shipping: true,
            is_default_billing: true,
          });
          if (result.success) {
            setCustomer(result.customer);
          }
        } catch (error) {
          console.error('Error saving address:', error);
          toast.error('Failed to process order. Please try again.');
          return null;
        }
      }

      return updatedCart;
    } catch (error) {
      console.error('Cart update error:', error);
      toast.error('Failed to process order. Please try again.');
      return null;
    }
  };

  const handlePayNow = async () => {
    let data = {
      shipping_address: {},
      billing_address: {},
      email: '',
    };

    // 1. Validation Improvements
    let isShippingAddressValid = false;
    let isBillingAddressValid = false;
    const isBillingTypeSame = billingType === 'same';

    try {
      // 2. Better Address Handling
      if (selectedAddress) {
        // Using selected saved address
        const address = {
          first_name: selectedAddress.first_name,
          last_name: selectedAddress.last_name,
          address_1: selectedAddress.address_1,
          address_2: selectedAddress.address_2 || '',
          city: selectedAddress.city,
          province: selectedAddress.province,
          postal_code: selectedAddress.postal_code,
          country_code: selectedAddress.country_code,
          phone: selectedAddress.phone,
        }
        data.shipping_address = address;
        data.billing_address = address;
        data.email = customer?.email;
      } else {
        // 3. Improved Form Validation
        isShippingAddressValid = await trigger([
          'shipping_address.first_name',
          'shipping_address.last_name',
          'shipping_address.address_1',
          'shipping_address.city',
          'shipping_address.province',
          'shipping_address.postal_code',
          'shipping_address.country_code',
          'shipping_address.phone'
        ]);

        if (!isBillingTypeSame) {
          isBillingAddressValid = await trigger([
            'billing_address.first_name',
            'billing_address.last_name',
            'billing_address.address_1',
            'billing_address.city',
            'billing_address.province',
            'billing_address.postal_code',
            'billing_address.country_code',
            'billing_address.phone'
          ]);
        }

        // 4. Early Validation Check
        if (!isShippingAddressValid || (!isBillingTypeSame && !isBillingAddressValid)) {
          toast.error('Please fill in all required fields correctly');
          return;
        }

        // 5. Data Preparation
        data.email = customer?.email;
        data.shipping_address = getValues('shipping_address');
        data.billing_address = isBillingTypeSame ? getValues('shipping_address') : getValues('billing_address');

        // Handle optional province field
        if (!isProvinceRequired) {
          data.shipping_address.province = '';
          if (!isBillingTypeSame) {
            data.billing_address.province = '';
          }
        }
      }

      // 6. Cart Validation
      const cartValidationState = {
        hasEmail: cartValidation.hasEmail(cart),
        hasShippingAddress: cartValidation.hasShippingAddress(cart),
        hasPaymentSession: cartValidation.hasPaymentSession(cart),
        hasShippingMethod: cartValidation.hasShippingMethod(cart),
        checkoutReady: cartValidation.isReadyForCheckout(cart),
      };

      console.table({
        isShippingAddressValid,
        isBillingAddressValid,
        isBillingTypeSame,
        hasEmail: cartValidationState.hasEmail,
        hasShippingAddress: cartValidationState.hasShippingAddress,
        hasPaymentSession: cartValidationState.hasPaymentSession,
        hasShippingMethod: cartValidationState.hasShippingMethod,
        isReady: cartValidationState.checkoutReady.isReady,
        missingSteps: cartValidationState.checkoutReady.missingSteps.join(', '),
      });

      // 7. Improved Flow Control
      if (cartValidationState.checkoutReady.isReady) {
        setShowBackDrop(true);
        await initateOrder(cart);
      } else {
        const isAddressValid = isBillingTypeSame ? isShippingAddressValid : (isShippingAddressValid && isBillingAddressValid);
        const isFirstTimeCheckout = isAddressValid &&
          cartValidationState.hasShippingMethod &&
          !cartValidationState.hasPaymentSession &&
          !cartValidationState.hasEmail &&
          !cartValidationState.hasShippingAddress;

        if (selectedAddress && cartValidationState.hasShippingMethod && !cartValidationState.hasPaymentSession && !cartValidationState.hasEmail && !cartValidationState.hasShippingAddress) {
          // Handle saved address checkout
          const updatedCart = await handleCartUpdate(data);
          if (updatedCart) {
            await initateOrder(updatedCart);
          }
        } else if (isFirstTimeCheckout) {
          // Handle first time checkout
          const updatedCart = await handleCartUpdate(data, true);
          if (updatedCart) {
            await initateOrder(updatedCart);
          }
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('An error occurred while processing your payment. Please try again.');
    } finally {
      // Only clear backdrop if payment initiation failed
      // successful payments will be handled by the payment callback
      if (!showBackDrop) {
        setShowBackDrop(false);
        setShowBackDropMessage('');
      }
    }
  };

  // utils
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


  return (
    <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
      <Backdrop
        sx={(theme) => ({
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        })}
        open={showBackDrop}
        onClick={() => setShowBackDrop(false)}
      >
        <CircularProgress color="inherit" />
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
              onClick={() => {
                logout();
                router.push('/');
              }}
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
                disabled={loadingId}
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
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEditSubmit();
                }}
                noValidate
                method="post"
                action="javascript:void(0);"
              >
                <ErrorMessage error={editState?.error} sx={{ mb: 2 }} />
                <input type="hidden" {...register('address_id')} value={selectedAddress?.id} />
                <Controller
                  name="country_code"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={!!errors?.country_code}
                      sx={{ mb: 2 }}
                    >
                      <InputLabel>Country/Region</InputLabel>
                      <Select {...field}
                        label="Country/Region"
                        value={watch('country_code')}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {errors?.country_code?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

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
                  {isProvinceRequired && (
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="province"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.province}
                          >
                            <InputLabel>
                              {getShippingStateLabel(
                                watch('country_code')
                              )}
                            </InputLabel>
                            <Select
                              {...field}
                              label={getShippingStateLabel(
                                watch('country_code')
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
                            {errors.province && (
                              <FormHelperText>
                                {errors.province.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="postal_code"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={getShippingPostalLabel(watch('country_code'))}
                          error={!!errors.postal_code}
                          helperText={errors.postal_code?.message}
                          onChange={(e) => {
                            field.onChange(e);
                            trigger('postal_code');
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Phone
                      {...field}
                      country={watch('country_code')}
                      value={watch('phone')}
                      onChange={(e) => handlePhoneChange('phone', e?.target?.value || '')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      label="Phone number"
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={handleDialogClose} color="inherit">
                    Cancel
                  </Button>
                  <SubmitButton
                    variant="contained"
                    color="primary"
                    loading={loadingId}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditSubmit();
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
                  <Select {...field}
                    label="Country/Region"
                    value={watch('shipping_address.country_code')}
                  >
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
                <Controller
                  name="shipping_address.postal_code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={getShippingPostalLabel(watch('shipping_address.country_code'))}
                      error={!!errors.shipping_address?.postal_code}
                      helperText={errors.shipping_address?.postal_code?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('shipping_address.postal_code');
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="shipping_address.phone"
              control={control}
              render={({ field }) => (
                <Phone
                  {...field}
                  country={watch('shipping_address.country_code')}
                  value={watch('shipping_address.phone')}
                  onChange={(e) => handlePhoneChange('shipping_address.phone', e?.target?.value || '')}
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
          {loadingId === 'shipping-method' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Skeleton variant="text" width={100} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="text" width={100} height={40} />
            </Box>
          )}
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
          <Controller
            name="billing_address.country_code"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                error={!!errors.billing_address?.country_code}
                sx={{ mb: 2 }}
              >
                <InputLabel>Country/Region</InputLabel>
                <Select {...field}
                  label="Country/Region"
                  value={watch('billing_address.country_code')}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.billing_address?.country_code?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('billing_address.first_name')}
                fullWidth
                label="First name"
                error={!!errors.billing_address?.first_name}
                helperText={errors.billing_address?.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('billing_address.last_name')}
                fullWidth
                label="Last name"
                error={!!errors.billing_address?.last_name}
                helperText={errors.billing_address?.last_name?.message}
              />
            </Grid>
          </Grid>

          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label="Address"
              {...register('billing_address.address_1')}
              error={!!errors.billing_address?.address_1}
              helperText={errors.billing_address?.address_1?.message}
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
            {...register('billing_address.address_2')}
            error={!!errors.billing_address?.address_2}
            helperText={errors.billing_address?.address_2?.message}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                {...register('billing_address.city')}
                error={!!errors.billing_address?.city}
                helperText={errors.billing_address?.city?.message}
              />
            </Grid>
            {isProvinceRequired && (
              <Grid item xs={12} sm={4}>
                <Controller
                  name="billing_address.province"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={!!errors.billing_address?.province}
                    >
                      <InputLabel>
                        {getShippingStateLabel(
                          watch('billing_address.country_code')
                        )}
                      </InputLabel>
                      <Select
                        {...field}
                        label={getShippingStateLabel(
                          watch('billing_address.country_code')
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
                      {errors.billing_address?.province && (
                        <FormHelperText>
                          {errors.billing_address.province.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                {...register('billing_address.postal_code')}
                label="PIN code"
                error={!!errors.billing_address?.postal_code}
                helperText={errors.billing_address?.postal_code?.message}
              />
            </Grid>
          </Grid>

          <Controller
            name="billing_address.phone"
            control={control}
            render={({ field }) => (
              <Phone
                {...field}
                country={watch('billing_address.country_code')}
                value={watch('billing_address.phone')}
                onChange={(e) => handlePhoneChange('billing_address.phone', e?.target?.value || '')}
                error={!!errors.billing_address?.phone}
                helperText={errors.billing_address?.phone?.message}
                label="Phone number"
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
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
        disabled={loadingId}
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
