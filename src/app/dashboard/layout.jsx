"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {User,Star,MapPin,Search,Bell,LucideLogOut,PanelRightOpen,PanelRightClose,Moon,Sun,} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../../Assets/ridex-logo.webp";
import darkLogo from "../../Assets/logo-dark.webp";
import ProtectedRoute from "../hooks/ProtectedRoute";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../hooks/AuthProvider";
import AdminDashboard from "./Components/adminDashboard/AdminDashboard";
import RiderDashboard from "./Components/riderDashboard/RiderDashboard";
import UserDashboard from "./Components/userDashboard/UserDashboard";

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [userData, setUserData] = useState(null);

  // Fetch user data after component mounts
  useEffect(() => {
    if (!user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?email=${user.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [user?.email]);

  // Determine role dynamically from fetched data or fallback
  // const userRole = userData?.role || "user";
  const userRole = "rider";

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside
          className={`flex flex-col justify-between transition-all duration-300 h-full flex-shrink-0 ${
            sidebarOpen
              ? "bg-accent/30 border-r border-border py-4 px-4 text-foreground w-64"
              : "hidden transition-all duration-500"
          }`}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <Link
                href="/"
                className="dark:hidden text-xl md:text-2xl leading-0 font-bold"
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
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mb-8">
              <Link
                href="/dashboard"
                className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                  pathname === "/dashboard"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <MapPin className="w-5 h-5" /> Dashboard
              </Link>

              {/* User routes */}
              {userRole === "user" && <UserDashboard />}

              {/* Rider routes */}
              {userRole === "rider" && <RiderDashboard />}

              {/* Admin routes */}
              {userRole === "admin" && <AdminDashboard />}
            </nav>

           
           
          </div>
           <Button
              onClick={logout}
              variant="destructiveOutline"
              size="lg"
              className="w-full m-3 text-md ml-1"
            >
              <LucideLogOut className="w-5 h-5" />
              Sign Out
            </Button>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col h-full">
          {/* Topbar */}
          <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background/80 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {!sidebarOpen ? (
                <button onClick={() => setSidebarOpen(true)}>
                  <PanelRightClose className="w-6 h-6 text-muted-foreground" />
                </button>
              ) : (
                <button onClick={() => setSidebarOpen(false)}>
                  <PanelRightOpen className="w-6 h-6 text-muted-foreground" />
                </button>
              )}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none"
                />
                <Search className="absolute left-2 top-2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="rounded-full p-2 border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground/80" />
                )}
              </button>
              <Bell className="w-6 h-6 text-muted-foreground" />

              <Link href="/dashboard/my-profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="hidden md:inline text-foreground">
                    Profile
                  </span>
                </Button>
              </Link>
            </div>
          </header>

          {/* Dynamic page content */}
          <main className="flex-1 overflow-y-auto scrollbar-hidden px-10 py-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
