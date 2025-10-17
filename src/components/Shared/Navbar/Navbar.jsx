"use client";

import { useState, useEffect, useRef } from "react";
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
  HelpCircle,
  MessageSquare,
  LogIn,
  UserPlus,
} from "lucide-react";
import defaultAvatar from '../../../Assets/default-avatar.png'
import gsap from "gsap";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const topbarRef = useRef(null);

  const { data } = useFetchData(
    "users",
    "/user",
    { email: user?.email },
    { enabled: !!user?.email }
  );

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  // GSAP animation for topbar smooth show/hide
  useEffect(() => {
    if (!user && topbarRef.current) {
      const handleScroll = () => {
        const scroll = window.scrollY > 0;
        setIsScrolled(scroll);
        gsap.to(topbarRef.current, {
          y: scroll ? -20 : 0,
          opacity: scroll ? 0.6 : 1,
          duration: 0.5,
          ease: "power2.out",
        });
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRideBy = () => setRideByOpen(!rideByOpen);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setRideByOpen(false);
        setAccountOpen(false);
      }
    };
    const handleClick = (e) => {
      const ridePanel = document.getElementById("rideby-panel");
      const rideBtn = e.target.closest('[aria-controls="rideby-panel"]');
      const accPanel = document.getElementById("account-panel");
      const accBtn = e.target.closest("#account-photo");

      if (ridePanel && !ridePanel.contains(e.target) && !rideBtn) {
        setRideByOpen(false);
      }
      if (accPanel && !accPanel.contains(e.target) && !accBtn) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const activeStyle = (path) =>
    pathname.startsWith(path)
      ? "text-primary font-semibold"
      : "hover:text-primary transition-colors duration-300";

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
    <>
      {/* ---------- TOPBAR ---------- */}
      {!user && (
        <div
          ref={topbarRef}
          className={`w-full z-[95] bg-primary backdrop-blur-sm transition-all duration-500 ease-in-out`}
        >
          <div className="max-w-[1440px] mx-auto flex justify-between items-center h-10 px-4 sm:px-6 xl:px-8 text-sm">
            {/* Left side */}
            <div className="flex items-center gap-1.5 sm:gap-4">
              <Link
                href="/support"
                className="flex items-center gap-1 text-white hover:text-black transition-colors duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Support Center</span>
              </Link>
              <Link
                href="/faqs"
                className="flex items-center gap-1 text-white hover:text-black transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">FAQs</span>
              </Link>
            </div>

            {/* Middle Text */}
            <div className="text-xs sm:text-sm text-center text-white transition-opacity duration-500 ease-in-out">
              <span className="sm:hidden">Hey there, welcome to RideX!</span>
              <span className="hidden sm:inline">
                Hey there, welcome to RideX ride sharing platform. To start ride
                login here!
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1.5 sm:gap-4">
              <Link
                href="/signIn"
                className="flex items-center gap-1 text-white hover:text-black transition-colors duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 text-white hover:text-black transition-colors duration-200"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MAIN NAVBAR ---------- */}
      <header
        className={`fixed left-0 right-0 z-[90] bg-background transition-all duration-500 border-b-2 border-gray-100 dark:border-gray-700 ${user
            ? "top-0"
            : isScrolled
              ? "top-0 shadow-sm"
              : "mt-0"
          }`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-20 sm:h-24 px-3 sm:px-6 xl:px-8 relative">
          {/* Left section - Logo + Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="dark:hidden">
              <Image
                src={logo}
                alt="RideX Logo"
                width={110}
                height={44}
                className="max-sm:w-[110px]"
              />
            </Link>
            <Link href="/" className="hidden dark:block">
              <Image
                src={darkLogo}
                alt="RideX Logo"
                width={110}
                height={44}
                className="max-sm:w-[110px]"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-lg font-semibold ml-6">
              {/* Ride By dropdown */}
              <div className="relative h-full flex items-center">
                <div className="relative">
                  <button
                    onClick={toggleRideBy}
                    aria-expanded={rideByOpen}
                    aria-controls="rideby-panel"
                    className="flex items-center py-6 cursor-pointer"
                  >
                    Ride By
                    <ChevronDown
                      className={`text-xs transition-transform duration-200 ${rideByOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    id="rideby-panel"
                    role="menu"
                    className={`absolute top-full right-0 mt-2 w-52 bg-popover text-popover-foreground flex flex-col shadow-lg rounded overflow-hidden transform transition-all duration-250 origin-top z-[9999] ${rideByOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-3 pointer-events-none"
                      }`}
                  >
                    {["/ride-bike", "/ride-cng", "/ride-car"].map((path, i) => {
                      const icons = [Bike, BusFront, Car];
                      const labels = ["Bike", "CNG", "Car"];
                      const Icon = icons[i];
                      return (
                        <Link
                          key={path}
                          href={path}
                          className={`flex items-center gap-3 justify-between w-full rounded-md px-6 py-3 transition-all duration-300 transform ${pathname.startsWith(path)
                              ? "font-semibold bg-primary/10 text-primary scale-[0.98] my-0.5"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-[0.98] my-0.5"
                            }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="text-primary text-xl border p-0.5 rounded" />
                            <span className="text-sm uppercase">
                              {labels[i]}
                            </span>
                          </div>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: "var(--primary)" }}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Link href="/offers" className={activeStyle("/offers")}>
                Offers
              </Link>
              <Link href="/contact" className={activeStyle("/contact")}>
                Contact
              </Link>
              <Link href="/about" className={activeStyle("/about")}>
                About
              </Link>

              {user?.role === "user" && (
                <Link
                  href="/become-rider"
                  className={activeStyle("/become-rider")}
                >
                  Become a Rider
                </Link>
              )}
            </nav>
          </div>

          {/* Right section - Theme Toggle + User */}
          <div className="flex items-center gap-2 mr-14 sm:mr-16">
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>

            {user && (
              <div className="relative h-full flex items-center">
                <Image
                  src={data?.photoUrl || defaultAvatar}
                  height={36}
                  width={36}
                  alt="User Photo"
                  id="account-photo"
                  className="w-9 h-9 sm:w-10 sm:h-10 border border-border rounded-full object-cover cursor-pointer"
                  onClick={() => setAccountOpen((prev) => !prev)}
                />
                <div
                  id="account-panel"
                  role="menu"
                  className={`absolute top-full right-0 my-2 w-52 bg-popover text-popover-foreground flex flex-col shadow-lg rounded overflow-hidden transform transition-all duration-250 origin-top z-[9999] ${accountOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-3 pointer-events-none"
                    }`}
                >
                  {["/dashboard/my-profile", "/dashboard"].map((path, i) => {
                    const icons = [User, ChartColumnDecreasing];
                    const labels = ["Profile", "Dashboard"];
                    const Icon = icons[i];
                    const active = pathname.startsWith(path);
                    return (
                      <Link
                        key={path}
                        href={path}
                        className={`flex items-center gap-3 justify-between w-full rounded-md px-6 py-3 transition-all duration-300 transform ${active
                            ? "font-semibold bg-primary/10 text-primary scale-[0.98] my-0.5"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-[0.98] my-0.5"
                          }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="text-primary text-xl border p-0.5 rounded" />
                          <span className="text-sm uppercase">
                            {labels[i]}
                          </span>
                        </div>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "var(--primary)" }}
                        />
                      </Link>
                    );
                  })}

                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex items-center gap-3 justify-start w-auto rounded-md px-10 py-5 mt-0.5 mb-1 mx-1"
                  >
                    <LucideLogOut className="text-white text-xl border p-0.5 rounded" />
                    <span className="text-sm uppercase">Logout</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Open menu"
            onClick={toggleSidebar}
            className="absolute right-0 top-6 sm:top-8 bottom-0 bg-primary w-14 h-20 sm:w-18 sm:h-28 flex flex-col justify-between items-center cursor-pointer"
          >
            <div className="h-20 w-full flex flex-col justify-center items-center">
              <TextAlignJustify className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="bg-foreground/60 dark:bg-foreground h-2 sm:h-3 w-full" />
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          rideByOpen={rideByOpen}
          toggleRideBy={toggleRideBy}
        />
      </header>
    </>
  );
};

export default Navbar;
