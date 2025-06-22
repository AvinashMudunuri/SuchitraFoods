import React from 'react';
import { Box, Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsApp = () => {
  const phoneNumber = '+917386360990'; // Replace with your WhatsApp number including country code (e.g., 919876543210)
  const message = "Hello Suchitra Foods! I'm visiting your website and have a question.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
      }}
    >
      <Fab
        sx={{
          backgroundColor: '#25D366',
          color: 'white',
          '&:hover': {
            backgroundColor: '#128C7E',
          },
        }}
        aria-label="whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
};

export default WhatsApp;