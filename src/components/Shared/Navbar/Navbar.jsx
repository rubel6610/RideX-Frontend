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
  Moon,
  Sun,
  LucideLogOut,
  User,
  ChartColumnDecreasing,
  HelpCircle,
  MessageSquare,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react";
import defaultAvatar from "../../../Assets/default-avatar.png";
import gsap from "gsap";
import logo from "../../../Assets/ridex-logo.webp";
import darkLogo from "../../../Assets/logo-dark.webp";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/hooks/AuthProvider";
import useTheme from "@/app/hooks/useTheme";
import { useFetchData } from "@/app/hooks/useApi";
import { toast } from "sonner";
import LanguageToggle from "@/components/Shared/LanguageToggle";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideByOpen, setRideByOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const topbarRef = useRef(null);
  const rideByRef = useRef(null);
  const accountRef = useRef(null);

  const { data } = useFetchData(
    "users",
    "/user",
    { email: user?.email },
    { enabled: !!user?.email }
  );

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    if (sidebarOpen) {
      setRideByOpen(false);
      setAccountOpen(false);
    }
  }, [sidebarOpen]);

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

  const toggleRideBy = () => {
    if (accountOpen) setAccountOpen(false);
    setRideByOpen((prev) => !prev);
  };

  const toggleAccount = () => {
    if (rideByOpen) setRideByOpen(false);
    setAccountOpen((prev) => !prev);
  };

  useEffect(() => {
    const ridePanel = rideByRef.current;
    if (ridePanel) {
      gsap.to(ridePanel, {
        opacity: rideByOpen ? 1 : 0,
        y: rideByOpen ? 0 : -10,
        duration: 0.25,
        pointerEvents: rideByOpen ? "auto" : "none",
        ease: "power2.out",
      });
    }
  }, [rideByOpen]);

  useEffect(() => {
    const accPanel = accountRef.current;
    if (accPanel) {
      gsap.to(accPanel, {
        opacity: accountOpen ? 1 : 0,
        y: accountOpen ? 0 : -10,
        duration: 0.25,
        pointerEvents: accountOpen ? "auto" : "none",
        ease: "power2.out",
      });
    }
  }, [accountOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setRideByOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ✅ FIXED: only exact path gets active style
  const activeStyle = (path) =>
    pathname === path
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
      {!user && (
        <div
          ref={topbarRef}
          className="w-full z-[95] bg-primary backdrop-blur-sm transition-all duration-500 ease-in-out"
        >
          <div className="max-w-[1440px] mx-auto flex justify-between items-center h-10 px-4 sm:px-6 xl:px-8 text-sm">
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

            <div className="text-xs sm:text-sm text-center text-white">
              <span className="sm:hidden">Hey there, welcome to RideX!</span>
              <span className="hidden sm:inline">
                Hey there, welcome to RideX ride sharing platform. To start ride login here!
              </span>
            </div>

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

      <header
        className={`fixed left-0 right-0 z-[90] bg-background transition-all duration-500 border-b border-border ${
          user ? "top-0" : isScrolled ? "top-0 shadow-sm" : "mt-0"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-20 sm:h-24 px-3 sm:px-6 xl:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="dark:hidden">
              <Image src={logo} alt="RideX Logo" width={110} height={44} />
            </Link>
            <Link href="/" className="hidden dark:block">
              <Image src={darkLogo} alt="RideX Logo" width={110} height={44} />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm xl:text-lg font-semibold uppercase tracking-wide">
            <Link href="/" className={activeStyle("/")}>
              Home
            </Link>

            <div className="relative h-full flex items-center cursor-pointer">
              <button
                onClick={toggleRideBy}
                aria-expanded={rideByOpen}
                aria-controls="rideby-panel"
                className="flex items-center py-6 -mx-1 cursor-pointer uppercase"
              >
                <p className="pr-1">Ride By</p>
                <ChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    rideByOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id="rideby-panel"
                ref={rideByRef}
                role="menu"
                className="absolute top-full right-0 mt-[11px] w-52 bg-popover text-popover-foreground flex flex-col shadow-lg rounded overflow-hidden origin-top z-[80]"
                style={{ opacity: 0, pointerEvents: "none" }}
              >
                {["/ride-bike", "/ride-cng", "/ride-car"].map((path, i) => {
                  const icons = [Bike, BusFront, Car];
                  const labels = ["Bike", "CNG", "Car"];
                  const Icon = icons[i];
                  return (
                    <Link
                      key={path}
                      href={path}
                      className={`flex items-center gap-3 justify-between w-full px-6 py-3 transition-all duration-300 ${
                        pathname === path
                          ? "font-semibold bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-primary text-xl border p-0.5 rounded" />
                        <span className="text-sm uppercase">{labels[i]}</span>
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

            <Link href="/offers" className={activeStyle("/offers")}>
              Offers
            </Link>
            <Link href="/contact" className={activeStyle("/contact")}>
              Contact
            </Link>
            <Link href="/about" className={activeStyle("/about")}>
              About
            </Link>
            <Link href="/blogs" className={activeStyle("/blogs")}>
              Blogs
            </Link>
            {user?.role === "user" && (
              <Link href="/become-rider" className={activeStyle("/become-rider")}>
                Become a Rider
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-2 lg:gap-1 xl:gap-2">
            <LanguageToggle />

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative w-8.5 h-8.5 sm:w-11 lg:w-9 xl:w-11 sm:h-11 lg:h-9 xl:h-11 flex items-center justify-center rounded-full transition-all duration-300 border border-border bg-primary text-white hover:bg-primary/10 hover:text-primary cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
              )}
            </button>

            {user && (
              <div className="relative h-full flex items-center">
                <Image
                  src={data?.photoUrl || defaultAvatar}
                  height={36}
                  width={36}
                  alt="User Photo"
                  id="account-photo"
                  className="w-9 h-9 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 border border-border rounded-full object-cover cursor-pointer"
                  onClick={toggleAccount}
                />
                <div
                  id="account-panel"
                  ref={accountRef}
                  role="menu"
                  className="absolute top-full right-0 mt-[23px] sm:mt-[25px] w-52 bg-popover text-popover-foreground flex flex-col shadow-lg rounded overflow-hidden origin-top z-[80]"
                  style={{ opacity: 0, pointerEvents: "none" }}
                >
                  {["/dashboard/my-profile", `/dashboard/${user?.role}`].map(
                    (path, i) => {
                      const icons = [User, ChartColumnDecreasing];
                      const labels = ["Profile", "Dashboard"];
                      const Icon = icons[i];
                      return (
                        <Link
                          key={path}
                          href={path}
                          className={`flex items-center gap-3 justify-between px-6 py-3 ${
                            pathname === path
                              ? "font-semibold bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          }`}
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
                    }
                  )}

                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex items-center gap-3 justify-start px-10 py-5 m-1 rounded-md"
                  >
                    <LucideLogOut className="text-white text-xl border p-0.5 rounded" />
                    <span className="text-sm uppercase">Logout</span>
                  </Button>
                </div>
              </div>
            )}

            <button
              aria-label="Open menu"
              onClick={toggleSidebar}
              className="flex items-center justify-center rounded-full bg-foreground text-background w-14 sm:w-22 lg:w-16 xl:w-22 h-10 sm:h-12 lg:h-11 xl:h-12 ml-1 sm:ml-3 lg:ml-2 xl:ml-3 hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              <Menu className="w-6 h-5 sm:w-8 sm:h-6" />
            </button>
          </div>
        </div>

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
