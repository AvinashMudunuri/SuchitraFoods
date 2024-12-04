import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid2 as Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateCustomerProfile } from '../pages/api/customer';

// Validation Schema
const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone must be numeric')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .required('Phone is required'),
});

const PersonalDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  });

  // Fetch customer data from localStorage
  useEffect(() => {
    const storedCustomer = JSON.parse(sessionStorage.getItem('customer'));
    if (storedCustomer) {
      setCustomer(storedCustomer);
      // Populate form fields with stored data
      Object.keys(storedCustomer).forEach((key) => {
        setValue(key, storedCustomer[key]);
      });
    }
  }, [setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log(`data`, data);
    const token = sessionStorage.getItem('token');
    const updatedProfileDetails = await updateCustomerProfile(token, data);

    // Update customer data in localStorage
    sessionStorage.setItem(
      'customer',
      JSON.stringify(updatedProfileDetails.customer)
    );
    setCustomer(updatedProfileDetails.customer);
    setIsEditing(false);

    // Optionally, send data to backend API
    console.log('Updated Customer Data:', updatedProfileDetails.customer);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Personal Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  disabled={!isEditing}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  disabled={!isEditing}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  disabled
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  disabled={!isEditing}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box mt={2}>
          {!isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" color="success">
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default PersonalDetails;
