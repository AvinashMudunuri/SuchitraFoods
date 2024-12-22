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
  IconButton,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import AddToCartButton from './AddToCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProductCard = ({
  product: {
    product_id,
    product_hash,
    product_image,
    product_name,
    product_short_description,
    product_description,
    best_used_for,
    quantities_available,
    discountedPrices,
    prices,
  },
  viewMode,
}) => {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
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
        height="200"
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
            {quantities_available.map((size) => (
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

      <CardActions>
        <Button component={Link} href={`/product/${product_id}`} variant="text">
          View Details
        </Button>
        <AddToCartButton product_id={product_id} />
      </CardActions>


      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mx: 2 }} />

        {/* Actions */}
        {/* <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          {selectedSize ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2 }}>{quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange('increase')}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{ flexGrow: 1 }}
              >
                Add to Cart
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select a size to add to cart
            </Typography>
          )}
        </CardActions> */}

        <Divider sx={{ mx: 2 }} />

        {/* View Details Button */}
        <CardActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={handleViewDetails}
            fullWidth
          >
            View Details
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
  viewMode: PropTypes.string,
};

export default ProductCard;
