import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  Stack,
  Tooltip,
  Badge,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import PropTypes from 'prop-types';

const CompactProductCard = ({
  product: {
    product_id,
    product_image,
    product_name,
    product_description,
    product_short_description,
    quantities_available,
    discountedPrices,
    prices,
    product_hash,
    stock_status = 'in_stock', // New prop for stock status
    is_bestseller = false, // New prop for bestseller badge
  },
  onAddToCart,
}) => {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleSizeSelect = (size) => {
    setSelectedSize(size.target.value);
    setQuantity(1);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity((prev) => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedSize && onAddToCart) {
      onAddToCart({
        size: selectedSize,
        quantity,
        price: discountedPrices[selectedSize] || prices[selectedSize],
      });
    }
  };

  const handleViewDetails = () => {
    router.push(`/products/${product_hash}`);
  };

  return (
    <Card
      sx={{
        width: '280px',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Section */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        <Stack spacing={1}>
          {is_bestseller && (
            <Chip
              size="small"
              color="primary"
              icon={<VerifiedIcon />}
              label="Bestseller"
              sx={{ bgcolor: 'primary.main' }}
            />
          )}
          {stock_status === 'low_stock' && (
            <Chip
              size="small"
              color="warning"
              label="Limited Stock"
              sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}
            />
          )}
        </Stack>
      </Box>

      {/* Image Section */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={product_image}
          alt={product_name}
          sx={{
            cursor: 'pointer',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            ...(isHovered && { transform: 'scale(1.05)' }),
          }}
          onClick={handleViewDetails}
        />
        {/* Discount badge */}
        {selectedSize && discountedPrices[selectedSize] && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'error.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {Math.round(
              ((prices[selectedSize] - discountedPrices[selectedSize]) /
                prices[selectedSize]) *
                100
            )}
            % OFF
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Stack spacing={1}>
          {/* Product Name */}
          <Typography
            variant="subtitle1"
            sx={{
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: 1.2,
              height: '2.4em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={handleViewDetails}
          >
            {product_name}
          </Typography>

          {/* Short Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              height: '7.4em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
            }}
          >
            {product_short_description || product_description}
          </Typography>

          {/* Size Selection and Price */}
          {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Select
              value={selectedSize}
              onChange={handleSizeSelect}
              size="small"
              displayEmpty
              sx={{
                minWidth: 100,
                height: 36,
                '& .MuiSelect-select': {
                  py: 0.5,
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Size
              </MenuItem>
              {quantities_available.map((size) => (
                <MenuItem key={size} value={size}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <span>{size}</span>
                    <Typography variant="body2" color="text.secondary">
                      ₹{discountedPrices[size] || prices[size]}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>

            {selectedSize && (
              <Box sx={{ textAlign: 'right', flex: 1 }}>
                {discountedPrices[selectedSize] ? (
                  <>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through', display: 'block' }}
                    >
                      ₹{prices[selectedSize]}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      fontWeight="bold"
                    >
                      ₹{discountedPrices[selectedSize]}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" fontWeight="bold">
                    ₹{prices[selectedSize]}
                  </Typography>
                )}
              </Box>
            )}
          </Box> */}

          {/* Quantity and Add to Cart */}
          {selectedSize && (
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: 36,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{ px: 1, minWidth: '24px', textAlign: 'center' }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange('increase')}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Tooltip title={!selectedSize ? 'Please select a size' : ''}>
                  <Box sx={{ flex: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                      disabled={
                        !selectedSize || stock_status === 'out_of_stock'
                      }
                      fullWidth
                      sx={{ height: 36 }}
                    >
                      Add
                    </Button>
                  </Box>
                </Tooltip>
              </Stack>

              {/* Delivery Info */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  color: 'success.main',
                }}
              >
                <LocalShippingIcon fontSize="small" />
                <Typography variant="caption">
                  Free delivery on orders above ₹500
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

CompactProductCard.propTypes = {
  product: PropTypes.object,
};

export default CompactProductCard;
