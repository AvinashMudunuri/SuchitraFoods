'use client';
import PropTypes from 'prop-types';
import { useActionState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField, Typography, Container, Box, Button } from '@mui/material';
import { updatePassword } from '../../pages/api/customer';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { LOGIN_VIEWS } from '../../pages/account';

const UpdatePassword = ({ setCurrentView }) => {
  const searchParams = useSearchParams();

  const token = useMemo(() => {
    return searchParams?.get('token');
  }, [searchParams]);
  const email = useMemo(() => {
    return searchParams?.get('email');
  }, [searchParams]);

  const [state, formAction] = useActionState(async (prevState, formData) => {
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    if (password !== confirmPassword) {
      return {
        message: 'Passwords do not match',
      };
    }
    const result = await updatePassword(prevState, formData, token, email);
    return result;
  }, null);

  if (state?.success) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Update Password</Typography>
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
      <Typography variant="h4">Update Password</Typography>
      <form action={formAction}>
        <TextField
          label="New Password"
          name="password"
          type="password"
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Confirm Password"
          name="confirm_password"
          type="password"
          fullWidth
          required
          sx={{ mt: 2, mb: 2 }}
        />
        <SubmitButton variant="contained">Update Password</SubmitButton>
        <ErrorMessage message={state?.message} />
      </form>
      <Box sx={{ mt: 2 }}>
        <Button onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}>
          Back to Sign In
        </Button>
      </Box>
    </Container>
  );
};

UpdatePassword.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default UpdatePassword;
