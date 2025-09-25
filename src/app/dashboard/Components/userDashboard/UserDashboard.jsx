import React from 'react';

const UserDashboard = () => {
    return (
       <>
                  <Link
                    href="/dashboard/book-a-ride"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/book-a-ride"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Users className="w-5 h-5" /> Book A Ride
                  </Link>
                  <Link
                    href="/dashboard/ride-history"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/ride-history"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" /> Ride History
                  </Link>
                  <Link
                    href="/dashboard/saved-locations"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/saved-locations"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Star className="w-5 h-5" /> Saved Locations
                  </Link>
                  <Link
                    href="/dashboard/payment-options"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/payment-options"
                        ? "bg-primary/90 text-background"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <DollarSign className="w-5 h-5" /> Payment Options
                  </Link>
                  <Link
                    href="/dashboard/support"
                    className={`nav-link flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      pathname === "/dashboard/support"
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