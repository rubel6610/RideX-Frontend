"use client";
import React, { useState } from "react";
import { Car, Bike, CarFront, Clock, Shield, Users } from "lucide-react";
import Image from "next/image";
import heroRide from "@/Assets/car.png"; // যদি illustration/image থাকে
import ecoIcon from "@/Assets/bike.png"; // optional eco-friendly icon
import { Minus, Plus } from "lucide-react";
import heroRidex from "@/Assets/car ridex.jpg";
import Cng from "@/Assets/cng.png";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r text-black dark:text-white py-24 flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-20">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About RideX</h1>
          <p className="text-lg md:text-xl mb-6 text-gray-500">
            RideX is redefining urban travel by connecting passengers with
            trusted drivers for safe, fast, and affordable rides. Whether it’s a
            car, bike, or CNG, booking a ride is simple and instant.
          </p>
          <button className="bg-primary text-black dark:text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-primary hover:text-black transition transform hover:scale-105">
            Explore Services
          </button>
        </div>
        <div className="md:w-1/2">
          <Image
            src={heroRide}
            alt="Ride Illustration"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* our journey */}

      <section className="py-16 px-6 md:px-16  bg-white dark:bg-gray-900 ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Left: Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Journey
            </h2>
            <p
              className="text-gray-400 dark:text-gray-300 text-base md:text-lg leading-relaxed"
              style={{ textAlign: "justify" }}
            >
              At RideX, our journey began with a simple idea: to make urban
              travel safer, faster, and more accessible for everyone. From
              connecting passengers with trusted riders to offering seamless
              last-mile delivery solutions, we have continuously innovated to
              meet the needs of modern cities. Our mission is to transform the
              way people move, providing reliable, affordable, and efficient
              transportation while building a community of riders and passengers
              who can trust each other.
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

      {/* How It Works Section */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center gap-4">
            <Car className="w-12 h-12 text-primary" />
            <h3 className="font-semibold text-xl">Choose Ride</h3>
            <p className="text-gray-500 dark:text-gray-300">
              Select your preferred ride option: Car, Bike, or CNG.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Clock className="w-12 h-12 text-primary" />
            <h3 className="font-semibold text-xl">Book Instantly</h3>
            <p className="text-gray-500 dark:text-gray-300">
              Book your ride in seconds and track it in real-time.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Users className="w-12 h-12 text-primary" />
            <h3 className="font-semibold text-xl">Ride & Enjoy</h3>
            <p className="text-gray-500 dark:text-gray-300">
              Sit back and enjoy a safe, comfortable, and affordable ride.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 px-6 md:px-20 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose RideX</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            <h4 className="font-semibold">Safe & Verified</h4>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              All drivers are verified for your safety.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <CarFront className="w-10 h-10 text-primary" />
            <h4 className="font-semibold">Affordable Rides</h4>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Competitive pricing without compromising quality.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Bike className="w-10 h-10 text-primary" />
            <h4 className="font-semibold">Eco-Friendly Options</h4>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Bike & CNG rides reduce traffic and emissions.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Clock className="w-10 h-10 text-primary" />
            <h4 className="font-semibold">24/7 Availability</h4>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Book anytime and get a ride instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Impact / Stats Section */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-4xl font-bold text-primary">10,000+</h3>
            <p className="text-gray-500 dark:text-gray-300">Rides Completed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary">5,000+</h3>
            <p className="text-gray-500 dark:text-gray-300">Happy Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary">500+</h3>
            <p className="text-gray-500 dark:text-gray-300">Trusted Drivers</p>
          </div>
        </div>
      </section>

     

      {/* collapes */}
      <div className="min-h-screen bg-white dark:bg-gray-900  flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-black dark:text-white text-center">
          Frequently Asked Questions
        </h1>

        <div className="w-[90%] mx-auto space-y-4">
          {/* Q1 */}
          <div className="border border-accent rounded-lg overflow-hidden">
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
              <p className="p-4 text-gray-300 dark:text-gray-300">
                RideX is a ride-sharing platform that connects passengers with
                trusted drivers. It offers safe, fast, and affordable rides
                across the city.
              </p>
            </div>
          </div>

          {/* Q2 */}
          <div className="border border-accent rounded-lg overflow-hidden">
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
          <div className="border border-accent rounded-lg overflow-hidden">
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
    </div>
  );
}
