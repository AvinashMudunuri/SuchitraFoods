'use client';
import PropTypes from 'prop-types';
import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  useTheme,
  Zoom,
  Divider
} from '@mui/material';
import {
  EmailOutlined,
  VpnKeyOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useState, useActionState } from 'react';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { LOGIN_VIEWS } from '../../pages/account';
import { signIn } from '../../pages/api/customer';
import { useAuth } from '../../context/AuthContext';

const SignIn = ({ setCurrentView }) => {
  const { fetchCustomer } = useAuth();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await signIn(prevState, formData);
    if (!result.message) {
      await fetchCustomer();
    }
    return result;
  }, null);

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
              bgcolor: theme.palette.secondary.main,
              color: 'white',
              py: 2,
              px: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="primary.main">
              Sign in to access an enhanced shopping experience
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form action={formAction}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                required
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

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }
                }}
              />

              <SubmitButton
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<LockOutlined />}
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
                Sign In
              </SubmitButton>

              <ErrorMessage sx={{ mt: 2 }} error={state?.message} />
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                onClick={() => setCurrentView(LOGIN_VIEWS.SIGN_UP)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                Don't have an account? Sign up
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

SignIn.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
};

export default SignIn;
