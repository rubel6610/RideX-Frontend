"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", desktop: 120, mobile: 60 },
  { month: "February", desktop: 250, mobile: 140 },
  { month: "March", desktop: 320, mobile: 180 },
  { month: "April", desktop: 210, mobile: 90 },
  { month: "May", desktop: 400, mobile: 230 },
  { month: "June", desktop: 380, mobile: 200 },
  { month: "July", desktop: 450, mobile: 260 },
  { month: "August", desktop: 480, mobile: 300 },
  { month: "September", desktop: 420, mobile: 240 },
  { month: "October", desktop: 500, mobile: 310 },
  { month: "November", desktop: 530, mobile: 320 },
  { month: "December", desktop: 600, mobile: 400 },
];


const chartConfig = {
  desktop: { label: "Desktop", color: "#4F46E5" },
  mobile: { label: "Mobile", color: "#10B981" },
};

export default function Charts() {
  return (
    <div className="bg-background rounded-xl shadow p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Website Earnings</h2>
        <span className="text-muted-foreground text-sm">January - June 2024</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} stroke="var(--muted)" strokeDasharray="4 4" />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
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
          <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={4} />
          <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-col items-start gap-2 text-sm mt-4">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </div>
    </div>
  );
}
