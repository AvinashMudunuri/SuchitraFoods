import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const InternationalShipping = () => {
    return (
        <>
            <Head>
                <title> International Shipping | Suchitra Foods</title>
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
                    <Typography variant="h4" >International Shipping Policy</Typography>

                    <Typography variant="h6" >1. Introduction</Typography>
                    <Typography variant="body1" gutterBottom >At www.suchitrafoods.com, we are proud to offer international shipping to many countries worldwide. Here’s a detailed overview of our international shipping policies:</Typography>

                    <Typography variant="h6" >2. Shipping Rates & Delivery Estimates</Typography>
                    <Typography variant="body1" gutterBottom >Shipping charges for your order will be calculated and displayed at checkout. Delivery times vary based on your location and the shipping method you choose. Here's what you can expect:</Typography>
                    <ul>
                        <li><Typography variant="body1" gutterBottom ><strong>Standard International Shipping:</strong> [Insert number of business days]</Typography></li>
                        <li><Typography variant="body1" gutterBottom ><strong>Express International Shipping:</strong> [Insert number of business days]</Typography></li>
                    </ul>
                    <Typography variant="body1" gutterBottom >Please note that these are estimated delivery times and actual delivery times may vary based on customs processing and other factors.</Typography>

                    <Typography variant="h6" >3. Customs, Duties, and Taxes</Typography>
                    <Typography variant="body1" gutterBottom >www.suchitrafoods.com is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.). We recommend contacting your local customs office for more information.</Typography>

                    <Typography variant="h6" >4. Order Processing Time</Typography>
                    <Typography variant="body1" gutterBottom >All international orders are processed within [Insert number of business days] business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</Typography>

                    <Typography variant="h6" >5. Shipping Confirmation & Order Tracking</Typography>
                    <Typography variant="body1" gutterBottom >You will receive a Shipping Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</Typography>

                    <Typography variant="h6" >6. Restricted Items</Typography>
                    <Typography variant="body1" gutterBottom >Certain items may not be eligible for international shipping due to restrictions in various countries. You will be notified at checkout if an item in your cart is not eligible for international shipment.</Typography>

                    <Typography variant="h6" >7. Lost or Damaged Shipments</Typography>
                    <Typography variant="body1" gutterBottom >www.suchitrafoods.com is not liable for any products lost or damaged during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.</Typography>

                    <Typography variant="h6" >8. Returns & Refunds</Typography>
                    <Typography variant="body1" gutterBottom >Our Returns Policy provides detailed information about options and procedures for returning your order.</Typography>

                    <Typography variant="h6" >9. Contact Us</Typography>
                    <Typography variant="body1" gutterBottom >If you have any questions or concerns regarding our International Shipping Policy, please contact us at:</Typography>
                    <Typography variant="body1" gutterBottom >Email: connect@suchitrafoods.com</Typography>
                    <Typography variant="body1" gutterBottom >Phone: 7386360990</Typography>
                </Box>
            </Container>
        </>
    );
};

export default InternationalShipping;
