// app/payment/page.jsx
"use client"; // This is a client component

import React, { useState } from 'react';
import { Copy } from 'lucide-react'; // Using lucide-react for icons

export default function PaymentPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Payment details - you would typically fetch these dynamically
  const paymentData = {
    companyName: 'SSLCommerz',
    amount: '323.00',
    currency: 'EUR',
    paymentId: 'EP2e11-f018-RQR12',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    address: '123 Payment Street, Transaction City, 12345, Country.',
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!'); // Basic feedback
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in both name and email to proceed.');
      return;
    }
    console.log("Payment form submitted:", { name, email, paymentId: paymentData.paymentId });
    // TODO: Integrate with your backend to initiate SSLCommerz payment
    alert(`Initiating payment for ${name} (${email}) for ${paymentData.amount} ${paymentData.currency}.`);

    // Reset form after submission (optional)
    setName('');
    setEmail('');
  };

  return (
    <div
      className="flex items-center justify-center" 
    >
      <div
        className="rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full bg-card"
      >
        {/* Left Side: Payment Details Card */}
        <div
          className="md:w-1/2 p-8 md:p-12 h-full flex flex-col justify-between bg-primary text-black"
        >
          <div>
            {/* SSLCommerz Logo/Text */}
            <div className="mb-5 text-center md:text-left">
              <h2 className="text-xl text-foreground font-bold flex items-center justify-center md:justify-start">
                SSL<span className="-mb-1 text-background text-base">COMMERZ</span>
                <svg className="ml-1 w-5 h-5 fill-background" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.975-2.73a9.998 9.998 0 0115.95 0L10 10.45l-7.975 4.82zM10 4a6 6 0 00-5.83 4.26A9.998 9.998 0 0110 4zm0 12a9.998 9.998 0 01-8.12-4.13L10 11.55l8.12 4.32A9.998 9.998 0 0110 16z" clipRule="evenodd"></path></svg>
              </h2>
            </div>


            {/* Amount */}
            <div className="text-5xl font-extrabold mb-9">
              {paymentData.amount} <span className="text-xl font-normal">{paymentData.currency}</span>
            </div>

            {/* Payment ID */}
            <div className="mb-5">
              <p className="text-sm opacity-80 -mb-2.5">Payment ID</p>
              <div
                className="flex items-center p-3 rounded-md">
                <span className="-ml-3 font-mono text-lg flex-grow truncate font-semibold">{paymentData.paymentId}</span>
                <button
                  onClick={() => handleCopy(paymentData.paymentId)}
                  className="ml-3 p-1 rounded hover:opacity-80 focus:outline-none cursor-pointer"
                  aria-label="Copy Payment ID"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm opacity-80 mb-1">Description</p>
              <p className="text-base font-medium leading-4.5">{paymentData.description}</p>
            </div>

            {/* Address */}
            <div>
              <p className="text-sm opacity-80 mb-1">Address</p>
              <p className="text-base font-medium leading-4.5">{paymentData.address}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center text-foreground" >
          {/* SSLCommerz Logo/Text */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold flex items-center justify-center md:justify-start">
              SSL<span className="text-orange-500">COMMERZ</span>
              {/* This SVG is just a placeholder; replace with actual SSLCommerz logo image if available */}
              <svg className="ml-2 w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.975-2.73a9.998 9.998 0 0115.95 0L10 10.45l-7.975 4.82zM10 4a6 6 0 00-5.83 4.26A9.998 9.998 0 0110 4zm0 12a9.998 9.998 0 01-8.12-4.13L10 11.55l8.12 4.32A9.998 9.998 0 0110 16z" clipRule="evenodd"></path></svg>
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