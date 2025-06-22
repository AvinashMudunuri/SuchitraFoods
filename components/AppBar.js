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
    const handleRouteChange = () => {
      setIsSearchVisible(false);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
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
                <Typography variant="h6" noWrap component="a" href="/" sx={{
                  mr: 2, fontWeight: 600, letterSpacing: '.1rem', color: 'inherit', textDecoration: 'none', fontFamily: 'Besley',
                }}>
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
                <Button color="inherit" component="a" href="/">Home</Button>
                {categories.map((category) => (
                  <Button key={category.id} color="inherit" href={`/category/${category.handle}`}>
                    {category.name}
                  </Button>
                ))}
                <Button color="inherit" href="/about">About Us</Button>
                <Button color="inherit" href="/contact-us">Contact Us</Button>
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
          <ListItem button onClick={() => { handleCloseDrawer(); router.push('/'); }}>
            <ListItemText primary="Home" />
          </ListItem>
          {categories.map((category) => (
            <ListItem key={category.id} button onClick={() => { handleCloseDrawer(); router.push(`/category/${category.handle}`); }}>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
          <ListItem button onClick={() => { handleCloseDrawer(); router.push('/about'); }}>
            <ListItemText primary="About Us" />
          </ListItem>
          <ListItem button onClick={() => { handleCloseDrawer(); router.push('/contact-us'); }}>
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
