// pages/index.js
import React from 'react';
import { useRouter } from 'next/router';
import SignatureProducts from '../components/SignatureProducts';
import Offers from '../components/Offers';
import Faqs from '../components/Faqs';
import Categories from '../components/Categories';
// import Testimonials from '../components/Testimonials';
import Banner from '../components/Banner';
import { useAnalytics } from '../lib/useAnalytics';
import { getProductCategories } from '../pages/api/products';

export const getStaticProps = async () => {
  const categories = await getProductCategories();
  return {
    props: { categories },
  };
};

const Home = ({ categories }) => {
  const noBannerPaths = ['/cart', '/checkout', '/order-success'];
  const router = useRouter();
  const { trackEvent } = useAnalytics();

  return (
    <>

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
      <Categories categories={categories} />
      <SignatureProducts />
      <Offers />
      {/* <Faqs /> */}
      {/* <Testimonials /> */}
      {/*
      <Special />
      <ContactUs /> */}
    </>
  );
};

export default Home;
