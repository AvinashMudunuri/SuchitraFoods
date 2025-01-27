import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid2 as Grid,
  Paper,
} from '@mui/material';
import Head from 'next/head';
import PersonalDetails from '../components/account/PersonalDetails';
import OrderHistory from '../components/account/OrderHistory';
import ManageAddress from '../components/account/ManageAddress';
import { useAuth } from '../context/AuthContext';
import { listOrders } from './api/orders';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const { customer, setCustomer } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await listOrders();
        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  return (
    <>
      <Head>
        <title> My Profile | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods My Profile`} />
        <meta property="og:title" content={`My Profile| Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods My Profile`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/profile`}
        />
      </Head>

      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        {/* Tabs for Sections */}
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Profile sections"
          >
            <Tab label="Personal Details" />
            <Tab label="Manage Address" />
            <Tab label="Order History" />
          </Tabs>
        </Paper>

        {/* Content */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {activeTab === 0 && (
              <Box>
                <PersonalDetails
                  customer={customer}
                  setCustomer={setCustomer}
                />
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                <ManageAddress />
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <OrderHistory orders={orders} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfilePage;
