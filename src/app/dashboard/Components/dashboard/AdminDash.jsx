"use client";

import * as React from "react";
import { Settings } from "lucide-react";
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
import { Users, User, Bike, DollarSign } from "lucide-react";
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
  { month: "Jan", revenue: 200 },
  { month: "Feb", revenue: 400 },
  { month: "Mar", revenue: 300 },
  { month: "Apr", revenue: 600 },
  { month: "May", revenue: 500 },
  { month: "Jun", revenue: 800 },
];

const barData = [
  { day: "Mon", bookings: 20 },
  { day: "Tue", bookings: 40 },
  { day: "Wed", bookings: 25 },
  { day: "Thu", bookings: 50 },
  { day: "Fri", bookings: 35 },
  { day: "Sat", bookings: 60 },
  { day: "Sun", bookings: 45 },
];

const lineData = [
  { week: "W1", growth: 200 },
  { week: "W2", growth: 300 },
  { week: "W3", growth: 250 },
  { week: "W4", growth: 400 },
  { week: "W5", growth: 350 },
];
/* ---------- AdminDash ---------- */
export default function AdminDash() {
  const stats = [
    { title: "Total Passengers", icon: User, value: 420 },
    { title: "Total Riders", icon: Bike, value: 850 },
    { title: "Total Users", icon: Users, value: 3200 },
    { title: "Earnings", icon: DollarSign, value: 120000 },
  ];

  return (
    <div className="space-y-4">
      {/* Heading + Spinner */}
      <div className="flex items-center space-x-3">
        <h1 className="flex gap-2 text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-10 w-10 text-destructive dark:text-primary animate-spin-slow" />  SEE ANALYSIS
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
                />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Row (3 charts same size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" className="[stop-color:#87e64b]" stopOpacity={0.7} />
                    <stop offset="95%" className="[stop-color:#87e64b]" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6bcf32"
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings Bar Chart */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" className="fill-[#ef4444]" />
                <Bar dataKey="bookings" className="fill-[#ef4444]" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Line Chart */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="growth"
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
