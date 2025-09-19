"use client";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import logo from '../../Assets/logo-dark.webp';
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="section-footer text-white px-5 sm:px-6 xl:px-28 ">
      <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Section */}
          <div className="md:col-span-2">
            <Link
              href="/"
            >
              <Image
                src={logo}
                alt="RideX Logo"
                width={120}
                height={50}
                className="object-contain"
              />
            </Link>

          <h2 className="text-3xl font-semibold text-[var(--primary)] leading-7 mt-3 mb-4">Start your journey with safety.</h2>  

          {/* Logo + Social */}
          <div className="mt-3">
            <strong className="text-gray-300">outreachPlus</strong>
            <div className="flex gap-2 mt-1">
              <Facebook className="cursor-pointer hover:text-blue-600 w-5.5" />
              <Linkedin className="cursor-pointer hover:text-blue-700 w-5.5" />
              <Twitter className="cursor-pointer hover:text-sky-500 w-5.5" />
              <Youtube className="cursor-pointer hover:text-red-500 w-5.5" />
            </div>
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-200">PRODUCT</h3>
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
          </ul>
        </div>

        {/* Use Cases */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-200">USE CASES</h3>
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
          <h3 className="text-xl font-semibold mb-3 text-gray-200">SPECIALTIES</h3>
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
      <div className="border-t sm:text-center text-xs py-4 text-gray-300 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>©2025 RIdeX Technologies. All rights reserved</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="#" className="hover:underline">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
