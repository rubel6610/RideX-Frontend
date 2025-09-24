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
import useTheme from "@/app/hooks/themeContext";
import { useAuth } from "@/app/hooks/AuthProvider";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideByOpen, setRideByOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  // Set mounted state to avoid hydration issues
  useEffect(() => {
    
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRideBy = () => setRideByOpen(!rideByOpen);

  const activeStyle = (path) =>
    pathname === path ? "font-semibold" : "transition-colors duration-300";

  // Scroll detection
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
    <>
      <div className={`w-full max-w-[1440px] mx-auto navbar fixed top-0 left-0 right-0 z-[999] bg-background text-foreground border-b border-primary/30 shadow-sm flex items-center justify-between h-19 px-4 sm:px-6 xl:px-8 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}>
        <div className="flex items-center gap-10">
          {/* Logo */}
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
                <Link href="/ride-bike" className="flex items-center gap-2 pl-4 pr-12 py-2 border-b border-primary/30 hover:text-primary">
                  <Bike className="text-primary text-xl border p-0.5 rounded" />
                  <span>Bike</span>
                </Link>
                <Link href="/ride-cng" className="flex items-center gap-2 pl-4 pr-12 py-2 border-b border-primary/30 hover:text-primary">
                  <BusFront className="text-primary text-xl border p-0.5 rounded" />
                  <span>CNG</span>
                </Link>
                <Link href="/ride-car" className="flex items-center gap-2 px-4 pr-12 py-2 hover:text-primary">
                  <Car className="text-primary text-xl border p-0.5 rounded" />
                  <span>Car</span>
                </Link>
              </div>
            </div>

            <Link href="/offers" className={`h-full flex items-center hover:text-primary ${activeStyle("/offers")}`}>
              Offers
            </Link>
            <Link href="/contact" className={`h-full flex items-center hover:text-primary ${activeStyle("/contact")}`}>
              Contact
            </Link>
            <Link href="/about" className={`h-full flex items-center hover:text-primary ${activeStyle("/about")}`}>
              About
            </Link>
            <Link href="/become-rider" className={`h-full flex items-center hover:text-primary ${activeStyle("/become-rider")}`}>
              Become a Rider
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center">
          <button onClick={toggleTheme} className="relative w-10 h-10 flex items-center justify-center rounded-full">
            <Sun className={`absolute text-xl transition-all duration-300 ${
              theme === "dark" ? "opacity-0 scale-0" : "opacity-100 scale-100"}`} />
            <Moon className={`absolute text-lg transition-all duration-300 ${
              theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
          </button>

          {!user ? (
            <Link href="/signIn">
              <Button variant="primary" size="lg" className="mr-3 text-md ml-1">
                Sign In Now
              </Button>
            </Link>
          ) : (
            <Button onClick={logout} variant="primary" size="lg" className="mr-3 text-md ml-1">
              Sign Out
            </Button>
          )}

          <div className="lg:hidden flex items-center">
            <TextAlignJustify className="text-2xl cursor-pointer" onClick={toggleSidebar} />
          </div>
        </div>
      </div>

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        rideByOpen={rideByOpen} 
        toggleRideBy={toggleRideBy} 
      />
    </>
  );
};

export default Navbar;