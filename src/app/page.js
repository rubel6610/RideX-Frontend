import Banner from '@/components/Shared/Banner';
import React from 'react';
import FeaturedDrivers from './../components/Shared/FeaturedDrivers';

const Home = () => {
  return (
    <div className='mt-18'>
      <Banner/>
      <FeaturedDrivers/>
    </div>
  );
};

export default Home;