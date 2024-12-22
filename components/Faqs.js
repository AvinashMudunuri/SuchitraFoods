// FAQ.js

import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Faq = () => {
  // Sample FAQs
  const faqs = [
    {
      question: 'How can I place an order?',
      answer:
        'Currently, orders are accepted through WhatsApp. Browse products on our website, then message us with your selected products and quantities at +91-9032090990. We’ll confirm and guide you through the payment process.',
    },
    {
      question: 'What payment methods are available?',
      answer:
        'Currently, we accept UPI payments through Google Pay, PhonePe, Cred etc. Please send payments to +91-9032090990 (Name – Suchitra Industries/YVS Subrahmanyam).',
    },
    {
      question: 'What are the shipping charges?',
      answer:
        'Shipping fees are calculated at checkout based on location and order size. We offer free shipping for orders meeting a minimum value of ₹800',
    },
    {
      question: 'How do I track my order?',
      answer:
        'Once your order ships, we’ll send you a tracking link via email or SMS.',
    },
    {
      question: 'Do you offer bulk orders or special packaging for events?',
      answer:
        'Yes, we accommodate bulk orders for family functions, weddings, and special events. Please contact us for customized options and pricing.',
    },
    {
      question: 'How do I track my order?',
      answer:
        'Once your order is shipped, we will share tracking details via WhatsApp for you to monitor the delivery status.',
    },
    {
      question: 'Can I return or cancel my order?',
      answer:
        'Cancellations are accepted before dispatch with a nominal fee. Currently, we do not accept returns, but if you receive a damaged product, contact us immediately for assistance.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes, we can ship to select international locations. Please reach out for more details on international shipping costs and timelines.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ backgroundColor: '#f9f9f9', my: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      {/* Sustainability Section */}
      {/* <Box
        sx={{ mt: 6, p: 2, backgroundColor: '#FFF6E5', borderRadius: '8px' }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Our Commitment to Sustainability
        </Typography>
        <Typography variant="body1" align="center">
          We are committed to minimizing our environmental footprint. Our
          products are crafted with sustainability in mind, using responsibly
          sourced materials. Our goal is to reduce waste, conserve resources,
          and contribute to a healthier planet.
        </Typography>
      </Box> */}

      {/* Packaging Information Section */}
      {/* <Box
        sx={{ mt: 6, p: 2, backgroundColor: '#E7F6E7', borderRadius: '8px' }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Packaging Information
        </Typography>
        <Typography variant="body1" align="center">
          We use eco-friendly packaging that is biodegradable and recyclable.
          Each product is packaged with care to ensure minimal environmental
          impact while maintaining quality and freshness.
        </Typography>
      </Box> */}
    </Container>
  );
};

export default Faq;
