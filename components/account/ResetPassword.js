'use client';
import PropTypes from 'prop-types';
import { useActionState } from 'react';
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
import { EmailOutlined, RestartAlt } from '@mui/icons-material';
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
                Check Your Email
              </Typography>
              <Typography variant="body2">
                Password reset instructions have been sent
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
                Return to Sign In
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
              Reset Password
            </Typography>
            <Typography variant="body2">
              Enter your email to receive reset instructions
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              If an account exists with the specified email address, you'll receive instructions to reset your password shortly.
              Please check your inbox and spam folder.
            </Typography>

            <form action={formAction}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <SubmitButton
                variant="contained"
                fullWidth
                startIcon={<RestartAlt />}
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
                Send Reset Instructions
              </SubmitButton>

              <ErrorMessage sx={{ mt: 2 }} error={state?.message} />
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

ResetPassword.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default ResetPassword;
