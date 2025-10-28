'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import Lottie from 'lottie-react';
import logo from '../../../Assets/ridex-logo.webp';
import darkLogo from '../../../Assets/logo-dark.webp';
import sidebarCar from '../../../Assets/sidebar-car.json';
import { useAuth } from '@/app/hooks/AuthProvider';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const {user} = useAuth();
  const overlayRef = useRef(null);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
  }, [sidebarOpen]);

  // Close sidebar when clicking anywhere outside the sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        overlayRef.current &&
        !overlayRef.current.contains(e.target.closest('aside'))
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // for mobile touch

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [sidebarOpen, toggleSidebar]);

  // Detect screen width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <div
      ref={overlayRef}
      className={`fixed top-0 right-0 h-screen w-full bg-black/40 backdrop-blur-sm z-[997] transform transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative h-screen w-full flex justify-end">
     <aside
  onWheel={(e) => e.stopPropagation()} 
  className={`w-[360px] h-screen bg-background text-foreground shadow-lg p-8 relative flex flex-col overflow-y-auto custom-scrollbar transition-all duration-300 ${
    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>

          {/* Close button */}
          <button
            className="absolute right-6 top-6 w-8 h-8 flex flex-col items-center justify-center bg-primary text-white cursor-pointer transition-transform duration-300 ease-in-out rotate-45 hover:rotate-[130deg] hover:text-black"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          {/* Logo and intro */}
          <div className="mt-10">
            <Link href="/" className="dark:hidden" onClick={toggleSidebar}>
              <Image src={logo} alt="RideX Logo" width={140} height={56} />
            </Link>
            <Link
              href="/"
              className="hidden dark:block"
              onClick={toggleSidebar}
            >
              <Image src={darkLogo} alt="RideX Logo" width={140} height={56} />
            </Link>

            <p className="text-base leading-4.5 text-muted-foreground mt-4">
              RideX makes your travel easy, fast, and safe — whether you choose
              a bike, car, or CNG, you can enjoy a smooth and reliable ride
              anytime, anywhere.
            </p>
          </div>

          {/* Show car animation on desktop (when nav links are hidden) */}
          {isDesktop && (
            <div className="absolute top-30 left-8 flex justify-center items-center overflow-hidden">
              <Lottie
                animationData={sidebarCar}
                loop
                autoplay
                className="w-full h-99"
              />
            </div>
          )}

          {/* Links for smaller devices */}
          {!isDesktop && (
            <div className="flex flex-col font-medium uppercase my-4">
              <Link
                href="/"
                className="py-2 font-semibold hover:text-primary"
                onClick={toggleSidebar}
              >
                Home
              </Link>

              <Link
                href="/offers"
                className="py-2 font-semibold hover:text-primary"
                onClick={toggleSidebar}
              >
                Offers
              </Link>
              <Link
                href="/contact"
                className="py-2 font-semibold hover:text-primary"
                onClick={toggleSidebar}
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="py-2 font-semibold hover:text-primary"
                onClick={toggleSidebar}
              >
                About
              </Link>
              <Link
                href="/blogs"
                className="py-2 font-semibold hover:text-primary"
                onClick={toggleSidebar}
              >
                Blogs
              </Link>
              <Link
                href="/become-rider"
                className="py-2 font-semibold hover:text-primary"
                onClick={toggleSidebar}
              >
                Become a Rider
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto lg:mt-40 pt-6 border-t border-border">
            <h4 className="font-semibold mb-3 text-lg text-primary">
              Contact Info
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="text-primary w-4 h-4" /> 85 Ketch Harbour
                Road, Bensalem, PA 19020
              </p>
              <p className="flex items-center gap-2">
                <Mail className="text-primary w-4 h-4" /> support@ridex.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="text-primary w-4 h-4" /> +880 999 695 695 35
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:opacity-80 transition"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:opacity-80 transition"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:opacity-80 transition"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:opacity-80 transition"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;