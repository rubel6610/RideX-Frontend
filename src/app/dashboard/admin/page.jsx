"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Settings, Users, User, Bike, DollarSign } from "lucide-react";
import CountUp from "react-countup";

import Charts from "./Components/Charts";
import DataTableDemo from "./Components/DataTableDemo";

/* ---------- utils ---------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-500",
      "dark:border-neutral-800 dark:hover:border-sidebar-primary-foreground hover:border-card dark:bg-neutral-900 hover:dark:bg-neutral-800 dark:text-neutral-100",
      "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 hover:text-destructive dark:hover:text-[#ef4444]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 p-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "font-bold leading-none tracking-tight text-lg",
      "dark:text-neutral-100 text-neutral-800 group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-all duration-500"
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("pr-4 pt-0 -ml-4", className)} {...props} />
);

export default function AdminDash() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/analytics/admin`
        );
        const data = await res.json();

        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Failed to fetch admin analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Passengers", icon: User, value: analytics?.totalPassengers || 0 },
    { title: "Total Riders", icon: Bike, value: analytics?.totalRiders || 0 },
    { title: "Total Users", icon: Users, value: analytics?.totalUsers || 0 },
    { title: "Earnings", icon: DollarSign, value: analytics?.totalEarnings || 0 },
  ];

  return (
    <div className="p-4 space-y-6 mt-6 max-w-screen mx-auto lg:w-full md:w-full">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h1 className="flex gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-destructive dark:text-primary animate-spin-slow" />
          SEE ANALYSIS
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <Card key={idx} className="flex flex-col justify-center p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{item.title}</CardTitle>
              <item.icon className="h-7 w-7 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold ml-8 pb-2">
                <CountUp 
                  end={item.value} 
                  duration={2.2} 
                  delay={0.4} 
                  separator=","
                  prefix={item.title === "Earnings" ? "৳ " : ""}
                />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Charts />

      {/* Table Section */}
      <DataTableDemo />
    </div>
  );
}
