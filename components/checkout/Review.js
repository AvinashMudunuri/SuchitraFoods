import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
import { useRazorpay } from 'react-razorpay';
import { useCallback, useState } from 'react';
import { placeOrder } from '../../pages/api/cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import SubmitButton from '../SubmitButton';
import ErrorMessage from '../ErrorMessage';
import { useCart } from '../../context/CartContext';

const Review = ({ cart }) => {
  const { refreshCart } = useCart();
  const router = useRouter();
  const { Razorpay } = useRazorpay();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('step') === 'review';
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isManualPayment =
    cart?.payment_collection?.payment_sessions[0]?.provider_id ===
    'pp_system_default';

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard);

  const handlePayment = useCallback(async () => {
    const options = {
      callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? '',
      amount: cart?.payment_collection?.payment_sessions[0]?.amount * 100 * 100,
      order_id: cart?.payment_collection?.payment_sessions[0]?.data?.id,
      currency: cart.currency_code.toUpperCase(),
      name: process.env.COMPANY_NAME ?? 'SUCHITRA FOODS ',
      description: `Order number ${cart?.payment_collection?.payment_sessions[0]?.data?.id}`,
      remember_customer: true,

      image: 'https://example.com/your_logo',
      modal: {
        backdropclose: true,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: async () => {
          setSubmitting(false);
          setErrorMessage(`payment cancelled`);
          await onPaymentCancelled();
        },
        animation: true,
      },

      handler: async () => {
        onPaymentCompleted();
      },
      prefill: {
        name:
          cart.billing_address?.first_name +
          ' ' +
          cart?.billing_address?.last_name,
        email: cart?.email,
        contact: cart?.shipping_address?.phone ?? undefined,
      },
    };
    const razorpay = new Razorpay(options);
    console.log(cart?.payment_collection?.payment_sessions[0]?.data?.id);
    console.log(razorpay);
    if (cart?.payment_collection?.payment_sessions[0]?.data?.id) {
      razorpay.open();
      razorpay.on('payment.failed', function (response) {
        setErrorMessage(JSON.stringify(response.error));
      });
      razorpay.on('payment.authorized', function (response) {
        onPaymentCompleted();
      });
    }
  }, [
    Razorpay,
    cart?.billing_address?.first_name,
    cart?.billing_address?.last_name,
    cart?.currency_code,
    cart?.email,
    cart?.shipping_address?.phone,
    cart?.payment_collection?.payment_sessions[0]?.amount,
    cart?.payment_collection?.payment_sessions[0]?.provider_id,
    cart?.payment_collection?.payment_sessions[0]?.data?.id,
  ]);

  const onPaymentCompleted = async () => {
    console.log('Placing order...');
    setSubmitting(true);
    const orderResponse = await placeOrder(cart.id);
    if (orderResponse.type === 'cart' && orderResponse?.cart) {
      console.log('Order Failed');
      setSubmitting(false);
      toast.error('Order failed. Please try again.');
    } else if (orderResponse.type === 'order' && orderResponse?.order) {
      console.log('Order Placed', orderResponse?.order);
      setSubmitting(false);
      toast.success('Order placed successfully!');
      refreshCart();
      router.push({
        pathname: '/order-success',
        query: {
          order_id: orderResponse?.order?.id,
        },
      });
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6">Review</Typography>
      {isOpen && previousStepsCompleted && (
        <>
          <Box>
            <Typography variant="body1">
              By clicking the Place Order button, you confirm that you have
              read, understand and accept our Terms of Use, Terms of Sale and
              Returns Policy and acknowledge that you have read Suchitra Foods
              Privacy Policy.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SubmitButton
              onClick={isManualPayment ? onPaymentCompleted : handlePayment}
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </SubmitButton>
            <ErrorMessage error={errorMessage} />
          </Box>
        </>
      )}
    </Box>
  );
};

Review.propTypes = {
  cart: PropTypes.object.isRequired,
};

export default Review;
