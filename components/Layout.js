// components/Layout.js
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useAnalytics } from '../lib/useAnalytics';
import ResponsiveAppBar from './AppBar';
import Banner from './Banner';
import Footer from './Footer';

const Layout = ({ children }) => {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  // Define the paths where the Banner should not be displayed
  const noBannerPaths = ['/cart', '/checkout', '/order-success'];
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <ResponsiveAppBar />
      {!noBannerPaths.includes(router.pathname) && (
        <Banner
          backgroundImage="/images/hero.jpg"
          title="Rich Flavours of Home made Spice Powders"
          description="Bringing the rich flavors of homemade goodness to your table with authentic spice powders."
          buttonText="Explore Products"
          buttonAction={() => {
            trackEvent({
              action: 'click',
              category: 'button',
              label: 'Explore Products',
            });
            router.push('/products');
          }}
        />
      )}
      {children}
      {/* Footer */}
      <Footer />
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
