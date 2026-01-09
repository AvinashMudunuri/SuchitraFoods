import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { stringAvatar } from '../utils';
import CartIcon from './CartIcon';
import { getProductCategories } from '../pages/api/products';
import Search from './Search';

const ResponsiveAppBar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { customer, logout } = useAuth();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/');
    window.location.reload();
  };
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const handleCategoryClick = async (categoryHandle, categoryId) => {
    setLoadingCategory(categoryId);
    setIsNavigating(true);
    try {
      await router.push(`/category/${categoryHandle}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoadingCategory(null);
      setIsNavigating(false);
    }
  };

  const handleHomeClick = async () => {
    setIsNavigating(true);
    try {
      await router.push('/');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getProductCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsSearchVisible(false);
      setIsNavigating(true);
    };
    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
      setLoadingCategory(null);
    };
    const handleRouteChangeError = () => {
      setIsNavigating(false);
      setLoadingCategory(null);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events]);

  return (
    <AppBar position="fixed" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isSearchVisible ? (
            <>
              <IconButton
                onClick={() => setIsSearchVisible(false)}
                color="inherit"
                aria-label="close search"
                edge="start"
                sx={{ ml: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ width: '100%', ml: 1, mr: 2 }}>
                <Search />
              </Box>
            </>
          ) : (
            <>
              {/* Mobile Menu Icon */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" onClick={handleOpenDrawer} color="inherit">
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Desktop Logo */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="button"
                  onClick={handleHomeClick}
                  disabled={isNavigating}
                  sx={{
                    mr: 2,
                    fontWeight: 600,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    fontFamily: 'Besley',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    '&:hover': {
                      opacity: 0.9,
                    },
                    '&:disabled': {
                      opacity: 0.6,
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  SUCHITRA FOODS
                </Typography>
                <Typography variant="subtitle2" component="div" color="inherit" sx={{ fontSize: '1rem', ml: '20px' }}>
                  Authentic * Aromatic * Alluring
                </Typography>
              </Box>

              {/* Mobile Title */}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', display: { xs: 'flex', md: 'none' } }}>
                SUCHITRA FOODS
              </Typography>

              {/* Desktop Nav Links */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Button
                  color="inherit"
                  onClick={handleHomeClick}
                  disabled={isNavigating}
                  sx={{
                    position: 'relative',
                    opacity: router.pathname === '/' ? 1 : 0.8,
                    fontWeight: router.pathname === '/' ? 600 : 400,
                    '&:hover': {
                      opacity: 1,
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                    '&::after': router.pathname === '/' ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      height: '2px',
                      bgcolor: 'currentColor',
                    } : {},
                  }}
                >
                  Home
                </Button>
                {categories.map((category) => {
                  const isActive = router.pathname === '/category/[handle]' &&
                    router.query.handle === category.handle;
                  const isLoading = loadingCategory === category.id;

                  return (
                    <Button
                      key={category.id}
                      color="inherit"
                      onClick={() => handleCategoryClick(category.handle, category.id)}
                      disabled={isNavigating}
                      sx={{
                        position: 'relative',
                        opacity: isActive ? 1 : 0.8,
                        fontWeight: isActive ? 600 : 400,
                        '&:hover': {
                          opacity: 1,
                        },
                        '&:disabled': {
                          opacity: 0.6,
                        },
                        '&::after': isActive ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '80%',
                          height: '2px',
                          bgcolor: 'currentColor',
                        } : {},
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              border: '2px solid',
                              borderColor: 'currentColor',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite',
                            }}
                          />
                          {category.name}
                        </Box>
                      ) : (
                        category.name
                      )}
                    </Button>
                  );
                })}
                <Button
                  color="inherit"
                  onClick={() => router.push('/about')}
                  disabled={isNavigating}
                  sx={{
                    opacity: router.pathname === '/about' ? 1 : 0.8,
                    fontWeight: router.pathname === '/about' ? 600 : 400,
                    '&:hover': { opacity: 1 },
                    '&:disabled': { opacity: 0.6 },
                  }}
                >
                  About Us
                </Button>
                <Button
                  color="inherit"
                  onClick={() => router.push('/contact-us')}
                  disabled={isNavigating}
                  sx={{
                    opacity: router.pathname === '/contact-us' ? 1 : 0.8,
                    fontWeight: router.pathname === '/contact-us' ? 600 : 400,
                    '&:hover': { opacity: 1 },
                    '&:disabled': { opacity: 0.6 },
                  }}
                >
                  Contact Us
                </Button>
              </Box>

              {/* Unified Action Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 1 } }}>
                <IconButton size="large" aria-label="open search" onClick={() => setIsSearchVisible(true)} color="inherit">
                  <SearchIcon />
                </IconButton>
                <CartIcon />
                <Tooltip title="Account">
                  <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                    {customer ? (
                      <Avatar sx={{ width: 24, height: 24 }} {...stringAvatar(`${customer.first_name} ${customer.last_name}`)} />
                    ) : (
                      <AccountCircleIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>

      {/* Drawer and Menu components are portals */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem
            button
            onClick={() => {
              handleCloseDrawer();
              handleHomeClick();
            }}
            disabled={isNavigating}
            selected={router.pathname === '/'}
          >
            <ListItemText primary="Home" />
          </ListItem>
          {categories.map((category) => {
            const isActive = router.pathname === '/category/[handle]' &&
              router.query.handle === category.handle;
            const isLoading = loadingCategory === category.id;

            return (
              <ListItem
                key={category.id}
                button
                onClick={() => {
                  handleCloseDrawer();
                  handleCategoryClick(category.handle, category.id);
                }}
                disabled={isNavigating}
                selected={isActive}
                sx={{
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isLoading && (
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            border: '2px solid',
                            borderColor: 'primary.main',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }}
                        />
                      )}
                      {category.name}
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
          <ListItem
            button
            onClick={() => {
              handleCloseDrawer();
              router.push('/about');
            }}
            disabled={isNavigating}
            selected={router.pathname === '/about'}
          >
            <ListItemText primary="About Us" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleCloseDrawer();
              router.push('/contact-us');
            }}
            disabled={isNavigating}
            selected={router.pathname === '/contact-us'}
          >
            <ListItemText primary="Contact Us" />
          </ListItem>
        </List>
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {customer ? (
          [
            <MenuItem key="profile" onClick={() => { handleMenuClose(); router.push('/profile'); }}>
              <Avatar sx={{ mr: 1 }} {...stringAvatar(`${customer.first_name} ${customer.last_name}`)} /> Profile
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          ]
        ) : (
          <MenuItem onClick={() => { handleMenuClose(); router.push('/account'); }}>
            <AccountCircleIcon sx={{ mr: 1 }} /> Sign In
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default ResponsiveAppBar;
