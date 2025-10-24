"use client";

import {  LayoutDashboard, BarChart3, Clock, DollarSign, PlayCircle, Truck, User, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Replicating SidebarLink logic for RiderDashboard
const SidebarLinkInternal = ({ href, pathname, Icon, label, collapsed }) => {
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
      <Icon
        className={`transition-all duration-500 ${collapsed ? "w-6 h-6" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-400 dark:text-gray-400"}`}
      />

      <span
        className={`text-[15px] font-medium transform transition-all duration-500 ease-in-out ${
          collapsed ? "opacity-0 translate-x-[-10px] w-0" : "opacity-100 translate-x-0 w-auto"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

// RiderDashboard component with collapse support
const RiderDashboard = ({ collapsed }) => {
  const pathname = usePathname();

  const riderLinks = [
        { href: "/dashboard/rider", Icon:  LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/rider/available-rides", Icon: Truck, label: "Available Rides" },
    { href: "/dashboard/rider/ongoing-ride", Icon: PlayCircle, label: "Ongoing Ride" },
    { href: "/dashboard/rider/earnings", Icon: DollarSign, label: "Earnings Overview" },
    { href: "/dashboard/rider/ride-history", Icon: Clock, label: "Ride History" },
    { href: "/dashboard/rider/performance-stats", Icon: BarChart3, label: "Performance Stats" },

      //  general menu
    { href: "/dashboard/rider/profile-vehicle-info", Icon: User, label: "Profile & Vehicle Info" },
    { href: "/dashboard/rider/support", Icon: HelpCircle, label: "Support" },
  ];

  return (
    <>
      {riderLinks.map((link, inx) => (
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

export default RiderDashboard;
