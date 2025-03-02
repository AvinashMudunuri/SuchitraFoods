import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { initPaymentSession } from '../../pages/api/payment';
import { getCart } from '../../pages/api/cart';
import { useCart } from '../../context/CartContext';
import { paymentInfoMap } from '../../utils';

const Payment = ({ cart, availablePaymentMethods }) => {
  const { setCart } = useCart();
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === 'pending'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ''
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get('step') === 'payment';

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard;

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleEdit = () => {
    router.push(pathname + '?' + createQueryString('step', 'payment'), {
      scroll: false,
    });
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const getUpdatedCart = async () => {
    const response = await getCart(cart?.id);
    setCart(response);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!activeSession) {
        const payment_collection = await initPaymentSession(
          cart,
          selectedPaymentMethod
        );
        payment_collection?.payment_sessions[0]?.data?.id &&
          (await getUpdatedCart());
      }
      router.push(pathname + '?' + createQueryString('step', 'review'), {
        scroll: false,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <>
      <Box>
        <Typography variant="h6">
          Payment
          {!isOpen && paymentReady && (
            <CheckCircleIcon sx={{ ml: 1, mb: -0.5, color: 'green' }} />
          )}
          {!isOpen && paymentReady && (
            <IconButton onClick={handleEdit}>
              <EditIcon sx={{ color: 'orangered', mb: 0.5 }} />
            </IconButton>
          )}
        </Typography>
        {isOpen && !paidByGiftcard && availablePaymentMethods.length > 0 && (
          <Box>
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
            >
              {availablePaymentMethods.map((method) => (
                <FormControlLabel
                  key={method.id}
                  value={method.id}
                  control={<Radio />}
                  label={paymentInfoMap[method.id]?.title}
                />
              ))}
            </RadioGroup>
            <Box>
              <SubmitButton
                variant="outlined"
                color="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!selectedPaymentMethod}
              >
                Continue to review
              </SubmitButton>
              <ErrorMessage error={error} />
            </Box>
          </Box>
        )}
        {!isOpen && activeSession && paymentReady && (
          <Typography variant="body1">
            Payment method selected:{' '}
            {paymentInfoMap[activeSession.provider_id]?.title}
          </Typography>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

Payment.propTypes = {
  cart: PropTypes.object.isRequired,
  availablePaymentMethods: PropTypes.array.isRequired,
};

export default Payment;
