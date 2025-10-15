"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/AuthProvider";

export default function PaymentPage() {
  const { user } = useAuth();
  const params = useSearchParams();

  const [rideData, setRideData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Extract data from URL and convert numeric values
  useEffect(() => {
    const data = Object.fromEntries(params.entries());

    const numericKeys = [
      "fare",
      "total",
      "baseFare",
      "distanceFare",
      "timeFare",
      "tax",
      "distance",
      "ratings",
      "completedRides",
    ];

    numericKeys.forEach((key) => {
      if (data[key]) {
        data[key] = Number(data[key]);
      }
    });

    setRideData(data);
    console.log("✅ Ride Data (converted):", data);
  }, [params]);

  // ✅ Prefill user email
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const paymentData = {
    companyName: "SSLCommerz",
    amount: rideData?.fare || rideData?.total || 0,
    currency: "BDT",
    description:
      " SSLCommerz powers Ridex payments with fast, secure, and reliable transactions, keeping your payments safe at all times.",
    address: "93 B, New Eskaton Road, Dhaka-1000, Bangladesh.",
  };

  // ✅ Submit handler
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Please fill in both name and email.");
      return;
    }

    // ✅ Build safe numeric payload for backend
    const payData = {
      username: name,
      userEmail: email,
      rideId: rideData.rideId,
      userId: rideData.userId,
      riderId: rideData.riderId,
      totalNum: Number(rideData.total) || 0,
      baseFareNum: Number(rideData.baseFare) || 0,
      distanceFareNum: Number(rideData.distanceFare) || 0,
      timeFareNum: Number(rideData.timeFare) || 0,
      taxNum: Number(rideData.tax) || 0,
      fareNum: Number(rideData.fare) || 0,
      distance: Number(rideData.distance) || 0,
      vehicleType: rideData.vehicleType,
      pickup: rideData.pickup,
      drop: rideData.drop,
    };

    console.log("💳 Sending payment data:", payData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/init`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payData),
        }
      );

      const data = await response.json();
      console.log("Payment init response:", data);

      if (data.url && data.url.startsWith("http")) {
        window.location.href = data.url;
      } else {
        alert("Payment page unavailable. Try again later.");
      }
    } catch (err) {
      console.error("Payment create error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full bg-card pt-6">
        {/* Left Side */}
        <div className="md:w-1/2 p-8 md:p-12 bg-primary text-black flex flex-col justify-between">
          <div>
            <div className="mb-5 text-left">
              <h2 className="text-xl font-bold flex items-center justify-start">
                SSL<span className="-mb-1 text-background text-base">COMMERZ</span>
              </h2>
            </div>
            <div className="text-5xl font-extrabold mb-9">
              {paymentData.amount}{" "}
              <span className="text-xl font-normal">{paymentData.currency}</span>
            </div>
            <div className="mb-6">
              <p className="text-sm opacity-80 mb-1">Description</p>
              <p className="text-base font-medium leading-4.5">
                {paymentData.description}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">Address</p>
              <p className="text-base font-medium leading-4.5">
                {paymentData.address}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center text-foreground">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold flex items-center justify-center md:justify-start">
              SSL<span className="text-orange-500">COMMERZ</span>
            </h2>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary border-none outline-none"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary border-none outline-none"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md font-semibold text-lg bg-primary text-background hover:opacity-90 cursor-pointer"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
