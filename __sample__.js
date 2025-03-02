// ... existing imports ...
import {
  Container,
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const CheckoutContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1440px',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const StepContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  '&:last-child': {
    marginBottom: 0,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const StickyBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(4),
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    position: 'static',
    marginTop: theme.spacing(3),
  },
}));

const OrderSummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
}));

const CheckoutPage = () => {
  // ... existing state and hooks ...

  return (
    <CheckoutContainer>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Main Checkout Content */}
        <Grid item xs={12} md={7} lg={8}>
          <ContentWrapper>
            <StepContainer>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Shipping Address
              </Typography>
              <Addresses
                cart={cart}
                setCart={setCart}
                customer={customer}
                isAuthenticated={isAuthenticated}
              />
            </StepContainer>

            <StepContainer>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Shipping Method
              </Typography>
              <Shipping
                cart={cart}
                setCart={setCart}
                availableShippingMethods={shippingMethods}
              />
            </StepContainer>

            <StepContainer>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Payment Method
              </Typography>
              <Payment
                cart={cart}
                setCart={setCart}
                availablePaymentMethods={paymentMethods}
              />
            </StepContainer>

            <StepContainer>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Review Order
              </Typography>
              <Review cart={cart} />
            </StepContainer>
          </ContentWrapper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={5} lg={4}>
          <StickyBox>
            <OrderSummaryCard>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Order Summary
              </Typography>

              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cart?.currency_code,
                    })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {convertToLocale({
                      amount: shipping,
                      currency_code: cart?.currency_code,
                    })}
                  </Typography>
                </Box>

                {discount > 0 && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography color="text.secondary">Discount</Typography>
                    <Typography
                      color="error.main"
                      variant="subtitle1"
                      fontWeight="medium"
                    >
                      -
                      {convertToLocale({
                        amount: discount,
                        currency_code: cart?.currency_code,
                      })}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Box>
                    <Typography variant="h6" color="primary.main">
                      {convertToLocale({
                        amount: total,
                        currency_code: cart?.currency_code,
                      })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Including GST
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Place Order
                </Button>
              </Stack>
            </OrderSummaryCard>
          </StickyBox>
        </Grid>
      </Grid>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
