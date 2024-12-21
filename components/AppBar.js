import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  // Menu,
  // MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

const ResponsiveAppBar = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detects mobile view
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [anchorElProfile, setAnchorElProfile] = useState(null);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // const handleOpenProfileMenu = (event) => {
  //   setAnchorElProfile(event.currentTarget);
  // };

  // const handleCloseProfileMenu = () => {
  //   setAnchorElProfile(null);
  // };

  return (
    <AppBar position="static" color="primary">
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
                fontSize: '2rem',
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
                fontSize: '2rem',
                justifyContent: 'center',
                lineHeight: 'normal',
              }}
            >
              SUCHITRA FOODS
            </Typography>
            <Typography
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
            </Typography>
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
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" color="inherit">
              <ShoppingCartIcon />
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenProfileMenu}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorElProfile}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElProfile)}
              onClose={handleCloseProfileMenu}
            >
              <MenuItem onClick={handleCloseProfileMenu}>Profile</MenuItem>
              <MenuItem onClick={handleCloseProfileMenu}>Orders</MenuItem>
              <MenuItem onClick={handleCloseProfileMenu}>Logout</MenuItem>
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
