"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Search,
  Bell,
  PanelRightOpen,
  PanelRightClose,
  Moon,
  Sun,
  X,
  LayoutDashboard, // Dashboard icon
  CheckCircle,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu, // Icon for Menu (for toggle or logo)
} from "lucide-react";

// Assuming these are still the correct imports
import logo from "../../Assets/ridex-logo.webp";
import darkLogo from "../../Assets/logo-dark.webp";
import ProtectedRoute from "../hooks/ProtectedRoute";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../hooks/AuthProvider";
// Note: These components are responsible for rendering your specific links (e.g., /dashboard/tasks)
import AdminDashboard from "./Components/adminDashboard/AdminDashboard";
import RiderDashboard from "./Components/riderDashboard/RiderDashboard";
import UserDashboard from "./Components/userDashboard/UserDashboard";
import RiderStatus from "@/components/Shared/Riders/RiderStatus";
import SignOutButton from "@/components/Shared/SignOutButton";
import { useFetchData } from "../hooks/useApi";

// --- Helper component to match the UserDashboard link style and add smooth transition ---
const SidebarLink = ({ href, pathname, Icon, label, collapsed, hasBadge }) => {
    // Use startsWith for dynamic links (e.g., /dashboard matches /dashboard/profile)
    const isActive = pathname.startsWith(href) && (pathname === href);

    return (
        <Link
            href={href}
            // Added overflow-hidden for smooth text transition, consistent with SidebarLinkInternal
            className={`flex items-center gap-3 ${collapsed ? 'pl-2.5' : 'px-3'} py-2 rounded-lg font-medium transition-colors text-base whitespace-nowrap overflow-hidden ${
                collapsed ? 'justify-center' : 'justify-start'
            } ${
                isActive
                    ? "bg-[#256a42] text-white shadow-md" // Dark Green BG for active
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" // Light/Dark hover for inactive
            }`}
            style={{
                borderRadius: '8px',
            }}
            title={collapsed ? label : undefined} // Add tooltip for collapsed icons
        >
            {/* Icon color logic consistent with active state */}
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400'} transition-colors`} />

            {/* 💡 SMOOTH TEXT TRANSITION: Applied the exact same transition logic */}
            <span
                className={`transition-opacity duration-200 ${
                    collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}
            >
                {label}
            </span>

            {hasBadge && !collapsed && <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />}
        </Link>
    );
};



export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Use the useFetchData for user data
  const { data } = useFetchData("users", "/user", { email: user?.email });
  const userRole = user?.role;

  // Use window width to determine initial collapsed state and handle resize
  useEffect(() => {
    const handleResize = () => {
      // For mobile screens, keep it uncollapsed and controlled by the overlay
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false);
      }
      // Optionally, set initial collapsed state for desktop if window is small
      else if (window.innerWidth < 1280) {
        // setSidebarCollapsed(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to toggle sidebar for mobile and desktop collapse
  const toggleSidebar = () => {
      if (window.innerWidth < 1024) {
          setSidebarOpen(!sidebarOpen);
      } else {
          setSidebarCollapsed(!sidebarCollapsed);
      }
  }


  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F7F8FA] dark:bg-[#1A1A1A] overflow-hidden">
        {/* Overlay only for mobile-md */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar - Styled to match the Donezo image */}
        <aside
          className={`fixed top-0 left-0 z-50 h-screen flex flex-col justify-between transition-all duration-300 bg-white dark:bg-[#252525] border-r border-gray-200 dark:border-gray-800 py-6 px-4 text-gray-800 dark:text-gray-200 ${
            sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"
          } lg:static ${
            // Toggling between 20 (collapsed) and 64 (open)
            sidebarCollapsed ? "lg:w-20 lg:translate-x-0" : "lg:w-64 lg:translate-x-0"
          }`}
        >
          <div>
            {/* Logo + Close btn (Styled to be minimalist and central) */}
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} gap-3 mb-10`}>
              <Link href="/" className="flex items-center gap-2">
                {/* Logo container like in the image */}
                <div className="w-8 h-8 rounded-full bg-[#13C065] flex items-center justify-center flex-shrink-0">
                   {/* Using Menu as a logo placeholder */}
                   <Image
                      src={theme === 'dark' ? darkLogo : logo}
                      alt="RideX Logo"
                      width={30}
                      height={30}
                      className="object-contain p-1"
                   />
                </div>
                {!sidebarCollapsed && (
                  <span className="text-xl font-bold dark:text-white">RideX</span>
                )}
              </Link>

              {/* Mobile Close Btn */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Navigation - MENU Section (Original Links) */}
            <h3 className={`text-xs font-semibold uppercase text-gray-400 mb-2 ${sidebarCollapsed ? 'sr-only' : ''}`}>
                MENU
            </h3>
            <nav className="flex flex-col gap-1 mb-8">
              {/* Original Dashboard Link - Now styled with SidebarLink component */}
              <SidebarLink
                href="/dashboard"
                pathname={pathname}
                Icon={LayoutDashboard}
                label="Dashboard"
                collapsed={sidebarCollapsed}
              />

              {/* Original dynamic navigation links (User/Rider/Admin) - PASSING COLLAPSED PROP */}
              {userRole === "user" && <UserDashboard collapsed={sidebarCollapsed} />}
              {userRole === "rider" && <RiderDashboard collapsed={sidebarCollapsed} />}
              {userRole === "admin" && <AdminDashboard collapsed={sidebarCollapsed} />}
            </nav>

            {/* Navigation - GENERAL Section (Kept for visual structure) */}
            <h3 className={`text-xs font-semibold uppercase text-gray-400 mb-2 ${sidebarCollapsed ? 'sr-only' : ''}`}>
                GENERAL
            </h3>
            <nav className="flex flex-col gap-1 mb-8">
               {/* Place general/utility links here if needed. Otherwise, keep it empty or remove the section. */}
            </nav>
          </div>

          {/* Logout Card (Replacing Download App Card, hidden when collapsed) */}
          {!sidebarCollapsed && (
            <div className="bg-[#E7F3ED] dark:bg-[#333] p-4 rounded-xl flex flex-col items-start space-y-2 border border-[#B3D9C4] dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Ready to Logout?</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Secure your session before leaving.</p>
              {/* Styled SignOutButton for the card */}
              <SignOutButton className="text-sm font-medium w-full text-center bg-red-500 text-white py-2 px-4 rounded-lg mt-2 hover:bg-red-600 transition flex items-center justify-center gap-2">
                 <LogOut className="w-4 h-4" />
                 Logout
              </SignOutButton>
            </div>
          )}
           {/* Logout Icon (Visible only when collapsed) */}
          {sidebarCollapsed && (
            <div className="w-full">
              <SignOutButton className="p-3 w-full rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition flex justify-center" title="Logout">
                 <LogOut className="w-5 h-5 text-red-500" />
              </SignOutButton>
            </div>
          )}

          {/* Logout Button (Mobile Fallback - kept for functional integrity) */}
          <div className="lg:hidden">
             {/* If the above card or icon is sufficient for mobile, this can be removed.
             Keeping it here in case SignOutButton's default styling is preferred for mobile. */}
             {/* <SignOutButton /> */}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col h-full">
          {/* Topbar - Styled to match the Donezo image */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#252525] sticky top-0 z-30 shadow-sm">

            <div className="flex items-center gap-4">
               {/* Toggle button - Simplified logic and icon for better custom look */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] transition"
              >
                {/* Use Menu icon for mobile/desktop toggle, regardless of state, for a cleaner UI */}
                <Menu className="w-6 h-6 text-gray-500" />
              </button>

               {/* Removed Search (desktop) as requested */}
            </div>


            <div className="flex items-center gap-3 md:gap-5">

              {/* Removed Filter/Sort (F) button as requested */}

              {/* Theme Toggle */}
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="rounded-full p-2 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-300" />
                {/* Small red dot for notification */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
              </div>

              {/* go online - offline (RiderStatus) */}
              {userRole === 'rider' && <RiderStatus />}

              {/* User Profile Info and Avatar */}
              {data && (
                <Link href="/dashboard/my-profile" className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#333] transition">
                    <div className="hidden sm:flex flex-col items-end leading-none">
                        <span className="text-sm font-semibold dark:text-white">{user?.name || data.name || "Totak Michael"}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email || data.email}</span>
                    </div>
                    <Image
                      src={data.photoUrl || "/default-avatar.png"}
                      height="40"
                      width="40"
                      alt="userPhoto"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-[#13C065]"
                    />
                </Link>
              )}
            </div>
          </header>

          {/* Mobile search input - Removed as per request to remove all search elements */}
          {/* {showSearch && (...) } */}

          {/* Dynamic Content */}
          <main className="flex-1 overflow-y-auto scrollbar-hidden px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
