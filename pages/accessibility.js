import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Head from 'next/head';

const Accessibility = () => {
  return (
    <>
      <Head>
        <title> Accessibility | Suchitra Foods</title>
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
          <Typography variant="h4" gutterBottom>Accessibility</Typography>

          <Typography variant="h6">1. Introduction</Typography>
          <Typography variant="body1" gutterBottom>
            At <a href="https://www.suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.suchitrafoods.com</a>, we are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </Typography>

          <Typography variant="h6">2. Accessibility on <a href="https://www.suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.suchitrafoods.com</a></Typography>
          <Typography variant="body1" gutterBottom>
            We strive to make our website accessible to all users, regardless of their physical abilities. Our accessibility efforts include:
          </Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Ensuring our website is navigable by screen readers and other assistive technologies.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Providing text alternatives for non-text content.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Offering accessible forms and input fields.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Ensuring sufficient contrast and readability of text and other elements.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Making our website responsive and adaptable to different devices and screen sizes.</Typography></li>
          </ul>

          <Typography variant="h6">3. Conformance Status</Typography>
          <Typography variant="body1" gutterBottom>
            The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. www.suchitrafoods.com is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </Typography>

          <Typography variant="h6">4. Feedback</Typography>
          <Typography variant="body1" gutterBottom>
            We welcome your feedback on the accessibility of <a href="https://www.suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.suchitrafoods.com</a>. Please let us know if you encounter accessibility barriers on our website:
          </Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Email: <a href="mailto:connect@suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }}>connect@suchitrafoods.com</a></Typography></li>
            <li><Typography variant="body1" gutterBottom>Phone: <a href="tel:+917386360990" style={{ color: '#E04F00', textDecoration: 'underline' }}>+91 7386360990</a></Typography></li>
          </ul>
          <Typography variant="body1" gutterBottom>
            We try to respond to feedback within 2 business days.
          </Typography>

          <Typography variant="h6">5. Technical Specifications</Typography>
          <Typography variant="body1" gutterBottom>
            Accessibility of <a href="https://www.suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.suchitrafoods.com</a> relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>HTML</Typography></li>
            <li><Typography variant="body1" gutterBottom>CSS</Typography></li>
            <li><Typography variant="body1" gutterBottom>JavaScript</Typography></li>
          </ul>

          <Typography variant="h6">6. Assessment Approach</Typography>
          <Typography variant="body1" gutterBottom>
            <a href="https://www.suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.suchitrafoods.com</a> assesses the accessibility of our website through self-evaluation and continuous monitoring of our digital assets.
          </Typography>

          <Typography variant="h6">7. Accessibility Features</Typography>
          <Typography variant="body1" gutterBottom>
            Some of the accessibility features on our website include:
          </Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Descriptive link text</Typography></li>
            <li><Typography variant="body1" gutterBottom>Keyboard navigation support</Typography></li>
            <li><Typography variant="body1" gutterBottom>Alt text for images</Typography></li>
            <li><Typography variant="body1" gutterBottom>Accessible forms with labels and instructions</Typography></li>
            <li><Typography variant="body1" gutterBottom>Use of headings and structured content</Typography></li>
          </ul>

          <Typography variant="h6">8. Limitations and Alternatives</Typography>
          <Typography variant="body1" gutterBottom>
            Despite our best efforts to ensure accessibility of <a href="https://www.suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">www.suchitrafoods.com</a>, there may be some limitations. Below is a description of known limitations and potential solutions:
          </Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Known Limitation: [Description of limitation]</Typography></li>
            <li><Typography variant="body1" gutterBottom>Alternative Solution: [Description of solution]</Typography></li>
          </ul>

          <Typography variant="h6">9. Contact Us</Typography>
          <Typography variant="body1" gutterBottom>
            If you experience any difficulty accessing any part of our website or need assistance, please contact us:
          </Typography>

          <Typography variant="body1" gutterBottom>Email: <a href="mailto:connect@suchitrafoods.com" style={{ color: '#E04F00', textDecoration: 'underline' }}>connect@suchitrafoods.com</a></Typography>
          <Typography variant="body1" gutterBottom>Phone: <a href="tel:+917386360990" style={{ color: '#E04F00', textDecoration: 'underline' }}>+91 7386360990</a></Typography>

        </Box>
      </Container>
    </>
  );
};

export default Accessibility;
