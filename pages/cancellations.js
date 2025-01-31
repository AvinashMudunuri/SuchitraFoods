import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const Cancellations = () => {
  return (
    <>
      <Head>
        <title> Cancellations | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods Cancellations`} />
        <meta property="og:title" content={`Cancellations | Suchitra Foods`} />
        <meta
          property="og:description"
          content={`Suchitra Foods Cancellations`}
        />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/cancellations`}
        />
      </Head>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>Returns Policy</Typography>

          <Typography variant="h6">1. Returns</Typography>
          <Typography variant="body1" gutterBottom>We hope you love your purchase, but if you are not completely satisfied, we are here to help. Our return policy is straightforward and hassle-free.</Typography>

          <Typography variant="h6">2. Eligibility for Returns</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Items must be returned within [Insert number] days of receipt.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Items must be in their original condition, unused, unwashed, and with all original tags and packaging.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Proof of purchase is required for all returns.</Typography></li>
          </ul>

          <Typography variant="h6">3. Non-Returnable Items</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Items marked as final sale</Typography></li>
            <li><Typography variant="body1" gutterBottom>Gift cards</Typography></li>
            <li><Typography variant="body1" gutterBottom>Personalized or custom-made items</Typography></li>
            <li><Typography variant="body1" gutterBottom>Perishable goods</Typography></li>
          </ul>

          <Typography variant="h6">4. Return Process</Typography>
          <ol>
            <li><Typography variant="body1" gutterBottom><strong>Contact Us:</strong> Email us at connect@suchitrafoods.com with your order number and reason for return. We will provide you with a return authorization number and instructions on how to send your item back.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Pack Your Item:</strong> Securely pack your item in the original packaging, if possible. Include your proof of purchase and return authorization number.</Typography></li>
            <li><Typography variant="body1" gutterBottom><strong>Ship Your Return:</strong> Use the shipping label we provide or your own preferred method to send the item back to us. Please note that return shipping costs are the responsibility of the customer unless the item is defective or incorrect.</Typography></li>
          </ol>

          <Typography variant="h6">5. Refunds</Typography>
          <Typography variant="body1" gutterBottom>Once we receive your return, we will inspect the item and notify you of the status of your refund. If your return is approved, we will process a refund to your original method of payment within [Insert number] days. Please note that original shipping costs are non-refundable.</Typography>

          <Typography variant="h6">6. Exchanges</Typography>
          <Typography variant="body1" gutterBottom>If you need to exchange an item for a different size, color, or product, please follow the return process and place a new order for the item you want.</Typography>

          <Typography variant="h6">7. Damaged or Defective Items</Typography>
          <Typography variant="body1" gutterBottom>If you receive a damaged or defective item, please contact us immediately at connect@suchitrafoods.com. We will arrange for a replacement or refund, and cover any shipping costs associated with the return.</Typography>

          <Typography variant="h6">8. Contact Us</Typography>
          <Typography variant="body1" gutterBottom>If you have any questions or concerns about our return policy, please contact us at:</Typography>
          <Typography variant="body1" gutterBottom>Email: connect@suchitrafoods.com</Typography>
          <Typography variant="body1" gutterBottom>Phone: +91 7331130990</Typography>
        </Box>
      </Container>
    </>
  );
};

export default Cancellations;
