import 'react-international-phone/style.css';
import PropTypes from 'prop-types';
import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import React, { useEffect } from 'react';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

const countries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return ['in', 'us', 'gb', 'ca', 'au', 'de'].includes(iso2);
});

export const Phone = ({ value, onChange, ...restProps }) => {
  const {
    inputValue,
    handlePhoneValueChange,
    inputRef,
    country: selectedCountry,
    setCountry,
  } = usePhoneInput({
    disableFormatting: true,
    disableCountryGuess: true,
    defaultCountry: 'in',
    forceDialCode: true,
    value,
    countries,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  // // Update phone country when prop changes
  // useEffect(() => {
  //   if (value) {
  //     setCountry(value);
  //   }
  // }, [value, setCountry]);

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
              style={{ marginRight: '2px', marginLeft: '-8px' }}
            >
              <Select
                MenuProps={{
                  style: {
                    height: '300px',
                    width: '360px',
                    top: '10px',
                    left: '-34px',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
                sx={{
                  width: 'max-content',
                  // Remove default outline (display only on focus)
                  fieldset: {
                    display: 'none',
                  },
                  '&.Mui-focused:has(div[aria-expanded="false"])': {
                    fieldset: {
                      display: 'block',
                    },
                  },
                  // Update default spacing
                  '.MuiSelect-select': {
                    padding: '8px',
                    paddingRight: '24px !important',
                  },
                  svg: {
                    right: 0,
                  },
                }}
                value={selectedCountry?.iso2}
                onChange={(e) => setCountry(e.target.value)}
                renderValue={(value) => (
                  <FlagImage iso2={value} style={{ display: 'flex' }} />
                )}
              >
                {countries.map((c) => {
                  const country = parseCountry(c);
                  return (
                    <MenuItem key={country.iso2} value={country.iso2}>
                      <FlagImage
                        iso2={country.iso2}
                        style={{ marginRight: '8px' }}
                      />
                      <Typography marginRight="8px">{country.name}</Typography>
                      <Typography color="gray">+{country.dialCode}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </InputAdornment>
          ),
        },
      }}
      {...restProps}
    />
  );
};

Phone.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  selectedCountry: PropTypes.string,
};
