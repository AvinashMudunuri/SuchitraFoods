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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import states from '../../lib/in_states.json';
import {
  convertToLocale,
  countries,
  getShippingMethodLabel,
  getCountry,
} from '../../utils';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useActionState } from 'react';
import { Phone } from '../Phone';
import ErrorMessage from '../ErrorMessage';
import SubmitButton from '../SubmitButton';
import { toast } from 'react-toastify';
import { useRazorpay } from 'react-razorpay';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  updateCustomerAddress,
  addCustomerAddress,
  deleteCustomerAddress,
} from '../../pages/api/customer';

import { placeOrder, partialSaveCart } from '../../pages/api/cart';
import { prepareOrder } from '../../pages/api/payment';

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
  // set state to customer's state
  const [stateName, setStateName] = useState(
    customer?.addresses?.[0]?.province || 'Telangana'
  );

  const [selectedAddress, setSelectedAddress] = useState(
    customer?.addresses?.find((addr) => addr.is_default_shipping) || ''
  );

  const [shippingMethod, setShippingMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [showBackDropMessage, setShowBackDropMessage] = useState('');

  const [formData, setFormData] = useState({
    'shipping_address.first_name': cart?.shipping_address?.first_name || '',
    'shipping_address.last_name': cart?.shipping_address?.last_name || '',
    'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
    'shipping_address.address_2': cart?.shipping_address?.address_2 || '',
    'shipping_address.company': cart?.shipping_address?.company || '',
    'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
    'shipping_address.city': cart?.shipping_address?.city || '',
    'shipping_address.country_code': cart?.shipping_address?.country_code || '',
    'shipping_address.province': cart?.shipping_address?.province || '',
    'shipping_address.phone': cart?.shipping_address?.phone || '',
    email: cart?.email || '',
  });

  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
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
      province: '',
      postal_code: '',
      phone: '',
    },
  });

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

  const setFormAddress = (address, email, phone) => {
    address &&
      setFormData((prevState) => ({
        ...prevState,
        'shipping_address.first_name': address?.first_name || '',
        'shipping_address.last_name': address?.last_name || '',
        'shipping_address.address_1': address?.address_1 || '',
        'shipping_address.address_2': address?.address_2 || '',
        'shipping_address.company': address?.company || '',
        'shipping_address.postal_code': address?.postal_code || '',
        'shipping_address.city': address?.city || '',
        'shipping_address.country_code': address?.country_code || '',
        'shipping_address.province': address?.province || '',
        'shipping_address.phone': address?.phone || '',
      }));

    email &&
      setFormData((prevState) => ({
        ...prevState,
        email: email,
      }));

    phone &&
      setFormData((prevState) => ({
        ...prevState,
        'shipping_address.phone': phone,
      }));
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

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart?.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email);
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email, undefined);
    }
    if (cart && !cart?.shipping_address?.phone && customer?.phone) {
      setFormAddress(undefined, undefined, customer.phone);
    }
  }, [cart]); // Add cart as a dependency

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      'shipping_address.country_code': country.code,
    }));
  }, [country]);

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
        paymentMethod
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

  useEffect(() => {
    if (selectedAddress && shippingMethods && paymentMethods) {
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
  }, [selectedAddress, shippingMethods, paymentMethods]);

  useEffect(() => {
    if (shippingMethods) {
      const countryCode = country?.code || country;
      const countryObj = getCountry(countryCode);
      const shippingOptions = shippingMethods?.find(
        (so) => so.name === `SO-${countryObj.code.toUpperCase()}`
      );
      setShippingMethod(shippingOptions);
      setFormData((prevState) => ({
        ...prevState,
        'shipping_address.province': stateName,
      }));
    }
    if (paymentMethods) {
      setPaymentMethod(paymentMethods[0]);
    }
  }, [country, stateName, formData['shipping_address.postal_code']]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setShowBackDrop(true);
    setShowBackDropMessage('Please wait while we are processing your order');
    console.log(cart);
    console.log(selectedAddress);
    console.log(shippingMethod);
    console.log(paymentMethod);
    console.log(billingType);
    console.log(formData);
    try {
      const result = await prepareOrder(
        cart,
        customer,
        selectedAddress,
        shippingMethod,
        paymentMethod,
        billingType,
        formData
      );
      if (result.success) {
        setShowBackDropMessage('Starting Payment');
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
    // setSubmitting(true);
    const orderResponse = await placeOrder(cart.id);
    if (orderResponse.type === 'cart' && orderResponse?.cart) {
      console.log('Order Failed');
      //setSubmitting(false);
      toast.error('Order failed. Please try again.');
    } else if (orderResponse.type === 'order' && orderResponse?.order) {
      console.log('Order Placed', orderResponse?.order);
      //setSubmitting(false);
      toast.success('Order placed successfully!');
      refreshCart();
      router.push({
        pathname: '/order-success',
        query: {
          order_id: orderResponse?.order?.id,
        },
      });
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

  const onActionSubmit = async (data) => {
    console.log(`onActionSubmit`, data);
    await editFormAction(data);
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

  console.log(`shippingMethod`, shippingMethods);
  console.log(`paymentMethod`, paymentMethods);
  console.log(`customer`, customer);
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
            <ChevronRightIcon
              sx={{
                ml: 1,
                transform: `rotate(${isAccountExpanded ? '270deg' : '90deg'})`,
                transition: 'transform 0.3s ease',
                color: 'primary.main',
              }}
            />
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
            <ChevronRightIcon
              sx={{
                ml: 1,
                transform: `rotate(${isShipToExpanded ? '270deg' : '90deg'})`,
                transition: 'transform 0.3s ease',
                color: 'primary.main',
              }}
            />
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
              {selectedAddress?.address_1}, {<br />}
              {selectedAddress?.address_2}, {<br />}
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
                  {selectedAddress?.address_2}, {<br />}
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
              <form onSubmit={handleSubmit(onActionSubmit)}>
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
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        {...register('province')}
                        name="province"
                        value={watch('province')}
                        label="State"
                      >
                        {states.records.map((state) => (
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
                  >
                    Save Changes
                  </SubmitButton>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      )}
      {isAuthenticated && <Divider sx={{ my: 3 }} />}
      {!isAuthenticated ||
        (customer?.addresses?.length === 0 && (
          <>
            {/* Delivery Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Delivery
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Country/Region</InputLabel>
              <Select
                name="shipping_address.country_code"
                value={country?.value}
                onChange={(e) => setCountry(getCountry(e.target.value))}
                label="Country/Region"
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="shipping_address.first_name"
                  label="First name"
                  value={
                    customer?.first_name ||
                    formData['shipping_address.first_name']
                  }
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="shipping_address.last_name"
                  label="Last name"
                  value={
                    customer?.last_name ||
                    formData['shipping_address.last_name']
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Address"
                name="shipping_address.address_1"
                value={formData['shipping_address.address_1']}
                onChange={handleChange}
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
              name="shipping_address.address_2"
              value={formData['shipping_address.address_2']}
              onChange={handleChange}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="shipping_address.city"
                  value={formData['shipping_address.city']}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="shipping_address.province"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  >
                    {states.records.map((state) => (
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
                  name="shipping_address.postal_code"
                  label="PIN code"
                  value={formData['shipping_address.postal_code']}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Phone
              value={formData['shipping_address.phone']}
              onChange={(phone) =>
                setFormData((prevState) => ({
                  ...prevState,
                  'shipping_address.phone': phone,
                }))
              }
              label="Phone number"
              sx={{ mb: 2 }}
              name="shipping_address.phone"
              placeholder="Phone number"
              color="primary"
              variant="outlined"
              fullWidth
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Save this information for next time"
              sx={{ mt: 1 }}
            />
          </>
        ))}

      {/* Shipping Method */}

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
            color: 'primary.main',
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
          {getShippingMethodLabel(shippingMethod?.name)}:{' '}
          {convertToLocale({
            amount: shippingMethod?.amount,
            currency_code: cart?.currency_code,
          })}
        </Typography>
      </Box>
      {/* <Paper
        variant="outlined"
        sx={{
          mb: 1,
          p: 2,
          bgcolor: 'primary.50',
          borderColor: 'primary.main',
        }}
      >
        {!shippingMethod ? (
          <Typography>Select a shipping method</Typography>
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
      </Paper> */}
      {isAuthenticated && <Divider sx={{ my: 3 }} />}
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
                  {states.records.map((state) => (
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
      <Button
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          mt: 2,
          mb: 4,
          py: 1.5,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          display: { xs: 'none', md: 'block' },
        }}
      >
        Pay now
      </Button>
      <ErrorMessage error={error} />
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
