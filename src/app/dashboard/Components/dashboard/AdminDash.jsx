"use client";

import * as React from "react";
import {
  Settings,
  Users,
  User,
  Bike,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- Chart Data ---------- */
const chartData = [
  { month: "January", desktop: 120, mobile: 60 },
  { month: "February", desktop: 250, mobile: 140 },
  { month: "March", desktop: 320, mobile: 180 },
  { month: "April", desktop: 210, mobile: 90 },
  { month: "May", desktop: 400, mobile: 230 },
  { month: "June", desktop: 380, mobile: 200 },
  { month: "July", desktop: 450, mobile: 260 },
  { month: "August", desktop: 300, mobile: 150 },
  { month: "September", desktop: 500, mobile: 280 },
  { month: "October", desktop: 470, mobile: 250 },
  { month: "November", desktop: 420, mobile: 230 },
  { month: "December", desktop: 600, mobile: 320 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4F46E5",
  },
  mobile: {
    label: "Mobile",
    color: "#10B981",
  },
};

/* ---------- utils ---------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------- Card Components ---------- */
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

/* ---------- AdminDash Component ---------- */
export default function AdminDash() {
  const stats = [
    { title: "Total Passengers", icon: User, value: 420 },
    { title: "Total Riders", icon: Bike, value: 850 },
    { title: "Total Users", icon: Users, value: 3200 },
    { title: "Earnings", icon: DollarSign, value: 120000 },
  ];

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center space-x-3">
        <h1 className="flex gap-2 text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-10 w-10 text-destructive dark:text-primary animate-spin-slow" />{" "}
          SEE ANALYSIS
        </h1>
      </div>

      {/* Top Stats Cards */}
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

      {/* Bar Chart */}
      <div className="bg-background rounded-xl shadow p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Website Earnings</h2>
          <span className="text-muted-foreground text-sm">
            January - June 2024
          </span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="var(--muted)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "var(--background)",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="desktop"
              fill={chartConfig.desktop.color}
              radius={4}
            />
            <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
          </BarChart>
        </ResponsiveContainer>

        {/* Footer Section */}
        <div className="flex flex-col items-start gap-2 text-sm mt-4">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </div>
      </div>
    </div>
  );
}
