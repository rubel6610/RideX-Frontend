"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Bike, Car, BusFront, TextAlignJustify, Moon, Sun } from "lucide-react";
import logo from "../../../Assets/ridex-logo.webp";
import darkLogo from "../../../Assets/logo-dark.webp";
import Sidebar from "./Sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/hooks/AuthProvider";
import useTheme from "@/app/hooks/useTheme";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideByOpen, setRideByOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => { }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRideBy = () => setRideByOpen(!rideByOpen);

  const activeStyle = (path) => (pathname === path ? "font-semibold" : "transition-colors duration-300");

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

  return (
    <div className={`bg-background mx-auto max-w-[2600px] fixed top-0 right-0 left-0 transition-transform duration-300 z-[999] ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
      {/* Topbar shown only to guests (not logged in) */}
      {!user && (
        <div className="w-full bg-foreground text-background text-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 h-8 flex items-center justify-between">
            <div className="flex gap-6">
              <Link href="/support" className="hover:underline">Support Center</Link>
              <Link href="/faqs" className="hover:underline">Faq's</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-[1440px] mx-auto bg-background text-foreground shadow-sm h-24 px-4 sm:px-6 xl:px-8 relative`}>
        {/* left diagonal accent (longer) */}
        <div className="hidden lg:block absolute left-0 top-0 w-44 h-7 bg-primary -skew-x-12 origin-top-left transform pointer-events-none" aria-hidden />

        {/* Logo (left) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30">
          <Link href="/" className="dark:hidden">
            <Image src={logo} alt="RideX Logo" width={140} height={56} />
          </Link>
          <Link href="/" className="hidden dark:block">
            <Image src={darkLogo} alt="RideX Logo" width={140} height={56} />
          </Link>
        </div>

        {/* Nav moved to the right area on large screens (see right area below) */}

        {/* Right area: theme + tall yellow block */}
        <div className="absolute right-0 top-0 bottom-0 z-40 flex items-center">
          {/* Desktop nav: links should appear on right side before the theme toggle */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold pr-4">
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 py-6 text-base font-semibold cursor-pointer">
                Ride By
                <ChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-0.5 border border-border bg-popover text-popover-foreground flex flex-col shadow-lg rounded-b overflow-hidden transform transition-all duration-200 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 z-[9999]">
                <Link href="/ride-bike" className="flex items-center gap-2 pl-4 pr-12 py-2 border-b border-border hover:text-primary">
                  <Bike className="text-primary text-xl border p-0.5 rounded" />
                  <span>Bike</span>
                </Link>
                <Link href="/ride-cng" className="flex items-center gap-2 pl-4 pr-12 py-2 border-b border-border hover:text-primary">
                  <BusFront className="text-primary text-xl border p-0.5 rounded" />
                  <span>CNG</span>
                </Link>
                <Link href="/ride-car" className="flex items-center gap-2 px-4 pr-12 py-2 hover:text-primary">
                  <Car className="text-primary text-xl border p-0.5 rounded" />
                  <span>Car</span>
                </Link>
              </div>
            </div>

            <Link href="/offers" className={`h-full flex items-center hover:text-primary ${activeStyle('/offers')}`}>Offers</Link>
            <Link href="/contact" className={`h-full flex items-center hover:text-primary ${activeStyle('/contact')}`}>Contact</Link>
            <Link href="/about" className={`h-full flex items-center hover:text-primary ${activeStyle('/about')}`}>About</Link>
            <Link href="/become-rider" className={`h-full flex items-center hover:text-primary ${activeStyle('/become-rider')}`}>Become a Rider</Link>
            {user && (
              <Link href="/dashboard" className={`h-full flex items-center hover:text-primary ${activeStyle('/dashboard')}`}>Dashboard</Link>
            )}
          </nav>

          {/* Theme toggle (always visible) - placed immediately after the links */}
          <div className="flex items-center pr-20">
            <button
              onClick={toggleTheme}
              className="inline-flex ml-2 w-9 h-9 rounded-full items-center justify-center bg-background text-foreground border border-border shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>

          {/* Tall right menu block (desktop) - flush to viewport edge with hamburger lines */}
          <div className="hidden lg:flex h-full w-16 bg-primary items-center justify-center cursor-pointer absolute right-0 top-8" onClick={toggleSidebar}>
            <div className="flex flex-col gap-1">
              <span className="block w-6 h-[2px] bg-foreground" />
              <span className="block w-6 h-[2px] bg-foreground" />
              <span className="block w-6 h-[2px] bg-foreground" />
            </div>
          </div>

          {/* mobile hamburger (kept) */}
          <div className="lg:hidden flex items-center pr-2">
            <TextAlignJustify className="text-2xl cursor-pointer" onClick={toggleSidebar} />
          </div>
        </div>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        rideByOpen={rideByOpen}
        toggleRideBy={toggleRideBy}
        showNavbar={showNavbar}
      />
    </div>
  );
};

export default Navbar;
