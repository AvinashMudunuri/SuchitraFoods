import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Link,
  useMediaQuery,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detects mobile view
  const currentYear = new Date().getFullYear(); // Get the current year
  const phoneNumber = '+917331130990'; // Replace with actual phone number
  const preFilledText = encodeURIComponent(
    'Hi! I am interested in your products.'
  );
  return (
    <Box
      sx={{
        position: 'relative', // Ensures that the overlay is positioned correctly relative to the Box
        backgroundImage: 'url(/images/footer.png)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 6,
        minHeight: '250px', // Sets a minimum height for the footer
        color: '#fff',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with 50% opacity
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <EmailIcon />
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  component={Link}
                  href="mailto:connect@suchitrafoods.com"
                  color="white"
                >
                  connect@suchitrafoods.com
                </Typography>
              </Grid>
            </Grid>
            {isMobile && (
              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item>
                  <WhatsAppIcon sx={{ color: '#25D366' }} />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body2"
                    component={Link}
                    href={`https://wa.me/${phoneNumber}?text=${preFilledText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="white"
                  >
                    Chat with us on WhatsApp
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <PhoneIcon />
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  component={Link}
                  href="tel:+917331130990"
                  color="white"
                >
                  +91 7331130990
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mt: 1, flexWrap: 'nowrap' }}
            >
              <Grid item>
                <LocationOnIcon />
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  11-125, Bapu Nagar, Ramanthapur, Hyderabad, Telangana, 500013,
                  India
                </Typography>
              </Grid>
            </Grid> */}
            <Grid container alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body2">
                  You can chat with us on our WhatsApp by direct messaging us
                  between 9am - 9 pm IST.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ minWidth: { md: '370px', lg: '500px' } }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: { xs: 'left', md: 'right' } }}
            >
              Useful Links
            </Typography>
            <Box sx={{ mt: 2, textAlign: { xs: 'left', md: 'right' } }}>
              <Link
                href="/privacy-policy"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/shipping"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Shipping & Delivery
              </Link>
              <Link
                href="/internationalShipping"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                International Shipping
              </Link>
              <Link
                href="/cancellations"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Cancellations & Returns
              </Link>
              <Link
                href="/terms"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Terms and Conditions
              </Link>
              <Link
                href="/disclaimer"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Disclaimer
              </Link>
              <Link
                href="/cookiePolicy"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Accessibility Statement
              </Link>
              <Link
                href="/faq"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Frequently Asked Questions (FAQ)
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Typography variant="body2" align="center">
              &copy; {currentYear} Suchitra Industries. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
