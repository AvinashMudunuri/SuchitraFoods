import React from 'react';
import { Container, Grid2 as Grid, Typography } from '@mui/material';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { products } from '../lib/constants';

const handleAddToCart = (productId) => {
  console.log(`Added product ${productId} to cart.`);
};

const ProductsPage = () => {
  const viewMode = 'grid';
  return (
    <>
      <Head>
        <title> Products| Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods`} />
        <meta property="og:title" content={`Products | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/products`}
        />
      </Head>
      <Container>
        <Typography variant="h4" sx={{ margin: '.5em 0', textAlign: 'center' }}>
          All Products
        </Typography>
        {/* Toggle Button for Grid/List View Switch */}
        {/* <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewToggle}
          aria-label="view mode"
          sx={{ marginBottom: 4 }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            Grid
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            List
          </ToggleButton>
        </ToggleButtonGroup> */}
        <Grid container spacing={3} sx={{ justifyContent: 'center', mb: 2 }}>
          {products.map((product) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              key={product.id}
            >
              <ProductCard product={product} viewMode={viewMode} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ProductsPage;
