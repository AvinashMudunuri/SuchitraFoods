import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const Counter = ({ product, selectedSize, quantity, setQuantity }) => {
  const { state, handleCartOperation } = useCart();

  const itemInCart = state.cartItems.find(
    (item) => item.product_id === product.id
  );

  const isMaxInventoryReached = () => {
    const inventory = product.inventory;
    const currentInventory = inventory[selectedSize] || 0;
    const cartQuantity = itemInCart?.quantity || 0;
    return cartQuantity >= currentInventory;
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase' && !isMaxInventoryReached()) {
      setQuantity((prev) => {
        const newQuantity = prev + 1;
        handleCartOperation(product, selectedSize, newQuantity);
        return newQuantity;
      });
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        handleCartOperation(product, selectedSize, newQuantity);
        return newQuantity;
      });
    }
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      handleCartOperation(product, selectedSize, quantity);
    }
  };

  return (
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
          disabled={isMaxInventoryReached()}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Tooltip title={!selectedSize ? 'Please select a size' : ''}>
        <span>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={!selectedSize}
            sx={{ flexGrow: 1 }}
          >
            Add to Cart
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

Counter.propTypes = {
  product: PropTypes.object.isRequired,
  selectedSize: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default Counter;
