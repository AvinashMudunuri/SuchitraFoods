import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { updateCustomerAddress } from '../pages/api/customer';

// Validation Schema
const addressSchema = yup.object().shape({
  address_1: yup.string().required('Address Line 1 is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postal_code: yup
    .string()
    .matches(/^[0-9]{6}$/, 'Postal code must be 6 digits')
    .required('Postal code is required'),
});

const ManageAddress = () => {
  const { customer } = useAuth();
  const [addresses, setAddresses] = useState(customer?.addresses || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postal_code: '',
    },
  });

  // Open the Add/Edit dialog
  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      reset(addresses[index]);
    } else {
      reset();
    }
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setEditingIndex(null);
    setOpenDialog(false);
  };

  // Save address (Add or Edit)
  const onSubmit = async (data) => {
    if (editingIndex !== null) {
      // Edit address
      const updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = data;
      setAddresses(updatedAddresses);
    } else {
      console.log('data', data);
      // Add new address
      setAddresses([...addresses, data]);
      const token = sessionStorage.getItem('token');
      const updatedCutomer = {
        ...customer,
        ...data,
      };
      console.log('updatedCutomer', updatedCutomer);
      const updateCustAddress = await updateCustomerAddress(
        token,
        updatedCutomer
      );
      console.log('updateCustAddress', updateCustAddress);
    }
    handleCloseDialog();
  };

  // Delete address
  const handleDelete = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manage Address
      </Typography>

      <List>
        {addresses.map((address, index) => (
          <ListItem
            key={index}
            divider
            secondaryAction={
              <>
                <IconButton
                  onClick={() => handleOpenDialog(index)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(index)} color="error">
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`${address.address_1}, ${address.address_2}, ${address.city}, ${address.postal_code}`}
            />
          </ListItem>
        ))}
        {addresses.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No addresses available. Add your first address!
          </Typography>
        )}
      </List>

      <Box mt={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Address
        </Button>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingIndex !== null ? 'Edit Address' : 'Add Address'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="address_1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address Line 1"
                      fullWidth
                      error={!!errors.address_1}
                      helperText={errors.address_1?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address_2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address Line 2"
                      fullWidth
                      error={!!errors.address_2}
                      helperText={errors.address_2?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State"
                      fullWidth
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="postal_code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Zip Code"
                      fullWidth
                      error={!!errors.postal_code}
                      helperText={errors.zipcode?.postal_code}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAddress;
