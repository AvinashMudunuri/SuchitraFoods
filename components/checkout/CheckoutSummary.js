import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Paper,
  TextField,
  Badge,
} from '@mui/material';
import PropTypes from 'prop-types';
import { convertToLocale } from '../../utils';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CheckoutSummary = ({ cart, subtotal, shipping, discount, total }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: { xs: 'white', md: 'grey.100' },
        p: { xs: 2, sm: 3 },
        height: '100%',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}
      >
        Order summary
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mb: 3,
          flexDirection: 'column',
        }}
      >
        {cart.items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',

              mb: 2,
            }}
          >
            <Badge badgeContent={item.quantity} color="primary">
              <Box
                component="img"
                src={item.thumbnail}
                alt="Product"
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: 1,
                }}
              />
            </Badge>
            <Box sx={{ ml: 2, flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    {item.product_title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {item.variant_title}
                  </Typography>
                </Box>
                <Typography>
                  {convertToLocale({
                    amount: item.unit_price,
                    currency_code: cart.currency_code,
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
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
        slotProps={{
          input: {
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
          },
        }}
      />

      <Box sx={{ '& > div': { mb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Subtotal</Typography>
          <Typography>
            {convertToLocale({
              amount: cart.subtotal,
              currency_code: cart.currency_code,
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Discount</Typography>
          <Typography color="error">
            -{' '}
            {convertToLocale({
              amount: cart.discount_total,
              currency_code: cart.currency_code,
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography display="flex" alignItems="center">
            Shipping <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
          </Typography>
          <Typography>
            {convertToLocale({
              amount: cart.shipping_total,
              currency_code: cart.currency_code,
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography display="flex" alignItems="center">
            Estimated taxes <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
          </Typography>
          <Typography>
            {convertToLocale({
              amount: cart.tax_total,
              currency_code: cart.currency_code,
            })}
          </Typography>
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
        <Box
          sx={{
            textAlign: 'right',
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            INR
          </Typography>
          <Typography variant="h5">
            {convertToLocale({
              amount: cart.total,
              currency_code: cart.currency_code,
            })}
          </Typography>
        </Box>
      </Box>
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
          display: { xs: 'block', md: 'none' },
        }}
      >
        Pay now
      </Button>
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
