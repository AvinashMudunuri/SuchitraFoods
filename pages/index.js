// pages/index.js
import React from 'react';

import SignatureProducts from '../components/SignatureProducts';
import Offers from '../components/Offers';
import Faqs from '../components/Faqs';
import Categories from '../components/Categories';
// import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <>
      <Categories />
      <SignatureProducts />
      <Offers />
      <Faqs />
      {/* <Testimonials /> */}
      {/*
      <Special />
      <ContactUs /> */}
    </>
  );
};

export default Home;
