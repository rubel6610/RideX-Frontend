"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Bike, Car, BusFront, TextAlignJustify } from 'lucide-react';
import { Moon, Sun } from "lucide-react";
import logo from '../../../Assets/ridex-logo.webp';
import darkLogo from '../../../Assets/logo-dark.webp';
import Sidebar from './Sidebar';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useTheme from "@/app/hooks/themeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideByOpen, setRideByOpen] = useState(false);

  // scroll state
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRideBy = () => setRideByOpen(!rideByOpen);

  // Active + hover style
  const activeStyle = (path) =>
    pathname === path
      ? "font-semibold"
      : " transition-colors duration-300";

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Auto-close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div
        className={` navbar fixed top-0 left-0 right-0 z-[999] bg-white text-black dark:text-white border-b border-[#6CC832]/20 shadow-sm flex items-center justify-between h-19 px-5 sm:px-6 xl:px-28 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center gap-10">
          {/* Left: Brand */}
          <Link
            href="/"
            className="dark:hidden text-xl md:text-2xl leading-0 font-bold "
          >
            <Image
              src={logo}
              alt="RideX Logo"
              width={120}
              height={50}
              className="object-contain"
            />
          </Link>
          <Link
            href="/"
            className="hidden dark:block text-xl md:text-2xl leading-0 font-bold"
          >
            <Image
              src={darkLogo}
              alt="RideX Logo"
              width={120}
              height={50}
              className="object-contain"
            />
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex lg:ml-4 gap-6 font-semibold h-full items-center">
            {/* Ride By dropdown */}
            <div className="relative group h-full flex items-center dropdown-menu">
              <button
                className={`flex items-center gap-1 py-6 text-base font-semibold cursor-pointer `}
              >
                Ride By
                <ChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown menu */}
              <div className="absolute top-full left-0 mt-0.5 border border-[#6CC832]/20 bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col shadow-lg rounded-b overflow-hidden transform transition-all duration-200 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 z-[9999]">
                <Link
                  href="/ride-bike"
                  className={`flex items-center gap-2 pl-4 pr-12 py-2 border-b border-[#6CC832]/20 hover:text-[var(--primary)]  ${activeStyle(
                    "/ride-bike"
                  )}`}
                >
                  <Bike className="text-blue-500 text-xl border p-0.5 rounded" />
                  <span>Bike</span>
                </Link>

                <Link
                  href="/ride-cng"
                  className={`flex items-center gap-2 pl-4 pr-12 py-2 border-b border-[#6CC832]/20 hover:text-[var(--primary)]  ${activeStyle(
                    "/ride-cng"
                  )}`}
                >
                  <BusFront className="text-green-600 text-xl border p-0.5 rounded" />
                  <span>CNG</span>
                </Link>

                <Link
                  href="/ride-car"
                  className={`flex items-center gap-2 px-4 pr-12 py-2 hover:text-[var(--primary)]  ${activeStyle(
                    "/ride-car"
                  )}`}
                >
                  <Car className="text-red-500 text-xl border p-0.5 rounded" />
                  <span>Car</span>
                </Link>
              </div>
            </div>

            <Link
              href="/offers"
              className={`h-full flex items-center hover:text-[var(--primary)]  ${activeStyle("/offers")}`}
            >
              Offers
            </Link>
            <Link
              href="/contact"
              className={`h-full flex items-center hover:text-[var(--primary)]  ${activeStyle("/contact")}`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`h-full flex items-center hover:text-[var(--primary)]  ${activeStyle("/about")}`}
            >
              About
            </Link>
            <Link
              href="/become-rider"
              className={`h-full flex items-center hover:text-[var(--primary)] ${activeStyle(
                "/become-rider"
              )}`}
            >
              Become a Rider
            </Link>
          </nav>
        </div>

        {/* Right: Theme Toggle + Ride Now + Hamburger */}
        <div className="flex items-center">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          >
            {/* Sun icon */}
            <Sun
              className={`absolute  text-xl transition-all duration-300 ${theme === "dark" ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
            />

            {/* Moon icon */}
            <Moon
              className={`absolute  text-lg transition-all duration-300 ${theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
            />
          </button>

          {/* Ride Now Button */}
          <Button variant="outline" size="icon" className="h-[2.8rem] w-30 text-base border border-[#6CC832]/20 font-semibold  mr-3 ml-1 button btn-primary">
            <Link
              href="/register"
            >
              Sign Up
            </Link>
          </Button>

          {/* Hamburger */}
          <div className="lg:hidden flex items-center">
            <TextAlignJustify
              className="text-2xl cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        </div>
      </div>

      {/* Sidebar Component */}
     <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        rideByOpen={rideByOpen}
        toggleRideBy={toggleRideBy}
        showNavbar={showNavbar}
      />
    </>
  );
};

export default Navbar;
