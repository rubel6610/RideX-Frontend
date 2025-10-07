import { DollarSign, Star, TrendingUp, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const UserDashboard = () => {
    const pathname = usePathname();
    return (
       <>
                  <Link
                    href="/dashboard/user/book-a-ride"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/user/book-a-ride"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Users className="w-5 h-5" /> Book A Ride
                  </Link>
                  <Link
                    href="/dashboard/user/ride-history"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/user/ride-history"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" /> Ride History
                  </Link>
                  <Link
                    href="/dashboard/user/saved-locations"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/user/saved-locations"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Star className="w-5 h-5" /> Saved Locations
                  </Link>
                  <Link
                    href="/dashboard/user/payment-options"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/user/payment-options"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <DollarSign className="w-5 h-5" /> Payment Options
                  </Link>
                  <Link
                    href="/dashboard/user/support"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/user/support"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <User className="w-5 h-5" /> Support
                  </Link>
                </>
    );
};

export default UserDashboard;