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
  ListItemIcon,
  Avatar,
  Tooltip,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { stringAvatar } from '../utils';
import CartIcon from './CartIcon';
import { getCategories } from '../pages/api/categories';

const ResponsiveAppBar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detects mobile view
  const { customer, logout, fetchCustomer } = useAuth(); // Replace with actual user state from context or auth hook

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/');
    window.location.reload();
  };
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // console.log(response)
        setCategories(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <AppBar position="sticky" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          {/* {!isMobile && (
            <img
              src="/images/logo.svg"
              alt="Logo"
              style={{
                height: 50,
                marginRight: 10,
              }}
            />
          )} */}
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                mt: 1,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 600,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                fontFamily: 'Besley',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                lineHeight: 'normal',
              }}
            >
              SUCHITRA FOODS
            </Typography>
            {/* Tagline */}
            <Typography
              variant="subtitle2"
              component="div"
              color="inherit"
              sx={{
                fontSize: '1rem',
                ml: '20px',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              Authentic * Aromatic * Alluring
            </Typography>
          </Box>
          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="nav-menu"
              aria-haspopup="true"
              onClick={handleOpenDrawer}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
              <List sx={{ width: 250 }}>
                <ListItem
                  button
                  onClick={() => {
                    handleCloseDrawer();
                    router.push('/');
                  }}
                >
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleCloseDrawer();
                    router.push('/how-to-order');
                  }}
                >

                  <ListItemText primary="Products" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleCloseDrawer();
                    router.push('/about');
                  }}
                >
                  <ListItemText primary="About Us" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleCloseDrawer();
                    router.push('/contact-us');
                  }}
                >
                  <ListItemText primary="Contact Us" />
                </ListItem>
              </List>
            </Drawer>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 1,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                flexDirection: 'column',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                fontFamily: 'Besley',
                fontStyle: 'normal',
                fontSize: '1.3rem',
                justifyContent: 'center',
                lineHeight: 'normal',
              }}
            >
              SUCHITRA FOODS
            </Typography>
            {/* <Typography
              variant="subtitle2"
              component="div"
              color="inherit"
              sx={{
                fontSize: '1rem',
                ml: '20px',
                mt: '-5px',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              Authentic * Aromatic * Alluring
            </Typography> */}
          </Box>
          {/* Desktop Nav Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: { md: 'right' },
            }}
          >
            <Button color="inherit" component="a" href="/">
              Home
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}  // Unique key for each button
                color="inherit"
                component="a"
                href={`/categories?type=${category.name}`}
              >
                {category.name}
              </Button>
            ))}
            {/* <Button color="inherit" component="a" href="/how-to-order">
              How to Order
            </Button> */}
            <Button color="inherit" component="a" href="/about">
              About Us
            </Button>

          </Box>

          {/* Icons for Add to Cart and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <IconButton size="large" color="inherit">
              <ShoppingCartIcon />
            </IconButton> */}
            <CartIcon />

            <Tooltip title="Account">
              <IconButton size="large" color="inherit" onClick={handleMenuOpen}>
                {customer ? (
                  <Avatar
                    {...stringAvatar(
                      `${customer?.first_name} ${customer?.last_name}`
                    )}
                  />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {!customer ? (
                <MenuItem
                  onClick={() =>
                    router.push('/account?view=sign-in&redirect=/')
                  }
                >
                  Sign In / Sign Up
                </MenuItem>
              ) : (
                [
                  <MenuItem
                    key="profile"
                    onClick={() => router.push('/profile')}
                  >
                    <Avatar /> My Profile
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Log Out
                  </MenuItem>,
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
