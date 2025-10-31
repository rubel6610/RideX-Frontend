"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Settings, CaptionsOff, Clock, Bike, DollarSign } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import CountUp from "react-countup";
import { useAuth } from "@/app/hooks/AuthProvider";

/* ---------- utils ---------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------- shadcn/ui inline card ---------- */
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

export default function RiderDash() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/analytics/rider/${user.id}`
        );
        const data = await res.json();

        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Failed to fetch rider analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [user]);

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
    { title: "Completed Rides", icon: Bike, value: analytics?.completedRides || 0 },
    { title: "Active Rides", icon: Clock, value: analytics?.activeRides || 0 },
    { title: "Canceled Rides", icon: CaptionsOff, value: analytics?.canceledRides || 0 },
    { title: "Total Earnings", icon: DollarSign, value: analytics?.totalEarnings || 0 },
  ];

  const areaData = analytics?.monthlyEarnings || [];
  const barData = analytics?.weeklyRides || [];
  const lineData = [
    { week: "W1", rating: 4.1 },
    { week: "W2", rating: 4.3 },
    { week: "W3", rating: 4.0 },
    { week: "W4", rating: 4.5 },
    { week: "W5", rating: 4.4 },
  ];

  return (
    <div className="p-4 space-y-6 mt-6 max-w-screen mx-auto lg:w-full md:w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h1 className="flex gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-destructive dark:text-primary animate-spin-slow" />
          RIDER ANALYSIS
        </h1>
      </div>

      {/* Top Stats */}
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
                  decimals={item.title === "Total Earnings" ? 0 : 0}
                  prefix={item.title === "Total Earnings" ? "৳ " : ""}
                />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Row (3 charts same size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Earnings Area Chart */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" className="[stop-color:#87e64b]" stopOpacity={0.7} />
                    <stop offset="95%" className="[stop-color:#87e64b]" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#6bcf32"
                  fill="url(#colorEarn)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rides Bar Chart */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Weekly Rides</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rides" className="fill-[#ef4444]" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ratings Line Chart */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Ratings Over Time </CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="week" />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#87e64b"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}