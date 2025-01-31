import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const Shipping = () => {
  return (
    <>
      <Head>
        <title> Shipping | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods Shipping`} />
        <meta property="og:title" content={`Shipping | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods Shipping`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/shipping`}
        />
      </Head>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>Shipping & Delivery Policy</Typography>

          <Typography variant="h6">1. Introduction</Typography>
          <Typography variant="body1" gutterBottom>At www.suchitraindustries.com, we offer a variety of shipping options to meet your needs. Here's a detailed overview of our shipping policies:</Typography>

          <Typography variant="h6">2. Shipping Rates & Delivery Estimates</Typography>
          <Typography variant="body1" gutterBottom>Shipping charges for your order will be calculated and displayed at checkout. We strive to ensure timely delivery of your order with the following shipping methods:</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom><strong>Standard Shipping:</strong> [Insert number of business days]</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Express Shipping:</strong> [Insert number of business days]</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>International Shipping:</strong> [Insert number of business days]</Typography></li>
          </ul>
          <Typography variant="body1" gutterBottom>Please note that delivery times are estimates and actual delivery times may vary.</Typography>

          <Typography variant="h6">3. Order Processing Time</Typography>
          <Typography variant="body1" gutterBottom>All orders are processed within [Insert number of business days] business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</Typography>

          <Typography variant="h6">4. Shipping Confirmation & Order Tracking</Typography>
          <Typography variant="body1" gutterBottom>You will receive a Shipping Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</Typography>

          <Typography variant="h6">5. Customs, Duties, and Taxes</Typography>
          <Typography variant="body1" gutterBottom>www.suchitraindustries.com is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</Typography>

          <Typography variant="h6">6. Damages</Typography>
          <Typography variant="body1" gutterBottom>www.suchitraindustries.com is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.</Typography>

          <Typography variant="h6">7. International Shipping Policy</Typography>
          <Typography variant="body1" gutterBottom>We currently do/do not ship outside India. [Provide details about your international shipping policies if applicable.]</Typography>

          <Typography variant="h6">8. Returns Policy</Typography>
          <Typography variant="body1" gutterBottom>Our [Insert your Returns Policy link] provides detailed information about options and procedures for returning your order.</Typography>

          <Typography variant="h6">9. Contact Us</Typography>
          <Typography variant="body1" gutterBottom>If you have any questions or concerns regarding our Shipping Policy, please contact us at:</Typography>
          <Typography variant="body1" gutterBottom >Email: connect@suchitrafoods.com</Typography>
          <Typography variant="body1" gutterBottom >Phone: 7331130990</Typography>
        </Box>
      </Container>
    </>
  );
};

export default Shipping;
