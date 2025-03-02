import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    // Compound checks
    isSmallScreen: isMobile || isTablet,
    isLargeDevice: isDesktop || isLargeScreen,
    // Current breakpoint
    breakpoint: isMobile
      ? 'mobile'
      : isTablet
        ? 'tablet'
        : isDesktop
          ? 'desktop'
          : 'largeScreen',
  };
};
