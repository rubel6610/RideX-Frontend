"use client"

import { AlertTriangle, Gift, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const AdminDashboard = () => {
  const pathname = usePathname();
  return (
    <div>
      <Link
        href="/dashboard/user-management"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          usePathname === "/dashboard/user-management"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <Shield className="w-5 h-5" /> User Management
      </Link>
      <Link
        href="/dashboard/monitor-live-rides"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/monitor-live-rides"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <MapPin className="w-5 h-5" /> Monitor Live Ride
      </Link>

      {/* Handle Disputes & Complaints */}
      <Link
        href="/dashboard/disputes-complaints"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/disputes-complaints"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <AlertTriangle className="w-5 h-5" /> Disputes & Complaints
      </Link>

      {/* Promotions & Discounts */}
      <Link
        href="/dashboard/promotions-discounts"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/promotions-discounts"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <Gift className="w-5 h-5" /> Promotions & Discounts
      </Link>
    </div>
  );
};

export default AdminDashboard;
