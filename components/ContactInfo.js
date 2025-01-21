import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
  CircularProgress,
} from '@mui/material';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import { updateCustomerDetailsToCart } from '../pages/api/cart';

const ContactInfo = ({ handleUpdateCheckoutData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { dispatch } = useCheckout();
  const {
    customer,
    isAuthenticated,
    loading: authLoading,
    fetchCustomer,
  } = useAuth(); // From AuthContext

  const { setCart, dispatch: cartDispatch } = useCart();
  const schema = Yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile: yup.string().required('Mobile number is required'),
  });

  const {
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    // Prepopulate data if the user is authenticated
    if (isAuthenticated && customer?.email) {
      setValue('email', customer.email);
    }
    if (isAuthenticated && customer?.phone) {
      setValue('mobile', customer.phone);
    }
  }, [isAuthenticated, customer, setValue, cart]);

  const onSubmit = async (data) => {
    dispatch({ type: 'SET_EMAIL', payload: data.email });
    try {
      const cartId = localStorage.getItem('cart_id');
      if (!cartId) {
        console.error('Cart ID not found in localStorage');
        return;
      }
      const updatedCart = await updateCustomerDetailsToCart(cartId, {
        email: data.email,
      });
      setCart(updatedCart);
      handleUpdateCheckoutData('email', data.email);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => setModalOpen(false);

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
        <Typography variant="h6" color="error">
          You must be logged in to proceed.
        </Typography>
        <Button
          onClick={handleModalOpen}
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2 }}
        >
          Login
        </Button>
        {/* Auth Modal */}
        <AuthModal
          open={modalOpen}
          onClose={handleModalClose}
          fetchCustomer={fetchCustomer}
        />
      </Box>
    );
  }

  return (
    <>
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
    </>
  );
};

export default ContactInfo;
