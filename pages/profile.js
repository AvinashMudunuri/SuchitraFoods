import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import Head from 'next/head';
import PersonalDetails from '../components/account/PersonalDetails';
import OrderHistory from '../components/account/OrderHistory';
import ManageAddress from '../components/account/ManageAddress';
import { useAuth } from '../context/AuthContext';
import { useRegion } from '../context/RegionContext';
import { listOrders } from './api/orders';
import { useRouter } from 'next/router';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { customer, setCustomer } = useAuth();
  const { countries } = useRegion();
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(50);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();

  useEffect(() => {
    if (router.query.tab === 'orders') {
      setActiveTab(2);
    }
  }, [router.query.tab]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders, count, offset: offsetResponse, limit: limitResponse } = await listOrders(limit, offset);
        setOrders(orders);
        setCount(count);
        setOffset(offsetResponse);
        setLimit(limitResponse);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (router.query.tab) {
      router.replace('/profile', undefined, { shallow: true });
    }
  };


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

      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          {/* Header with welcome message */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              My Profile
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, {customer?.firstName || 'Guest'}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>

          {/* Responsive Tabs */}
          <Paper
            elevation={2}
            sx={{
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              scrollButtons={!isMobile && "auto"}
              aria-label="Profile sections"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Tab
                label="Personal Details"
                sx={{ textTransform: 'none' }}
              />
              <Tab
                label="Manage Address"
                sx={{ textTransform: 'none' }}
              />
              <Tab
                label="Order History"
                sx={{ textTransform: 'none' }}
              />
            </Tabs>
          </Paper>

          {/* Content with better spacing and layout */}
          <Box sx={{
            minHeight: '60vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            boxShadow: 1
          }}>
            {activeTab === 0 && (
              <PersonalDetails
                customer={customer}
                setCustomer={setCustomer}
              />
            )}
            {activeTab === 1 && (
              <ManageAddress customer={customer} countries={countries} />
            )}
            {activeTab === 2 && (
              <OrderHistory orders={orders} count={count} offset={offset} limit={limit} />
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
