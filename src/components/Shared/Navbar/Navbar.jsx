"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Bike,
  Car,
  BusFront,
  TextAlignJustify,
  Moon,
  Sun,
  LucideLogOut,
  User,
  ChartColumnDecreasing,
} from "lucide-react";
import logo from "../../../Assets/ridex-logo.webp";
import darkLogo from "../../../Assets/logo-dark.webp";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/hooks/AuthProvider";
import useTheme from "@/app/hooks/useTheme";
import { useFetchData } from "@/app/hooks/useApi";
import { toast } from "sonner"; 

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideByOpen, setRideByOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const { data } = useFetchData(
    "users",
    "/user",
    { email: user?.email },
    {
      enabled: !!user?.email, 
    }
  );

  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY < lastY || currentY <= 0);
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRideBy = () => setRideByOpen(!rideByOpen);

  const activeStyle = (path) =>
    pathname.startsWith(path)
      ? "text-primary font-semibold"
      : "transition-colors duration-300";

 
 const handleLogout = () => {
    toast("Are you sure you want to logout?", {
      description: "Click below to confirm your action.",
      action: {
        label: "Logout",
        onClick: async () => {
          try {    
            await logout();
            toast.success("You have been logged out successfully 👋");
          } catch (err) {
            toast.error("Logout failed. Please try again.");
          }
        },
      },
    });
  };

  return (
    <div
      className={`bg-background mx-auto max-w-[2600px] fixed top-0 right-0 left-0 transition-transform duration-300 z-[90] border-b border-primary/30 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1440px] mx-auto bg-background text-foreground shadow-sm flex items-center justify-between h-19 px-4 sm:px-6 xl:px-8">
        
          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center">
            <TextAlignJustify
              className="text-2xl cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="dark:hidden">
            <Image src={logo} alt="RideX Logo" width={120} height={50} />
          </Link>
          <Link href="/" className="hidden dark:block">
            <Image src={darkLogo} alt="RideX Logo" width={120} height={50} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:ml-4 gap-6 font-semibold h-full items-center">
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 py-6 text-base font-semibold cursor-pointer">
                Ride By
                <ChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-0.5 border border-primary/30 bg-popover text-foreground flex flex-col shadow-lg rounded-b overflow-hidden transform transition-all duration-200 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 z-[9999]">
                <Link
                  href="/ride-bike"
                  className="flex items-center gap-2 pl-4 pr-12 py-2 border-b border-primary/30 hover:text-primary"
                >
                  <Bike className="text-primary text-xl border p-0.5 rounded" />
                  <span>Bike</span>
                </Link>
                <Link
                  href="/ride-cng"
                  className="flex items-center gap-2 pl-4 pr-12 py-2 border-b border-primary/30 hover:text-primary"
                >
                  <BusFront className="text-primary text-xl border p-0.5 rounded" />
                  <span>CNG</span>
                </Link>
                <Link
                  href="/ride-car"
                  className="flex items-center gap-2 px-4 pr-12 py-2 hover:text-primary"
                >
                  <Car className="text-primary text-xl border p-0.5 rounded" />
                  <span>Car</span>
                </Link>
              </div>
            </div>

            <Link
              href="/offers"
              className={`h-full flex items-center hover:text-primary ${activeStyle(
                "/offers"
              )}`}
            >
              Offers
            </Link>
            <Link
              href="/contact"
              className={`h-full flex items-center hover:text-primary ${activeStyle(
                "/contact"
              )}`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`h-full flex items-center hover:text-primary ${activeStyle(
                "/about"
              )}`}
            >
              About
            </Link>

            {user?.role === "user" && (
              <Link
                href="/become-rider"
                className={`h-full flex items-center hover:text-primary ${activeStyle(
                  "/become-rider"
                )}`}
              >
                Become a Rider
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Theme + Profile */}
        <div className="flex items-center">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          {/* User Section */}
          {!user ? (
            <Link href="/signIn">
              <Button variant="primary" size="lg" className="mr-3 text-md ml-1">
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="relative group h-full flex items-center">
              <Image
                src={data?.photoUrl || "/default-avatar.png"}
                height={40}
                width={40}
                alt="User Photo"
                className="w-10 h-10 border border-border rounded-full object-cover"
              />
              <div className="absolute w-40 top-10 mt-0.5 -right-0 border border-border bg-popover text-foreground flex flex-col shadow-lg rounded-lg overflow-hidden transform transition-all duration-200 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 z-[9999]">
                <Link
                  href="/dashboard/my-profile"
                  className="flex items-center gap-2 pl-4 py-2 border-b border-primary/30 hover:text-primary"
                >
                  <User className="text-primary text-xl border p-0.5 rounded" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 border-b border-primary/30 ps-4 py-2 hover:text-primary"
                >
                  <ChartColumnDecreasing className="text-primary text-xl border p-0.5 rounded" />
                  <span>Dashboard</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="m-2 text-md flex gap-2 justify-center"
                >
                  <LucideLogOut className="w-5 h-5" />
                  Logout
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Sidebar (Mobile) */}
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
