// Testimonials.js

import React from 'react';
import {
  Container,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Box,
} from '@mui/material';

const testimonials = [
  {
    name: 'Abhiram, Germany',
    rating: 4,
    comment:
      'The seasonal pickles from Suchitra Foods are outstanding. The freshness and taste of the Chintakaya and Nimmakaya pickles are mouth-watering.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Mounika, Canada',
    rating: 5,
    comment:
      'I ordered traditional snacks - Gatti Pakodi, Murukulu, and Bellam Kajjikayalu. They are absolutely delicious! Palli Chikki and Nuvvula Chikki surprised me with their perfect consistency. They are my childhood favorites.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Lakshman, Hyderabad',
    rating: 4.5,
    comment:
      'I contacted them for a custom combo-pack order for a party. They helped us meet our needs perfectly. I really appreciate their openness and dedication. Special thanks to Prasanna. Our guests really enjoyed the combo packs of snacks and sweets.',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  // {
  //   name: 'Sara Wilson',
  //   rating: 5,
  //   comment: 'Affordable prices and high-quality products. Highly recommended!',
  //   avatar: 'https://i.pravatar.cc/150?img=12',
  // },
];

const Testimonials = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#E04F00', fontWeight: 600 }}>
          Customer Stories
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ fontSize: '1rem', fontStyle: 'italic' }}>
          <blockquote>
            <b>Every Order Tells a Story:</b> Discover how our products have become part of our customers' daily lives and special moments.
          </blockquote>
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center" sx={{ backgroundColor: '#f5f5f5', padding: 4, borderRadius: 4 }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* <Avatar
                alt={testimonial.name}
                src={testimonial.avatar}
                sx={{ width: 64, height: 64, mb: 2 }}
              /> */}
              {/* <Rating
                name="read-only"
                value={testimonial.rating}
                precision={0.5}
                readOnly
              /> */}
              <CardContent>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 2, maxWidth: '200px' }}
                >
                  <q>{testimonial.comment}</q>
                </Typography>
                <Typography variant="subtitle2" align="center" color="primary">
                  - {testimonial.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Testimonials;
