import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const CookiePolicy = () => {
    return (
        <>
            <Head>
                <title> Cookie Policy | Suchitra Foods</title>
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
                    <Typography variant="h4" gutterBottom>Cookie Policy</Typography>

                    <Typography variant="h6">1. Introduction</Typography>
                    <Typography variant="body1" gutterBottom>
                        Suchitra Foods uses cookies on www.suchitrafoods.com (the "Site"). By using the Site, you consent to the use of cookies. Our Cookie Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the Site, your choices regarding cookies, and further information about cookies.
                    </Typography>

                    <Typography variant="h6">2. What Are Cookies?</Typography>
                    <Typography variant="body1" gutterBottom>
                        Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Site or a third-party to recognize you and make your next visit easier and the Site more useful to you.
                    </Typography>

                    <Typography variant="h6">3. How We Use Cookies</Typography>
                    <Typography variant="body1" gutterBottom>
                        When you use and access the Site, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                    </Typography>
                    <ul>
                        <li><Typography variant="body1" gutterBottom>To enable certain functions of the Site</Typography></li>
                        <li><Typography variant="body1" gutterBottom>To provide analytics</Typography></li>
                        <li><Typography variant="body1" gutterBottom>To store your preferences</Typography></li>
                        <li><Typography variant="body1" gutterBottom>To enable advertisements delivery, including behavioural advertising</Typography></li>
                    </ul>

                    <Typography variant="h6">4. Types of Cookies We Use</Typography>
                    <Typography variant="body1" gutterBottom>
                        We use both session and persistent cookies on the Site and we use different types of cookies to run the Site:
                    </Typography>
                    <ul>
                        <li><Typography variant="body1" gutterBottom><strong>Essential Cookies:</strong> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</Typography></li>
                        <li><Typography variant="body1" gutterBottom><strong>Preferences Cookies:</strong> We may use preferences cookies to remember information that changes the way the Site behaves or looks, such as the "remember me" functionality of a registered user or a user's language preference.</Typography></li>
                        <li><Typography variant="body1" gutterBottom><strong>Analytics Cookies:</strong> We may use analytics cookies to track information on how the Site is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features, or new functionality of the Site to see how our users react to them.</Typography></li>
                        <li><Typography variant="body1" gutterBottom><strong>Advertising Cookies:</strong> These types of cookies are used to deliver advertisements on and through the Site and to track the performance of these advertisements. These cookies may also be used to enable third-party advertising networks to deliver ads that may be relevant to you based on your activities or interests.</Typography></li>
                    </ul>

                    <Typography variant="h6">5. Third-Party Cookies</Typography>
                    <Typography variant="body1" gutterBottom>
                        In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Site, deliver advertisements on and through the Site, and so on.
                    </Typography>

                    <Typography variant="h6">6. Your Choices Regarding Cookies</Typography>
                    <Typography variant="body1" gutterBottom>
                        If you’d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                    </Typography>

                    <Typography variant="h6">7. More Information About Cookies</Typography>
                    <Typography variant="body1" gutterBottom>
                        You can learn more about cookies at the following third-party websites:
                    </Typography>
                    <ul>
                        <li><Typography variant="body1" gutterBottom><a href="http://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">All About Cookies</a></Typography></li>
                        <li><Typography variant="body1" gutterBottom><a href="http://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></Typography></li>
                    </ul>

                    <Typography variant="h6">8. Contact Us</Typography>
                    <Typography variant="body1" gutterBottom>
                        If you have any questions about our Cookie Policy, please contact us at:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Email: <a href="mailto:connect@suchitrafoods.com">connect@suchitrafoods.com</a>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Phone: +91 7386360990
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default CookiePolicy;
