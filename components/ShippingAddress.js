import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid2 as Grid,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
} from '@mui/material';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext'; // Auth context for logged-in user
import { useCart } from '../context/CartContext';
import { updateCustomerDetailsToCart } from '../pages/api/cart';

const ShippingAddress = ({ onNext, OnBack }) => {
  const { dispatch } = useCheckout();
  const { setCart } = useCart();
  const { customer, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addingNewAddress, setAddingNewAddress] = useState(false);

  // Validation Schema for New Address
  const schema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    address_1: Yup.string().required('Address Line1 is required'),
    address_2: Yup.string(),
    address_name: Yup.string(),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
  });

  // Form setup for New Address
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address_name: '',
      address_1: '',
      address_2: '',
      city: '',
      postalCode: '',
    },
  });

  // Handle Address Selection
  const handleAddressSelection = (event) => {
    setSelectedAddressId(event.target.value);
    setAddingNewAddress(false);
  };

  const handleAddNewAddress = () => {
    setAddingNewAddress(true);
    setSelectedAddressId(null);
  };

  const onSubmit = (data) => {
    if (addingNewAddress) {
      // Save the new address to context and backend if authenticated
      dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: data });
      if (isAuthenticated) {
        saveAddressToBackend(data);
      }
    } else {
      // Use the selected address
      const selectedAddress = customer?.addresses?.find(
        (addr) => addr.id === selectedAddressId
      );
      dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: selectedAddress });
      try {
        const cartId = localStorage.getItem('cart_id');
        if (!cartId) {
          console.error('Cart ID not found in localStorage');
          return;
        }
        const addressObj = {
          first_name: selectedAddress.first_name,
          last_name: selectedAddress.last_name,
          address_1: selectedAddress.address_1,
          address_2: selectedAddress.address_2,
          city: selectedAddress.city,
          postal_code: selectedAddress.postalCode,
        };
        const response = updateCustomerDetailsToCart(cartId, {
          shipping_address: addressObj,
          billing_address: addressObj,
        });
        console.log('Cart updated successfully:', response);
        setCart(response);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
    onNext();
  };

  const saveAddressToBackend = async (address) => {
    try {
      await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
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
        Shipping Address
      </Typography>
      {isAuthenticated && customer?.addresses?.length > 0 && (
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 3 }}>
            Choose an Address
          </FormLabel>
          <RadioGroup
            value={selectedAddressId}
            onChange={handleAddressSelection}
          >
            {customer.addresses.map((address) => (
              <Paper key={address.id} sx={{ p: 2, mb: 1 }}>
                <FormControlLabel
                  value={address.id}
                  control={<Radio />}
                  label={
                    <>
                      <strong>{address.address_name}</strong> -{' '}
                      {address.first_name} {address.last_name},{' '}
                      {address.address_1}, {address.address_2} , {address.city},{' '}
                      {address.postalCode}, {'INDIA'}
                    </>
                  }
                />
              </Paper>
            ))}
          </RadioGroup>
          <Button variant="text" onClick={handleAddNewAddress}>
            Add New Address
          </Button>
          <Box sx={{ textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              Next
            </Button>
          </Box>
        </FormControl>
      )}
      {(addingNewAddress ||
        !isAuthenticated ||
        customer?.addresses?.length === 0) && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {isAuthenticated
              ? 'Enter a new address'
              : 'Enter your shipping address'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Address Name"
                fullWidth
                {...register('address_name')}
                error={!!errors.address_name}
                helperText={errors.address_name?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                fullWidth
                {...register('first_name')}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Last Name"
                fullWidth
                {...register('last_name')}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line1"
                fullWidth
                {...register('address_1')}
                error={!!errors.address_1}
                helperText={errors.address_1?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line2"
                fullWidth
                {...register('address_2')}
                error={!!errors.address_2}
                helperText={errors.address_2?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                fullWidth
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Code"
                fullWidth
                {...register('postalCode')}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                fullWidth
                {...register('country')}
                error={!!errors.country}
                helperText={errors.country?.message}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button onClick={OnBack} variant="contained" color="primary">
              Back
            </Button>
          </Box>
          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default ShippingAddress;
