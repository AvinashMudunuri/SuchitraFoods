import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { compareAddresses } from '../../utils';
import { Box, Typography, MenuItem, Select, Radio } from '@mui/material';

const AddressSelect = ({ addresses, addressInput, onSelect }) => {
  const handleSelect = (id) => {
    const savedAddress = addresses.find((a) => a.id === id);
    if (savedAddress) {
      onSelect(savedAddress);
    }
  };
  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput));
  }, [addresses, addressInput]);

  return (
    <Select
      fullWidth
      value={selectedAddress?.id || 'Choose an address'}
      onChange={(e) => handleSelect(e.target.value)}
      data-testid="shipping-address-select"
    >
      {addresses.map((address) => (
        <MenuItem
          key={address.id}
          value={address.id}
          data-testid="shipping-address-option"
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Radio
              checked={selectedAddress?.id === address.id}
              data-testid="shipping-address-radio"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1">
                {address.first_name} {address.last_name}
              </Typography>
              {address?.company && (
                <Typography variant="body2" color="text.secondary">
                  {address.company}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                <Typography variant="body1">
                  {address.address_1}
                  {address.address_2 && `, ${address.address_2}`}
                </Typography>
                <Typography variant="body1">
                  {address.postal_code}, {address.city}
                </Typography>
                <Typography variant="body1">
                  {address.province && `${address.province}, `}
                  {address.country_code?.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};

AddressSelect.propTypes = {
  addresses: PropTypes.array.isRequired,
  addressInput: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AddressSelect;
