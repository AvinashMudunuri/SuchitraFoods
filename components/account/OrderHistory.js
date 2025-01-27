import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Link,
  Paper,
  Button,
  Grid2 as Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { convertToLocale } from '../../utils';

const OrderHistory = ({ orders }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent orders
      </Typography>
      <Box
        component="ul"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          listStyle: 'none',
        }}
        data-testid="orders-wrapper"
      >
        {orders && orders.length > 0 ? (
          orders.slice(0, 5).map((order) => (
            <li
              key={order.id}
              data-testid="order-wrapper"
              data-value={order.id}
              style={{
                textDecoration: 'none',
              }}
            >
              <Link href={`/orders/${order.id}`}>
                <Paper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Date placed
                        </Typography>
                        <Typography
                          variant="body2"
                          data-testid="order-created-date"
                        >
                          {new Date(order.created_at).toDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Order number
                        </Typography>
                        <Typography
                          variant="body2"
                          data-testid="order-id"
                          data-value={order.display_id}
                        >
                          #{order.display_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Total amount
                        </Typography>
                        <Typography variant="body2" data-testid="order-amount">
                          {convertToLocale({
                            amount: order.total,
                            currency_code: order.currency_code,
                          })}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button data-testid="open-order-button">
                      <Box component="span" sx={{ display: 'none' }}>
                        Go to order #{order.display_id}
                      </Box>
                      <ChevronRightIcon />
                    </Button>
                  </Box>
                </Paper>
              </Link>
            </li>
          ))
        ) : (
          <Typography variant="body1" data-testid="no-orders-message">
            No recent orders
          </Typography>
        )}
      </Box>
    </Box>
  );
};

OrderHistory.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrderHistory;
