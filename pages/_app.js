// pages/_app.js
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { RegionProvider } from '../context/RegionContext';
import { CartProvider } from '../context/CartContext';
import ResponsiveAppBar from '../components/AppBar';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import WhatsApp from '../components/WhatsApp';

const GA_TRACKING_ID = process.env.GA_TRACKING_ID; // Replace with your tracking ID

const LoadingOverlay = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      height: '3px',
      bgcolor: 'primary.main',
      animation: 'loading 2s infinite',
    }}
  />
);

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [preventRefresh, setPreventRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    const handleRouteChange = (url) => {
      setIsLoading(true);
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    const handlePreventRefresh = (value) => {
      setPreventRefresh(value);
    };
    router.events.on('preventRefresh', handlePreventRefresh);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('preventRefresh', handlePreventRefresh);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  // Prevent API calls during transition
  useEffect(() => {
    if (preventRefresh) {
      // Optionally show a loading state
      return;
    }

    // Your regular API calls/effects here
  }, [preventRefresh]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Suchitra Foods</title>
        <meta name="title" content="Suchitra Foods" />
        <meta
          name="description"
          content="Your go-to destination for trusted homemade authentic foods. Enjoy our fresh seasonal pickles, aromatic powders, and mouth-watering snacks and sweets."
        />
        {/* Additional Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="shortcut icon" href="/images/ico/suchitra.ico"></link>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/ico//apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/ico//favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/ico//favicon-16x16.png"
        ></link>
        <link rel="canonical" href="https://www.suchitrafoods.com/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400..900;1,400..900&Tangerine:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RegionProvider>
            <CartProvider>
              <Layout>
                <ResponsiveAppBar />
                <main style={{ "margin-top": "70px" }}>
                  {isLoading && <LoadingOverlay />}
                  <Component {...pageProps} />
                  <ToastContainer />
                </main>
                <WhatsApp />
                <Footer />
              </Layout>
            </CartProvider>
          </RegionProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
