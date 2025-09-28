"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart as ReAreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- Parent Chart ---------- */
const Chart = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
));
Chart.displayName = "Chart";

/* ---------- Chart Header ---------- */
const ChartHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-between mb-4", className)} {...props} />
));
ChartHeader.displayName = "ChartHeader";

/* ---------- Chart Body ---------- */
const ChartBody = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full h-[250px]", className)} {...props} />
));
ChartBody.displayName = "ChartBody";

/* ---------- Chart Legend ---------- */
const ChartLegend = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex gap-4 mt-2", className)} {...props}>
    {children}
  </div>
));
ChartLegend.displayName = "ChartLegend";

/* ---------- Chart Legend Item ---------- */
const ChartLegendItem = React.forwardRef(({ color, label, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
    <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
));
ChartLegendItem.displayName = "ChartLegendItem";

/* ---------- Chart Tooltip ---------- */
const ChartTooltip = React.forwardRef(({ className, ...props }, ref) => (
  <Tooltip {...props} />
));
ChartTooltip.displayName = "ChartTooltip";

/* ---------- Chart Content (Fixed with ResponsiveContainer) ---------- */
const ChartContent = React.forwardRef(({ data, config, className, ...props }, ref) => (
  <ResponsiveContainer width="100%" height="100%">
    <ReAreaChart ref={ref} data={data} className={cn(className)} {...props}>
      <defs>
        {Object.keys(config).map((key) => (
          <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config[key].color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={config[key].color} stopOpacity={0.1} />
          </linearGradient>
        ))}
      </defs>

      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={32}
        tickFormatter={(value) => {
          const date = new Date(value);
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }}
      />

      {Object.keys(config).map((key) => (
        <Area
          key={key}
          dataKey={key}
          type="natural"
          fill={`url(#fill-${key})`}
          stroke={config[key].color}
          stackId="a"
        />
      ))}
    </ReAreaChart>
  </ResponsiveContainer>
));
ChartContent.displayName = "ChartContent";

/* ---------- Export All Sub Components ---------- */
export {
  Chart,
  ChartHeader,
  ChartBody,
  ChartLegend,
  ChartLegendItem,
  ChartTooltip,
  ChartContent,
};
