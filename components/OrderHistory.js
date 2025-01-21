import React from 'react';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getLoggedInCustomerOrders } from '../pages/api/customer';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchLoggedInUserOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = await getLoggedInCustomerOrders(token);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchLoggedInUserOrders();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Order History
      </Typography>
      {orders.map((order) => (
        <Box key={order.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
          <Typography variant="subtitle1">Order ID: {order.id}</Typography>
          {/* <Typography>Date: {order.date}</Typography>
          <Typography>Total: ${order.total}</Typography>
          <Typography>Status: {order.status}</Typography> */}
        </Box>
      ))}
    </Box>
  );
};

export default OrderHistory;
