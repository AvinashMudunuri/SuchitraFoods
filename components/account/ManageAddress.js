import React, { useState, useMemo } from 'react';
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
  MenuItem,
  Checkbox,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addCustomerAddress } from '../../pages/api/customer';

// Validation Schema
const addressSchema = yup.object().shape({
  address_name: yup.string().required('Address name is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  company: yup.string(),
  address_1: yup.string().required('Address Line 1 is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  province: yup.string().required('Province is required'),
  postal_code: yup
    .string()
    .matches(/^[0-9]{6}$/, 'Postal code must be 6 digits')
    .required('Postal code is required'),
  country_code: yup.string().required('Country is required'),
  phone: yup.string().required('Phone number is required'),
  is_default_shipping: yup.boolean(),
  is_default_billing: yup.boolean(),
});

const countrySchema = yup.object().shape({
  country_code: yup.string().required('Country is required'),
});

const ManageAddress = () => {
  const { customer } = useAuth();
  const { cart } = useCart();
  const [addresses, setAddresses] = useState(customer?.addresses || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  console.log('Component rendered');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      address_name: '',
      first_name: '',
      last_name: '',
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      province: '',
      postal_code: '',
      country_code: '',
      phone: '',
      is_default_shipping: false,
      is_default_billing: false,
    },
  });
  console.log('Form control initialized:', { control, errors }); // Add this

  const countriesInRegion = useMemo(() => {
    if (!cart?.region) return [];
    return cart?.region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [cart?.region]);

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
    console.log('Form submitted with data:', data);
    if (editingIndex !== null) {
      // Edit address
      const updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = data;
      setAddresses(updatedAddresses);
    } else {
      console.log('data', data);
      // Add new address
      setAddresses([...addresses, data]);
      const updatedCutomer = {
        ...customer,
        ...data,
      };
      console.log('updatedCutomer', updatedCutomer);
      const updateCustAddress = await addCustomerAddress(updatedCutomer);
      console.log('updateCustAddress', updateCustAddress);
      setCustomer(updateCustAddress);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="address_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address Name"
                      fullWidth
                      error={!!errors.address_name}
                      helperText={errors.address_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                    />
                  )}
                />
              </Grid>
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
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State/Province"
                      fullWidth
                      error={!!errors.province}
                      helperText={errors.province?.message}
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
              <Grid item xs={12}>
                <Controller
                  name="country_code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Country"
                      {...field}
                      fullWidth
                      required
                    >
                      {countriesInRegion.map((country) => (
                        <MenuItem key={country.value} value={country.value}>
                          {country.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="is_default_shipping"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      label="Default Shipping Address"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="is_default_billing"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      label="Default Billing Address"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageAddress;
