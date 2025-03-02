import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { addShippingOptionToCart } from '../../pages/api/cart';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { convertToLocale } from '../../utils';

const Shipping = ({ cart, setCart, availableShippingMethods }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingMethodId, setShippingMethodId] = useState(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get('step') === 'delivery';

  const selectedShippingMethod = availableShippingMethods?.find(
    // To do: remove the previously selected shipping method instead of using the last one
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  );

  const handleEdit = () => {
    router.push(pathname + '?step=delivery', { scroll: false });
  };

  const handleSubmit = () => {
    router.push(pathname + '?step=payment', { scroll: false });
  };

  const handleSetShippingMethod = async (id) => {
    setError(null);
    let currentId;
    setIsLoading(true);
    setShippingMethodId((prev) => {
      currentId = prev;
      return id;
    });

    await addShippingOptionToCart(cart.id, { shippingMethodId: id })
      .then((res) => {
        setCart(res);
      })
      .catch((err) => {
        setShippingMethodId(currentId);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleIcon sx={{ ml: 1, mb: -0.5, color: 'green' }} />
          )}
          {!isOpen &&
            cart?.shipping_address &&
            cart?.billing_address &&
            cart?.email && (
              <IconButton onClick={handleEdit}>
                <EditIcon sx={{ color: 'orangered', mb: 0.5 }} />
              </IconButton>
            )}
        </Typography>
        {isOpen ? (
          <Box>
            <RadioGroup
              value={shippingMethodId}
              onChange={(e) => handleSetShippingMethod(e.target.value)}
            >
              {availableShippingMethods.map((method) => (
                <FormControlLabel
                  key={method.id}
                  value={method.id}
                  control={<Radio />}
                  label={`${method.name} - ₹${method.amount}`}
                />
              ))}
            </RadioGroup>
            <SubmitButton
              onClick={handleSubmit}
              disabled={!cart.shipping_methods?.[0]}
              variant="outlined"
              color="primary"
              isLoading={isLoading}
              sx={{ mt: 2, mb: 2 }}
            >
              Continue to payment
            </SubmitButton>
            <ErrorMessage error={error} />
          </Box>
        ) : (
          <Box>
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <Typography variant="body1" gutterBottom>
                Shipping Method: {selectedShippingMethod?.name}
                <br />
                Price:{' '}
                {convertToLocale({
                  amount: selectedShippingMethod?.amount,
                  currency_code: cart?.currency_code,
                })}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

Shipping.propTypes = {
  cart: PropTypes.object.isRequired,
  availableShippingMethods: PropTypes.array.isRequired,
};

export default Shipping;
