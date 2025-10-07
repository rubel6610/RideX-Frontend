"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EarningPage = () => {
  const [period, setPeriod] = useState("daily");

  const earnings = {
    daily: [50, 75, 100, 80, 60, 90, 120],
    weekly: [400, 550, 600, 450],
    monthly: [1500, 1800, 2000, 1700, 2200, 2100, 1900, 2300, 2500, 2400, 2600, 2800],
  };

  const labels = {
    daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  };

  const currentEarnings = earnings[period];
  const currentLabels = labels[period];

  const chartData = currentLabels.map((label, i) => ({
    label,
    value: currentEarnings[i],
  }));

  const summary = {
    today: earnings.daily[earnings.daily.length - 1],
    week: earnings.weekly.reduce((a, b) => a + b, 0),
    month: earnings.monthly.reduce((a, b) => a + b, 0),
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Today's Earning", value: summary.today },
          { title: "This Week", value: summary.week },
          { title: "This Month", value: summary.month },
        ].map((item, index) => (
          <div key={index} className="p-6  rounded-2xl border border-gray-200 text-center">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <h2 className="text-2xl font-bold text-blue-600">${item.value}</h2>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 bg-background rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Earnings Chart</h2>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                className={`px-4 py-1 rounded-lg font-medium ${
                  period === p ? "bg-muted " : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningPage;