import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const Faq = () => {
    return (
        <>
            <Head>
                <title> FAQ | Suchitra Foods</title>
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
                    <Typography variant="h4" gutterBottom>Frequently Asked Questions (FAQ)
                    </Typography>

                    <Typography variant="h6">1. What is www.suchitraindustries.com?</Typography>
                    <Typography variant="body1" gutterBottom>
                        www.suchitraindustries.com is [brief description of your website and what it offers].
                    </Typography>

                    <Typography variant="h6">2. How do I create an account?</Typography>
                    <Typography variant="body1" gutterBottom>
                        To create an account, click on the "Sign Up" button at the top right corner of the homepage. Fill in the required information and submit the form. You will receive a confirmation email with a link to activate your account.
                    </Typography>

                    <Typography variant="h6">3. What payment methods do you accept?</Typography>
                    <Typography variant="body1" gutterBottom>
                        We accept the following payment methods:
                    </Typography>
                    <ul>
                        <li><Typography variant="body1" gutterBottom>Credit/Debit cards (Visa, MasterCard, American Express, etc.)</Typography></li>
                        <li><Typography variant="body1" gutterBottom>PayPal</Typography></li>
                        <li><Typography variant="body1" gutterBottom>[Any other payment methods you accept]</Typography></li>
                    </ul>

                    <Typography variant="h6">4. How can I track my order?</Typography>
                    <Typography variant="body1" gutterBottom>
                        Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this tracking number to check the status of your delivery on our website or the courier's website.
                    </Typography>

                    <Typography variant="h6">5. What is your return policy?</Typography>
                    <Typography variant="body1" gutterBottom>
                        You can find detailed information about our return policy <a href="#">here</a>. We accept returns within [number] days of receipt, provided the items are in their original condition.
                    </Typography>

                    <Typography variant="h6">6. Do you ship internationally?</Typography>
                    <Typography variant="body1" gutterBottom>
                        Yes, we ship to many countries worldwide. Please refer to our <a href="#">Shipping Policy</a> for more information on international shipping rates and delivery times.
                    </Typography>

                    <Typography variant="h6">7. How can I contact customer service?</Typography>
                    <Typography variant="body1" gutterBottom>
                        You can reach our customer service team by emailing <a href="mailto:connect@suchitrafoods.com">connect@suchitrafoods.com</a> or calling +91 7331130990. Our team is available [days and hours of operation].
                    </Typography>

                    <Typography variant="h6">8. Can I change or cancel my order?</Typography>
                    <Typography variant="body1" gutterBottom>
                        If you need to change or cancel your order, please contact us as soon as possible at <a href="mailto:connect@suchitrafoods.com">connect@suchitrafoods.com</a>. We will do our best to accommodate your request before the order is processed and shipped.
                    </Typography>

                    <Typography variant="h6">9. Are my personal details safe with you?</Typography>
                    <Typography variant="body1" gutterBottom>
                        Yes, we take your privacy and security seriously. Please refer to our <a href="#">Privacy Policy</a> for detailed information on how we handle your personal data.
                    </Typography>

                    <Typography variant="h6">10. Do you offer gift cards?</Typography>
                    <Typography variant="body1" gutterBottom>
                        Yes, we offer gift cards that can be purchased on our website. They make great presents for friends and family!
                    </Typography>

                    <Typography variant="h6">11. How do I subscribe to your newsletter?</Typography>
                    <Typography variant="body1" gutterBottom>
                        To subscribe to our newsletter, enter your email address in the subscription box at the bottom of our homepage. You will receive updates on new products, special offers, and more.
                    </Typography>

                    <Typography variant="h6">12. What should I do if I receive a damaged or incorrect item?</Typography>
                    <Typography variant="body1" gutterBottom>
                        If you receive a damaged or incorrect item, please contact us immediately at <a href="mailto:connect@suchitrafoods.com">connect@suchitrafoods.com</a>. We will arrange for a replacement or refund as soon as possible.
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default Faq;
