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
  CircularProgress
} from "@mui/material";
import { useRouter } from 'next/router';
import { useAnalytics } from '../lib/useAnalytics';

const Categories = ({ categories }) => {
  const [loadingCategory, setLoadingCategory] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { trackEvent } = useAnalytics();

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
              <CardMedia
                component="img"
                image={category.image || "/images/karam.jpg"}
                alt={category.name}
                sx={{
                  width: { xs: '80px', sm: '120px', md: '150px' },
                  height: { xs: '80px', sm: '120px', md: '150px' },
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
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
