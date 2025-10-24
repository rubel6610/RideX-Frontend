"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube, Mail, Phone, Clock, ArrowUp } from 'lucide-react';
import logo from '../../Assets/logo-white-text.webp';
import Image from "next/image";

export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.round(scrollPercent));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="relative w-full text-white overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/Assets/footer-bg.png')"
        }}
      />

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black" />

      {/* Content */}
      <div className="relative z-10">
        {/* Top Contact Bar */}
        <div className="">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start sm:items-center py-10 border-b border-gray-600/50">
              {/* Column 1 - Logo */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-start mb-4 sm:mb-0">
                <Image
                  src={logo}
                  alt="RideX Logo"
                  width={120}
                  height={50}
                  className="object-contain"
                />
              </div>

              {/* Column 2 - Send Email */}
              <div className="col-span-1 flex items-center gap-3 justify-start">
                <div className="w-10 h-10 bg-primary group-hover:bg-white transition-all duration-400 group-hover:scale-110 group-hover:-translate-y-1 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-xs sm:text-sm">Send Email</p>
                  <p className="text-white font-medium text-sm sm:text-base relative group cursor-pointer">
                    info@ridex.com
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 ease-out"></span>
                  </p>
                </div>
              </div>

              {/* Column 3 - Call Agent */}
              <div className="col-span-1 flex items-center gap-3 justify-start">
                <div className="w-10 h-10 bg-primary group-hover:bg-white transition-all duration-400 group-hover:scale-110 group-hover:-translate-y-1 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-xs sm:text-sm">Call Agent</p>
                  <p className="text-white font-medium text-sm sm:text-base relative group cursor-pointer">
                    +880 1770000000
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 ease-out"></span>
                  </p>
                </div>
              </div>

              {/* Column 4 - Opening Time */}
              <div className="col-span-1 flex items-center gap-3 justify-start">
                <div className="w-10 h-10 bg-primary group-hover:bg-white transition-all duration-400 group-hover:scale-110 group-hover:-translate-y-1 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-xs sm:text-sm">Opening Time</p>
                  <p className="text-white font-medium text-sm sm:text-base relative group cursor-pointer">
                  Mon - Fri : 8am - 7pm
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 ease-out"></span>
                  </p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About RideX */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-white mb-4">About <span className="text-primary">RideX</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                RideX is premier ride-sharing platform offering bikes, CNG, and cars with real-time tracking and professional drivers.
              </p>
              <div className="flex gap-3">
                <div className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
                  <Linkedin className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
                  <Youtube className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Quick <span className="text-primary">Links</span></h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/offers" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Offers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Blog & News
                  </Link>
                </li>
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Useful <span className="text-primary">Links</span></h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/user/support" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                      <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/complain" className="hover:text-primary hover:translate-x-2 transition-all duration-400 ease-in-out inline-block relative group">
                      <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-primary text-lg">•</span>
                    Complain
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Notification */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Get <span className="text-primary">Notification</span></h3>
              <p className="text-gray-400 text-sm mb-4">
                Get Notification From Our Latest News! Enter Your Email Here
              </p>
              <div className="relative mb-3">
                <input
                  type="email"
                  placeholder="Enter Mail"
                  className="w-full px-4 py-3 pr-12 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out">
                SUBSCRIBE NOW
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-600/50">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                © Copyright 2025 RideX.Com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {scrollProgress > 0 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50 overflow-hidden"
          style={{
            background: `conic-gradient(#000000 ${scrollProgress}%, #ffffff ${scrollProgress}%)`
          }}
        >
          <div className="absolute inset-1 bg-primary rounded-full flex items-center justify-center">
            {scrollProgress === 100 ? (
              <ArrowUp className="w-6 h-6 text-white" />
            ) : (
              <span className="text-white text-md font-semibold">{scrollProgress}%</span>
            )}
          </div>
        </button>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-20 h-20">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent transform rotate-45"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="w-full h-full bg-gradient-to-tl from-primary/20 to-transparent transform rotate-45"></div>
      </div>
    </footer>
  );
}
