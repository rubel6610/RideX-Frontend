"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {MapPin,Search,Bell,PanelRightOpen,PanelRightClose,Moon,Sun,X,
} from "lucide-react";
import logo from "../../Assets/ridex-logo.webp";
import darkLogo from "../../Assets/logo-dark.webp";
import ProtectedRoute from "../hooks/ProtectedRoute";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../hooks/AuthProvider";
import AdminDashboard from "./Components/adminDashboard/AdminDashboard";
import RiderDashboard from "./Components/riderDashboard/RiderDashboard";
import UserDashboard from "./Components/userDashboard/UserDashboard";
import RiderStatus from "@/components/Shared/Riders/RiderStatus";
import SignOutButton from "@/components/Shared/SignOutButton";
import { useFetchData } from "../hooks/useApi";

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

   const {data}=useFetchData("users","/user", {email:user?.email})
  const userRole = user?.role;   
 

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Overlay only for mobile-md */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full flex flex-col justify-between transition-all duration-300 bg-accent border-r border-border py-4 px-4 text-foreground ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"} lg:static ${sidebarCollapsed ? "lg:hidden" : "lg:flex lg:translate-x-0 lg:w-64"}
`}>
          <div>
            {/* Logo + Close btn */}
            <div className="flex items-center justify-between gap-3 mb-8">
              <Link href="/" className="dark:hidden">
                <Image
                  src={logo}
                  alt="RideX Logo"
                  width={120}
                  height={50}
                  className="object-contain"
                />
              </Link>
              <Link href="/" className="hidden dark:block">
                <Image
                  src={darkLogo}
                  alt="RideX Logo"
                  width={120}
                  height={50}
                  className="object-contain"
                />
              </Link>

              {/* Mobile Close Btn */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-foreground/10 lg:hidden"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mb-8">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard"
                  ? "bg-primary/90 text-background"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
              >
                <MapPin className="w-5 h-5" />{" "}
                {!sidebarCollapsed && "Dashboard"}
              </Link>

              {userRole === "user" && <UserDashboard collapsed={sidebarCollapsed} />}
              {userRole === "rider" && <RiderDashboard collapsed={sidebarCollapsed} />}
              {userRole === "admin" && <AdminDashboard collapsed={sidebarCollapsed} />}
            </nav>
          </div>

          {/* Logout Button */}
          <SignOutButton />
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col h-full">
          {/* Topbar */}
          <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border bg-background/80 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* Toggle button */}
              <button
                onClick={() =>
                  window.innerWidth < 1024
                    ? setSidebarOpen(!sidebarOpen)
                    : setSidebarCollapsed(!sidebarCollapsed)
                }
              >
                {window.innerWidth < 1024 ? (
                  sidebarOpen ? (
                    <PanelRightOpen className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <PanelRightClose className="w-6 h-6 text-muted-foreground" />
                  )
                ) : sidebarCollapsed ? (
                  <PanelRightOpen className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <PanelRightClose className="w-6 h-6 text-muted-foreground" />
                )}
              </button>


              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="sm:hidden p-2"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
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
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />

              {/* go online - offline */}
              {
                userRole === 'rider' && <RiderStatus />
              }

             {data &&  <Link href="/dashboard/my-profile">
                  <Image src={data.photoUrl} height="120" width="120" alt="userPhoto" className="w-4 h-4 md:w-10 md:h-10 rounded-full object-cover hover:scale-110" />
               
              </Link> }
            </div>
          </header>

    

          {/* Dynamic Content */}
          <main className="flex-1 overflow-y-auto scrollbar-hidden px-4 md:px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}