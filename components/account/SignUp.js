'use client';

import PropTypes from 'prop-types';
import { TextField, Typography, Container, Box, Button } from '@mui/material';
import { useActionState } from 'react';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { LOGIN_VIEWS } from '../../pages/account';
import { signUp } from '../../pages/api/customer';
import { useAuth } from '../../context/AuthContext';

const SignUp = ({ setCurrentView }) => {
  const { fetchCustomer } = useAuth();
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await signUp(prevState, formData);
    if (!result.message) {
      // If sign up was successful (no error message)
      await fetchCustomer();
    }
    return result;
  }, null);

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
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sign up for a personalized shopping experience.
        </Typography>
        <form action={formAction}>
          <TextField
            label="First Name"
            name="first_name"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="last_name"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <SubmitButton fullWidth sx={{ mt: 2 }} variant="contained">
            Create Account
          </SubmitButton>
          <ErrorMessage message={state?.message} />
        </form>
        <Box>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}>
            Already have an account? Sign in
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
