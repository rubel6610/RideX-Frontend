import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import FeaturedSection from '@/components/Shared/FeaturedSection';
import LuxuryCarsSection from '@/components/Shared/LuxuryCarsSection';
import React from 'react';
import Hero from '@/components/Shared/Hero';
import CategoryRides from '@/components/Shared/CategoryRides';

const Home = () => {
  return (
    <div className="mt-19">
      <Hero />
      <FeaturedSection />
      <LuxuryCarsSection />
      {/* <Banner/> */}
      <FeaturedDrivers />
      <CategoryRides />
      {/* <BeRidersAndPassenger /> */}
    </div>
  );
};

export default Home;
