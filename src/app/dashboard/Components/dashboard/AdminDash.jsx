"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import {
  Chart,
  ChartHeader,
  ChartBody,
  ChartLegend,
  ChartLegendItem,
  ChartContent,
} from "@/components/ui/charts/areaChart";
import { Users, User, Bike, DollarSign } from "lucide-react";
import CountUp from "react-countup";
import {
  AreaChart as ReAreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- Chart Data ---------- */
const chartData = [
  { date: "2024-06-01", desktop: 120, mobile: 80 },
  { date: "2024-06-02", desktop: 85, mobile: 150 },
  { date: "2024-06-03", desktop: 180, mobile: 95 },
  { date: "2024-06-04", desktop: 110, mobile: 220 },
  { date: "2024-06-05", desktop: 250, mobile: 130 },
  { date: "2024-06-06", desktop: 140, mobile: 280 },
  { date: "2024-06-07", desktop: 300, mobile: 160 },
  { date: "2024-06-08", desktop: 170, mobile: 340 },
  { date: "2024-06-09", desktop: 380, mobile: 190 },
  { date: "2024-06-10", desktop: 210, mobile: 420 },
  { date: "2024-06-11", desktop: 450, mobile: 230 },
  { date: "2024-06-12", desktop: 190, mobile: 380 },
  { date: "2024-06-13", desktop: 420, mobile: 210 },
  { date: "2024-06-14", desktop: 160, mobile: 320 },
  { date: "2024-06-15", desktop: 350, mobile: 180 },
  { date: "2024-06-16", desktop: 200, mobile: 400 },
  { date: "2024-06-17", desktop: 440, mobile: 220 },
  { date: "2024-06-18", desktop: 180, mobile: 360 },
  { date: "2024-06-19", desktop: 390, mobile: 195 },
  { date: "2024-06-20", desktop: 220, mobile: 440 },
  { date: "2024-06-21", desktop: 470, mobile: 235 },
  { date: "2024-06-22", desktop: 195, mobile: 390 },
  { date: "2024-06-23", desktop: 430, mobile: 215 },
  { date: "2024-06-24", desktop: 170, mobile: 340 },
  { date: "2024-06-25", desktop: 370, mobile: 185 },
  { date: "2024-06-26", desktop: 205, mobile: 410 },
  { date: "2024-06-27", desktop: 450, mobile: 225 },
  { date: "2024-06-28", desktop: 185, mobile: 370 },
  { date: "2024-06-29", desktop: 410, mobile: 205 },
  { date: "2024-06-30", desktop: 220, mobile: 440 },
  { date: "2024-07-01", desktop: 480, mobile: 240 },
  { date: "2024-07-02", desktop: 160, mobile: 320 },
  { date: "2024-07-03", desktop: 350, mobile: 175 },
  { date: "2024-07-04", desktop: 195, mobile: 390 },
  { date: "2024-07-05", desktop: 430, mobile: 215 },
  { date: "2024-07-06", desktop: 180, mobile: 360 },
  { date: "2024-07-07", desktop: 400, mobile: 200 },
  { date: "2024-07-08", desktop: 210, mobile: 420 },
  { date: "2024-07-09", desktop: 460, mobile: 230 },
  { date: "2024-07-10", desktop: 170, mobile: 340 },
  { date: "2024-07-11", desktop: 380, mobile: 190 },
  { date: "2024-07-12", desktop: 200, mobile: 400 },
  { date: "2024-07-13", desktop: 440, mobile: 220 },
  { date: "2024-07-14", desktop: 185, mobile: 370 },
  { date: "2024-07-15", desktop: 410, mobile: 205 },
  { date: "2024-07-16", desktop: 175, mobile: 350 },
  { date: "2024-07-17", desktop: 390, mobile: 195 },
  { date: "2024-07-18", desktop: 215, mobile: 430 },
  { date: "2024-07-19", desktop: 470, mobile: 235 },
  { date: "2024-07-20", desktop: 165, mobile: 330 },
  { date: "2024-07-21", desktop: 360, mobile: 180 },
  { date: "2024-07-22", desktop: 190, mobile: 380 },
  { date: "2024-07-23", desktop: 420, mobile: 210 },
  { date: "2024-07-24", desktop: 155, mobile: 310 },
  { date: "2024-07-25", desktop: 340, mobile: 170 },
  { date: "2024-07-26", desktop: 180, mobile: 360 },
  { date: "2024-07-27", desktop: 400, mobile: 200 },
  { date: "2024-07-28", desktop: 145, mobile: 290 },
  { date: "2024-07-29", desktop: 320, mobile: 160 },
  { date: "2024-07-30", desktop: 170, mobile: 340 },
  { date: "2024-07-31", desktop: 380, mobile: 190 },
  { date: "2024-08-01", desktop: 135, mobile: 270 },
  { date: "2024-08-02", desktop: 300, mobile: 150 },
  { date: "2024-08-03", desktop: 160, mobile: 320 },
  { date: "2024-08-04", desktop: 360, mobile: 180 },
  { date: "2024-08-05", desktop: 125, mobile: 250 },
  { date: "2024-08-06", desktop: 280, mobile: 140 },
];
const chartConfig = {
  desktop: { label: "Desktop", color: "#4F46E5" },
  mobile: { label: "Mobile", color: "#10B981" },
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

      {/* Area Chart */}
      <Chart className="p-4 bg-background rounded-xl shadow">
        <ChartHeader>
          <h2 className="text-lg font-semibold">Website Traffic</h2>
          <span className="text-muted-foreground text-sm">Last 30 Days</span>
        </ChartHeader>

        <ChartBody>
          <ResponsiveContainer width="100%" height="100%">
            <ReAreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {Object.keys(chartConfig).map((key) => (
                  <linearGradient
                    key={key}
                    id={`fill-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartConfig[key].color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig[key].color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="var(--muted)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--muted)",
                  borderRadius: 8,
                  color: "var(--popove)",
                  padding: "14px 12px",
                  fontSize: "12px",
                }}
              />

              {Object.keys(chartConfig).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#fill-${key})`}
                  stroke={chartConfig[key].color}
                  stackId="a"
                />
              ))}
            </ReAreaChart>
          </ResponsiveContainer>
        </ChartBody>

        <ChartLegend>
          {Object.keys(chartConfig).map((key) => (
            <ChartLegendItem
              key={key}
              color={chartConfig[key].color}
              label={chartConfig[key].label}
            />
          ))}
        </ChartLegend>
      </Chart>
    </div>
  );
}
