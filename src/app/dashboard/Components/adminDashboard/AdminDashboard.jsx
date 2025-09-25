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
        href="/dashboard/admin/user-management"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          usePathname === "/dashboard/admin/user-management"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <Shield className="w-5 h-5" /> User Management
      </Link>
      <Link
        href="/dashboard/admin/monitor-live-rides"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/admin/monitor-live-rides"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <MapPin className="w-5 h-5" /> Monitor Live Ride
      </Link>

      {/* Handle Disputes & Complaints */}
      <Link
        href="/dashboard/admin/disputes-complaints"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/admin/disputes-complaints"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <AlertTriangle className="w-5 h-5" /> Disputes & Complaints
      </Link>

      {/* Promotions & Discounts */}
      <Link
        href="/dashboard/admin/promotions-discounts"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/admin/promotions-discounts"
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
