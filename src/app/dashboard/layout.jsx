"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users, User, Star, DollarSign, MapPin, Search, Bell, LucideLogOut, PanelRightOpen, PanelRightClose, TrendingUp, Shield, Moon, Sun, Truck, PlayCircle, Clock, BarChart3 } from "lucide-react";
import useTheme from "@/app/hooks/themeContext";

import { Button } from "@/components/ui/button";
import logo from "../../Assets/ridex-logo.webp";
import darkLogo from "../../Assets/logo-dark.webp"

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  // TODO: Replace with real user role from context/auth
  const userRole = "rider"; // Change to "rider" to test rider view

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col justify-between transition-all duration-300 ${sidebarOpen ? "bg-accent/30 border-r border-border py-8 px-6 text-foreground w-64" : "hidden transition-all duration-500"}`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/" className="dark:hidden text-xl md:text-2xl leading-0 font-bold">
              <Image src={logo} alt="RideX Logo" width={120} height={50} className="object-contain" />
            </Link>
            <Link href="/" className="hidden dark:block text-xl md:text-2xl leading-0 font-bold">
              <Image src={darkLogo} alt="RideX Logo" width={120} height={50} className="object-contain" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 mb-8">
            <Link href="/dashboard" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}> <MapPin className="w-5 h-5" /> Dashboard</Link>
            {userRole === "user" && (
              <>
                <Link href="/dashboard/book-a-ride" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/book-a-ride' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}> <Users className="w-5 h-5" /> Book A Ride</Link>
                <Link href="/dashboard/ride-history" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/ride-history' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}> <TrendingUp className="w-5 h-5" /> Ride History</Link>
                <Link href="/dashboard/saved-locations" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/saved-locations' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}> <Star className="w-5 h-5" /> Saved Locations</Link>
                <Link href="/dashboard/payment-options" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/payment-options' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}> <DollarSign className="w-5 h-5" /> Payment Options</Link>
                <Link href="/dashboard/support" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/support' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}> <User className="w-5 h-5" /> Support</Link>
              </>
            )}

            {/* rider role routes  */}
            {userRole === "rider" && (
              <>
                {/* Ride Requests */}
                <Link
                  href="/dashboard/ride-requests"
                  className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard/ride-requests"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  <TrendingUp className="w-5 h-5" /> Ride Requests
                </Link>

                {/* Ongoing Ride */}
                <Link
                  href="/dashboard/ongoing-ride"
                  className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard/ongoing-ride"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  <PlayCircle className="w-5 h-5" /> Ongoing Ride
                </Link>

                {/* Earnings Overview */}
                <Link
                  href="/dashboard/earnings"
                  className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard/earnings"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  <DollarSign className="w-5 h-5" /> Earnings Overview
                </Link>

                {/* Ride History */}
                <Link
                  href="/dashboard/ride-history"
                  className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard/ride-history"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  <Clock className="w-5 h-5" /> Ride History
                </Link>

                {/* Profile & Vehicle Info */}
                <Link
                  href="/dashboard/profile-vehicle-info"
                  className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard/profile-vehicle-info"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  <User className="w-5 h-5" /> Profile & Vehicle Info
                </Link>

                {/* Performance Stats */}
                <Link
                  href="/dashboard/performance-stats"
                  className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === "/dashboard/performance-stats"
                    ? "bg-primary/90 text-background"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  <BarChart3 className="w-5 h-5" /> Performance Stats
                </Link>
              </>
            )}

            {userRole === "admin" && (
              <Link href="/dashboard/user-management" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/user-management' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}>
                <Shield className="w-5 h-5" /> User Management
              </Link>
            )}
          </nav>

          {/* // TODO: User Card Dynamic Data */}
          <div className="mt-8 flex items-center gap-3 p-3 rounded-lg bg-accent border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">JD</div>
            <div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                John Doe
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/30">Rider</span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                4.9 <Star className="w-3 h-3 text-primary" /> Rating
              </div>
            </div>
          </div>
        </div>

        <Button variant="destructiveOutline" className="flex items-center justify-center gap-2 mt-8">
          <LucideLogOut className="w-5 h-5" /> Logout
        </Button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
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

            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span className="hidden md:inline text-foreground">Profile</span>
            </Button>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
