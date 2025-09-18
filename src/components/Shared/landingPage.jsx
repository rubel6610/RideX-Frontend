import { Users } from 'lucide-react';
import React from 'react';

const landingPage = () => {
    return (
        

   
   <div>
     <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        
        {/* Rider Section */}
    
        <div className="border rounded-2xl shadow-sm p-8">
                <div className='flex gap-4 bg-gray-300 w-40 p-1 rounded-xl text-primary'>
                    <Users />
                    <h1>For Passengers</h1>
                </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Become a RideX Rider
          </h3>
          <p className="text-gray-600 mb-6">
            Join millions of Riders who choose RideX for safe, reliable, and affordable transportation.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li> Safe & Secure Rides anytime, anywhere</li>
            <li> Affordable pricing with no hidden costs</li>
            <li> 24/7 Availability with dedicated support</li>
          </ul>
          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
            Sign Up as Rider
          </button>
        </div>

        {/* Driver Section */}
        <div className="border rounded-2xl shadow-sm p-8">
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