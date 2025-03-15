import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { useRouter } from 'next/router';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const Banner = ({
  slides,
  height,
  autoplay = true,
  effect = 'fade',
  loop = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // Default slides if none provided
  const defaultSlides = [
    {
      image: '/images/hero.jpg',
      title: 'Authentic Flavors of Andhra & Telangana',
      description: 'Bringing traditional tastes to your table',
      buttonText: 'Explore Products',
      buttonAction: () => router.push('/category'),
    },
    {
      image: '/images/special_2.jpg',
      title: 'Handcrafted with Love',
      description: 'Every product is made with care and tradition',
      buttonText: 'Our Story',
      buttonAction: () => router.push('/about'),
    },
    {
      image: '/images/special_3.jpg',
      title: 'Premium Quality Ingredients',
      description: 'Sourced from the finest regions of South India',
    },
  ];

  const bannerSlides = slides || defaultSlides;
  const bannerHeight = height || { xs: '400px', md: '500px' };

  return (
    <Box
      sx={{
        width: '100%',
        height: bannerHeight,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Swiper
        effect={effect}
        autoplay={autoplay ? {
          delay: 5000,
          disableOnInteraction: false,
        } : false}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={!isMobile}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        loop={loop}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Dark overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 1,
                }}
              />

              {/* Content */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  textAlign: 'center',
                  color: 'white',
                  maxWidth: '90%',
                  padding: { xs: '20px', md: '40px' },
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(0)',
                  animation: 'fadeIn 0.5s ease-in-out',
                }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontSize: { xs: '24px', sm: '32px', md: '42px' },
                    fontWeight: 700,
                    marginBottom: '16px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {slide.title}
                </Typography>

                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    fontSize: { xs: '14px', sm: '16px', md: '18px' },
                    marginBottom: '24px',
                    maxWidth: '800px',
                    mx: 'auto',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {slide.description}
                </Typography>

                {slide.buttonText && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={slide.buttonAction}
                    sx={{
                      padding: { xs: '8px 16px', md: '10px 24px' },
                      fontSize: { xs: '14px', md: '16px' },
                      fontWeight: 600,
                      borderRadius: '30px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                      },
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                )}
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom styles for Swiper pagination */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: white;
          opacity: 0.6;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: ${theme.palette.primary.main};
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

Banner.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      buttonText: PropTypes.string,
      buttonAction: PropTypes.func,
    })
  ),
  height: PropTypes.object,
  autoplay: PropTypes.bool,
  effect: PropTypes.string,
  loop: PropTypes.bool,
};

export default Banner;
