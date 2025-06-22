'use client';
import PropTypes from 'prop-types';
import { useActionState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Zoom,
  Divider
} from '@mui/material';
import { VpnKeyOutlined, LockOutlined } from '@mui/icons-material';
import { updatePassword } from '../../pages/api/customer';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import SuccessMessage from '../SuccessMessage';
import { LOGIN_VIEWS } from '../../pages/account';

const UpdatePassword = ({ setCurrentView }) => {
  const searchParams = useSearchParams();

  const token = useMemo(() => {
    return searchParams?.get('token');
  }, [searchParams]);
  const email = useMemo(() => {
    const email = searchParams?.get('email');
    return decodeURIComponent(email);
  }, [searchParams]);

  const [state, formAction] = useActionState(async (prevState, formData) => {
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    if (password !== confirmPassword) {
      return {
        message: 'Passwords do not match',
        success: false,
      };
    }
    const result = await updatePassword(prevState, formData, token, email);
    if (result.success) {
      return {
        message: 'Password updated successfully',
        success: true,
      };
    } else {
      return {
        message: result.message,
        success: false,
      };
    }
  }, null);

  if (state?.success) {
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
                bgcolor: 'success.main',
                color: 'white',
                py: 2,
                px: 3,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Password Updated
              </Typography>
              <Typography variant="body2">
                Your password has been successfully changed
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {state.message}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}
                sx={{
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                Sign In with New Password
              </Button>
            </CardContent>
          </Card>
        </Zoom>
      </Container>
    );
  }

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
              bgcolor: 'warning.main',
              color: 'white',
              py: 2,
              px: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Create New Password
            </Typography>
            <Typography variant="body2">
              Please enter your new password
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form action={formAction}>
              <TextField
                label="New Password"
                name="password"
                type="password"
                fullWidth
                required
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Confirm Password"
                name="confirm_password"
                type="password"
                fullWidth
                required
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 3 }}
              />

              <SubmitButton
                variant="contained"
                fullWidth
                startIcon={<LockOutlined />}
                sx={{
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                Update Password
              </SubmitButton>

              {state?.success ? (
                <SuccessMessage sx={{ mt: 2 }} success={state?.message} />
              ) : (
                <ErrorMessage sx={{ mt: 2 }} error={state?.message} />
              )}
            </form>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_IN)}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                justifyContent: 'flex-start',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </Zoom>
    </Container>
  );
};

UpdatePassword.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default UpdatePassword;
