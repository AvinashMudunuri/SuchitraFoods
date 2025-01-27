import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  useMediaQuery,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  loginCustomer,
  registerCustomer,
  updateCustomerDetails,
} from '../pages/api/customer';

// Validation Schemas
const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  phone: yup.string().required('Phone number is required'),
  otp: yup.string().when('isOtpSent', {
    is: true,
    then: yup.string().required('OTP is required'),
  }),
});

const signUpSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function AuthModal({ open, onClose, fetchCustomer }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const schema = isSignUp ? signUpSchema : signInSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      otp: '',
      isOtpSent: false,
    },
  });

  const onSubmit = async (data) => {
    if (isSignUp) {
      console.log('Sign Up Data:', data); // Replace with Medusa API call
      const { email, first_name, last_name, password } = data;
      try {
        const tokenResponse = await registerCustomer(email, password);
        console.log('Registration token:', tokenResponse);
        // Update the customer details using the token
        const customer = await updateCustomerDetails(
          tokenResponse,
          email,
          first_name,
          last_name
        );
        console.log('Customer details updated:', customer);
        // Handle successful registration and update
        // For example, you can store the token in localStorage or cookies
        const customerToken = await loginCustomer(email, password);
        sessionStorage.setItem('token', customerToken);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    } else {
      console.log('Sign In Data:', data); // Replace with Medusa API call
      const { email, password } = data;
      try {
        const response = await loginCustomer(email, password);
        // Store token in localStorage or cookies
        sessionStorage.setItem('token', response);
        fetchCustomer();
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
    onClose();
    reset();
  };

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
    reset(); // Reset form fields when switching modes
  };

  useEffect(() => {
    console.log(`Mounted`, open);
  }, []);

  let buttonText;
  if (isSignUp) {
    buttonText = isOtpSent ? 'Verify OTP' : 'Sign Up';
  } else {
    buttonText = 'Sign In';
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile}>
      <DialogTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {isSignUp && (
            <>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      readOnly: isOtpSent,
                    }}
                  />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      readOnly: isOtpSent,
                    }}
                  />
                )}
              />
            </>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  readOnly: isOtpSent,
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  readOnly: isOtpSent,
                }}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ''}
                InputProps={{
                  readOnly: isOtpSent,
                }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleToggle}>
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </Button>

        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
