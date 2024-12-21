import React from 'react';
import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const offers = [
  {
    id: 1,
    title: 'Bulk Purchase Discount',
    description: 'Buy any 3 products and get 10% off!',
  },
  {
    id: 2,
    title: 'Free Shipping Offer',
    description: 'Bill for ₹800 or more and get free shipping!',
  },
  {
    id: 3,
    title: 'Combo Packs Special',
    description: 'Buy combo packs and enjoy extra discounts!',
  },
];

const OffersBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        backgroundColor: '#E04F00',
        padding: '2em',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    color: '#E04F00',
                  }}
                >
                  {offer.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ marginTop: '0.5em', fontSize: '1rem' }}
                >
                  {offer.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OffersBanner;
