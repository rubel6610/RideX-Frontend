import BeRidersAndPassenger from '@/components/Shared/BeRidersAndPassenger';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import FeaturedSection from '@/components/Shared/FeaturedSection';
import LuxuryCarsSection from '@/components/Shared/LuxuryCarsSection';
import PopularRides from '@/components/Shared/PopularRides';
import React from 'react';
import Hero from '@/components/Shared/Hero';

const Home = () => {
  return (
    <div className="mt-19">
      <Hero />
      <FeaturedSection />
      <LuxuryCarsSection />
      {/* <Banner/> */}
      <FeaturedDrivers />
      <PopularRides />
      <BeRidersAndPassenger />
    </div>
  );
};

export default Home;
