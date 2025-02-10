import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Button, ListItemButton, ListItemIcon, Checkbox, Paper, Container, Grid2 as Grid, Typography, Skeleton, List, ListItem, ListItemText, Chip, Pagination, Box, Divider } from '@mui/material';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ProductCard from '../../components/ProductCard';
import ErrorBoundary from '../../components/ErrorBoundary';
import { getProductCategories, getProductsByCategory } from '../api/products';

export const getServerSideProps = async ({ params }) => {
  const { handle } = params;
  try {
    const categoriesResponse = await getProductCategories();
    const categories = await Promise.all(
      categoriesResponse.map(async (cat) => {
        const products = await getProductsByCategory(cat.id);
        return {
          ...cat,
          products_count: products.length
        };
      })
    );
    // Handle multiple category selection
    const selectedHandles = handle ? handle.split('+') : [];
    let products = [];

    if (selectedHandles.length > 0) {
      // Get products for all selected categories
      const selectedCategories = categories.filter(cat =>
        selectedHandles.includes(cat.handle)
      );

      // Fetch and combine products from all selected categories
      const productsArrays = await Promise.all(
        selectedCategories.map(cat => getProductsByCategory(cat.id))
      );
      products = productsArrays.flat();
    } else {
      // No categories selected, show all products
      products = await getAllProducts();
    }
    return {
      props: {
        categories,
        products,
        currentCategory: null
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        error: 'Failed to load products',
      },
    };
  }
}
const ITEMS_PER_PAGE = 12;

export const CategoryDetail = ({ products, categories, currentCategory }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const router = useRouter();
  // Lift selectedCategories state up
  const [selectedCategories, setSelectedCategories] = useState(
    router.query.handle ? router.query.handle.split('+') : []
  );



  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (handle) => {
    router.push(`/category/${handle}`);
  };


  const getHeading = () => {
    if (selectedCategories.length === 0) {
      return "All Products";
    }

    const categoryNames = selectedCategories.map(handle =>
      categories.find(c => c.handle === handle)?.name
    ).filter(Boolean);

    if (categoryNames.length === 1) {
      return categoryNames[0].toUpperCase();
    }

    return `${categoryNames.slice(0, -1).join(', ')} & ${categoryNames.slice(-1)}`.toUpperCase();
  };

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  // Add loading state when categories change
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const CategorySidebar = () => {

    const handleCategoryToggle = (handle) => {
      setSelectedCategories(prev => {
        if (prev.includes(handle)) {
          // Remove category
          const newSelected = prev.filter(h => h !== handle);
          // Update URL with remaining categories or remove param if empty
          if (newSelected.length > 0) {
            router.push(`/category/${newSelected.join('+')}`);
          } else {
            router.push('/category');
          }
          return newSelected;
        } else {
          // Add category
          const newSelected = [...prev, handle];
          router.push(`/category/${newSelected.join('+')}`);
          return newSelected;
        }
      });
    };

    return (
      <Box sx={{ width: { sm: 240, md: 280 }, p: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6">Filter by Category</Typography>
          {selectedCategories.length > 0 && (
            <Button
              size="small"
              onClick={() => {
                setSelectedCategories([]);
                router.push('/category');
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              disablePadding
              sx={{ mb: 1 }}
            >
              <ListItemButton
                selected={selectedCategories.includes(category.handle)}
                onClick={() => handleCategoryToggle(category.handle)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'grey.200',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'grey.200',
                  }
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedCategories.includes(category.handle)}
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      }
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      {category.name}
                      <Chip
                        label={category.products_count}
                        size="small"
                        color={selectedCategories.includes(category.handle) ? "primary" : "default"}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Mobile view - Selected filters chips */}
        {isMobile && selectedCategories.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategories.map(handle => {
              const category = categories.find(c => c.handle === handle);
              return (
                <Chip
                  key={handle}
                  label={category?.name}
                  onDelete={() => handleCategoryToggle(handle)}
                  color="primary"
                  variant="outlined"
                />
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  const ProductSkeleton = () => (
    <Grid container spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Box sx={{ p: 1 }}>
            <Skeleton variant="rectangular" width={200} height={200} sx={{ mb: 1, borderRadius: 2 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const Sorting = () => {
    return (
      <Box>
        <Typography>Sort by</Typography>
        <Select
          value={sort}
          onChange={handleSortChange}
          sx={{ width: 150 }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </Box>
    );
  };


  if (isPageLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="text" width="200px" height={40} />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container>
        <Typography>No products found.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title> Category | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods`} />
        <meta property="og:title" content={`Products | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/products`}
        />
      </Head>
      <Box
        sx={{
          display: 'flex',
          p: 3,
          maxWidth: 1200,
          mx: 'auto',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Sidebar with Contact Information */}
        <Box sx={{ width: 300, mr: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <CategorySidebar />
          </Paper>
        </Box>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, mt: { xs: 4, md: 0 } }}>
          {/* Pagination & sorting */}
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', mb: 2 }}>
            <Sorting />
          </Box> */}

          {/* Heading */}
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            {getHeading()}
          </Typography>
          {/* Products count */}
          {!isLoading && <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 2 }}
          >
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </Typography>}
          {isLoading ? (
            <ProductSkeleton />
          ) : (
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {currentProducts.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={product.id}
                >
                  <ErrorBoundary fallback={<div>Error loading product</div>}>
                    <ProductCard product={product} source="category" isMobile={isMobile} />
                  </ErrorBoundary>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};

CategoryDetail.propTypes = {
  products: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  currentCategory: PropTypes.object.isRequired,
};

export default CategoryDetail;
