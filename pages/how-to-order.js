import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const steps = [
  {
    icon: <ShoppingCartIcon />,
    title: 'Browse & Finalize Products',
    description: 'Select products, choose preferred size and quantity.',
  },
  {
    icon: <WhatsAppIcon />,
    title: 'Send WhatsApp Message',
    description: 'Message +91 73863 60990 with your order details.',
  },
  {
    icon: <CheckCircleIcon />,
    title: 'Order Acknowledged',
    description: 'Order confirmation will be sent via WhatsApp.',
  },
  {
    icon: <QrCodeIcon />,
    title: 'Send UPI Payment',
    description: 'Make payment to +91 90320 90990 using UPI apps.',
  },
  {
    icon: <LocalShippingIcon />,
    title: 'Order Confirmed & Sent for Delivery',
    description: 'Your order is confirmed and ready for delivery.',
  },
];

const HowToOrder = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Follow These Steps to Order
      </Typography>

      <Box
        sx={{
          bgcolor: '#FF8C42',
          color: 'white',
          textAlign: 'center',
          borderRadius: 2,
          my: 4,
          py: 1.5,
        }}
      >
        <Typography variant="h5">TO ORDER PRODUCT</Typography>
      </Box>

      <Timeline position="alternate">
        {steps.map((step, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot sx={{ bgcolor: '#FF8C42' }}>{step.icon}</TimelineDot>
              {index < steps.length - 1 && (
                <TimelineConnector sx={{ bgcolor: '#FF8C42' }} />
              )}
            </TimelineSeparator>

            <TimelineContent>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: '#FFF8F1', borderRadius: 2 }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default HowToOrder;
