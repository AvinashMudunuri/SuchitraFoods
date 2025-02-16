'use client';

import PropTypes from 'prop-types';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Typography, Container, Box, Button } from '@mui/material';
import { useActionState } from 'react';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { Phone } from '../Phone';
import { signUp } from '../../pages/api/customer';
import { useAuth } from '../../context/AuthContext';
import { LOGIN_VIEWS } from '../../pages/account';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
// Define validation schema
const signUpSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid();
    }, 'Invalid phone number for the selected country'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*]/,
      'Password must contain at least one special character'
    ),
});

const SignUp = ({ setCurrentView }) => {
  const { fetchCustomer } = useAuth();

  const [state, formAction] = useActionState(async (prevState, formData) => {
    try {
      const result = await signUp(formData);

      if (result.message) {
        return {
          error: result.message,
        };
      }

      // If sign up was successful (no error message)
      await fetchCustomer();
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        error: 'Failed to create account. Please try again.',
      };
    }
  }, null);

  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data, event) => {
    event.preventDefault();
    await formAction(data);
  };

  const handlePhoneChange = (phone) => {
    setValue('phone', phone, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          maxWidth: '600px',
          margin: 'auto',
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'white',
          position: 'relative',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        <Typography variant="body1" gutterBottom>
          Sign up for a personalized shopping experience.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('first_name')}
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />

          <TextField
            {...register('last_name')}
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />

          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Phone
                value={watch('phone')}
                onChange={handlePhoneChange}
                error={!!errors.phone}
                helperText={errors?.phone?.message}
                label="Phone number"
                country="in"
                fullWidth
                margin="normal"
              />
            )}
          />

          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isValid}
            sx={{ mt: 3, mb: 1 }}
          >
            Create Account
          </SubmitButton>
          <ErrorMessage sx={{ mt: 2 }} error={state?.error} />
        </form>

        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}>
            Already have an account? Sign in
          </Button>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.RESET_PASSWORD)}>
            Reset password?
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

SignUp.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default SignUp;
