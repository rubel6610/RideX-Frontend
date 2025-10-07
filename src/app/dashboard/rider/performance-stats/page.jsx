"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceStats() {
  const [performance] = useState({
    rating: 4.5,
    cancelledRate: 8,
    acceptanceRate: 92,
    trend: [5, 4, 4.5, 4, 4.8, 5, 4.7],
  });

  const chartData = [
    { week: "Week 1", rating: performance.trend[0] },
    { week: "Week 2", rating: performance.trend[1] },
    { week: "Week 3", rating: performance.trend[2] },
    { week: "Week 4", rating: performance.trend[3] },
    { week: "Week 5", rating: performance.trend[4] },
    { week: "Week 6", rating: performance.trend[5] },
    { week: "Week 7", rating: performance.trend[6] },
  ];

  const stats = [
    { icon: "⭐", title: "Rating", value: `${performance.rating}/5` },
    { icon: "❌", title: "Cancellation Rate", value: `${performance.cancelledRate}%` },
    { icon: "✅", title: "Acceptance Rate", value: `${performance.acceptanceRate}%` },
  ];

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-background rounded-2xl border border-gray-200 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 bg-background rounded-2xl border border-border">
        <h2 className="text-xl font-semibold mb-6">Rating Trend (Last 7 Weeks)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="rating" fill="#3b82f6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}