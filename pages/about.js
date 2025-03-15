import React from 'react';
import {
  Container,
  Typography,
  Grid2 as Grid,
  Box,
  Card,
  CardContent,
  useTheme,
  Avatar,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import {
  Restaurant,
  LocalShipping,
  Security,
  VerifiedUser,
  Settings,
  Favorite,
  History,
  EmojiPeople,
  Spa,
} from '@mui/icons-material';
import Banner from '../components/Banner';
import { useRouter } from 'next/router';

export default function AboutUs() {
  const theme = useTheme();
  const router = useRouter();
  // Banner slides for the About page
  const aboutBannerSlides = [
    {
      image: '/images/hero.jpg',
      title: 'About Suchitra Foods',
      description: 'A celebration of tradition, authenticity, and the rich flavors of Andhra & Telangana',
      buttonText: 'Explore Our Products',
      buttonAction: () => router.push('/category'),
    },
    {
      image: '/images/special_2.jpg',
      title: 'Our Heritage',
      description: 'Preserving traditional recipes passed down through generations',
    },
    {
      image: '/images/kandi.jpg',
      title: 'Women-Driven Initiative',
      description: 'Empowering women in our community to share their culinary artistry',
    },
    {
      image: '/images/special.jpg',
      title: 'Handcrafted with Love',
      description: 'Every product is made with care and tradition',
    },
  ];

  const missionPoints = [
    {
      title: 'Quality and Tradition',
      description: 'We meticulously select raw materials from various cities in Andhra and Telangana, adhering to traditional cooking techniques and using only the finest oils. Our products are a reflection of cherished old recipes, made with passion and precision, and we proudly maintain a strict policy of no preservatives.',
      icon: <Restaurant fontSize="large" />,
    },
    {
      title: 'Shipping Worldwide',
      description: 'From local to global, we are dedicated to bringing the taste of Suchitra Foods to customers all around the world. Craving a taste of home? Our global shipping options ensure that you receive your favorite products quickly and hassle-free.',
      icon: <LocalShipping fontSize="large" />,
    },
    {
      title: 'Secure Payment',
      description: 'Secure bites, happy smiles. We prioritize your convenience with hassle-free, encrypted payment options, so you can enjoy our products with peace of mind.',
      icon: <Security fontSize="large" />,
    },
    {
      title: 'No Compromise on Quality',
      description: 'At Suchitra Foods, we deliver more than just products; we deliver a taste of tradition. Immerse yourself in the unparalleled quality of our age-old recipes and handcrafted treasures, passed down with love and care.',
      icon: <VerifiedUser fontSize="large" />,
    },
    {
      title: 'Customization',
      description: 'We recognize and value that everyone has very unique taste preferences. That\'s why we offer multiple customization options, allowing you to tailor your order to suit your taste and dietary requirements.',
      icon: <Settings fontSize="large" />,
    },
    {
      title: 'Customer Satisfaction',
      description: 'We believe in building lasting relationships with our customers. By interacting with each customer individually, we understand their choices and create bonds that go beyond transactions. Your satisfaction and happiness are our top priorities.',
      icon: <Favorite fontSize="large" />,
    },
  ];

  return (
    <>
      {/* Banner Carousel */}
      <Banner
        slides={aboutBannerSlides}
        height={{ xs: '400px', md: '500px' }}
        effect="fade"
      />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Our Journey Section */}
        <Paper elevation={3} sx={{
          mb: 8,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(to right, #fff, #f9f5f1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(224, 79, 0, 0.1)',
            zIndex: 0
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{
                bgcolor: theme.palette.primary.main,
                mr: 2,
                width: 56,
                height: 56
              }}>
                <History fontSize="large" />
              </Avatar>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 600 }}>
                Our Journey: A Tale of Tradition and Heart
              </Typography>
            </Box>

            <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem', mb: 3 }}>
              We understand that food is a connection to our roots, a bridge to cherished memories, and a celebration of tradition. Our story began with a deep respect for these values and a desire to share the rich flavors of our heritage with the world.
            </Typography>

            <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem', mb: 3 }}>
              Suchitra Foods is a proud extension of the Suchitra Industries group. In 2018, we embarked on a journey towards sustainability by starting our non-woven bags manufacturing, serving over 5000 customers globally with our eco-friendly products. But our story didn't stop there.
            </Typography>

            <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem' }}>
              In 2024, driven by a passion for authentic flavors and a love for our Telugu culture, we launched Suchitra Foods. This endeavor is a testament to our commitment to preserving the traditional recipes passed down from our grandmothers, ensuring that every product we offer is infused with love and authenticity. What's more, this initiative is entirely women-driven, empowering the remarkable women in our community to share their culinary artistry with the world.
            </Typography>
          </Box>

          <Box sx={{
            position: 'absolute',
            bottom: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(224, 79, 0, 0.05)',
            zIndex: 0
          }} />
        </Paper>

        {/* Our Mission Section */}
        <Box mb={8}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{
                bgcolor: theme.palette.primary.main,
                width: 70,
                height: 70,
                mb: 2
              }}>
                <EmojiPeople fontSize="large" />
              </Avatar>
            </Box>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Our Mission: Bringing the Taste of Home to You
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', fontSize: '1.1rem', mb: 2 }}>
              Our mission is very simple yet profound: to bring the taste of home to your table. We craft our products with care, ensuring that every bite transports you to the warmth and comfort of a home-cooked meal.
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
              Our product line includes a delightful array of flavorful spice powders, seasonal pickles, and mouth-watering snacks and sweets. Each recipe is a piece of our heritage, lovingly crafted just like from Grandma's kitchen.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {missionPoints.map((point, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{
                        bgcolor: theme.palette.primary.main,
                        mr: 2,
                        width: 50,
                        height: 50
                      }}>
                        {point.icon}
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        {point.title}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {point.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{
          textAlign: 'center',
          p: 6,
          borderRadius: 4,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          boxShadow: '0 8px 20px rgba(224, 79, 0, 0.3)',
        }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Experience the Authentic Taste of Home
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}>
            Discover our range of traditional products crafted with love and care, bringing the authentic flavors of Andhra and Telangana to your table.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => router.push('/category')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#fff',
                color: theme.palette.primary.main,
              }
            }}
          >
            Explore Our Products
          </Button>
        </Box>
      </Container>
    </>
  );
}
