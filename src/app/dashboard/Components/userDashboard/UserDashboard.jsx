"use client";

import { DollarSign, Star, TrendingUp, User, Users, MapPin, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// Replicating the SidebarLink logic for internal consistency and collapse support
const SidebarLinkInternal = ({ href, pathname, Icon, label, collapsed, hasBadge = false }) => {
    // Check if the current pathname starts with the link's href to highlight active links
    const isActive = pathname.startsWith(href) && (pathname === href || pathname.startsWith(`${href}/`));

    return (
        <Link
            href={href}
            // Added overflow-hidden for smooth text transition
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
            {/* The icon's color logic also matches the SidebarLink */}
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400'} transition-colors`} />

            {/* 💡 SMOOTH TEXT TRANSITION: Fade in the text and give it width only when NOT collapsed */}
            <span
                className={`transition-opacity duration-200 ${
                    collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}
            >
                {label}
            </span>

            {/* Included the optional badge element */}
            {hasBadge && !collapsed && <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />}
        </Link>
    );
};


// The UserDashboard component now accepts the 'collapsed' prop
const UserDashboard = ({ collapsed }) => {
    const pathname = usePathname();

    // Define the links and their properties
    const userLinks = [
        { href: "/dashboard/user/book-a-ride", Icon: Users, label: "Book A Ride" },
        { href: "/dashboard/user/ride-history", Icon: TrendingUp, label: "Ride History" },
        { href: "/dashboard/user/saved-locations", Icon: MapPin, label: "Saved Locations" },
        { href: "/dashboard/user/payment-options", Icon: DollarSign, label: "Payment Options" },
        // Added Settings and Help for a more complete dashboard structure
        { href: "/dashboard/user/settings", Icon: Settings, label: "Settings" },
        { href: "/dashboard/user/support", Icon: HelpCircle, label: "Support" },
    ];


    return (
        <>
            {userLinks.map((link) => (
                <SidebarLinkInternal
                    key={link.href}
                    href={link.href}
                    pathname={pathname}
                    Icon={link.Icon}
                    label={link.label}
                    collapsed={collapsed}
                    // hasBadge is defaulted to false, no need to pass it unless a badge is desired
                />
            ))}
        </>
    );
};

export default UserDashboard;
