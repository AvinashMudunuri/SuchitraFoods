import React, { useState } from 'react';
import {
  Box,
  Grid2 as Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { updateCustomerProfile } from '../../pages/api/customer';
import { Phone } from '../Phone';

const PersonalDetails = ({ customer, setCustomer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    firstName: customer?.first_name || '',
    lastName: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const transformedData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      };
      const updatedProfileDetails = await updateCustomerProfile(transformedData);
      setCustomer(updatedProfileDetails);
      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Passwords do not match',
        severity: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      // API call to change password
      // await changePassword(passwordData);
      setNotification({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to change password',
        severity: 'error',
      });
    }
    setLoading(false);
  };

  const getInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`;
  };

  return (
    <Fade in={true}>
      <Box sx={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 4,
            gap: isMobile ? 2 : 0
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '40px',
                height: '3px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '2px'
              }
            }}
          >
            Personal Information
          </Typography>
          {!isEditing && (
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                px: 3,
                py: 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Zoom in={true}>
          <Card
            elevation={3}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              mb: 4,
              transition: 'all 0.3s ease',
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56
                  }}
                >
                  {getInitials()}
                </Avatar>
              }
              title={
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                  {`${formData.firstName} ${formData.lastName}`}
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  {formData.email}
                </Typography>
              }
              action={
                !isEditing ? (
                  <Tooltip title="Change Password">
                    <IconButton
                      onClick={() => setShowPasswordDialog(true)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light + '20',
                        }
                      }}
                    >
                      <LockIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
              }
            />
            <Divider />
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                        sx: {
                          borderRadius: '8px',
                          bgcolor: !isEditing ? theme.palette.grey[50] : 'transparent'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                        sx: {
                          borderRadius: '8px',
                          bgcolor: !isEditing ? theme.palette.grey[50] : 'transparent'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                        sx: {
                          borderRadius: '8px',
                          bgcolor: theme.palette.grey[50]
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px',
                        bgcolor: !isEditing ? theme.palette.grey[50] : 'transparent'
                      }
                    }}>
                      <Phone
                        countryCallingCodeEditable={false}
                        defaultCountry="IN"
                        value={formData.phone}
                        onChange={(value) => setFormData({ ...formData, phone: value })}
                        disabled={!isEditing}
                        style={{ width: '100%' }}
                      />
                    </Box>
                  </Grid>

                  {isEditing && (
                    <Grid item xs={12}>
                      <Stack direction={isMobile ? "column" : "row"} spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              firstName: customer?.first_name || '',
                              lastName: customer?.last_name || '',
                              email: customer?.email || '',
                              phone: customer?.phone || '',
                            });
                          }}
                          sx={{
                            borderRadius: '8px',
                            width: isMobile ? '100%' : 'auto'
                          }}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          loading={loading}
                          variant="contained"
                          type="submit"
                          startIcon={<SaveIcon />}
                          sx={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                              transition: 'all 0.3s ease'
                            },
                            width: isMobile ? '100%' : 'auto'
                          }}
                        >
                          Save Changes
                        </LoadingButton>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {/* Password Change Dialog */}
        <Dialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Change Password
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ pt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                    sx: { borderRadius: '8px' }
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                    sx: { borderRadius: '8px' }
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                    sx: { borderRadius: '8px' }
                  }}
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              onClick={() => setShowPasswordDialog(false)}
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handlePasswordSubmit}
              variant="contained"
              sx={{
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              Change Password
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: '8px' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

PersonalDetails.propTypes = {
  customer: PropTypes.object.isRequired,
  setCustomer: PropTypes.func.isRequired,
};

export default PersonalDetails;
