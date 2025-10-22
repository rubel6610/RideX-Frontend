"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Sun, Moon, X } from "lucide-react";

import logo from "../../Assets/ridex-logo.webp";
import darkLogo from "../../Assets/logo-dark.webp";
import defaultAvater from "../../Assets/default-avatar.png";

import ProtectedRoute from "../hooks/ProtectedRoute";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../hooks/AuthProvider";
import { useFetchData } from "../hooks/useApi";

import AdminDashboard from "./Components/adminDashboard/AdminDashboard";
import RiderDashboard from "./Components/riderDashboard/RiderDashboard";
import UserDashboard from "./Components/userDashboard/UserDashboard";
import RiderStatus from "@/components/Shared/RiderStatus";
import NotificationBell from "@/components/Shared/NotificationBell";
import { useLogout } from "../hooks/SignOutButton";

export default function DashboardLayout({ children }) {
const handleLogout = useLogout();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { data } = useFetchData("users", "/user", { email: user?.email });
  const userRole = user?.role;

  // Handle window resize for sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar open/close or collapse/expand
  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen((s) => !s);
    } else {
      setSidebarCollapsed((s) => !s);
    }
  };

  return (
    <ProtectedRoute>
      {/* Container with horizontal overflow hidden */}
      <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-screen flex flex-col justify-between border-r border-border bg-sidebar text-sidebar-foreground py-6 px-4
            ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"}
            ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"} lg:translate-x-0
            transition-all duration-500 ease-in-out`} // smooth sidebar animation
        >
          <div>
            {/* Logo */}
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} gap-3 mb-4`}>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Image
                    src={theme === "dark" ? darkLogo : logo}
                    alt="RideX Logo"
                    width={30}
                    height={30}
                    className="object-contain p-1"
                  />
                </div>
                {!sidebarCollapsed && <span className="text-xl font-bold">RideX</span>}
              </Link>

              <button onClick={() => setSidebarOpen(false)} className="p-2.5 rounded-full bg-muted hover:bg-accent lg:hidden transition duration-300 cursor-pointer">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Menu heading */}
            <h3
              className={`text-sm font-semibold uppercase text-muted-foreground pt-2 mb-4 ${
                sidebarCollapsed ? "sr-only" : ""
              }`}
            >
              {userRole} Menu
            </h3>

            {/* Menu items based on role */}
            <nav className="flex flex-col gap-1 mb-8">
              {userRole === "user" && <UserDashboard collapsed={sidebarCollapsed} />}
              {userRole === "rider" && <RiderDashboard collapsed={sidebarCollapsed} />}
              {userRole === "admin" && <AdminDashboard collapsed={sidebarCollapsed} />}
            </nav>
          </div>

          {/* Logout button */}
          <div className="transition-all duration-500 ease-in-out">
            <div
              className={`border border-border rounded-xl bg-card hover:bg-muted transition-all flex items-center justify-center overflow-hidden ${
                sidebarCollapsed ? "p-3 w-12 h-12 mx-auto" : "p-3 w-full h-11 px-5"
              }`}
            >
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className={`flex items-center text-destructive font-medium w-full h-full transition-all duration-500 cursor-pointer ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-all duration-500 ${sidebarCollapsed ? "w-7 h-7" : "w-6 h-6 mr-2"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>

                <span
                  className={`text-sm font-semibold transform transition-all duration-500 ${
                    sidebarCollapsed ? "opacity-0 translate-x-[-10px] w-0" : "opacity-100 translate-x-0 ml-1 w-auto"
                  }`}
                >
                  Logout
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className={`flex items-center justify-between px-6 py-3 border-b border-border bg-background text-foreground fixed top-0 w-full ${sidebarCollapsed ? "lg:w-[calc(100%-80px)] lg:ml-20" : "lg:w-[calc(100%-256px)] lg:ml-64"} z-20`}>
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2.5 rounded-full bg-muted hover:bg-accent transition cursor-pointer">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              {/* Notification Bell */}
              <NotificationBell />
              
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="rounded-full p-2.5 bg-muted hover:bg-accent transition cursor-pointer -mr-2"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
              </button>

              {userRole === "rider" && <RiderStatus />}

              {data && (
                <Link href="/dashboard/my-profile" className="flex items-center gap-3 p-1 rounded-full hover:bg-muted transition">
                  <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className="text-sm font-semibold">{data?.fullName}</span>
                    <span className="text-xs text-muted-foreground">{data?.email}</span>
                  </div>
                  <Image
                    src={data?.photoUrl || defaultAvater}
                    height="40"
                    width="40"
                    alt="User Photo"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-primary"
                  />
                </Link>
              )}
            </div>
          </header>

          {/* Scrollable main content */}
          <main className={`flex-1  scrollbar-hidden p-6 mt-14 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
