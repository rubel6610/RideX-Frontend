import Banner from '@/components/Shared/Banner';
import BecomeRidexAndPassenger from '@/components/Shared/BecomeRidexAndPassenger';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import React from 'react';

const Home = () => {
  return (
    <div className=''>
      <Banner/>
      <FeaturedDrivers/>
      <BecomeRidexAndPassenger/>
    </div>
  );
};

export default Home;