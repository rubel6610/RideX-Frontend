"use client";

import { useAuth } from '@/app/hooks/AuthProvider';
import {  LayoutDashboard, DollarSign, TrendingUp, Users, User, MapPin, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';


const SidebarLinkInternal = ({ href, pathname, Icon, label, collapsed, hasBadge = false }) => {
  const isActive = pathname.startsWith(href) && pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 ${collapsed ? "pl-2.5" : "px-3"} py-2 rounded-lg font-medium transition-all duration-500 ease-in-out text-base whitespace-nowrap overflow-hidden
        ${collapsed ? "justify-center" : "justify-start"}
        ${
          isActive
            ? "bg-[#256a42] text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      style={{ borderRadius: "8px" }}
      title={collapsed ? label : undefined}
    >
      {/* Icon */}
      <Icon
        className={`transition-all duration-500 ${
          collapsed ? "w-6 h-6" : "w-5 h-5"
        } ${isActive ? "text-white" : "text-gray-400 dark:text-gray-400"}`}
      />

      {/* Smooth text transition */}
      <span
        className={`text-[15px] font-medium transform transition-all duration-500 ease-in-out ${
          collapsed
            ? "opacity-0 translate-x-[-10px] w-0"
            : "opacity-100 translate-x-0 w-auto"
        }`}
      >
        {label}
      </span>

      {hasBadge && !collapsed && (
        <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
      )}
    </Link>
  );
};


// The UserDashboard component now accepts the 'collapsed' prop
const UserDashboard = ({ collapsed }) => {
    const pathname = usePathname();
    const {user} = useAuth();

    // Define the links and their properties
    const userLinks = [
        { href: "/dashboard/user", Icon:  LayoutDashboard, label: "Dashboard" },
        { href: "/dashboard/user/book-a-ride", Icon: Users, label: "Book A Ride" },
        { href: "/dashboard/user/ride-history", Icon: TrendingUp, label: "Ride History" },
        { href: "/dashboard/user/ongoing-ride", Icon: MapPin, label: "Ongoing Ride" },

        //  general menu
        {href: "/dashboard/my-profile", Icon: User, label: `${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Profile`},
        { href: "/dashboard/user/support", Icon: HelpCircle, label: "Support" },
    ];


    return (
        <>
            {userLinks.map((link, inx) => (
                <SidebarLinkInternal
                    key={inx}
                    href={link.href}
                    pathname={pathname}
                    Icon={link.Icon}
                    label={link.label}
                    collapsed={collapsed}
                />
            ))}
        </>
    );
};

export default UserDashboard;
