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
  Stack,
  Divider,
  Paper,
  Tooltip,
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
  },
  product,
}) => {
  const router = useRouter();
  const { handleCartOperation, isItemLoading } = useCart();
  const { trackEvent } = useAnalytics();
  const [selectedSize, setSelectedSize] = useState(quantities_available[0]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      handleCartOperation(product, selectedSize, 1);
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

  console.log('isitemLoading', isItemLoading);

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
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
          <Typography variant="subtitle2" gutterBottom>
            Available Packs:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {quantities_available.length > 0 &&
              quantities_available.map((size) => (
                <Paper
                  key={size}
                  elevation={selectedSize === size ? 3 : 1}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    minWidth: '80px',
                    textAlign: 'center',
                    bgcolor:
                      selectedSize === size
                        ? 'primary.light'
                        : 'background.paper',
                    color:
                      selectedSize === size
                        ? 'primary.contrastText'
                        : 'text.primary',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                  }}
                  onClick={() => handleSizeSelect(size)}
                >
                  <Typography variant="body2">{size}</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {discountedPrices[size] ? (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            textDecoration: 'line-through',
                            display: 'block',
                          }}
                        >
                          ₹{prices[size]}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{discountedPrices[size]}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" fontWeight="bold">
                        ₹{prices[size]}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}
          </Stack>
        </Box>
      </CardContent>

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mx: 2 }} />

        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Tooltip title={!selectedSize ? 'Please select a size' : ''}>
            <span>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={!selectedSize || isItemLoading}
                sx={{ flexGrow: 1 }}
              >
                Add to Cart
              </Button>
            </span>
          </Tooltip>
        </CardActions>

        <Divider sx={{ mx: 2 }} />
      </Box>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default ProductCard;
