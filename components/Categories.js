import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  CircularProgress,
  Avatar
} from "@mui/material";
import { useRouter } from 'next/router';
import { useAnalytics } from '../lib/useAnalytics';
// Import Material UI icons for categories
import {
  Restaurant,
  LocalDining,
  Spa,
  Grass,
  Blender,
  EggAlt,
  Cake,
  LocalPizza,
  EmojiFoodBeverage,
  RiceBowl,
  SetMeal,
  LocalFlorist,
  Fastfood,
  FreeBreakfast,
  LunchDining,
  BakeryDining,
  IcecreamOutlined,
  KitchenOutlined,
  SoupKitchenOutlined,
} from '@mui/icons-material';

const Categories = ({ categories }) => {
  const [loadingCategory, setLoadingCategory] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { trackEvent } = useAnalytics();

  // Get category image based on index
  const getCategoryImage = (name, index) => {
    // Cycle through 4 images (1.jpg, 2.jpg, 3.jpg, 4.jpg)
    return `/images/categories/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  };

  // Get accent color based on category index
  const getCategoryColor = (index) => {
    const colors = [
      theme.palette.primary.main, // Primary color
      '#8BC34A',                  // Green
      '#FFC107',                  // Amber
      '#E91E63',                  // Pink
    ];

    return colors[index % colors.length];
  };

  const onCategoryClick = async (category) => {
    setLoadingCategory(category.id);
    trackEvent({
      action: 'click',
      category: 'button',
      label: `Categories | ${category.handle}`,
    });
    await router.push(`/category/${category.handle}`);
    setLoadingCategory(null);
  }

  return (
    <Container maxWidth="xl">
      <Card sx={{
        backgroundColor: '#f4f4f4',
        my: { xs: 2, md: 4 },
        mx: { xs: 1, md: 'auto' }
      }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          align="center"
          sx={{
            color: '#E04F00',
            mt: { xs: 2, md: 3 },
            fontWeight: 'bold',
          }}
        >
          Choose Your Category
        </Typography>

        <Typography
          variant={isMobile ? "body1" : "h6"}
          align="center"
          sx={{
            mx: { xs: 2, md: 4 },
            my: { xs: 1, md: 2 },
            whiteSpace: 'pre-line'
          }}
        >
          Your go-to destination for trusted homemade authentic foods.
          <br />
          Enjoy our fresh seasonal pickles, aromatic powders, and mouth-watering snacks and sweets.
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'row' },
          flexWrap: 'wrap',
          gap: { xs: 2, md: 8 },
          justifyContent: "center",
          p: { xs: 2, md: 4 },
        }}>
          {categories.map((category, index) => (
            <Card
              key={category.id}
              onClick={() => onCategoryClick(category)}
              sx={{
                position: 'relative',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: 'none',
                boxShadow: 'none',
                backgroundColor: 'inherit',
                transition: "transform 0.3s ease",
                cursor: "pointer",
                '&:hover': {
                  transform: "scale(1.05)",
                },
                width: { xs: '40%', sm: 'auto' },
                maxWidth: { xs: 150, sm: 'none' }
              }}
            >
              {loadingCategory === category.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 'inherit',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}

              {/* Image Container */}
              <Box sx={{ position: 'relative' }}>
                {/* Square Image Container */}
                <Box
                  sx={{
                    width: { xs: '80px', sm: '120px', md: '150px' },
                    height: { xs: '80px', sm: '120px', md: '150px' },
                    bgcolor: 'white',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={category.image || getCategoryImage(category.name, index)}
                    alt={category.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Accent color border */}
                {/* <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: { xs: '30px', sm: '40px', md: '50px' },
                    height: { xs: '30px', sm: '40px', md: '50px' },
                    borderRadius: '50%',
                    bgcolor: getCategoryColor(index),
                    border: '2px solid white',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  }}
                /> */}
              </Box>

              <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  align="center"
                  sx={{
                    fontWeight: 'medium',
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                  }}
                >
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Card>
    </Container>
  );
}

Categories.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default Categories;
