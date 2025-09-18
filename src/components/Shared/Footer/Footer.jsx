// components/Footer.jsx
"use client";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="bg-black border-t text-white px-5 sm:px-6 xl:px-28 ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Section */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-semibold text-primary">Start your free trial today</h2>
          <div className="mt-4 text-sm">
            <p className="">
              <strong>Call Us</strong>
            </p>
            <p className="text-gray-300">UK: +44 1223 567 636</p>
            <p className="text-gray-300">USA: +1 (855) 976-2571</p>
          </div>
          {/* Logo + Social */}
          <div className="mt-6">
            <p className="text-xl font-bold">outreachPlus</p>
            <div className="flex gap-3 mt-3 text-gray-500">
              <Facebook className="cursor-pointer hover:text-blue-600" />
              <Linkedin className="cursor-pointer hover:text-blue-700" />
              <Twitter className="cursor-pointer hover:text-sky-500" />
              <Youtube className="cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-xl font-semibold mb-3">PRODUCT</h3>
          <ul className="space-y-1 text-gray-300">
            <li>
              <Link href="#" className="hover:underline">Offers</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Pricing</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Contact</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">About us</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* Use Cases */}
        <div>
          <h3 className="text-xl font-semibold mb-3">USE CASES</h3>
          <ul className="space-y-1 text-gray-300">
            <li>
              <Link href="#" className="hover:underline">Rides</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Rider Job</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Become a Rider</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xl font-semibold mb-3">SPECIALTIES</h3>
          <ul className="space-y-1 text-gray-300">
            <li>
              <Link href="#" className="hover:underline">Reports</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Quick supports</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">Strong safety</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t text-center text-xs py-4 text-gray-400 flex flex-col md:flex-row items-center justify-between px-6">
        <p>©2025 RIdeX Technologies. All rights reserved</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="#" className="hover:underline">Terms of Service</Link>
          <Link href="#" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
