"use client";
import React, { useState, useEffect } from "react";
import { Clock, Tag, Car, Users, Gift, Bike, CarFront } from "lucide-react";
import Image from "next/image";
import heroRidex from "@/Assets/Terms & Conditions.jpg";
import caroffer from "@/Assets/caroffer.png";
import cngoffer from "@/Assets/offer cnf.png";
import bikeoffer  from "@/Assets/bike offer.png";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

// Offers Data
const offersData = [
  { id: 1, title: "50% Off on First Car Ride", type: "Car", category: "Promotion", discount: "50%", validTill: "2025-09-26", featured: true },
  { id: 2, title: "Flat $5 Off on Bike Ride", type: "Bike", category: "Promotion", discount: "$5", validTill: "2025-10-15", featured: true },
  { id: 3, title: "Shared Ride Cashback 20%", type: "Shared", category: "Promotion", discount: "20%", validTill: "2025-11-01", featured: true },
  { id: 4, title: "CNG Ride Discount 15%", type: "CNG", category: "Promotion", discount: "15%", validTill: "2025-10-18", featured: true },
  { id: 5, title: "Weekend Special: Car Pass 30% Off", type: "Car", category: "Package", discount: "30%", validTill: "2025-10-05", featured: true },
  { id: 6, title: "Refer a Friend and Get $5 Credit", type: "Referral", category: "Referral", discount: "$5", validTill: "2025-12-31", featured: true },
  { id: 7, title: "Morning Ride Offer: $3 Off on Bike", type: "Bike", category: "Promotion", discount: "$3", validTill: "2025-10-20", featured: false },
];

// Countdown Component
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = new Date(targetDate) - new Date();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) return null;

  return (
    <div className="text-sm text-gray-400 dark:text-gray-300 mt-2 flex items-center gap-1">
      <Clock className="w-4 h-4 text-gray-700" />
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
    </div>
  );
};

// Icon Based on Type
const getTypeIcon = (type) => {
  switch (type) {
    case "Car": return <Car className="w-5 h-5 text-primary" />;
    case "Bike": return <Bike className="w-5 h-5 text-primary" />;
    case "CNG": return <CarFront className="w-5 h-5 text-primary" />;
    case "Shared": return <Users className="w-5 h-5 text-primary" />;
    case "Referral": return <Gift className="w-5 h-5 text-primary" />;
    default: return <Tag className="w-5 h-5 text-primary" />;
  }
};

export default function OfferPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const filteredOffers = selectedType === "All" ? offersData : offersData.filter((offer) => offer.type === selectedType);

  const handleApplyCode = (offerExpired) => {
    if (offerExpired) return;
    if (couponCode.trim()) {
      setAppliedCode(couponCode.trim());
      setCouponCode("");
      alert(`Coupon "${couponCode}" applied!`);
    }
  };

  return (
    <div className="min-h-screen mt-18 bg-white dark:bg-gray-800 text-black dark:text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r text-black dark:text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">Grab Amazing Offers on Your Rides!</h1>
        <p className="text-lg md:text-xl mb-6 animate-fadeIn delay-200">Exclusive discounts for our loyal riders. Hurry, limited-time offers!</p>
       
        {/* akhane ami slide bannar chai */}
       {/* Slider Section */}
<div className="w-full flex justify-center">
  <Swiper
    modules={[Pagination, Autoplay]}
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    loop={true}
    className="w-full h-[400px]"
  >
    <SwiperSlide>
      <Image src={caroffer} alt="Car Offer" className="w-full h-full object-contain" />
    </SwiperSlide>
    <SwiperSlide>
      <Image src={bikeoffer} alt="Bike Offer" className="w-full h-full object-contain" />
    </SwiperSlide>
    <SwiperSlide>
      <Image src={cngoffer} alt="CNG Offer" className="w-full h-full object-contain" />
    </SwiperSlide>
  </Swiper>
</div>

      </section>

      {/* Filter Section */}
      <section className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Filter by Ride Type</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {["All", "Car", "Bike", "CNG", "Shared", "Referral"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full border transition cursor-pointer ${
                selectedType === type ? "bg-primary text-white" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-10 px-4 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredOffers.map((offer) => {
          const isExpired = new Date(offer.validTill) < new Date();
          return (
            <div
              key={offer.id}
              className={`bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition relative transform hover:-translate-y-2 duration-300`}
            >
              {offer.featured && (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">⭐ Featured</span>
              )}

              <div className="flex items-center mb-4 gap-2 font-semibold">{getTypeIcon(offer.type)} {offer.type} Ride</div>
              <h3 className="text-xl font-bold mb-2">{offer.title}</h3>

              <span className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full mb-2">{offer.category}</span>

              <p className="text-gray-400 mb-2">
                Discount: <span className="font-semibold text-gray-400">{offer.discount}</span>
              </p>

              {/* Countdown or Expired */}
              {isExpired ? <p className="text-red-500 font-semibold mt-2">❌ Offer Expired</p> : <Countdown targetDate={offer.validTill} />}

              {/* CTA Button */}
              <button
                onClick={() => !isExpired && (window.location.href = "/")}
                disabled={isExpired}
                className={`mt-4 w-full bg-primary text-black dark:text-white py-2 rounded-lg font-semibold hover:bg-primary transition flex items-center justify-center gap-2 cursor-pointer ${isExpired ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {getTypeIcon(offer.type)} Book Now
              </button>

              {/* Coupon Section */}
              {offer.category !== "Referral" && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-2 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                    disabled={isExpired}
                  />
                  <button
                    onClick={() => handleApplyCode(isExpired)}
                    disabled={isExpired}
                    className={`px-4 rounded-r-lg transition cursor-pointer text-white ${isExpired ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-green-700"}`}
                  >
                    Apply
                  </button>
                </div>
              )}

              {appliedCode && !isExpired && (
                <p className="mt-2 text-green-500 text-sm">Coupon "{appliedCode}" applied!</p>
              )}
            </div>
          );
        })}
      </section>

      {/* Terms & Conditions */}
      <section className="py-10 px-6 md:px-20 text-black dark:text-gray-300 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Offers valid only once per user.</li>
            <li>Cannot be combined with other discounts.</li>
            <li>Minimum ride amount may apply.</li>
            <li>Subject to availability and change without notice.</li>
          </ul>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image src={heroRidex} alt="Terms Illustration" className="w-full max-w-md object-contain" />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r py-12 text-center text-black dark:text-white">
        <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
        <p className="mb-6">Subscribe to get the latest offers directly in your inbox.</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-lg border-none w-64 bg-gray-300 text-gray-800" />
          <button className="bg-primary text-black dark:text-white font-semibold px-6 py-2 rounded-r-lg hover:bg-gray-100 transition flex items-center gap-1 cursor-pointer">
            <Tag className="w-4 h-4" /> Subscribe
          </button>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="fixed bottom-70 right-4 z-50">
        <button className="bg-destructive  cursor-pointer text-white px-8 py-3 rounded-xl font-bold hover:bg-destructive/80 transition shadow-lg transform hover:scale-105 flex items-center justify-center gap-2" onClick={() => (window.location.href = "/")}>
          <Tag className="w-5 h-5" /> Grab Your Offer Now
        </button>
      </section>
    </div>
  );
}
