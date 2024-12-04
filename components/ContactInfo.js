import { useForm } from 'react-hook-form';
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

const ContactInfo = ({ onNext }) => {
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
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

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
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
    onNext();
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
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        mt: 4,
        mb: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'white',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Contact Information
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Enter your email to continue.
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              readOnly={isAuthenticated}
              label="Email Address"
              fullWidth
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ContactInfo;
