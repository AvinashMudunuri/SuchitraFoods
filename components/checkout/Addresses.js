import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useActionState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid2 as Grid,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import ShippingAddresses from './ShippingAddresses';
import BillingAddresses from './BillingAddresses';
import { setAddresses } from '../../pages/api/cart';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { compareAddresses } from '../../utils';

const Addresses = ({ cart, setCart, customer, isAuthenticated }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sameAsBilling, setSameAsBilling] = useState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  );
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await setAddresses(prevState, formData);
    if (result.success) {
      setCart(result.cart);
      router.push('/checkout?step=delivery');
    }
    return result;
  }, null);

  const handleEdit = () => {
    router.push(pathname + '?step=address');
  };

  const handleSameAsBillingChange = (event) => {
    setSameAsBilling(event.target.checked);
  };

  const isOpen = searchParams.get('step') === 'address';
  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          Shipping Address
          {!isOpen && (
            <CheckCircleIcon sx={{ ml: 1, mb: -0.5, color: 'green' }} />
          )}
          {!isOpen && cart?.shipping_address && (
            <IconButton onClick={handleEdit}>
              <EditIcon sx={{ color: 'orangered', mb: 0.5 }} />
            </IconButton>
          )}
        </Typography>
        {isOpen ? (
          <form action={formAction}>
            <ShippingAddresses
              customer={customer}
              isAuthenticated={isAuthenticated}
              cart={cart}
              sameAsBilling={sameAsBilling}
              onChange={handleSameAsBillingChange}
            />
            {!sameAsBilling && (
              <>
                <Typography variant="body1" gutterBottom>
                  Billing Address
                </Typography>
                <BillingAddresses cart={cart} />
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SubmitButton
                data-testid="submit-address-button"
                variant="outlined"
                color="primary"
                sx={{ mt: 2, mb: 2 }}
              >
                Continue to delivery
              </SubmitButton>
              <ErrorMessage error={state?.error} />
            </Box>
          </form>
        ) : (
          <Box>
            {cart?.shipping_address && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Shipping Address</strong>
                  </Typography>
                  <Typography variant="body2">
                    {cart.shipping_address.first_name}{' '}
                    {cart.shipping_address.last_name}
                    {cart?.shipping_address?.company && (
                      <>
                        <br />
                        {cart.shipping_address.company}
                      </>
                    )}
                    <br />
                    {cart.shipping_address.address_1}
                    {cart.shipping_address.address_2 && (
                      <>
                        <br />
                        {cart.shipping_address.address_2}
                      </>
                    )}
                    <br />
                    {cart.shipping_address.city},{' '}
                    {cart.shipping_address.province}{' '}
                    {cart.shipping_address.postal_code}{' '}
                    {cart.shipping_address.country_code.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Contact</strong>
                  </Typography>
                  <Typography variant="body2">
                    {cart.email}
                    <br />
                    {cart.shipping_address.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Billing Address</strong>
                  </Typography>
                  {sameAsBilling ? (
                    <Typography variant="body2">
                      Billing- and delivery address are the same.
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      {cart.billing_address.first_name}{' '}
                      {cart.billing_address.last_name}
                      {cart.billing_address.company && (
                        <>
                          <br />
                          {cart.billing_address.company}
                        </>
                      )}
                      <br />
                      {cart.billing_address.address_1}
                      {cart.billing_address.address_2 && (
                        <>
                          <br />
                          {cart.billing_address.address_2}
                        </>
                      )}
                      <br />
                      {cart.billing_address.city},{' '}
                      {cart.billing_address.province}{' '}
                      {cart.billing_address.postal_code}{' '}
                      {cart.billing_address.country_code.toUpperCase()}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

Addresses.propTypes = {
  cart: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Addresses;
