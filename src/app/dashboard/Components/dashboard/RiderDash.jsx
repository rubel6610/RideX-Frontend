"use client";

import * as React from "react";
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

/* ---------- Dummy chart data ---------- */
const areaData = [
  { month: "Jan", earnings: 590 },
  { month: "Feb", earnings: 770 },
  { month: "Mar", earnings: 660 },
  { month: "Apr", earnings: 900 },
  { month: "May", earnings: 8950 },
  { month: "Jun", earnings: 9200 },
];

const barData = [
  { day: "Mon", rides: 5 },
  { day: "Tue", rides: 7 },
  { day: "Wed", rides: 6 },
  { day: "Thu", rides: 8 },
  { day: "Fri", rides: 5 },
  { day: "Sat", rides: 9 },
  { day: "Sun", rides: 6 },
];

const lineData = [
  { week: "W1", rating: 4.1 },
  { week: "W2", rating: 4.3 },
  { week: "W3", rating: 4.0 },
  { week: "W4", rating: 4.5 },
  { week: "W5", rating: 4.4 },
];

/* ---------- RiderDash ---------- */
export default function RiderDash() {
  const stats = [
    { title: "Completed Rides", icon: Bike, value: 120 },
    { title: "Active Rides", icon: Clock, value: 2 },
    { title: "Canceled Rides", icon: CaptionsOff, value: 30 },
    { title: "Total Earnings", icon: DollarSign, value: 45000 },
  ];

  return (
    <div className="space-y-4">
      {/* Heading + Spinner */}
      <div className="flex items-center space-x-3">
        <h1 className="flex gap-2 text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-10 w-10 text-destructive dark:text-primary animate-spin-slow" />
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
                  decimals={item.title === "Avg. Rating" ? 1 : 0}
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
            <CardTitle>Ratings Over Time</CardTitle>
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
