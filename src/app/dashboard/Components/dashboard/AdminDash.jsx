"use client";

import * as React from "react";
import { Settings, Users, User, Bike, DollarSign } from "lucide-react";
import CountUp from "react-countup";

// আলাদা component import
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

/* ---------- AdminDash ---------- */
export default function AdminDash() {
  const stats = [
    { title: "Total Passengers", icon: User, value: 420 },
    { title: "Total Riders", icon: Bike, value: 850 },
    { title: "Total Users", icon: Users, value: 3200 },
    { title: "Earnings", icon: DollarSign, value: 120000 },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center space-x-3">
        <h1 className="flex gap-2 text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-10 w-10 text-destructive dark:text-primary animate-spin-slow" />
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
                <CountUp end={item.value} duration={2.2} delay={0.4} separator="," />
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
