import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { searchProducts } from '../lib/searchClient';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),
  width: '100%',
  '& .MuiInputBase-root': {
    color: 'inherit',
    width: '100%',
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
    '&:focus': {
      width: '100%',
    },
  },
}));

const Search = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (inputValue.trim().length < 2) {
      setOptions([]);
      setOpen(false);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      searchProducts(inputValue).then((products) => {
        setLoading(false);
        setOptions(products || []);
        setOpen(true);
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleOptionSelected = (event, value) => {
    if (typeof value === 'object' && value?.handle) {
      router.push(`/products/${value.handle}`);
      setInputValue('');
      setOpen(false);
    }
  };

  return (
    <StyledAutocomplete
      id="product-search-autocomplete"
      open={open}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleOptionSelected}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
      options={options}
      loading={loading}
      noOptionsText="No products found"
      disableClearable
      popupIcon={null}
      slotProps={{
        paper: {
          sx: { backgroundColor: 'background.paper', color: 'text.primary', mt: 1 },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search products…"
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'inherit' }} />,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {!loading && inputValue && (
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setInputValue('')}
                    edge="end"
                    size="small"
                    sx={{ color: 'inherit' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
          <img
            loading="lazy"
            width="40"
            src={option.thumbnail || '/images/logo.svg'}
            alt={option.title}
            style={{ objectFit: 'cover', height: '40px' }}
          />
          <Typography variant="body2">{option.title}</Typography>
        </Box>
      )}
    />
  );
};

export default Search;
