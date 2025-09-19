import {
  AlarmClockCheck,
  Car,
  DollarSign,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
const BeRidersAndPassenger = () => {
  return (
    <div>
      <section className="py-16">
        <div className="max-w-7xl  mx-auto px-6 grid md:grid-cols-2 gap-10">
          {/* Rider Section */}

          <div className="border border-[#90fc47]/20 rounded-2xl  p-8">
            <div className="flex gap-4 bg-[#90fc47]/16 :bg-gray-800 w-40 p-1 rounded-xl text-primary">
              <span className="text-[#90fc47] ml-1">
                <Users />
              </span>
              <h1 className="text-primary dark:text-primary">For Passengers</h1>
            </div>
            <h3 className="text-2xl mt-2 font-semibold text-black dark:text-white mb-4">
              Become a
              <span className="ml-2 bg-gradient-to-r from-[#a8ff70] via-[#90fc47] to-[#6dbd2f] bg-clip-text text-transparent">
                RideX Passenger
              </span>
            </h3>
            <p className=" text-gray-600 dark:text-gray-300 mb-6">
              Join millions of Riders who choose RideX for safe, reliable, and
              affordable transportation.
            </p>
            <ul className="space-y-3 text-gray-700">
              <div className="flex gap-2">
                <h1 className="text-primary   bg-[#90fc47]/20 dark:bg-[#90fc47]/4 rounded p-1">
                  <span className="text-[#90fc47]">
                    <ShieldCheck />
                  </span>
                </h1>
                <h1 className="font-bold text-black dark:text-white">
                  Safe & Verified
                </h1>
              </div>
              <li className="ml-10 -mt-4 text-gray-600 dark:text-gray-300 text">
                Safe & Secure Rides anytime, anywhere
              </li>
              <div className="flex gap-2">
                <h1 className="text-primary   bg-[#90fc47]/20 dark:bg-[#90fc47]/4 rounded p-1">
                  <span className="text-[#90fc47]">
                    <DollarSign />
                  </span>
                </h1>
                <h1 className="font-bold text-black dark:text-white">
                  Affordable Rates
                </h1>
              </div>
              <li className="ml-10 -mt-4 text-gray-600 dark:text-gray-300">
                Affordable pricing with no hidden costs
              </li>
              <div className="flex gap-2 ">
                <h1 className="  bg-[#90fc47]/20 dark:bg-[#90fc47]/4 p-1 rounded">
                  <span className="text-[#90fc47]">
                    <AlarmClockCheck />
                  </span>
                </h1>
                <h1 className="font-bold text-black dark:text-white">24/7 Availability</h1>
              </div>
              <li className="ml-10 -mt-4 text-gray-600 dark:text-gray-300">
                24/7 Availability with dedicated support
              </li>
            </ul>
            <button className="mt-6 w-full flex items-center justify-center gap-2 bg-[#90fc47] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#90fc47]/80 transition">
              <Users />
              Sign Up as Rider
            </button>
            <h1 className="text-gray-600 dark:text-gray-300 mt-6 text-center">Already have an account? <span className="text-[#90fc47]">Sign in here</span></h1>
          </div>

          {/* Driver Section */}
          <div className="border border-[#90fc47]/20 rounded-2xl  p-8">
            <div className="flex gap-2  bg-[#90fc47]/16 :bg-gray-800 w-40 p-1 rounded-xl text-primary">
              <span className="text-[#90fc47] ml-2">
                <Car />
              </span>
              <h1 className="text-primary dark:text-primary">For Drivers</h1>
            </div>
            
              
             <h3 className="text-2xl mt-2 font-semibold text-black dark:text-white mb-4">
              Become a
              <span className="ml-2 bg-gradient-to-r from-[#a8ff70] via-[#90fc47] to-[#6dbd2f] bg-clip-text text-transparent">
                RideX Rider
              </span>
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Turn your car into a money-making opportunity. Drive on your own
              schedule with extra earnings.
            </p>
            <ul className="space-y-3 text-gray-700">
              <div className="flex gap-2">
                <h1 className="text-primary p-1  bg-[#90fc47]/20 dark:bg-[#90fc47]/4 rounded">
                  <span className="text-[#90fc47]">
                    <DollarSign />
                  </span>
                </h1>
                <span className="font-bold text-black dark:text-white">
                  Earn More
                </span>
              </div>

              <li className="ml-10 -mt-4 text-gray-600 dark:text-gray-300"> Earn More with flexible hours</li>
              <div className="flex ga-2">
                <h1 className="text-primary p-1  bg-[#90fc47]/20 dark:bg-[#90fc47]/4 rounded">
                  <span className="text-[#90fc47]">
                    <AlarmClockCheck />
                  </span>
                </h1>
                <span className="font-bold ml-2 text-black dark:text-white">
                  Flexible Schedule
                </span>
              </div>
              <li className="ml-10 -mt-4 text-gray-600 dark:text-gray-300"> Freedom to drive when you want</li>
              <div className="flex gap-2 items-center">
                <h1 className="p-1 rounded bg-[#90fc47]/20 dark:bg-[#90fc47]/4 ">
                  <span className="text-[#90fc47]">
                    <Star />
                  </span>
                </h1>
                <span className="font-bold text-black dark:text-white">
                  Driver Support
                </span>
              </div>

              <li className="ml-10 -mt-4 text-gray-600 dark:text-gray-300">
                Partner support whenever you need help
              </li>
            </ul>

            <button className="mt-6 w-full flex items-center justify-center text-black gap-2 bg-[#90fc47]  px-6 py-3 rounded-lg font-medium hover:bg-[#90fc47]/90 transition">
              Apply to Driver
            </button>
              <h1 className="text-gray-600 dark:text-gray-300 mt-6 text-center">Requirements: Valid license,insurance, and vehicle inspection</h1>

          </div>
          
        </div>
      </section>
    </div>
  );
};

export default BeRidersAndPassenger;
