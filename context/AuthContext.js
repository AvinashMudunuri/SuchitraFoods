import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getLoggedInCustomer, logoutCustomer } from '../pages/api/customer';
import PropTypes from 'prop-types';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      if (sessionStorage.getItem('token')) {
        const token = sessionStorage.getItem('token');
        const response = await getLoggedInCustomer(token);
        setCustomer(response.customer);
        setIsAuthenticated(true);
        sessionStorage.setItem('customer', JSON.stringify(response.customer));
      }
    } catch {
      setCustomer(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutCustomer();
    setCustomer(null);
  };

  useEffect(() => {
    fetchCustomer();
  }, []);
  const obj = useMemo(
    () => ({ customer, fetchCustomer, logout, isAuthenticated, loading }),
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
