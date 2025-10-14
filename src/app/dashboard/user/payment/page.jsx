"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/AuthProvider"; // ✅ make sure path is correct

export default function PaymentPage() {
  const { user } = useAuth(); // ✅ getting logged in user
  const params = useSearchParams();

  const [rideData, setRideData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Extract all URL data and set as object
  useEffect(() => {
    const data = Object.fromEntries(params.entries());
    setRideData(data);
    console.log("Ride Data from URL:", data);
  }, [params]);

  // ✅ Set user info as default values
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  // Payment details - keep as is
  const paymentData = {
    companyName: "SSLCommerz",
    amount: rideData?.fare,
    currency: "BDT",
    description:
      "SSLCommerz powers Ridex payments with fast, secure, and reliable transactions, keeping your payments safe at all times.",
    address: "93 B, New Eskaton Road, Dhaka-1000, Bangladesh.",
  };

  const handlePaymentSubmit = async(e) => {
    e.preventDefault();

    try {
      if (!name || !email) {
        alert("Please fill in both name and email to proceed.");
        return;
      }

      // ✅ Log everything (for now)
      const payData = {
        username: name,
        userEmail: email,
        ...rideData,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payData),
      });

      const data = await response.json();
      console.log("Payment initiation response:", data);
      const gatewayUrl = data.url;

      if (gatewayUrl && gatewayUrl.startsWith("http")) {
        window.location.href = gatewayUrl; // redirect to SSLCommerz payment page
      } else {
        alert("Payment page unavailable. Please try again later.");
      }
    } catch (error) {
      console.error("Payment create error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full bg-card pt-6">
        {/* Left Side: Payment Details Card */}
        <div className="md:w-1/2 p-8 md:p-12 h-full flex flex-col justify-between bg-primary text-black">
          <div>
            <div className="mb-5 text-left">
              <h2 className="text-xl text-foreground font-bold flex items-center justify-start">
                SSL
                <span className="-mb-1 text-background text-base">
                  COMMERZ
                </span>
                <svg
                  className="ml-1 w-5 h-5 fill-background"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.975-2.73a9.998 9.998 0 0115.95 0L10 10.45l-7.975 4.82zM10 4a6 6 0 00-5.83 4.26A9.998 9.998 0 0110 4zm0 12a9.998 9.998 0 01-8.12-4.13L10 11.55l8.12 4.32A9.998 9.998 0 0110 16z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </h2>
            </div>

            <div className="text-5xl font-extrabold mb-9">
              {paymentData.amount}{" "}
              <span className="text-xl font-normal">
                {paymentData.currency}
              </span>
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

        {/* Right Side: Payment Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center text-foreground">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold flex items-center justify-center md:justify-start">
              SSL<span className="text-orange-500">COMMERZ</span>
              <svg
                className="ml-2 w-7 h-7 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.975-2.73a9.998 9.998 0 0115.95 0L10 10.45l-7.975 4.82zM10 4a6 6 0 00-5.83 4.26A9.998 9.998 0 0110 4zm0 12a9.998 9.998 0 01-8.12-4.13L10 11.55l8.12 4.32A9.998 9.998 0 0110 16z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </h2>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary border-none outline-none transition duration-150 ease-in-out"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary border-none outline-none transition duration-150 ease-in-out"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-md font-semibold text-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-background hover:opacity-90 cursor-pointer"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
