import React, { useState } from 'react';
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
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { stringAvatar } from '../utils';
import CartIcon from './CartIcon';

const ResponsiveAppBar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { customer, logout } = useAuth(); // Replace with actual user state from context or auth hook

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/');
  };
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

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
                  <ListItemText primary="How to order" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleCloseDrawer();
                    router.push('/products');
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
                mr: 3,
                mt: 1,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                flexDirection: 'column',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                fontFamily: 'Besley',
                fontStyle: 'normal',
                fontSize: '1.5rem',
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
            <Button color="inherit" component="a" href="/how-to-order">
              How to Order
            </Button>
            <Button color="inherit" component="a" href="/products">
              Products
            </Button>
            <Button color="inherit" component="a" href="/about">
              About Us
            </Button>
            <Button color="inherit" component="a" href="/contact-us">
              Contact Us
            </Button>
          </Box>

          {/* Icons for Add to Cart and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <IconButton size="large" color="inherit">
              <ShoppingCartIcon />
            </IconButton> */}
            <CartIcon />

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
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                    My Profile
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
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
