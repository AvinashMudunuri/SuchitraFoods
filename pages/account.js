'use client';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import SignIn from '../components/account/SignIn';
import SignUp from '../components/account/SignUp';

export const LOGIN_VIEWS = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
};
const AccountPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState(LOGIN_VIEWS.SIGN_IN);

  useEffect(() => {
    // Set initial view based on URL parameter
    const view = searchParams.get('view');
    if (view && Object.values(LOGIN_VIEWS).includes(view)) {
      setCurrentView(view);
    }
  }, [searchParams]);

  useEffect(() => {
    // Handle redirect after successful authentication
    if (isAuthenticated) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push('/'); // Default redirect if no redirect URL specified
      }
    }
  }, [isAuthenticated, router, searchParams]);

  const handleViewChange = (newView) => {
    // Preserve the redirect parameter when changing views
    const redirect = searchParams.get('redirect');
    const redirectParam = redirect ? '&redirect=' + redirect : '';
    const newUrl = '/account?view=' + newView + redirectParam;
    router.push(newUrl);
    setCurrentView(newView);
  };

  return (
    <Container maxWidth="sm">
      {currentView === LOGIN_VIEWS.SIGN_IN && (
        <SignIn setCurrentView={handleViewChange} />
      )}
      {currentView === LOGIN_VIEWS.SIGN_UP && (
        <SignUp setCurrentView={handleViewChange} />
      )}
    </Container>
  );
};

export default AccountPage;
