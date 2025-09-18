import Banner from '@/components/Shared/Banner';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import PopularRides from '@/components/Shared/PopularRides';
import React from 'react';

const Home = () => {
  return (
    <div className=''>
      <Banner/>
      <FeaturedDrivers/>
      <PopularRides/>
    </div>
  );
};

export default Home;