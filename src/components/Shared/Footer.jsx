"use client";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import logo from '../../Assets/logo-dark.webp';
import Image from "next/image";


export default function Footer() {
  return (
  <footer className="w-full bg-black/90 text-white pt-16 border-t border-border">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-4">
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

          <h2 className="text-3xl font-semibold text-primary leading-7 mt-3 mb-4">Start your journey with safety.</h2>

          {/* Logo + Social */}
          <div className="mt-3">
            <strong className="text-background">Reach out at </strong>
            <div className="flex gap-2 mt-1">
              <Facebook className="cursor-pointer text-white hover:text-primary w-5.5 transition" />
              <Linkedin className="cursor-pointer text-white hover:text-primary w-5.5 transition" />
              <Twitter className="cursor-pointer text-white hover:text-primary w-5.5 transition" />
              <Youtube className="cursor-pointer text-white hover:text-primary w-5.5 transition" />
            </div>
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">PRODUCT</h3>
          <ul className="space-y-1 text-white">
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Offers</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Pricing</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Contact</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">About us</Link>
            </li>
          </ul>
        </div>

        {/* Use Cases */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">USE CASES</h3>
          <ul className="space-y-1 text-white">
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Rides</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Rider Job</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Become a Rider</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">SPECIALTIES</h3>
          <ul className="space-y-1 text-white">
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Reports</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Quick supports</Link>
            </li>
            <li>
              <Link href="#" className="hover:underline hover:text-primary">Strong safety</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border shadow-xs sm:text-center text-xs py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>©2025 RideX Technologies. All rights reserved</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="#" className="hover:underline hover:text-white transition">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="hover:underline hover:text-white transition">Privacy Policy</Link>
        </div>
      </div>
      </div>
    </footer>
  );
}
