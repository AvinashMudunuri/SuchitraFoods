import PropTypes from 'prop-types';
import { Grid2 as Grid, TextField, MenuItem } from '@mui/material';
import { useState, useMemo } from 'react';

const BillingAddresses = ({ cart }) => {
  const [formData, setFormData] = useState({
    'billing_address.first_name': cart?.billing_address?.first_name || '',
    'billing_address.last_name': cart?.billing_address?.last_name || '',
    'billing_address.address_1': cart?.billing_address?.address_1 || '',
    'billing_address.address_2': cart?.billing_address?.address_2 || '',
    'billing_address.company': cart?.billing_address?.company || '',
    'billing_address.postal_code': cart?.billing_address?.postal_code || '',
    'billing_address.city': cart?.billing_address?.city || '',
    'billing_address.country_code': cart?.billing_address?.country_code || '',
    'billing_address.province': cart?.billing_address?.province || '',
    'billing_address.phone': cart?.billing_address?.phone || '',
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const countriesInRegion = useMemo(() => {
    if (!cart?.region) return [];
    return cart?.region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [cart?.region]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Country"
          name="billing_address.country_code"
          autoComplete="country"
          value={formData['billing_address.country_code']}
          onChange={handleChange}
          required
          fullWidth
        >
          {countriesInRegion.map((country) => (
            <MenuItem key={country.value} value={country.value}>
              {country.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData['billing_address.first_name']}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData['billing_address.last_name']}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData['billing_address.address_1']}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Address 2"
          name="billing_address.address_2"
          autoComplete="address-line2"
          value={formData['billing_address.address_2']}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Company"
          name="billing_address.company"
          autoComplete="company"
          value={formData['billing_address.company']}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData['billing_address.postal_code']}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="City"
          name="billing_address.city"
          autoComplete="city"
          value={formData['billing_address.city']}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label="Phone"
          name="billing_address.phone"
          autoComplete="phone"
          value={formData['billing_address.phone']}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

BillingAddresses.propTypes = {
  cart: PropTypes.object.isRequired,
};

export default BillingAddresses;
