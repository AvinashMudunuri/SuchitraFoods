import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';

const Counter = ({ product, selectedQuantities }) => {
  const { state, handleCartOperation } = useCart();
  const itemInCart = state.cartItems.find(
    (item) => item.product_id === product.id
  );
  const isMaxInventoryReached = () => {
    const inventory = product.inventory;
    const currentInventory = inventory[selectedQuantities[product.id]] || 0;
    const cartQuantity = itemInCart?.quantity || 0;

    return cartQuantity >= currentInventory;
  };

  return itemInCart ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border="1px solid #ccc"
      borderRadius="8px"
      padding="4px 8px"
      maxWidth="120px"
      bgcolor="#f9f9f9"
    >
      <IconButton
        onClick={() => handleCartOperation(product, selectedQuantities, -1)}
        size="small"
        sx={{
          bgcolor: '#e0e0e0',
          '&:hover': { bgcolor: '#d6d6d6' },
          borderRadius: '50%',
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="body1"
        sx={{
          minWidth: '32px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {itemInCart?.quantity}
      </Typography>
      <IconButton
        onClick={() => handleCartOperation(product, selectedQuantities, 1)}
        disabled={isMaxInventoryReached()}
        size="small"
        sx={{
          bgcolor: '#e0e0e0',
          '&:hover': { bgcolor: '#d6d6d6' },
          borderRadius: '50%',
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  ) : (
    <Button
      variant="outlined"
      onClick={() => handleCartOperation(product, selectedQuantities, 1)}
    >
      Add to Cart
    </Button>
  );
};

Counter.propTypes = {
  product: PropTypes.object.isRequired,
  selectedQuantities: PropTypes.object.isRequired,
};

export default Counter;
