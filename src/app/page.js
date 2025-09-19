import Banner from '@/components/Shared/Banner';
import BeRidersAndPassenger from '@/components/Shared/BeRidersAndPassenger';
import FeaturedDrivers from '@/components/Shared/FeaturedDrivers';
import PassengerSay from '@/components/Shared/PassengerSay';
import PopularRides from '@/components/Shared/PopularRides';
import React from 'react';
import RidexWork from '@/components/Shared/RidexWork'


const Home = () => {
  return (
    <div className='max-w[1440px]'>
      <Banner/>
      <FeaturedDrivers/>
      <PopularRides/>
      <RidexWork/>
      <BeRidersAndPassenger/>
      <PassengerSay/>
    </div>
  );
};

export default Home;