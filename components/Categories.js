import React from "react";
import { Grid2 as Grid, Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const categories = [
    { image: "/images/karam.jpg", title: "Powders" },
    { image: "/images/karam.jpg", title: "Pickels" },
    { image: "/images/karam.jpg", title: "Snacks" },
    { image: "/images/karam.jpg", title: "Sweets" },
    { image: "/images/karam.jpg", title: "Instant Mix" },
    { image: "/images/karam.jpg", title: "Health Mix" },
];

const Categories = () => {

    const onCategoryClick = (category) => {

    }

    return (
        <Box
            sx={{
                display: "flex",
                padding: '3em',

                justifyContent: "space-between", // Space between the cards
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
                        backgroundColor: 'inherit'
                    }}
                >

                    {categories.map((category, index) => (
                        <Card
                            key={index}
                            onClick={() => onCategoryClick(category)}
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
                                height="140"
                                image={category.image}
                                alt={category.title}
                                sx={{
                                    borderRadius: '100px'
                                }}
                            />
                            <CardContent>
                                <Typography variant="h6" align="center" >
                                    {category.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Card>
            </Card>
        </Box >
    );


}

export default Categories;