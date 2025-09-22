// import Banner from '@/components/Shared/Banner';
import BeRidersAndPassenger from '@/components/Shared/BeRidersAndPassenger';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import PassengerSay from '@/components/Shared/WhatUsersSay';
import PopularRides from '@/components/Shared/PopularRides';
import React from 'react';
import RidexWork from '@/components/Shared/HowItWorks'
import Hero from '@/components/Shared/Hero';


const Home = () => {
  return (
    <div className='mt-19'>
      <Hero/>
      {/* <Banner/> */}
      <FeaturedDrivers/>
      <PopularRides/>
      <RidexWork/>
      <BeRidersAndPassenger/>
      <PassengerSay/>
    </div>
  );
};

export default Home;