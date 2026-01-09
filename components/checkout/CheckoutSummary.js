import {
  Box,
  Typography,
  Divider,
  Paper,
  TextField,
  Badge,
  IconButton,
  Collapse,
} from '@mui/material';
import PropTypes from 'prop-types';
import { convertToLocale } from '../../utils';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import { useResponsive } from '../../hooks/useResponsive';
import { useState } from 'react';
import { addPromotionToCart, removePromotionFromCart } from '../../pages/api/cart';
import { toast } from 'react-toastify';

const OrderTotal = ({ cart }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
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
);

OrderTotal.propTypes = {
  cart: PropTypes.object.isRequired,
};

const SummaryContent = ({ cart, setCart }) => {
  const [promotionCode, setPromotionCode] = useState('');
  const [promotionCodeError, setPromotionCodeError] = useState('');
  const [promotionCodeLoading, setPromotionCodeLoading] = useState(false);
  const [promotionCodeSuccess, setPromotionCodeSuccess] = useState('');
  const [appliedCode, setAppliedCode] = useState('');


  const handlePromotionCodeRemoveAll = async () => {
    try {
      setPromotionCodeLoading(true);
      setPromotionCodeError('');
      const response = await removePromotionFromCart(cart.id);
      console.log('Promotion Removed==>', response);
      setPromotionCodeSuccess('Promotion Removed');
      setAppliedCode('');
      if (setCart && response?.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to remove promotion');
    } finally {
      setPromotionCodeLoading(false);
    }
  };

  const handlePromotionCodeRemove = async (promotionCode) => {
    try {
      setPromotionCodeLoading(true);
      setPromotionCodeError('');
      const response = await removePromotionFromCart(cart.id, promotionCode);
      console.log('Promotion Removed==>', response);
      setPromotionCodeSuccess('Promotion Removed');
      setAppliedCode('');
      setPromotionCode('');
      if (setCart && response?.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      console.log('Error Removing Promotion==>', error);
      setPromotionCodeError(error.response?.data?.message || error.message || 'Failed to remove promotion code');
    } finally {
      setPromotionCodeLoading(false);
    }
  };

  const handlePromotionCodeChange = (event) => {
    setPromotionCode(event.target.value);
  };

  const handlePromotionCodeApply = async () => {
    if (!promotionCode) {
      setPromotionCodeError('Please enter a promotion code');
      return;
    }
    try {
      setPromotionCodeLoading(true);
      setPromotionCodeError('');
      const response = await addPromotionToCart(cart.id, promotionCode);
      console.log('Promotion Applied==>', response);
      setPromotionCodeSuccess('Promotion Applied');
      setAppliedCode(response?.promotions?.[0]?.code || promotionCode);
      if (setCart && response) {
        setCart(response);
      }
    } catch (error) {
      setPromotionCodeError(error.response?.data?.message || error.message || 'Failed to apply promotion code');
      setPromotionCodeLoading(false);
    } finally {
      setPromotionCodeLoading(false);
    }
  };
  return (
    <>
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
              alignItems: 'center',
              width: '100%',
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
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
        value={promotionCode}
        onChange={handlePromotionCodeChange}
        error={!!promotionCodeError}
        helperText={promotionCodeError}
        disabled={promotionCodeLoading || appliedCode || cart?.promotions?.length > 0}
        sx={{
          mb: cart?.promotions?.length > 0 ? 1 : 3,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <Typography
                component="button"
                onClick={handlePromotionCodeApply}
                disabled={promotionCodeLoading || appliedCode || cart?.promotions?.length > 0}
                sx={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: cart?.promotions?.length > 0 ? 'text.secondary' : 'primary.main',
                  fontWeight: cart?.promotions?.length > 0 ? 400 : 500,
                }}
              >
                Apply
              </Typography>
            ),
          },
        }}
      />
      {cart?.promotions?.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Promotions Applied:</Typography>
          {cart.promotions.map((promotion) => (
            <Typography key={promotion.id} variant="body2" color="primary.main" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              {promotion.code}
              <IconButton size="small" color="error" onClick={() => handlePromotionCodeRemove(promotion.code)}>
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Typography>
          ))}
        </Box>
      )}
      <Box sx={{ '& > div': { mb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Subtotal</Typography>
          <Typography>
            {convertToLocale({
              amount: cart.item_subtotal,
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

      <OrderTotal cart={cart} />
    </>
  )
};

SummaryContent.propTypes = {
  cart: PropTypes.object.isRequired,
  setCart: PropTypes.func.isRequired,
};

const CheckoutSummary = ({ cart, setCart }) => {
  const { isMobile } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'grey.100',
        p: { xs: 2, sm: 3 },
        height: '100%',
        borderRadius: 2,
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {isMobile ? (
        <>
          {/* Mobile Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: isExpanded ? 2 : 0,
            }}
            onClick={toggleExpand}
          >
            <Typography
              variant="h6"
              sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }}
            >
              Order summary
            </Typography>
            <IconButton size="small">
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>

          {/* Collapsible Content */}
          <Collapse timeout="auto" sx={{ bgcolor: 'grey.100' }} in={isExpanded}>
            <SummaryContent cart={cart} setCart={setCart} />
          </Collapse>
        </>
      ) : (
        // Desktop View
        <>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Order summary
          </Typography>
          <SummaryContent cart={cart} setCart={setCart} />
        </>
      )}
    </Paper>
  );
};

CheckoutSummary.propTypes = {
  cart: PropTypes.object.isRequired,
  setCart: PropTypes.func.isRequired,
};

export default CheckoutSummary;
export { SummaryContent, OrderTotal };
