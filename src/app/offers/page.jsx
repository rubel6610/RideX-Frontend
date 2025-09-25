"use client";
import React, { useState, useEffect } from "react";
import { Clock, Tag, Car, Truck, Users, Gift } from "lucide-react";

// Updated offers data with types and categories
const offersData = [
  {
    id: 1,
    title: "50% Off on First Car Ride",
    type: "Car",
    category: "Promotion",
    discount: "50%",
    validTill: "2025-10-10",
    featured: true,
  },
  {
    id: 2,
    title: "Flat $5 Off on Bike Ride",
    type: "Bike",
    category: "Promotion",
    discount: "$5",
    validTill: "2025-10-15",
    featured: false,
  },
  {
    id: 3,
    title: "Shared Ride Cashback 20%",
    type: "Shared",
    category: "Promotion",
    discount: "20%",
    validTill: "2025-11-01",
    featured: true,
  },
  {
    id: 4,
    title: "CNG Ride Discount 15%",
    type: "CNG",
    category: "Promotion",
    discount: "15%",
    validTill: "2025-10-18",
    featured: false,
  },
  {
    id: 5,
    title: "Weekend Special: Car Pass 30% Off",
    type: "Car",
    category: "Package",
    discount: "30%",
    validTill: "2025-10-05",
    featured: true,
  },
  {
    id: 6,
    title: "Refer a Friend and Get $5 Credit",
    type: "Referral",
    category: "Referral",
    discount: "$5",
    validTill: "2025-12-31",
    featured: true,
  },
  {
    id: 7,
    title: "Morning Ride Offer: $3 Off on Bike",
    type: "Bike",
    category: "Promotion",
    discount: "$3",
    validTill: "2025-10-20",
    featured: false,
  },
];

// Countdown Timer Component
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

  if (
    !timeLeft.days &&
    !timeLeft.hours &&
    !timeLeft.minutes &&
    !timeLeft.seconds
  )
    return null;

  return (
    <div className="text-sm text-gray-700 mt-2 flex items-center gap-1">
      <Clock className="w-4 h-4 text-gray-700" />
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      left
    </div>
  );
};

// Function to return icon based on type
const getTypeIcon = (type) => {
  switch (type) {
    case "Car":
      return <Car className="w-5 h-5" />;
    case "Bike":
      return <Truck className="w-5 h-5" />;
    case "CNG":
      return <Tag className="w-5 h-5" />;
    case "Shared":
      return <Users className="w-5 h-5" />;
    case "Referral":
      return <Gift className="w-5 h-5" />;
    default:
      return <Tag className="w-5 h-5" />;
  }
};

export default function OfferPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const filteredOffers =
    selectedType === "All"
      ? offersData
      : offersData.filter((offer) => offer.type === selectedType);

  const handleApplyCode = () => {
    if (couponCode.trim()) {
      setAppliedCode(couponCode.trim());
      setCouponCode("");
      alert(`Coupon "${couponCode}" applied!`);
    }
  };

  return (
    <div className="min-h-screen mt-18 bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r  text-black dark:text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
          Grab Amazing Offers on Your Rides!
        </h1>
        <p className="text-lg md:text-xl mb-6 animate-fadeIn delay-200">
          Exclusive discounts for our loyal riders. Hurry, limited-time offers!
        </p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105 animate-fadeIn delay-400">
          View Offers
        </button>
      </section>

      {/* Filter Section */}
      <section className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Filter by Ride Type</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {["All", "Car", "Bike", "CNG", "Shared", "Referral"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-10 px-4 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition relative transform hover:-translate-y-2 duration-300 ${
              offer.featured ? "border-2 border-yellow-400" : ""
            }`}
          >
            <div className="flex items-center mb-4 gap-2 text-blue-600 font-semibold">
              {getTypeIcon(offer.type)} {offer.type} Ride
            </div>
            <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
            <p className="text-gray-600 mb-2">
              Discount: <span className="font-semibold">{offer.discount}</span>
            </p>

            {/* Countdown */}
            <Countdown targetDate={offer.validTill} />

            {/* CTA Button */}
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
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
                />
                <button
                  onClick={handleApplyCode}
                  className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 transition"
                >
                  Apply
                </button>
              </div>
            )}

            {appliedCode && (
              <p className="mt-2 text-green-500 text-sm">
                Coupon "{appliedCode}" applied!
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Terms & Conditions */}
      <section className=" py-10 px-6 md:px-20 text-black  dark:text-gray-300">
        <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Offers valid only once per user.</li>
          <li>Cannot be combined with other discounts.</li>
          <li>Minimum ride amount may apply.</li>
          <li>Subject to availability and change without notice.</li>
        </ul>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r  py-12 text-center text-black dark:text-white">
        <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
        <p className="mb-6">
          Subscribe to get the latest offers directly in your inbox.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-lg border-none w-64 text-gray-800"
          />
          <button className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-r-lg hover:bg-gray-100 transition flex items-center gap-1">
            <Tag className="w-4 h-4" /> Subscribe
          </button>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 text-center">
        
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
          onClick={() => (window.location.href = "/")}
        >
          <Tag className="w-5 h-5" /> Grab Your Offer Now
        </button>
      </section>
    </div>
  );
}
