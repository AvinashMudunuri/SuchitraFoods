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

  // Map category names to icons
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();

    if (name.includes('podi') || name.includes('powder')) return <Blender fontSize="large" />;
    if (name.includes('pickle') || name.includes('achar')) return <KitchenOutlined fontSize="large" />;
    if (name.includes('snack') || name.includes('namkeen')) return <LocalDining fontSize="large" />;
    if (name.includes('sweet') || name.includes('mithai')) return <Cake fontSize="large" />;
    if (name.includes('spice') || name.includes('masala')) return <LocalFlorist fontSize="large" />;
    if (name.includes('rice') || name.includes('grain')) return <RiceBowl fontSize="large" />;
    if (name.includes('dal') || name.includes('lentil')) return <SoupKitchenOutlined fontSize="large" />;
    if (name.includes('breakfast')) return <FreeBreakfast fontSize="large" />;
    if (name.includes('lunch') || name.includes('dinner')) return <LunchDining fontSize="large" />;
    if (name.includes('baked') || name.includes('bakery')) return <BakeryDining fontSize="large" />;
    if (name.includes('dessert')) return <IcecreamOutlined fontSize="large" />;
    if (name.includes('vegetable') || name.includes('veggie')) return <Grass fontSize="large" />;
    if (name.includes('egg')) return <EggAlt fontSize="large" />;
    if (name.includes('seafood') || name.includes('fish')) return <SetMeal fontSize="large" />;
    if (name.includes('fast food')) return <Fastfood fontSize="large" />;
    if (name.includes('pizza')) return <LocalPizza fontSize="large" />;
    if (name.includes('tea') || name.includes('coffee')) return <EmojiFoodBeverage fontSize="large" />;
    if (name.includes('herb') || name.includes('organic')) return <Spa fontSize="large" />;

    // Default icon if no match is found
    return <Restaurant fontSize="large" />;
  };

  // Get icon color based on category name
  const getCategoryColor = (categoryName) => {
    const name = categoryName.toLowerCase();

    if (name.includes('podi') || name.includes('powder')) return '#E04F00'; // Brand primary color
    if (name.includes('pickle') || name.includes('achar')) return '#8BC34A'; // Green
    if (name.includes('snack') || name.includes('namkeen')) return '#FFC107'; // Amber
    if (name.includes('sweet') || name.includes('mithai')) return '#E91E63'; // Pink
    if (name.includes('spice') || name.includes('masala')) return '#FF5722'; // Deep Orange

    // Default to brand primary color
    return theme.palette.primary.main;
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
          {categories.map((category) => (
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

              {/* Icon and Image Container */}
              <Box sx={{ position: 'relative' }}>
                {/* Background Circle */}
                <Avatar
                  sx={{
                    width: { xs: '80px', sm: '120px', md: '150px' },
                    height: { xs: '80px', sm: '120px', md: '150px' },
                    bgcolor: 'white',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* If there's an image, show it */}
                  {category.image ? (
                    <CardMedia
                      component="img"
                      image={category.image}
                      alt={category.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    /* If no image, show an icon */
                    <Avatar
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: getCategoryColor(category.name),
                        color: 'white',
                      }}
                    >
                      {getCategoryIcon(category.name)}
                    </Avatar>
                  )}
                </Avatar>

                {/* Small icon overlay in corner */}
                <Avatar
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: { xs: '30px', sm: '40px', md: '50px' },
                    height: { xs: '30px', sm: '40px', md: '50px' },
                    bgcolor: getCategoryColor(category.name),
                    border: '2px solid white',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {getCategoryIcon(category.name)}
                </Avatar>
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
