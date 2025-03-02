import React, { useState, useEffect } from 'react';
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
  Paper,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Zoom,
  Fade,
  Badge,
  Stack,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { Phone } from '../Phone';
import PropTypes from 'prop-types';
import { updateCustomerAddress, addCustomerAddress, deleteCustomerAddress } from '../../pages/api/customer';
import { FormattedPhoneNumber, getShippingPostalLabel, getShippingStateLabel } from '../../utils';
import in_states from '../../lib/in_states.json';
import us_ca_states from '../../lib/us_ca_states.json';

const AddressForm = ({ address, countries, onSubmit, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [statesMap, setStatesMap] = useState([]);

  const [formData, setFormData] = useState({
    first_name: address?.first_name || '',
    last_name: address?.last_name || '',
    address_1: address?.address_1 || '',
    address_2: address?.address_2 || '',
    city: address?.city || '',
    province: address?.province || '',
    country_code: address?.country_code || 'in',
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

  useEffect(() => {
    if (formData.country_code && ['in', 'us', 'ca'].includes(formData.country_code)) {
      if (formData.country_code === 'in') {
        setStatesMap(in_states.records.sort((a, b) => a.state_name_english.localeCompare(b.state_name_english)));
      } else if (formData.country_code === 'us' || formData.country_code === 'ca') {
        setStatesMap(us_ca_states.find(
          (country) => country.abbreviation.toLowerCase() === formData.country_code
        )?.states.sort((a, b) => a.state_name_english.localeCompare(b.state_name_english)));
      }
    }
  }, [formData.country_code]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="country-select-label">Country/Region</InputLabel>
        <Select
          labelId="country-select-label"
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
      </FormControl>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
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
        label="Address"
        name="address_1"
        value={formData.address_1}
        onChange={handleChange}
        required
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        label="Apartment, suite, etc. (optional)"
        name="address_2"
        value={formData.address_2}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
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
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel id="province-select-label">{getShippingStateLabel(formData.country_code)}</InputLabel>
              <Select
                labelId="province-select-label"
                fullWidth
                label={getShippingStateLabel(formData.country_code)}
                name="province"
                value={formData.province}
                onChange={handleChange}
                required

              >
                <MenuItem value="" disabled>
                  <em>Select {getShippingStateLabel(formData.country_code)}</em>
                </MenuItem>
                {statesMap.map((state) => (
                  <MenuItem
                    key={state.state_name_english}
                    value={state.state_name_english}
                  >
                    {state.state_name_english}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={getShippingPostalLabel(formData.country_code)}
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Phone
            country={formData.country_code}
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Save Address
        </Button>
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [addresses, setAddresses] = useState(customer?.addresses || []);
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

  const setDefaultShippingAddress = async (address) => {
    setLoading(true);
    try {
      // API call to set default shipping address
      let addressData = {
        address_id: address.id,
        first_name: address.first_name,
        last_name: address.last_name,
        address_1: address.address_1,
        address_2: address.address_2,
        city: address.city,
        province: ['in', 'us', 'ca'].includes(address.country_code) ? address.province : '',
        country_code: address.country_code,
        postal_code: address.postal_code,
        phone: address.phone,
        is_default_shipping: true
      };
      const response = await updateCustomerAddress(null, addressData);
      if (response.success) {
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          is_default_shipping: addr.id === address.id
        }));
        setAddresses(updatedAddresses);
        toast.success('Default shipping address updated successfully');
      }
    } catch (error) {
      console.log(`Error Setting Default Shipping Address ==>`, error);
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const getAddressInitials = (address) => {
    return `${address.first_name.charAt(0)}${address.last_name.charAt(0)}`;
  };

  return (
    <Box sx={{ position: 'relative' }}>
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
          Saved Addresses
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setDialogOpen(true)}
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
          Add New Address
        </Button>
      </Box>

      <Grid container spacing={3}>
        {addresses.sort((a, b) => a.is_default_shipping ? -1 : 1).map((address, index) => (
          <Grid item xs={12} sm={6} md={4} key={address.id}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                {address.is_default_shipping && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderBottomLeftRadius: '8px',
                      zIndex: 1
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Default
                    </Typography>
                  </Box>
                )}
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: address.is_default_shipping ? theme.palette.primary.main : theme.palette.grey[300],
                        color: address.is_default_shipping ? 'white' : theme.palette.text.primary
                      }}
                    >
                      {getAddressInitials(address)}
                    </Avatar>
                  }
                  title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {`${address.first_name} ${address.last_name}`}
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <Divider />
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                      <Typography variant="body2" color="text.primary">
                        {address.address_1} <br />
                        {address.address_2 && `${address.address_2}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <HomeIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                      <Typography variant="body2" color="text.primary">
                        {address.city}, {address.province ? `${address.province},` : ''} {address.country_code.toUpperCase()} - {address.postal_code}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.primary">
                        {FormattedPhoneNumber(address.phone, address.country_code)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box>
                    <Tooltip title="Edit Address">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setEditingAddress(address);
                          setDialogOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Address">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setDeleteDialogOpen(true);
                          setEditingAddress(address);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {!address.is_default_shipping && (
                    <Tooltip title="Set as Default Shipping">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<StarBorderIcon />}
                        onClick={() => setDefaultShippingAddress(address)}
                        sx={{
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                            color: 'white'
                          }
                        }}
                      >
                        Set Default
                      </Button>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Zoom>
          </Grid>
        ))}
        {addresses.length === 0 && (
          <Grid item xs={12}>
            <Fade in={true}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: '12px',
                  border: `1px dashed ${theme.palette.grey[300]}`
                }}
              >
                <LocationIcon sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  No Addresses Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't added any addresses yet. Add your first address to get started.
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setDialogOpen(true)}
                  sx={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    px: 3,
                    py: 1
                  }}
                >
                  Add New Address
                </Button>
              </Paper>
            </Fade>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Delete Address
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Are you sure you want to delete this address? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteAddress(editingAddress.id)}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingAddress(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <AddressForm
            address={editingAddress || {}}
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
