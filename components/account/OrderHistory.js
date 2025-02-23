import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Pagination,
} from '@mui/material';
import PropTypes from 'prop-types';
import { convertToLocale } from '../../utils';
import { useRouter } from 'next/router';

const OrderHistory = ({ orders, count, offset, limit }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error',
    };
    return statusColors[status.toLowerCase()] || 'default';
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Order History</Typography>

      <Grid container spacing={3}>
        {orders.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="body1" textAlign="center">
                  No orders found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2">Order #{order.display_id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2">Total Amount</Typography>
                      <Typography variant="body2">{convertToLocale({
                        amount: order.total,
                        currency_code: order.currency_code,
                      })}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => router.push(`/orders/${order.id}`)}
                        fullWidth={isMobile}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {/* <Pagination
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 2,
        }}
        count={count}
        page={offset / limit + 1}
        onChange={(event, value) => router.push(`/profile?offset=${(value - 1) * limit}`)}
      /> */}
    </Box>
  );
};

OrderHistory.propTypes = {
  orders: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

export default OrderHistory;
