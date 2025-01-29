import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Grid2 as Grid,
  IconButton,
  Checkbox,
  RadioGroup,
  Radio,
  Paper,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import states from '../../lib/in_states.json';

import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect } from 'react';

const CheckoutForm = ({ cart, customer, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    'shipping_address.first_name': cart?.shipping_address?.first_name || '',
    'shipping_address.last_name': cart?.shipping_address?.last_name || '',
    'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
    'shipping_address.address_2': cart?.shipping_address?.address_2 || '',
    'shipping_address.company': cart?.shipping_address?.company || '',
    'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
    'shipping_address.city': cart?.shipping_address?.city || '',
    'shipping_address.country_code': cart?.shipping_address?.country_code || '',
    'shipping_address.province': cart?.shipping_address?.province || '',
    'shipping_address.phone': cart?.shipping_address?.phone || '',
    email: cart?.email || '',
  });

  const setFormAddress = (address, email) => {
    address &&
      setFormData((prevState) => ({
        ...prevState,
        'shipping_address.first_name': address?.first_name || '',
        'shipping_address.last_name': address?.last_name || '',
        'shipping_address.address_1': address?.address_1 || '',
        'shipping_address.address_2': address?.address_2 || '',
        'shipping_address.company': address?.company || '',
        'shipping_address.postal_code': address?.postal_code || '',
        'shipping_address.city': address?.city || '',
        'shipping_address.country_code': address?.country_code || '',
        'shipping_address.province': address?.province || '',
        'shipping_address.phone': address?.phone || '',
      }));

    email &&
      setFormData((prevState) => ({
        ...prevState,
        email: email,
      }));
  };

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart?.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email);
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email);
    }
  }, [cart]); // Add cart as a dependency

  const countriesInRegion = useMemo(
    () =>
      cart?.region?.countries?.map((c) => ({
        value: c.iso_2,
        label: c.name,
      })),
    [cart?.region]
  );

  const countryOptions = useMemo(() => {
    return customer?.addresses?.map((address) => ({
      value: address.country_code,
      label: address.name,
    }));
  }, [customer?.addresses]);

  const [country, setCountry] = React.useState(
    customer?.addresses?.[0]?.country_code || 'India'
  );
  const [stateName, setStateName] = React.useState(
    customer?.addresses?.[0]?.province || 'Telangana'
  );

  console.log(stateName);
  const [shippingMethod, setShippingMethod] = React.useState('standard');

  const PaymentMethodIcons = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <img src="/api/placeholder/32/20" alt="UPI" />
      <img src="/api/placeholder/32/20" alt="Visa" />
      <img src="/api/placeholder/32/20" alt="Mastercard" />
      <img src="/api/placeholder/32/20" alt="RuPay" />
      <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
        +16
      </Typography>
    </Box>
  );
  return (
    <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
      {/* Contact Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contact
        </Typography>
        <Link href="/account?view=sign-in" sx={{ ml: 'auto' }}>
          Login
        </Link>
      </Box>
      <TextField
        fullWidth
        placeholder="Email or mobile phone number"
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {/* Delivery Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Delivery
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Country/Region</InputLabel>
        <Select
          name="shipping_address.country_code"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          label="Country/Region"
        >
          {countriesInRegion.map((country) => (
            <MenuItem key={country.value} value={country.value}>
              {country.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="shipping_address.first_name"
            label="First name"
            value={
              customer?.first_name || formData['shipping_address.first_name']
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="shipping_address.last_name"
            label="Last name"
            value={
              customer?.last_name || formData['shipping_address.last_name']
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          label="Address"
          name="shipping_address.address_1"
          value={
            customer?.addresses?.[0]?.address_1 ||
            formData['shipping_address.address_1']
          }
        />
        {/* <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <SearchIcon />
        </IconButton> */}
      </Box>

      <TextField
        fullWidth
        label="Apartment, suite, etc. (optional)"
        name="shipping_address.address_2"
        value={
          customer?.addresses?.[0]?.address_2 ||
          formData['shipping_address.address_2']
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            name="shipping_address.city"
            value={
              customer?.addresses?.[0]?.city ||
              formData['shipping_address.city']
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              name="shipping_address.province"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            >
              {states.records.map((state) => (
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
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="shipping_address.postal_code"
            label="PIN code"
            value={
              customer?.addresses?.[0]?.postal_code ||
              formData['shipping_address.postal_code']
            }
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        name="shipping_address.phone"
        label="Phone"
        value={
          customer?.addresses?.[0]?.phone || formData['shipping_address.phone']
        }
      />

      <FormControlLabel
        control={<Checkbox />}
        label="Save this information for next time"
        sx={{ mt: 1 }}
      />

      {/* Shipping Method */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Shipping method
      </Typography>
      <RadioGroup
        value={shippingMethod}
        onChange={(e) => setShippingMethod(e.target.value)}
      >
        <Paper
          variant="outlined"
          sx={{
            mb: 1,
            p: 2,
            bgcolor:
              shippingMethod === 'standard' ? 'primary.50' : 'transparent',
            borderColor:
              shippingMethod === 'standard' ? 'primary.main' : 'divider',
          }}
        >
          <FormControlLabel
            value="standard"
            control={<Radio />}
            label={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <span>Standard</span>
                <Typography>₹89.00</Typography>
              </Box>
            }
          />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: shippingMethod === 'local' ? 'primary.50' : 'transparent',
            borderColor:
              shippingMethod === 'local' ? 'primary.main' : 'divider',
          }}
        >
          <FormControlLabel
            value="local"
            control={<Radio />}
            label={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <span>Local delivery</span>
                <Typography>₹99.00</Typography>
              </Box>
            }
          />
        </Paper>
      </RadioGroup>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Payment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        All transactions are secure and encrypted.
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'primary.50',
          borderColor: 'primary.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>
            Razorpay Secure (UPI, Cards, Wallets, NetBanking)
          </Typography>
          <PaymentMethodIcons />
        </Box>
      </Paper>
      <Box
        sx={{
          bgcolor: 'grey.100',
          p: 3,
          borderRadius: 1,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src="/api/placeholder/64/64"
          alt="Redirect Icon"
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          After clicking "Pay now", you will be redirected to Razorpay Secure
          (UPI, Cards, Wallets, NetBanking) to complete your purchase securely.
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        Billing address
      </Typography>
      <RadioGroup
        value={billingType}
        onChange={(e) => setBillingType(e.target.value)}
      >
        <Paper
          variant="outlined"
          sx={{
            mb: 1,
            p: 2,
            bgcolor: billingType === 'same' ? 'primary.50' : 'transparent',
            borderColor: billingType === 'same' ? 'primary.main' : 'divider',
          }}
        >
          <FormControlLabel
            value="same"
            control={<Radio />}
            label="Same as shipping address"
          />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            bgcolor: billingType === 'different' ? 'primary.50' : 'transparent',
            borderColor:
              billingType === 'different' ? 'primary.main' : 'divider',
          }}
        >
          <FormControlLabel
            value="different"
            control={<Radio />}
            label="Use a different billing address"
          />
        </Paper>
      </RadioGroup>
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{
          mt: 2,
          mb: 4,
          py: 1.5,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        Pay now
      </Button>
    </Box>
  );
};

CheckoutForm.propTypes = {
  customer: PropTypes.object.isRequired,
};

export default CheckoutForm;
