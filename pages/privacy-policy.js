import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title> Privacy Policy | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods Privacy Policy`} />
        <meta property="og:title" content={`Privacy Policy | Suchitra Foods`} />
        <meta
          property="og:description"
          content={`Suchitra Foods Privacy Policy`}
        />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/privacy-policy`}
        />
      </Head>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>Privacy Policy</Typography>

          <Typography variant="h6">1. Introduction</Typography>
          <Typography variant="body1" gutterBottom>Suchitrafoods.com is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website...</Typography>

          <Typography variant="h6">2. Information We Collect</Typography>
          <Typography variant="body1" gutterBottom>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom><strong>Personal Data:</strong> Information such as your name, shipping address, email address, and telephone number.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Derivative Data:</strong> Information our servers automatically collect such as your IP address, browser type, and access times.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Financial Data:</strong> Payment method details for transactions.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Mobile Device Data:</strong> Device information including model, ID, and location if accessed via mobile.</Typography></li>
          </ul>

          <Typography variant="h6">3. Use of Your Information</Typography>
          <Typography variant="body1" gutterBottom>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use collected information to:</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Create and manage your account.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Process transactions and send order details.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Communicate about services and promotions.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Compile anonymous statistical data for analysis.</Typography></li>
          </ul>

          <Typography variant="h6">4. Disclosure of Your Information</Typography>
          <Typography variant="body1" gutterBottom>We may share information in specific situations:</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom><strong>By Law or to Protect Rights:</strong> If required by law or to enforce policies.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Third-Party Service Providers:</strong> For payment processing, data analysis, and marketing assistance.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Affiliates:</strong> Companies under common control with us.</Typography></li>
          </ul>

          <Typography variant="h6">5. Data Security</Typography>
          <Typography variant="body1" gutterBottom>We implement security measures to protect your personal information. However, no security system is impenetrable.</Typography>

          <Typography variant="h6">6. Policy Changes</Typography>
          <Typography variant="body1" gutterBottom>We may update this policy periodically. Please review it from time to time.</Typography>

          <Typography variant="h6">7. Contact Us</Typography>
          <Typography variant="body1" gutterBottom>If you have any questions, feel free to contact us.</Typography>
          <Typography variant="body1" gutterBottom >Email: connect@suchitrafoods.com</Typography>
          <Typography variant="body1" gutterBottom >Phone: 7331130990</Typography>
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
