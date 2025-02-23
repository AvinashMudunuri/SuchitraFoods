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
} from '@mui/material';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { updateCustomerProfile } from '../../pages/api/customer';
import { Phone } from '../Phone';

const PersonalDetails = ({ customer, setCustomer }) => {
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


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
      p: { xs: 2, sm: 3 }
    }}>
      <Grid container direction="column" spacing={3}>
        <Grid>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled
          />
        </Grid>

        <Grid>
          <Box sx={{
            '& .MuiInputBase-root': {
              height: '56px',  // Match TextField height
              '& input': { height: '100%' }
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

        <Grid xs={12} sx={{ mt: 2 }}>
          {!isEditing ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowPasswordDialog(true)}
              >
                Change Password
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
              >
                Save Changes
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: customer?.first_name || '',
                    lastName: customer?.last_name || '',
                    email: customer?.email || '',
                    phone: customer?.phone || '',
                  });
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ pt: 2 }}>
            <Grid container direction="column" spacing={2}>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <LoadingButton loading={loading} onClick={handlePasswordSubmit} variant="contained">
            Change Password
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

PersonalDetails.propTypes = {
  customer: PropTypes.object.isRequired,
  setCustomer: PropTypes.func.isRequired,
};

export default PersonalDetails;
