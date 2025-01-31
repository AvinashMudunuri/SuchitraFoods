// components/Layout.js
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';


const Layout = ({ children }) => {
  const router = useRouter();
  // Define the paths where the Banner should not be displayed
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {children}
      {/* Footer */}
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
