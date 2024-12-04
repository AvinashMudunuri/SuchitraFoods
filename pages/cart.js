import React from 'react';
import { useCart } from '../context/CartContext'; // Replace with your cart context/reducer
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Box,
  Divider,
  Link,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const CartPage = () => {
  const { state, handleCartOperation, cart } = useCart(); // Access cart state and dispatch
  const { cartItems: items } = state;

  console.log(`cart`, cart);
  console.log(`items`, items);
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {items.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Your cart is empty. Start adding items!
        </Typography>
      ) : (
        <>
          <List>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleCartOperation(item)}
                        disabled={item.quantity === 1}
                      >
                        <Remove />
                      </IconButton>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ mx: 1 }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleCartOperation(item)}
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCartOperation(item.id)}
                        sx={{ ml: 2 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      alt={item.title}
                      src={item.thumbnail} // Replace with actual image URL
                      sx={{ width: 64, height: 64 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={`Price: ₹${item.unit_price} | Quantity: `}
                    sx={{ ml: 2 }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 4, mb: 4, textAlign: 'right' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total: ₹{cart?.item_total}
            </Typography>
            <Button
              component={Link}
              href={`/checkout`}
              variant="contained"
              color="primary"
              size="large"
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;
