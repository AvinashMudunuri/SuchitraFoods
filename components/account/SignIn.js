'use client';
import PropTypes from 'prop-types';
import { TextField, Typography, Container, Box, Button } from '@mui/material';
import { useActionState } from 'react';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { LOGIN_VIEWS } from '../../pages/account';
import { signIn } from '../../pages/api/customer';
import { useAuth } from '../../context/AuthContext';

const SignIn = ({ setCurrentView }) => {
  const { fetchCustomer } = useAuth();
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await signIn(prevState, formData);
    if (!result.message) {
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
          Welcome Back!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sign in to access an enhanced shopping experience.
        </Typography>
        <form action={formAction}>
          <TextField
            label="Email"
            name="email"
            type="email"
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
          <SubmitButton variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign In
          </SubmitButton>
          <ErrorMessage sx={{ mt: 2 }} error={state?.message} />
        </form>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_UP)}>
            Don't have an account? Sign up
          </Button>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.RESET_PASSWORD)}>
            Reset password?
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

SignIn.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default SignIn;
