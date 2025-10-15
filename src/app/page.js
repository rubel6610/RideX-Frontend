import BeRidersAndPassenger from '@/components/Shared/BeRidersAndPassenger';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import FeaturedSection from '@/components/Shared/FeaturedSection';
import PopularRides from '@/components/Shared/PopularRides';
import React from 'react';
import RidexWork from '@/components/Shared/HowItWorks';
import Hero from '@/components/Shared/Hero';
import WhatUsersSay from '@/components/Shared/WhatUsersSay';

const Home = () => {
  return (
    <div className="mt-19">
      <Hero />
      <FeaturedSection />
      {/* <Banner/> */}
      <FeaturedDrivers />
      <PopularRides />
      <RidexWork />
      <BeRidersAndPassenger />
      <WhatUsersSay />
    </div>
  );
};

export default Home;
