"use client";

import { useAuth } from "@/app/hooks/AuthProvider";
import { LayoutDashboard, AlertTriangle, Gift, MapPin, Shield, UserCog, User, HelpCircle, PenBox, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// SidebarLinkInternal for AdminDashboard
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

const AdminDashboard = ({ collapsed }) => {
  const pathname = usePathname();
  const {user} = useAuth();

  const adminLinks = [
    { href: "/dashboard/admin", Icon:  LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/admin/user-management", Icon: UserCog, label: "User Management" },
    { href: "/dashboard/admin/rider-management", Icon: Shield, label: "Rider Requests" },
    { href: "/dashboard/admin/monitor-live-rides", Icon: MapPin, label: "Monitor Live Ride" },
    { href: "/dashboard/admin/disputes-complaints", Icon: AlertTriangle, label: "Complaints" },
    { href: "/dashboard/admin/promotions-discounts", Icon: Gift, label: "Promotions & Discounts" },
    { href: "/dashboard/admin/manage-payments", Icon: DollarSign, label: "Payment Management" },
    { href: "/dashboard/admin/create-blog", Icon: PenBox, label: "Create Blog" },

    //  general menu
    {href: "/dashboard/my-profile", Icon: User, label: `${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Profile`},
    { href: "/dashboard/admin/support-inbox", Icon: HelpCircle, label: "Support Inbox" },

  ];

  return (
    <>
      {adminLinks.map((link) => (
        <SidebarLinkInternal
          key={link.href}
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

export default AdminDashboard;