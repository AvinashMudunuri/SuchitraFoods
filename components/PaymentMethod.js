import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import {
  createPaymentCollection,
  getPaymentProviders,
  initPaymentSession,
} from '../pages/api/payment';
import { getCart } from '../pages/api/cart';

const PaymentMethod = ({ onNext, onBack }) => {
  const { cart, setCart } = useCart();
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(null);

  useEffect(() => {
    if (!cart) return;
    const getProviders = async () => {
      const data = await getPaymentProviders(cart.region_id);
      setPaymentProviders(data);
      if (data.length > 0) {
        setSelectedPaymentProvider(data[0].id);
      }
    };
    getProviders();
  }, [cart]);

  const handleSelectProvider = async (e) => {
    e.preventDefault();
    if (!cart || !selectedPaymentProvider) return;
    const cartId = localStorage.getItem('cart_id');

    let paymentCollectionId = cart.payment_collection?.id;

    if (!paymentCollectionId) {
      const paymentCollection = await createPaymentCollection(cartId);
      paymentCollectionId = paymentCollection.id;
    }

    const session = await initPaymentSession(
      paymentCollectionId,
      selectedPaymentProvider
    );
    console.log(session);

    const updatedCart = await getCart(cartId);
    setCart(updatedCart);
  };

  const getPaymentUI = useCallback(() => {
    const activePaymentSession =
      cart?.payment_collection?.payment_sessions?.[0];
    if (!activePaymentSession) return;
    switch (true) {
      case activePaymentSession.provider_id.startsWith('pp_system_paypal'):
        return (
          <span>
            You chose PayPal! You will be redirected to PayPal to complete your
            payment.
          </span>
        );
      case activePaymentSession.provider_id.startsWith('pp_system_default'):
        return (
          <span>You chose manual payment! No additional actions required.</span>
        );
      default:
        return (
          <span>
            You chose {activePaymentSession.provider_id} which is in
            development.
          </span>
        );
    }
  }, [cart]);

  return (
    <Box
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        mt: 4,
        mb: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Choose Payment Method
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={selectedPaymentProvider}
          onChange={(e) => setSelectedPaymentProvider(e.target.value)}
        >
          {paymentProviders.map((provider) => (
            <FormControlLabel
              key={provider.id}
              value={provider.id}
              control={<Radio />}
              label={provider.id}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Box sx={{ textAlign: 'right', mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedPaymentProvider}
          onClick={async (e) => {
            await handleSelectProvider(e);
          }}
        >
          Continue
        </Button>
      </Box>
      {getPaymentUI()}
      <Box sx={{ textAlign: 'right', mt: 1 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          By clicking Next, you agree to our terms and conditions.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          You will be charged $0.00 upon completing your order.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          disabled={!selectedPaymentProvider}
          onClick={() => onNext()}
        >
          Next
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedPaymentProvider}
          onClick={() => onBack()}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethod;
