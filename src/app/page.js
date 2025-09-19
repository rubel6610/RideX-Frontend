import Banner from '@/components/Shared/Banner';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import React from 'react';

const Home = () => {
  return (
    <div className='mt-18'>
      <Banner/>
      <FeaturedDrivers/>
    </div>
  );
};

export default Home;