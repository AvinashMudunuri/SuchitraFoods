import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { useRouter } from 'next/router';
import { useAnalytics } from '../lib/useAnalytics';


const image = "/images/karam.jpg"

const Categories = ({ categories }) => {

  const router = useRouter();
  const { trackEvent } = useAnalytics();


  const onCategoryClick = (handle) => {
    // console.log(category)
    trackEvent({
      action: 'click',
      category: 'button',
      label: `Categories | ${handle}`,
    });
    router.push(`/category/${handle}`);
  }

  return (
    <Box
      sx={{
        display: "flex",
        padding: '3em',

        justifyContent: "center", // Space between the cards
        gap: 2, // Gap between cards
        flexWrap: "wrap", // Wrap to the next row if needed
      }}
    >
      <Card
        sx={{
          backgroundColor: '#f4f4f4',
        }}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: '#E04F00',
            marginTop: '1em', // Add spacing below the header
            fontWeight: 'bold', // Bold text for emphasis
          }}
        >
          Choose Your Category
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            margin: '0.5em', // Add spacing below the header
            // Bold text for emphasis
            whiteSpace: 'pre-line'
          }}
        >
          Your ultimate destination for authentic Indian cuisine.
          <br />
          Explore our fresh pickles, flavourful masalas and irresistible telugu snacks.
        </Typography>
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 8,
            boxShadow: 'none',
            borderRadius: '8px',
            border: 'none',
            overflow: 'hidden',
            paddingBlock: '1em',
            paddingInline: '3em',
            backgroundColor: 'inherit',
            justifyContent: "center",
          }}
        >

          {categories.map((category) => (
            <Card
              key={category.id}
              onClick={() => onCategoryClick(category.handle)}
              sx={{
                // width: "120px", // Fixed width for each card
                // height: "300px", // Fixed height for each card
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: 'none',
                boxShadow: 'none',
                backgroundColor: 'inherit',
                transition: "transform 0.3s ease", // Smooth scaling
                '&:hover': {
                  transform: "scale(1.05)", // Scale up on hover
                  cursor: "pointer", // Pointer cursor on hover
                },
              }}
            >
              <CardMedia
                component="img"
                // height="140"
                image={image}
                alt={category.name}
                sx={{
                  width: "150px", // Adjust size as needed
                  height: "150px", // Equal width and height
                  borderRadius: "50%", // Makes the image circular
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography variant="h6" align="center" >
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Card>
      </Card>
    </Box >
  );


}

Categories.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default Categories;
