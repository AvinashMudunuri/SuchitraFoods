import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {
  Container,
  Typography,
  Divider,
  CardMedia,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  useTheme,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import { retrieveOrder } from '../api/orders';
import { convertToLocale } from '../../utils'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ReceiptIcon from '@mui/icons-material/Receipt'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PaymentIcon from '@mui/icons-material/Payment'
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormattedPhoneNumber } from '../../utils';

export async function getServerSideProps({ params }) {
  const { id } = params;
  const order = await retrieveOrder(id);
  return { props: { order } };
}

const LineItem = ({ label, amount, isNegative = false, bold = false, currency_code }) => {
  return (
    <ListItem sx={{ px: 0, py: 1 }}>
      <ListItemText
        primary={
          <Typography
            variant={bold ? "subtitle1" : "body1"}
            fontWeight={bold ? "bold" : "regular"}
          >
            {label}
          </Typography>
        }
      />
      <Typography
        variant={bold ? "subtitle1" : "body1"}
        fontWeight={bold ? "bold" : "regular"}
        color={isNegative ? "error.main" : "text.primary"}
      >
        {isNegative && "- "}{convertToLocale({
          amount,
          currency_code,
        })}
      </Typography>
    </ListItem>
  )
}

LineItem.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  isNegative: PropTypes.bool,
  bold: PropTypes.bool,
  currency_code: PropTypes.string,
}

const OrderDetails = ({ order }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleBackToOrders = () => {
    router.push({
      pathname: '/profile',
      query: { tab: 'orders' },
    });
  };

  const formatStatus = (str) => {
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  console.log(`order`, order);
  return (
    <>
      <Head>
        <title> Order Details | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods`} />
        <meta property="og:title" content={`Order Details | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/orders/${order.id}`}
        />
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            onClick={handleBackToOrders}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Orders
          </Button>
          <Typography variant="h4">Order Details</Typography>
        </Box>
        <Divider />
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.default
          }}
        >
          <Stack spacing={2}>
            {/* Order Confirmation Message */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="action" />
              <Typography>
                We have sent the order confirmation details to{" "}
                <Typography
                  component="span"
                  fontWeight="medium"
                  color="text.primary"
                  data-testid="order-email"
                >
                  {order.email}
                </Typography>
              </Typography>
            </Box>

            {/* Order Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon color="action" />
              <Typography>
                Order date:{" "}
                <Typography
                  component="span"
                  data-testid="order-date"
                >
                  {new Date(order.created_at).toDateString()}
                </Typography>
              </Typography>
            </Box>

            {/* Order Number */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLongIcon color="primary" />
              <Typography color="primary">
                Order number:{" "}
                <Typography
                  component="span"
                  color="primary"
                  data-testid="order-id"
                >
                  {order.display_id}
                </Typography>
              </Typography>
            </Box>

            {/* Status Section */}
            <Grid
              container
              spacing={2}
              sx={{
                mt: 2,
                alignItems: 'center'
              }}
            >
              {/* Fulfillment Status */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShippingIcon color="action" fontSize="small" />
                  <Typography variant="body2">
                    Order status:{" "}
                    <Chip
                      label={formatStatus(order.fulfillment_status)}
                      size="small"
                      color="default"
                      data-testid="order-status"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>

              {/* Payment Status */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon color="action" fontSize="small" />
                  <Typography variant="body2">
                    Payment status:{" "}
                    <Chip
                      label={formatStatus(order.payment_status)}
                      size="small"
                      color="default"
                      data-testid="order-payment-status"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Order Items
        </Typography>
        <Divider />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CardMedia
                        component="img"
                        image={item.thumbnail}
                        alt={item.product_title}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Typography variant="subtitle1">{item.product_title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{item.variant_title}</Typography>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {convertToLocale({
                      amount: item.unit_price,
                      currency_code: order.currency_code,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            my: 3
          }}>
            <LocalShippingIcon />
            <Typography variant="h4">
              Delivery
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Shipping Address */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: '100%',
                  backgroundColor: theme.palette.background.default
                }}
                data-testid="shipping-address-summary"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Shipping Address
                </Typography>
                <Typography color="text.secondary">
                  {order.shipping_address?.first_name}{" "}
                  {order.shipping_address?.last_name}
                </Typography>
                <Typography color="text.secondary">
                  {order.shipping_address?.address_1}{" "}
                  {order.shipping_address?.address_2}
                </Typography>
                <Typography color="text.secondary">
                  {order.shipping_address?.postal_code},{" "}
                  {order.shipping_address?.city}
                </Typography>
                <Typography color="text.secondary">
                  {order.shipping_address?.country_code?.toUpperCase()}
                </Typography>
              </Paper>
            </Grid>
            { /* Billing Address */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: '100%',
                  backgroundColor: theme.palette.background.default
                }}
                data-testid="billing-address-summary"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Billing Address
                </Typography>
                <Typography color="text.secondary">
                  {order.billing_address?.first_name}{" "}
                  {order.billing_address?.last_name}
                </Typography>
                <Typography color="text.secondary">
                  {order.billing_address?.address_1}{" "}
                  {order.billing_address?.address_2}
                </Typography>
                <Typography color="text.secondary">
                  {order.billing_address?.postal_code},{" "}
                  {order.billing_address?.city}
                </Typography>
                <Typography color="text.secondary">
                  {order.billing_address?.country_code?.toUpperCase()}
                </Typography>
              </Paper>
            </Grid>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: '100%',
                  backgroundColor: theme.palette.background.default
                }}
                data-testid="shipping-contact-summary"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Contact
                </Typography>
                <Box sx={{ mb: 1 }}>
                  {FormattedPhoneNumber(
                    order.shipping_address?.phone,
                    order.shipping_address?.country_code
                  )}
                </Box>
                <Typography color="text.secondary">
                  {order.email}
                </Typography>
              </Paper>
            </Grid>

            {/* Shipping Method */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: '100%',
                  backgroundColor: theme.palette.background.default
                }}
                data-testid="shipping-method-summary"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Method
                </Typography>
                <Typography color="text.secondary">
                  {order.shipping_methods[0]?.name}{" "}
                  ({convertToLocale({
                    amount: order.shipping_methods?.[0].total ?? 0,
                    currency_code: order.currency_code,
                  })})
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.default
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReceiptIcon />
            <Typography variant="h6">
              Order Summary
            </Typography>
          </Box>
          <List disablePadding>
            <LineItem label="Subtotal" amount={order.item_total} currency_code={order.currency_code} />
            {order.discount_total > 0 && (
              <LineItem label="Discount" amount={order.discount_total} isNegative currency_code={order.currency_code} />
            )}
            {order.gift_card_total > 0 && (
              <LineItem label="Gift Card" amount={order.gift_card_total} isNegative currency_code={order.currency_code} />
            )}

            <LineItem label="Shipping" amount={order.shipping_total ?? 0} currency_code={order.currency_code} />
            {order.tax > 0 && (
              <LineItem label="Tax" amount={order.tax} currency_code={order.currency_code} />
            )}
            <Divider
              sx={{
                my: 2,
                borderStyle: 'dashed'
              }}
            />
            <LineItem label="Total" amount={order.total} bold currency_code={order.currency_code} />
          </List>
        </Paper>
      </Container>
    </>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderDetails;
