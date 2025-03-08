import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const Disclaimer = () => {
    return (
        <>
            <Head>
                <title> Disclaimer | Suchitra Foods</title>
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
                    <Typography variant="h4" gutterBottom>Disclaimer</Typography>

                    <Typography variant="h6">1. General Information</Typography>
                    <Typography variant="body1" gutterBottom>
                        The information provided by Suchitra Foods on www.suchitrafoods.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                    </Typography>

                    <Typography variant="h6">2. External Links Disclaimer</Typography>
                    <Typography variant="body1" gutterBottom>
                        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.
                    </Typography>

                    <Typography variant="h6">3. Professional Disclaimer</Typography>
                    <Typography variant="body1" gutterBottom>
                        The Site cannot and does not contain [legal/medical/fitness/other] advice. The [legal/medical/fitness/other] information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of [legal/medical/fitness/other] advice. The use or reliance of any information contained on this Site is solely at your own risk.
                    </Typography>

                    <Typography variant="h6">4. Affiliates Disclaimer</Typography>
                    <Typography variant="body1" gutterBottom>
                        The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.
                    </Typography>

                    <Typography variant="h6">5. Testimonials Disclaimer</Typography>
                    <Typography variant="body1" gutterBottom>
                        The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. Your individual results may vary.
                    </Typography>

                    <Typography variant="h6">6. Errors and Omissions Disclaimer</Typography>
                    <Typography variant="body1" gutterBottom>
                        While we have made every attempt to ensure that the information contained in this Site has been obtained from reliable sources, www.suchitrafoods.com is not responsible for any errors or omissions or for the results obtained from the use of this information. All information in this Site is provided "as is," with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.
                    </Typography>

                    <Typography variant="h6">7. Contact Us</Typography>
                    <Typography variant="body1" gutterBottom>
                        If you have any questions or concerns about this Disclaimer, please contact us at:
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

export default Disclaimer;
