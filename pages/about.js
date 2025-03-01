import React from 'react';
import {
  Container,
  Typography,
  Grid2 as Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Avatar,
  Button,
} from '@mui/material';
import { Restaurant, Spa, Sanitizer } from '@mui/icons-material';

export default function AboutUs() {
  const theme = useTheme();

  const offerings = [
    { name: 'Kandi Podi', description: 'Protein-packed delight', icon: '🌱' },
    { name: 'Nuvvula Podi', description: 'Sesame seed goodness', icon: '✨' },
    { name: 'Palli Podi', description: 'Peanut perfection', icon: '🥜' },
    { name: 'Karapodi', description: 'Spicy & flavorful', icon: '🌶️' },
    { name: 'Kobbari Podi', description: 'Coconut charm', icon: '🥥' },
    { name: 'Putnalu Podi', description: 'Roasted gram deliciousness', icon: '🌾' },
    { name: 'Kura Podi', description: 'Vegetable magic', icon: '🥗' },
  ];

  const whyChooseUs = [
    { title: 'Authentic Taste', description: 'Rich, homemade goodness', icon: <Restaurant /> },
    { title: 'Premium Quality', description: 'Highest standards', icon: <Spa /> },
    { title: 'Hygienic Process', description: 'Safety & satisfaction', icon: <Sanitizer /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{
        textAlign: 'center',
        py: 8,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        borderRadius: 4,
        color: 'white',
        mb: 6
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Taste the Tradition
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Bringing authentic flavors of Andhra & Telangana to your table
        </Typography>
      </Box>

      {/* Offerings Section */}
      <Box mb={8}>
        <Typography variant="h3" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          Our Signature Blends
        </Typography>
        <Grid container spacing={3}>
          {offerings.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'transparent', fontSize: '2rem' }}>{item.icon}</Avatar>}
                  title={item.name}
                  titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why Choose Us Section */}
      <Box mb={8}>
        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
          Why Choose Suchitra Foods?
        </Typography>
        <Grid container spacing={4}>
          {whyChooseUs.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
                height: '100%',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[6]
                }
              }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  mb: 2,
                  bgcolor: 'primary.main',
                  color: 'white'
                }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h5" gutterBottom>{item.title}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Story Section */}
      <Box mb={8}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Our Journey
            </Typography>
            <Typography variant="body1" component="p">
              From eco-friendly non-woven bags to culinary delights, our journey reflects our dedication to quality. With over 500 happy clients globally through Suchitra Industries, we bring that same commitment to traditional Indian flavors.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              height: 300,
              backgroundImage: 'url(/images/kitchen.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 4
            }} />
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{
        textAlign: 'center',
        p: 6,
        borderRadius: 4,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
          Ready to Experience Authentic Flavors?
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Explore Our Products
        </Button>
      </Box>
    </Container>
  );
}
