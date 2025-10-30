import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import FeaturedSection from '@/components/Shared/FeaturedSection';
import LuxuryCarsSection from '@/components/Shared/LuxuryCarsSection';
import React from 'react';
import Hero from '@/components/Shared/Hero';
import CategoryRides from '@/components/Shared/CategoryRides';

const Home = () => {
  return (
    <div className="mt-24">
      <Hero />
      <FeaturedSection />
      <LuxuryCarsSection />
      <FeaturedDrivers />
      <CategoryRides />
    </div>
  );
};

export default Home;
