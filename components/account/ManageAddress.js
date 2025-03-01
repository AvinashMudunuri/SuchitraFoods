import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid2 as Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Dialog,
  Divider,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { Phone } from '../Phone';
import PropTypes from 'prop-types';
import { updateCustomerAddress, addCustomerAddress, deleteCustomerAddress } from '../../pages/api/customer';
import { FormattedPhoneNumber } from '../../utils';

const AddressForm = ({ address, countries, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: address?.first_name || '',
    last_name: address?.last_name || '',
    address_1: address?.address_1 || '',
    address_2: address?.address_2 || '',
    city: address?.city || '',
    province: address?.province || '',
    country_code: address?.country_code || '',
    postal_code: address?.postal_code || '',
    phone: address?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isProvinceRequired = ['in', 'us', 'ca'].includes(formData.country_code);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Select
        fullWidth
        label="Country/Region"
        name="country_code"
        value={formData.country_code}
        onChange={handleChange}
        required
      >
        {countries.map((country) => (
          <MenuItem key={country.code} value={country.code}>
            {country.name}
          </MenuItem>
        ))}
      </Select>
      <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </Grid>

      </Grid>

      <TextField
        fullWidth
        label="Address Line 1"
        name="address_1"
        value={formData.address_1}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />


      <TextField
        fullWidth
        label="Address Line 2"
        name="address_2"
        value={formData.address_2}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Grid>
        {isProvinceRequired && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Phone
            country={formData.country_code}
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            required
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Save Address</Button>
      </Box>
    </Box>
  );
};

AddressForm.propTypes = {
  address: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ManageAddress = ({ customer, countries }) => {
  console.log(`customer`, customer)
  const [addresses, setAddresses] = useState(customer?.addresses || []); // Replace with actual addresses from API
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddAddress = async (addressData) => {
    setLoading(true);
    try {
      let address = {
        first_name: addressData.first_name,
        last_name: addressData.last_name,
        address_1: addressData.address_1,
        address_2: addressData.address_2,
        city: addressData.city,
        province: ['in', 'us', 'ca'].includes(addressData.country_code) ? addressData.province : '',
        country_code: addressData.country_code,
        postal_code: addressData.postal_code,
        phone: addressData.phone,
        is_default_shipping: false,
        is_default_billing: false,
      }
      const response = await addCustomerAddress(null, address);
      if (response.success) {
        setAddresses([...addresses, response.customer.addresses[0]]);
        toast.success(response.message);
        setDialogOpen(false);
      }
    } catch (error) {
      console.log(`Error Add Customer Address Details ==>`, error);
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const handleEditAddress = async (addressData) => {
    setLoading(true);
    try {
      // API call to update address
      let address = {
        address_id: editingAddress.id,
        first_name: addressData.first_name,
        last_name: addressData.last_name,
        address_1: addressData.address_1,
        address_2: addressData.address_2,
        city: addressData.city,
        province: ['in', 'us', 'ca'].includes(addressData.country_code) ? addressData.province : '',
        country_code: addressData.country_code,
        postal_code: addressData.postal_code,
        phone: addressData.phone,
      }
      const response = await updateCustomerAddress(null, address);
      if (response.success) {
        const updatedAddresses = addresses.map(addr =>
          addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
        );
        setAddresses(updatedAddresses);
        toast.success(response.message);
        setDialogOpen(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.log(`Error Update Customer Address Details ==>`, error);
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const handleDeleteAddress = async (addressId) => {
    setLoading(true);
    try {
      // API call to delete address
      const response = await deleteCustomerAddress(addressId);
      if (response.success) {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        toast.success(response.message);
        setDeleteDialogOpen(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.log(`Error Delete Customer Address Details ==>`, error);
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const generateContent = (address) => {
    const isDefaultShipping = address.is_default_shipping;
    const isDefaultBilling = address.is_default_billing;
    const content = [];
    if (isDefaultShipping) {
      content.push(<Chip size='small' color='primary' label='Default Shipping' />);
    }
    if (isDefaultBilling) {
      content.push(<Chip size='small' color='secondary' label='Default Billing' />);
    }
    return content;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Saved Addresses</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          Add New Address
        </Button>
      </Box>

      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} sm={6} key={address.id}>
            <Card>
              <CardHeader
                title={`${address.first_name} ${address.last_name}`}
                subheader={generateContent(address)}
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {address.address_1}
                  {address.address_2 && <>, {address.address_2}</>}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.city}, {address.province ? `${address.province},` : ''} {address.country_code.toUpperCase()} - {address.postal_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {FormattedPhoneNumber(address.phone, address.country_code)}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => {
                    setEditingAddress(address);
                    setDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => {
                  setDeleteDialogOpen(true);
                  setEditingAddress(address);
                }}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleDeleteAddress(editingAddress.id)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingAddress(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent dividers>
          <AddressForm
            address={editingAddress}
            countries={countries}
            onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
            onCancel={() => {
              setDialogOpen(false);
              setEditingAddress(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

ManageAddress.propTypes = {
  customer: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
};

export default ManageAddress;
