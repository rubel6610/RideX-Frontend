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
        className={`fixed top-0 left-0 right-0 z-[999] bg-background shadow-sm flex items-center justify-between px-5 sm:px-6 xl:px-28 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center gap-10">
          {/* Left: Brand */}
          <Link
            href="/"
            className="dark:hidden text-xl md:text-2xl leading-0 font-bold font-oxygen text-[var(--primary)]"
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
            className="hidden dark:block text-xl md:text-2xl leading-0 font-bold font-oxygen text-[var(--primary)]"
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
            <div className="relative group h-full flex items-center">
              <button
                className={`flex items-center gap-1 py-6 text-base font-semibold cursor-pointer ${activeStyle(
                  "/ride-bike"
                )}`}
              >
                Ride By
                <ChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown menu */}
              <div className="absolute top-full left-0 mt-0.5 border border-border bg-background flex flex-col shadow-lg rounded-b overflow-hidden transform transition-all duration-200 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 z-[9999]">
                <Link
                  href="/ride-bike"
                  className={`flex items-center gap-2 pl-4 pr-12 py-2 border-b border-border ${activeStyle(
                    "/ride-bike"
                  )}`}
                >
                  <Bike className="text-blue-500 text-xl border p-0.5 rounded" />
                  <span>Bike</span>
                </Link>

                <Link
                  href="/ride-cng"
                  className={`flex items-center gap-2 pl-4 pr-12 py-2 border-b border-border ${activeStyle(
                    "/ride-cng"
                  )}`}
                >
                  <BusFront className="text-green-600 text-xl border-b border-border p-0.5 rounded" />
                  <span>CNG</span>
                </Link>

                <Link
                  href="/ride-car"
                  className={`flex items-center gap-2 px-4 pr-12 py-2 ${activeStyle(
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
              className={`h-full flex items-center ${activeStyle("/offers")}`}
            >
              Offers
            </Link>
            <Link
              href="/contact"
              className={`h-full flex items-center ${activeStyle("/contact")}`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`h-full flex items-center ${activeStyle("/about")}`}
            >
              About
            </Link>
            <Link
              href="/become-rider"
              className={`h-full flex items-center ${activeStyle(
                "/become-rider"
              )}`}
            >
              Become a Rider
            </Link>
          </nav>
        </div>

        {/* Right: Theme Toggle + Ride Now + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4 py-4">
          {/* Theme Toggle */}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
          >
            {theme === "light" ? (
              <Moon className="w-6 h-6 text-gray-800" />
            ) : (
              <Sun className="w-6 h-6 text-yellow-400" />
            )}
          </button>

          {/* Ride Now Button */}
          <Button variant="outline" size="icon" className="h-[2.8rem] w-30 text-base border border-border font-semibold text-primary">
            <Link
              href="/ride-now"
            >
              Ride Now
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
