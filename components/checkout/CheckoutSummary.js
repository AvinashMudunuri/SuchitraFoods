import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Paper,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { convertToLocale } from '../../utils';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CheckoutSummary = ({ cart, subtotal, shipping, discount, total }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'grey.100',
        p: { xs: 2, sm: 3 },
        height: '100%',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        <Box
          component="img"
          src="/api/placeholder/80/80"
          alt="Product"
          sx={{
            width: { xs: 60, sm: 80 },
            height: { xs: 60, sm: 80 },
            mr: 2,
            borderRadius: 1,
          }}
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Bellam Gavvalu Original Godavari Recipe
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            250 gms
          </Typography>
          <Typography variant="h6">₹140.00</Typography>
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Discount code"
        size="small"
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
          },
        }}
        InputProps={{
          endAdornment: (
            <Typography
              component="button"
              sx={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'primary.main',
                fontWeight: 500,
              }}
            >
              Apply
            </Typography>
          ),
        }}
      />

      <Box sx={{ '& > div': { mb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Subtotal</Typography>
          <Typography>₹140.00</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography display="flex" alignItems="center">
            Shipping <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
          </Typography>
          <Typography>₹89.00</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography display="flex" alignItems="center">
            Estimated taxes <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
          </Typography>
          <Typography>₹7.00</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Total</Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            INR
          </Typography>
          <Typography variant="h5">₹236.00</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

CheckoutSummary.propTypes = {
  cart: PropTypes.object.isRequired,
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default CheckoutSummary;
