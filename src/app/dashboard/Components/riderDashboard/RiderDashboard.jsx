import { BarChart3, Clock, DollarSign, PlayCircle, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const RiderDashboard = () => {
    const pathname = usePathname();
    return (
        <>
                          <Link
                            href="/dashboard/rider/available-rides"
                            className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                              usePathname === "/dashboard/rider/available-rides"
                                ? "bg-primary/90 text-background"
                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <Truck className="w-5 h-5" /> Available Rides
                          </Link>
                          <Link
                            href="/dashboard/rider/ongoing-ride"
                            className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                              pathname === "/dashboard/rider/ongoing-ride"
                                ? "bg-primary/90 text-background"
                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <PlayCircle className="w-5 h-5" /> Ongoing Ride
                          </Link>
                          <Link
                            href="/dashboard/rider/earnings"
                            className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                              pathname === "/dashboard/rider/earnings"
                                ? "bg-primary/90 text-background"
                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <DollarSign className="w-5 h-5" /> Earnings Overview
                          </Link>
                          <Link
                            href="/dashboard/rider/ride-history"
                            className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                              pathname === "/dashboard/rider/ride-history"
                                ? "bg-primary/90 text-background"
                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <Clock className="w-5 h-5" /> Ride History
                          </Link>
                          <Link
                            href="/dashboard/rider/profile-vehicle-info"
                            className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                              pathname === "/dashboard/rider/profile-vehicle-info"
                                ? "bg-primary/90 text-background"
                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <User className="w-5 h-5" /> Profile & Vehicle Info
                          </Link>
                          <Link
                            href="/dashboard/rider/performance-stats"
                            className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                              pathname === "/dashboard/rider/performance-stats"
                                ? "bg-primary/90 text-background"
                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <BarChart3 className="w-5 h-5" /> Performance Stats
                          </Link>
                        </>
    );
};

export default RiderDashboard;