"use client";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import logo from '../../../Assets/logo-dark.webp';
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-black border-t text-white px-5 sm:px-6 xl:px-28 ">
      <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Section */}
        <div className="md:col-span-2">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-xl md:text-2xl leading-0 font-bold font-oxygen text-[var(--primary)]"
            >
              <Image
                src={logo}
                alt="RideX Logo"
                width={120}
                height={50}
                className="object-contain"
              />
            </Link>
            <h2 className="text-2xl font-semibold text-primary leading-6.5">Start your journey with safety.</h2>
          </div>

          {/* Logo + Social */}
          <div className="mt-3">
            <strong>outreachPlus</strong>
            <div className="flex gap-2 mt-1 text-gray-500">
              <Facebook className="cursor-pointer hover:text-blue-600 w-5.5" />
              <Linkedin className="cursor-pointer hover:text-blue-700 w-5.5" />
              <Twitter className="cursor-pointer hover:text-sky-500 w-5.5" />
              <Youtube className="cursor-pointer hover:text-red-500 w-5.5" />
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
      <div className="border-t sm:text-center text-xs py-4 text-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between px-6">
        <p>©2025 RIdeX Technologies. All rights reserved</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="#" className="hover:underline">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
