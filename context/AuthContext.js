import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  retrieveCustomer,
  logout as logoutCustomer,
} from '../pages/api/customer';
import { getCookie } from '../lib/clientCookies';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      // Check if we have a token first
      const token = getCookie('_medusa_jwt');
      if (!token) {
        setCustomer(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await retrieveCustomer();
      setCustomer(response);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setCustomer(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutCustomer();
    setCustomer(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetchCustomer();
  }, []);
  const obj = useMemo(
    () => ({
      customer,
      setCustomer,
      fetchCustomer,
      logout,
      isAuthenticated,
      loading,
    }),
    [customer]
  );
  return <AuthContext.Provider value={obj}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }

  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
