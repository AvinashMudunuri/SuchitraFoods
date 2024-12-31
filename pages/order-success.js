import React from 'react';
import {
  Container,
  Grid2 as Grid,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  CardMedia,
  Button,
  Link,
} from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import Head from 'next/head';
import PropTypes from 'prop-types';
import medusaClient from '../lib/medusa';

export const getServerSideProps = async (context) => {
  const { order_id } = context.query;

  if (!order_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const { order } = await medusaClient.orders.retrieve(order_id);

    if (!order) {
      return {
        props: {
          order: null,
          error: 'Order not found',
        },
      };
    }

    return {
      props: {
        order,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching order:', error);

    return {
      props: {
        order: null,
        error: 'Failed to fetch order details',
      },
    };
  }
};

const OrderSuccessPage = ({ order, error }) => {
  console.log(`order`, order);
  const subtotal = order?.item_total || 0;
  const shippingTotal = order?.shipping_total || 0;
  const discountTotal = order?.discount_total || 0;
  const total = order?.total || 0;
  return (
    <>
      <Head>
        <title> Order Success | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods`} />
        <meta property="og:title" content={`Order Success | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/order-success`}
        />
      </Head>
      <Container sx={{ mt: 4 }}>
        {error ? (
          <Typography variant="h4" gutterBottom>
            {error}
          </Typography>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                Thank you!
              </Typography>
              <Typography variant="h6" gutterBottom>
                Your order was placed successfully.
              </Typography>
              <Typography variant="body1" gutterBottom>
                We have sent the order confirmation details to{' '}
                <strong>{order?.email}</strong>.
              </Typography>
              <Typography variant="body1" gutterBottom>
                Order date:{' '}
                <strong>{new Date(order?.created_at).toDateString()}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Order number: <strong>{order?.display_id}</strong>
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h5" gutterBottom>
              Summary
            </Typography>
            <TableContainer component={Paper} sx={{ flex: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      Weight
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardMedia
                            component="img"
                            image={item.thumbnail}
                            alt={item.product_title}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mr: 2,
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle1">
                              {item.product_title}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          {item.variant_title}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          ₹{item.unit_price * item.quantity}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="left">
                    <Typography variant="subtitle2">
                      Subtotal (excl. shipping and taxes)
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">
                      <strong>₹{subtotal}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
                {!!discountTotal && (
                  <TableRow>
                    <TableCell align="left">
                      <Typography variant="subtitle2">Discount:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        - <strong>₹{discountTotal}</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell align="left">
                    <Typography variant="subtitle2">Shipping:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">
                      <strong>₹{shippingTotal}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left">
                    <Typography variant="subtitle2">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">
                      <strong>₹{total}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              Delivery Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              {order?.shipping_address.first_name}{' '}
              {order?.shipping_address.last_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {order?.shipping_address.address_1}
            </Typography>
            {order?.shipping_address.address_2 && (
              <Typography variant="body1" gutterBottom>
                {order?.shipping_address.address_2}
              </Typography>
            )}
            <Typography variant="body1" gutterBottom>
              {order?.shipping_address.city}, {order?.shipping_address.province}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {order?.shipping_address.postal_code},{' '}
              {order?.shipping_address?.country_code?.toUpperCase()}{' '}
            </Typography>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body1" gutterBottom>
              {order?.shipping_address.phone}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {order?.email}
            </Typography>
            {order?.shipping_methods.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom>
                  Shipping Method
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {`${order?.shipping_methods[0]?.name} - ₹${order?.shipping_methods[0]?.total}`}
                </Typography>
              </>
            )}
            <Divider sx={{ my: 4 }} />
            {order.payment_collections?.[0].payments?.[0] && (
              <>
                <Typography variant="h5" gutterBottom>
                  Payment
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Payment method{' '}
                  {`${order.payment_collections?.[0].payments?.[0].provider_id}`}
                </Typography>
              </>
            )}
            <Divider sx={{ my: 4 }} />
            {/* Continue Shopping Button - Below Table */}
            <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
              <Button
                component={Link}
                href="/products"
                variant="outlined"
                startIcon={<ShoppingBag />}
                size="large"
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

OrderSuccessPage.propTypes = {
  order: PropTypes.object,
  error: PropTypes.string,
};

export default OrderSuccessPage;
