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
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
              Get in touch with us
            </Typography>
            <Grid
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
                  11-125, Bapu Nagar, <br />
                  Ramanthapur, Hyderabad, <br />
                  Telangana, 500013, <br />
                  India
                </Typography>
              </Grid>
            </Grid>
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
          </Grid>
          <Grid item xs={12} md={4} sx={{ ml: { xs: 0, md: 10 } }}>
            <Typography variant="h6" gutterBottom>
              Policies
            </Typography>
            <Box sx={{ mt: 2, textAlign: { xs: 'left' } }}>
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
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ ml: { xs: 0, md: 10 } }}>
            <Box sx={{ mt: 2, textAlign: { xs: 'left' } }}>
              <Typography variant="h6" gutterBottom>
                FSSAI License
              </Typography>
              <img src="/images/FSSAI_logo.png" alt="FSSAI License" width="100px" />
              <Typography variant="body2">
                License Number: 13624011001482
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ ml: { xs: 0, md: 10 }, textAlign: { xs: 'left', md: 'right' } }}
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


              {/* <Link
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
              </Link> */}

              <Link
                href="/contact-us"
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'inherit',
                  textDecoration: 'none',
                  mb: 1,
                }}
              >
                Bulk Orders & Custom Orders
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
