"use client";
//import { Bike, Car } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import heroRidex from "@/Assets/car ridex.jpg";
import Cng from "@/Assets/cng.png";
import { Minus, Plus } from "lucide-react";

export default function AboutPage() {

 const [openSections, setOpenSections] = useState({
    q1: false,
    q2: false,
    q3: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };


  return (
    <div className="min-h-screen  flex flex-col">
      {/* Main content */}
      <main className="flex-1 mt-16 ">
        <div className="relative h-[140vh] bg-gray-500 dark:bg-gray-800 text-white">
          {/* Curved bottom using SVG */}
          <div className="relative bottom-0 left-0 w-full leading-[0]">
            <svg
              viewBox="0 0 1200 300"
              className="w-full h-[80vh] block"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-white dark:fill-gray-900"
                fillOpacity="1"
                d="M0,128L48,144C96,160,192,192,288,208C384,224,480,224,576,213.3C672,203,768,181,864,160C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              ></path>
            </svg>

            {/* Floating Car & Bike Icons */}
            {/* <div className="absolute ml-8 md:ml-38 -mt-46 lg:ml-95 flex justify-center items-center gap-4">
              <div className="reletive w-20 h-20 bg-white border-4 border-gray-800 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-primary font-bold">
                  <Car />
                </span>
              </div>
              <div className="w-20 md:w-40 md:h-40 h-20 lg:w-40 lg:h-40 bg-white border-4 border-gray-800 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-primary font-bold">
                  <Bike />
                </span>
              </div>
              <div className="w-20 relative h-20 bg-white border-4 border-gray-800 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-primary font-bold">
                  <Car />
                </span>
              </div>
            </div> */}
          </div>

          {/* Text on top center */}
          <div className="absolute mt-12 md:mt-16  inset-0  flex flex-col justify-center items-center text-center px-6">
            <h1
              className="text-xl  md:text-4xl  font-bold -mt-160 lg:-mt-150
           text-black dark:text-white"
            >
              We’ll Get You There with RideX
            </h1>
            <p
              className="mt-6 text-sm  md:text-md lg:text-xl max-w-2xl text-gray-500 dark:text-gray-400 leading-relaxed"
              style={{ textAlign: "justify" }}
            >
              At RideX, we are transforming the way people move in the city. Our
              app connects passengers with trusted riders for safe, fast, and
              affordable travel. Whether you need a quick ride across town or
              reliable last-mile delivery, RideX is here to make your journey
              easier. For businesses, we also provide flexible solutions to
              simplify corporate travel.
            </p>
          </div>
           {/* why choose ridex?  */}
         <div className="flex flex-col md:flex-row items-center justify-center gap-28 px-6 md:px-16 -mt-12 md:mt-10 ">
      {/* Left: Image */}
      <div className="flex-shrink-0">
        <Image
          src={heroRidex}
          alt="RideX Hero"
          className="w-full h-60 md:w-80 md:h-80 rounded-xl shadow-lg -mt-8"
        />
      </div>

      {/* Right: Text */}
      <div className="text-center -mt-26 md:text-left max-w-xl">
        <h2 className="text-xl md:text-4xl font-bold text-black dark:text-white mb-4">
          Why Choose RideX?
        </h2>
        <p className="text-gray-300 dark:text-gray-300 text-sm md:text-lg leading-relaxed ">
          RideX is more than just a ride-sharing platform. We connect you with 
          trusted riders to ensure safe, fast, and affordable travel across the city. 
          From quick trips to last-mile deliveries, RideX makes your journey easier. 
          For businesses, we provide flexible corporate travel solutions designed 
          to save time and cost.
        </p>
      </div>
      </div>
        </div>
     {/* new section */}
 <section className="py-16 px-6 md:px-16  bg-gray-500 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        
        {/* Left: Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Our Journey
          </h2>
          <p className="text-gray-300 dark:text-gray-300 text-base md:text-lg leading-relaxed" style={{ textAlign: "justify" }}>
            At RideX, our journey began with a simple idea: to make urban travel safer, faster, and more accessible for everyone. 
            From connecting passengers with trusted riders to offering seamless last-mile delivery solutions, we have continuously innovated 
            to meet the needs of modern cities. Our mission is to transform the way people move, providing reliable, affordable, and 
            efficient transportation while building a community of riders and passengers who can trust each other.
          </p>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Image
            src={Cng}
            alt="Our Journey"
            className="w-64 h-64 md:w-80 md:h-80 rounded-xl shadow-lg object-cover"
          />
        </div>

      </div>
    </section>


    {/* collapes */}
    <div className="min-h-screen bg-gray-500 dark:bg-gray-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
  <h1 className="text-2xl md:text-4xl font-bold mb-8 text-black dark:text-white text-center">
    Frequently Asked Questions
  </h1>

  <div className="w-full max-w-2xl space-y-4">
    {/* Q1 */}
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection("q1")}
        className="w-full flex items-center justify-between p-4 bg-gray-300 dark:bg-gray-700 font-bold text-black dark:text-white"
      >
        <span>🚗 What is RideX?</span>
        {openSections.q1 ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          openSections.q1 ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <p className="p-4 text-gray-700 dark:text-gray-300">
          RideX is a ride-sharing platform that connects passengers with
          trusted drivers. It offers safe, fast, and affordable rides across
          the city.
        </p>
      </div>
    </div>

    {/* Q2 */}
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection("q2")}
        className="w-full flex items-center justify-between p-4 bg-gray-300 dark:bg-gray-700 font-bold text-black dark:text-white"
      >
        <span>💳 How do I pay for a ride?</span>
        {openSections.q2 ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          openSections.q2 ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <p className="p-4 text-gray-700 dark:text-gray-300">
          You can pay seamlessly through the app using mobile banking,
          credit cards, or cash — depending on your preference.
        </p>
      </div>
    </div>

    {/* Q3 */}
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection("q3")}
        className="w-full flex items-center justify-between p-4 bg-gray-300 dark:bg-gray-700 font-bold text-black dark:text-white"
      >
        <span>🛡️ Is RideX safe to use?</span>
        {openSections.q3 ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          openSections.q3 ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <p className="p-4 text-gray-700 dark:text-gray-300">
          Absolutely! All our drivers are verified and trained. We also
          provide 24/7 customer support to ensure your safety during every
          ride.
        </p>
      </div>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}
