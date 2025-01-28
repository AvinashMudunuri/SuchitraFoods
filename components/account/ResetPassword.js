'use client';
import PropTypes from 'prop-types';
import { useActionState } from 'react';
import { TextField, Typography, Container, Box, Button } from '@mui/material';
import { resetPassword } from '../../pages/api/customer';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { LOGIN_VIEWS } from '../../pages/account';
const ResetPassword = ({ setCurrentView }) => {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await resetPassword(prevState, formData);
    return result;
  }, null);

  if (state?.success) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Reset Password</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {state.message}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}>
            Back to Sign In
          </Button>
        </Box>
      </Container>
    );
  }
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4">Reset Password</Typography>
      <Typography variant="body1">
        Enter your email below, and we will send you instructions on how to
        reset your password.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <form action={formAction}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <SubmitButton variant="contained">
            Send Reset Instructions
          </SubmitButton>
          <ErrorMessage error={state?.message} />
        </form>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}>
            Back to Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

ResetPassword.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default ResetPassword;
