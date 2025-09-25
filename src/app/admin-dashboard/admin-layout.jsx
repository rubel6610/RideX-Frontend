"use client";


import { useState } from "react";
import { usePathname } from "next/navigation";
// import Link from "next/link";
import Image from "next/image";
import {
  Users,
  User,
  Star,
  DollarSign,
  MapPin,
  Search,
  Bell,
  LucideLogOut,
  PanelRightOpen,
  PanelRightClose,
  TrendingUp,
  Shield,
  Moon,
  Sun,
  BarChart2,
//   PieChart,
//   CreditCard,
//   FileText,
  MessageSquare,
//   UserCheck,
} from "lucide-react";
import useTheme from "@/app/hooks/themeContext";

import { Button } from "@/components/ui/button";
import logo from "../../Assets/ridex-logo.webp";
import darkLogo from "../../Assets/logo-dark.webp";
import Link from "next/link";

// Enhanced AdminLayout with collapsible admin sections and sub-routes
// - Change `userRole` to come from your auth/context (currently hard-coded to "admin" for demo)
// - This layout keeps the original look and adds organized admin menus (step-wise)

const AdminLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({
    users: true,
    rides: false,
    earnings: false,
    analytics: false,
    verification: false,
    support: false,
  });
  const pathname = usePathname();

  // TODO: Replace with real role from context/auth
  // For testing change this value to 'user' or 'rider'
  const userRole = "admin";

  const toggleMenu = (key) => setOpenMenus((p) => ({ ...p, [key]: !p[key] }));

  const NavLink = ({ href, children, isActive }) => (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
        isActive ? "bg-primary/90 text-background" : "text-foreground hover:bg-primary/10 hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "bg-accent/30 border-r border-border py-8 px-6 text-foreground w-64" : "hidden transition-all duration-500"
        }`}
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
            <Link
              href="/dashboard"
              className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                pathname === "/dashboard" ? "bg-primary/90 text-background" : "text-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <MapPin className="w-5 h-5" /> Dashboard
            </Link>

            {/* --- Admin menu (step-by-step) --- */}
            {userRole === "admin" && (
              <>
                {/* Step 1: User Management */}
                <div className="mt-3">
                  <Link href='/admin-dashboard/user-management'
                    // onClick={() => toggleMenu("users")}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10"
                    aria-expanded={openMenus.users}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">User Management</span>
                    </div>
                    <PanelRightOpen className={`w-4 h-4 transition-transform ${openMenus.users ? "rotate-90" : ""}`} />
                  </Link>

                  {openMenus.users && (
                    <div className="mt-2 ml-3 flex flex-col gap-1">
                      <NavLink href="/dashboard/admin/users/riders" isActive={pathname.startsWith("/dashboard/admin/users/riders")}>
                        Riders
                      </NavLink>
                      <NavLink href="/dashboard/admin/users/passengers" isActive={pathname.startsWith("/dashboard/admin/users/passengers")}>
                        Passengers
                      </NavLink>
                      <NavLink href="/dashboard/admin/users/ban-approve" isActive={pathname.startsWith("/dashboard/admin/users/ban-approve")}>
                        Ban / Approve
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Step 2: Ride Management */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("rides")}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10"
                    aria-expanded={openMenus.rides}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-medium">2. Ride Management</span>
                    </div>
                    <PanelRightOpen className={`w-4 h-4 transition-transform ${openMenus.rides ? "rotate-90" : ""}`} />
                  </button>

                  {openMenus.rides && (
                    <div className="mt-2 ml-3 flex flex-col gap-1">
                      <NavLink href="/dashboard/admin/rides/active" isActive={pathname.startsWith("/dashboard/admin/rides/active")}>
                        Active Rides
                      </NavLink>
                      <NavLink href="/dashboard/admin/rides/canceled" isActive={pathname.startsWith("/dashboard/admin/rides/canceled")}>
                        Canceled Rides
                      </NavLink>
                      <NavLink href="/dashboard/admin/rides/complaints" isActive={pathname.startsWith("/dashboard/admin/rides/complaints")}>
                        Complaints
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Step 3: Earnings & Transactions */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("earnings")}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10"
                    aria-expanded={openMenus.earnings}
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-medium">3. Earnings & Transactions</span>
                    </div>
                    <PanelRightOpen className={`w-4 h-4 transition-transform ${openMenus.earnings ? "rotate-90" : ""}`} />
                  </button>

                  {openMenus.earnings && (
                    <div className="mt-2 ml-3 flex flex-col gap-1">
                      <NavLink href="/dashboard/admin/earnings/platform" isActive={pathname.startsWith("/dashboard/admin/earnings/platform")}>
                        Platform Earnings
                      </NavLink>
                      <NavLink href="/dashboard/admin/earnings/payouts" isActive={pathname.startsWith("/dashboard/admin/earnings/payouts")}>
                        Driver Payouts
                      </NavLink>
                      <NavLink href="/dashboard/admin/earnings/commission" isActive={pathname.startsWith("/dashboard/admin/earnings/commission")}>
                        Commission Overview
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Step 4: Analytics / Reports */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("analytics")}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10"
                    aria-expanded={openMenus.analytics}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart2 className="w-5 h-5" />
                      <span className="font-medium">4. Analytics & Reports</span>
                    </div>
                    <PanelRightOpen className={`w-4 h-4 transition-transform ${openMenus.analytics ? "rotate-90" : ""}`} />
                  </button>

                  {openMenus.analytics && (
                    <div className="mt-2 ml-3 flex flex-col gap-1">
                      <NavLink href="/dashboard/admin/analytics/dau" isActive={pathname.startsWith("/dashboard/admin/analytics/dau")}>
                        Daily Active Users
                      </NavLink>
                      <NavLink href="/dashboard/admin/analytics/total-rides" isActive={pathname.startsWith("/dashboard/admin/analytics/total-rides")}>
                        Total Rides Completed
                      </NavLink>
                      <NavLink href="/dashboard/admin/analytics/revenue" isActive={pathname.startsWith("/dashboard/admin/analytics/revenue")}>
                        Revenue Charts
                      </NavLink>
                      <NavLink href="/dashboard/admin/analytics/top-areas" isActive={pathname.startsWith("/dashboard/admin/analytics/top-areas")}>
                        Top Areas (heatmap)
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Step 5: Verification Requests */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("verification")}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10"
                    aria-expanded={openMenus.verification}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">5. Verification Requests</span>
                    </div>
                    <PanelRightOpen className={`w-4 h-4 transition-transform ${openMenus.verification ? "rotate-90" : ""}`} />
                  </button>

                  {openMenus.verification && (
                    <div className="mt-2 ml-3 flex flex-col gap-1">
                      <NavLink href="/dashboard/admin/verification/drivers" isActive={pathname.startsWith("/dashboard/admin/verification/drivers")}>
                        Driver KYC
                      </NavLink>
                      <NavLink href="/dashboard/admin/verification/riders" isActive={pathname.startsWith("/dashboard/admin/verification/riders")}>
                        Rider KYC
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Step 6: Support Tickets */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("support")}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-primary/10"
                    aria-expanded={openMenus.support}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">6. Support Tickets</span>
                    </div>
                    <PanelRightOpen className={`w-4 h-4 transition-transform ${openMenus.support ? "rotate-90" : ""}`} />
                  </button>

                  {openMenus.support && (
                    <div className="mt-2 ml-3 flex flex-col gap-1">
                      <NavLink href="/dashboard/admin/support/open" isActive={pathname.startsWith("/dashboard/admin/support/open")}>
                        Open Tickets
                      </NavLink>
                      <NavLink href="/dashboard/admin/support/closed" isActive={pathname.startsWith("/dashboard/admin/support/closed")}>
                        Closed Tickets
                      </NavLink>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Non-admin quick links (kept for completeness) */}
            {userRole === "user" && (
              <>
                <Link href="/dashboard/book-a-ride" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/book-a-ride' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  <Users className="w-5 h-5" /> Book A Ride
                </Link>
                <Link href="/dashboard/ride-history" className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${pathname === '/dashboard/ride-history' ? 'bg-primary/90 text-background' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  <TrendingUp className="w-5 h-5" /> Ride History
                </Link>
              </>
            )}
          </nav>

          {/* User Card */}
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
              {theme === "dark" ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground/80" />}
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
};

export default AdminLayout;
