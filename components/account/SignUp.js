'use client';

import PropTypes from 'prop-types';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  useTheme,
  Zoom,
  Divider
} from '@mui/material';
import {
  PersonOutlined,
  EmailOutlined,
  VpnKeyOutlined,
  PersonAddOutlined,
  CheckCircleOutline
} from '@mui/icons-material';
import { useActionState } from 'react';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import SuccessMessage from '../SuccessMessage';
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
  const theme = useTheme();

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
      return { success: true, message: 'Account created successfully' };
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
      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <Card
          elevation={3}
          sx={{
            maxWidth: '600px',
            margin: 'auto',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              py: 2,
              px: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Create Account
            </Typography>
            <Typography variant="body2">
              Sign up for a personalized shopping experience
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleOutline sx={{ color: theme.palette.success.main, mr: 2, fontSize: 24 }} />
                <Typography variant="body2" color="text.secondary">
                  Join us to enjoy a seamless shopping experience with faster checkout and order tracking
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('first_name')}
                label="First Name"
                fullWidth
                margin="normal"
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                {...register('last_name')}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                {...register('email')}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }
                }}
                sx={{ mb: 2 }}
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
                    sx={{ mb: 2 }}
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyOutlined color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }
                }}
                sx={{ mb: 2 }}
              />

              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid}
                startIcon={<PersonAddOutlined />}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                Create Account
              </SubmitButton>

              {state?.success ? (
                <SuccessMessage sx={{ mt: 2 }} success={state?.message} />
              ) : (
                <ErrorMessage sx={{ mt: 2 }} error={state?.message} />
              )}
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                Already have an account? Sign in
              </Button>

              <Button
                onClick={() => setCurrentView(LOGIN_VIEWS.RESET_PASSWORD)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                Forgot your password?
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </Container>
  );
};

SignUp.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default SignUp;
