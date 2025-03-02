import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const Terms = () => {
    return (
        <>
            <Head>
                <title> Terms and Conditions | Suchitra Foods</title>
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
                    <Typography variant="h4" gutterBottom>Terms and Conditions</Typography>

                    <Typography variant="h6" gutterBottom>1. Introduction</Typography>
                    <Typography variant="body1" gutterBottom>
                        Welcome to www.suchitraindustries.com. These Terms and Conditions ("Terms") govern your use of our website www.suchitrafoods.com, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Site.
                    </Typography>

                    <Typography variant="h6">2. Use of the Site</Typography>
                    <Typography variant="body1" gutterBottom>
                        By using the Site, you represent and warrant that you:
                    </Typography>
                    <ul>
                        <li><Typography variant="body1" gutterBottom>Are at least 18 years old or have the permission of a parent or guardian.</Typography></li>
                        <li><Typography variant="body1" gutterBottom>Will provide accurate, current, and complete information when creating an account or making a purchase.</Typography></li>
                        <li><Typography variant="body1" gutterBottom>Will not use the Site for any illegal or unauthorized purpose.</Typography></li>
                        <li><Typography variant="body1" gutterBottom>Will not engage in any activity that interferes with or disrupts the Site.</Typography></li>
                    </ul>

                    <Typography variant="h6">3. Account Information</Typography>
                    <Typography variant="body1" gutterBottom>
                        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
                    </Typography>

                    <Typography variant="h6">4. Product Information</Typography>
                    <Typography variant="body1" gutterBottom>
                        We make every effort to display the colors, features, specifications, and details of our products accurately. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                    </Typography>

                    <Typography variant="h6">5. Orders and Payment</Typography>
                    <Typography variant="body1" gutterBottom>
                        We reserve the right to refuse any order placed through the Site. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
                    </Typography>

                    <Typography variant="h6">6. Shipping and Delivery</Typography>
                    <Typography variant="body1" gutterBottom>
                        Please review our Shipping Policy for information on how we handle shipping and delivery of products.
                    </Typography>

                    <Typography variant="h6">7. Returns and Refunds</Typography>
                    <Typography variant="body1" gutterBottom>
                        Please review our Return Policy for information on how we handle returns and refunds of products.
                    </Typography>

                    <Typography variant="h6">8. Intellectual Property Rights</Typography>
                    <Typography variant="body1" gutterBottom>
                        All content on the Site, including but not limited to text, graphics, logos, images, and software, is the property of Suchitra Foods or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works of any content on the Site without our express written permission.
                    </Typography>

                    <Typography variant="h6">9. Limitation of Liability</Typography>
                    <Typography variant="body1" gutterBottom>
                        In no event shall Suchitra Foods, its directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Site, including but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of any content posted, transmitted, or otherwise made available via the Site, even if advised of their possibility.
                    </Typography>

                    <Typography variant="h6">10. Governing Law</Typography>
                    <Typography variant="body1" gutterBottom>
                        These Terms and your use of the Site shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles.
                    </Typography>

                    <Typography variant="h6">11. Changes to These Terms</Typography>
                    <Typography variant="body1" gutterBottom>
                        We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
                    </Typography>

                    <Typography variant="h6">12. Contact Us</Typography>
                    <Typography variant="body1" gutterBottom>
                        If you have any questions or concerns about these Terms, please contact us at:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Email: <a href="mailto:connect@suchitrafoods.com">connect@suchitrafoods.com</a>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Phone: +91 7331130990
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default Terms;
