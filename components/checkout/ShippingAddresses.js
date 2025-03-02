import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid2 as Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import AddressSelect from './AddressSelect';
import { mapKeys } from 'lodash';

const ShippingAddresses = ({
  customer,
  isAuthenticated,
  cart,
  sameAsBilling,
  onChange,
}) => {
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

  const countryOptions = useMemo(() => {
    return customer?.addresses?.map((address) => ({
      value: address.country_code,
      label: address.country_code,
    }));
  }, [customer?.addresses]);

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  );

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(() => {
    return customer?.addresses.filter((a) => {
      return a.country_code && countriesInRegion?.includes(a.country_code);
    });
  }, [customer?.addresses, countriesInRegion]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log('isAuthenticated', isAuthenticated);
  console.log('addressesInRegion', addressesInRegion);
  return (
    <>
      {isAuthenticated && addressesInRegion?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </Typography>
          <AddressSelect
            addresses={customer?.addresses}
            addressInput={mapKeys(formData, (_, key) =>
              key.replace('shipping_address.', '')
            )}
            onSelect={setFormAddress}
          />
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="First name"
            name="shipping_address.first_name"
            autoComplete="given-name"
            value={formData['shipping_address.first_name']}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Last name"
            name="shipping_address.last_name"
            autoComplete="family-name"
            value={formData['shipping_address.last_name']}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Address"
            name="shipping_address.address_1"
            autoComplete="address-line1"
            value={formData['shipping_address.address_1']}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Address 2"
            name="shipping_address.address_2"
            autoComplete="address-line2"
            value={formData['shipping_address.address_2']}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Company"
            name="shipping_address.company"
            value={formData['shipping_address.company']}
            onChange={handleChange}
            autoComplete="organization"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="City"
            name="shipping_address.city"
            value={formData['shipping_address.city']}
            onChange={handleChange}
            autoComplete="address-level2"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="State / Province"
            name="shipping_address.province"
            value={formData['shipping_address.province']}
            onChange={handleChange}
            autoComplete="shipping-province-input"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Country"
            name="shipping_address.country_code"
            value={formData['shipping_address.country_code']}
            onChange={handleChange}
            autoComplete="country"
            fullWidth
            required
          >
            {countryOptions.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Postal code"
            name="shipping_address.postal_code"
            value={formData['shipping_address.postal_code']}
            onChange={handleChange}
            autoComplete="postal-code"
            fullWidth
            required
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={sameAsBilling}
              onChange={onChange}
              name="same_as_billing"
            />
          }
          label="Billing address is the same as shipping address"
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Phone"
            name="shipping_address.phone"
            value={formData['shipping_address.phone']}
            onChange={handleChange}
            autoComplete="phone"
            fullWidth
            required
          />
        </Grid>
      </Grid>
    </>
  );
};

ShippingAddresses.propTypes = {
  customer: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  cart: PropTypes.object,
  sameAsBilling: PropTypes.bool,
  onChange: PropTypes.func,
};

export default ShippingAddresses;
