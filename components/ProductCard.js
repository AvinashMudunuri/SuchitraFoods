import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PropTypes from 'prop-types';
import { useAnalytics } from '../lib/useAnalytics';
import { useCart } from '../context/CartContext';

const ProductCard = ({
  product: {
    id: product_id,
    hash,
    image: product_image,
    name: product_name,
    product_short_description,
    description: product_description,
    quantities_available,
    discountedPrices,
    prices,
    inventory,
  },
  product,
  source,
  isMobile,
}) => {
  const router = useRouter();
  const { handleCartOperation, isItemLoading } = useCart();
  const { trackEvent } = useAnalytics();
  const [selectedSize, setSelectedSize] = useState(quantities_available[0]);
  const isProductOutOfStock = inventory[selectedSize] === 0;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (selectedSize) {
      await handleCartOperation(product, selectedSize, 1);
      trackEvent({
        action: 'add_to_cart',
        category: 'Product',
        label: product_name,
        value: product_id,
      });
    }
  };

  const handleViewDetails = () => {
    trackEvent({
      action: 'click_view_details',
      category: 'Product',
      label: product_name,
      value: product_id,
    });
    router.push(`/products/${hash}`);
  };

  // Update: Check loading state for specific product
  const isThisItemLoading = isItemLoading === product_id;

  return (
    <Card
      sx={{
        maxWidth: !isMobile ? 240 : 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // transition: 'transform 0.2s',
        // '&:hover': {
        //   transform: 'translateY(-4px)',
        //   boxShadow: 4,
        // },
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        height="150"
        image={product_image}
        alt={product_name}
        sx={{
          objectFit: 'cover',
          cursor: 'pointer',
        }}
        onClick={handleViewDetails}
      />

      {/* Product Info */}
      <CardContent sx={{ pb: 1, flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          noWrap
          sx={{
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
          onClick={handleViewDetails}
        >
          {product_name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            height: '40px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product_short_description || product_description}
        </Typography>

        {/* Pack Sizes */}

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth size="small">
            {/* <InputLabel id="pack-size-label">Select Pack Size</InputLabel> */}
            <Select
              displayEmpty
              labelId="pack-size-label"
              value={selectedSize || ''}
              onChange={(e) => handleSizeSelect(e.target.value)}
              disabled={isProductOutOfStock}
            >
              {quantities_available.length > 0 &&
                quantities_available.map((size) => (
                  <MenuItem key={size} value={size}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{size}</Typography>
                      <Typography>
                        {/* {discountedPrices[size] ? (
                            <>
                              <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                                ₹{prices[size]}
                              </span>
                              <strong>₹{discountedPrices[size]}</strong>
                            </>
                          ) : (
                            <strong>₹{prices[size]}</strong>
                          )} */}
                        <strong>₹{prices[size]}</strong>
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>

      <Box sx={{ mt: 'auto' }}>
        {/* <Divider sx={{ mx: 2 }} /> */}

        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Tooltip title={!selectedSize ? 'Please select a size' : ''}>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!selectedSize || isThisItemLoading || isProductOutOfStock}
              sx={{ flexGrow: 1, width: '100%' }}
            >
              {isProductOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button variant="outlined" sx={{ mt: 1, width: '100%' }} onClick={handleViewDetails}>
              View Details
            </Button>
          </Tooltip>
        </CardActions>

        <Divider sx={{ mx: 2 }} />
      </Box>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
  source: PropTypes.string,
  isMobile: PropTypes.bool,
};

export default ProductCard;
