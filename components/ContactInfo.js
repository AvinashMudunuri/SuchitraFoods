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
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const watchEmail = watch('email');

  useEffect(() => {
    // Prepopulate data if the user is authenticated
    if (isAuthenticated && customer?.email) {
      setValue('email', customer.email);
    }
  }, [isAuthenticated, customer, setValue]);

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

  // Auto-submit when email is valid
  useEffect(() => {
    if (isValid && watchEmail) {
      handleSubmit(onSubmit)();
    }
  }, [isValid, watchEmail, handleSubmit, onSubmit]);

  const handleBlur = () => {
    //if (!!errors.email) {
    handleSubmit(onSubmit);
    //}
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => setModalOpen(false);

  // if (authLoading) {
  //   return (
  //     <Box sx={{ textAlign: 'center', mt: 4 }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%' }}
    >
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Email Address"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
            autoComplete="email"
          />
        )}
      />

      {(!watchEmail || !isValid) && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          Continue
        </Button>
      )}
    </Box>
  );
};

export default ContactInfo;
