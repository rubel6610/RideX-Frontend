import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const AdminDashboard = () => {
    const pathname = usePathname();
  return (
    <div>
      <Link
        href="/dashboard/admin/rider-management"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/admin/rider-management"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <Shield className="w-5 h-5" /> Rider Requests
      </Link>
       <Link
        href="/dashboard/admin/monitor-live-rides"
        className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
          pathname === "/dashboard/admin/monitor-live-rides"
            ? "bg-primary/90 text-background"
            : "text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <Shield className="w-5 h-5" /> Monitor Live Ride 
      </Link>
    </div>
  );
};

export default AdminDashboard;
