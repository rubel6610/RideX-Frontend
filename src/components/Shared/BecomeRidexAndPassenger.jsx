import { AlarmClockCheck, DollarSign, ShieldCheck, Users } from 'lucide-react';
import React from 'react';

const landingPage = () => {
    return (
   
   <div>
     <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        
        {/* Rider Section */}
    
        <div className="border rounded-2xl  p-8">
                <div className='flex gap-4 bg-gray-300 w-40 p-1 rounded-xl text-primary'>
                    <Users />
                    <h1>For Passengers</h1>
                </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Become a <span className='bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 bg-clip-text text-transparent'>RideX Rider</span>
          </h3>
          <p className="text-gray-600 mb-6">
            Join millions of Riders who choose RideX for safe, reliable, and affordable transportation.
          </p>
          <ul className="space-y-3 text-gray-700">
            <div className='flex gap-2'>
               <span className='text-primary'> <ShieldCheck/></span>
              <h1 className='text-black font-bold'> Safe & Verified</h1>
            </div>
            <li className='ml-8 -mt-4'> Safe & Secure Rides anytime, anywhere</li>
            <div className='flex gap-2'>
              <h1 className='text-primary'>  <DollarSign /></h1>
               <h1 className='text-black font-bold'> Affordable Rates</h1>
            </div>
            <li className='ml-8 -mt-4'> Affordable pricing with no hidden costs</li>
            <div className='flex gap-2'>
                <h1 className='text-primary'><AlarmClockCheck /></h1>
               <h1 className='text-black font-bold'> 24/7 Availability</h1>
            </div>
            <li className='ml-8 -mt-4'> 24/7 Availability with dedicated support</li>
          </ul>
        <button className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
  <Users />
  Sign Up as Rider
</button>

        </div>

        {/* Driver Section */}
        <div className="border rounded-2xl  p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Become a RideX Driver
          </h3>
          <p className="text-gray-600 mb-6">
            Turn your car into a money-making opportunity. Drive on your own schedule with extra earnings.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li> Earn More with flexible hours</li>
            <li> Freedom to drive when you want</li>
            <li> Partner support whenever you need help</li>
          </ul>
          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
            Sign Up as Driver
          </button>
        </div>

      </div>
    </section>
   </div>
        
    );
};

export default landingPage;