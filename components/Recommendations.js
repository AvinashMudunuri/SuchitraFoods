import { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid } from '@mui/material';
import ProductCard from './ProductCard';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Recommendations = ({ products }) => {
  // Ensure component only renders on client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering until client-side
  if (!isMounted) return null;
  const reduceAndShuffle = (arr, n) => {
    arr.splice(n); // reduce array
    arr.sort(() => 0.5 - Math.random()); // shuffle array
    return arr;
  };
  return (
    <Box sx={{ mt: 6, backgroundColor: '#f9f9f9', p: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Recommended for You
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {reduceAndShuffle(products, 3).map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.product_id}>
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

Recommendations.propTypes = {
  products: PropTypes.array,
};
export default Recommendations;
