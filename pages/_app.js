// pages/_app.js
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import theme from '../styles/theme';
import Layout from '../components/Layout';
import '../styles/globals.css';

const GA_TRACKING_ID = process.env.GA_TRACKING_ID; // Replace with your tracking ID

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Suchitra Foods</title>
        <meta name="title" content="Suchitra Foods" />
        <meta
          name="description"
          content="A brief description of your application."
        />
        {/* Additional Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.suchitrafoods.com/" />
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
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
