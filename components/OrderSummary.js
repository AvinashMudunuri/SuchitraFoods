import { useCart } from '../context/CartContext';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { placeOrder } from '../pages/api/cart';
import { useRouter } from 'next/router';

const OrderSummary = () => {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { items, total, shipping_address, payment_collection } = cart;

  const onPlaceOrder = async () => {
    // Implement order placement logic here
    if (!cart) {
      return;
    }
    const orderResponse = await placeOrder(cart.id);
    console.log(orderResponse);
    if (orderResponse.type === 'cart' && orderResponse?.cart) {
      console.log('Order Failed');
    } else if (orderResponse.type === 'order' && orderResponse?.order) {
      console.log('Order Placed', orderResponse?.order);
      refreshCart();
      router.push('/order-success');
    }
  };
  return (
    <Box
      sx={{ maxWidth: 600, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Order Summary
      </Typography>
      {/* Cart Items */}
      <Typography variant="h6" gutterBottom>
        Items
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.product_title}
              secondary={`Quantity: ${item.quantity}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      {/* Shipping Address */}
      <Typography variant="body1">
        {shipping_address.first_name} {shipping_address.last_name} <br />
        {shipping_address.address_1}, {shipping_address.address_2} <br />
        {shipping_address.city}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {/* Payment Method */}
      <Typography variant="h6" gutterBottom>
        Payment Method: {payment_collection?.payment_sessions?.[0]?.provider_id}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {/* Total */}
      <Typography variant="h6" gutterBottom>
        Total: {total}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onPlaceOrder}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default OrderSummary;
