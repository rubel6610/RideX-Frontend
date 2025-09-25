"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EarningPage() {
  // Dummy data
  const [earnings, setEarnings] = useState({
    daily: [50, 75, 100, 80, 60, 90, 120],
    weekly: [400, 550, 600, 450],
    monthly: [1500, 1800, 2000, 1700, 2200, 2100, 1900, 2300, 2500, 2400, 2600, 2800],
  });

  const [period, setPeriod] = useState("daily");

  // Summary cards values
  const summary = {
    today: earnings.daily?.[earnings.daily.length - 1] || 0,
    week: earnings.weekly?.reduce((a, b) => a + b, 0) || 0,
    month: earnings.monthly?.reduce((a, b) => a + b, 0) || 0,
  };

  // Labels
  const labels = {
    daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    monthly: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  };

  const data = {
    labels: labels[period],
    datasets: [
      {
        label: "Income ($)",
        data: earnings[period],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Earnings Overview (${period})`, font: { size: 18 } },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Top 3 summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 shadow-md bg-accent/50 rounded-2xl flex flex-col items-center transition-all hover:-translate-y-1 duration-300 hover:border-primary group-hover:bg-accent cursor-pointer border border-border">
          <h2 className="text-lg font-semibold">Today's Earning</h2>
          <h2 className="text-2xl font-bold text-primary">${summary.today}</h2>
        </div>

        <div className="p-6 shadow-md bg-accent/50 rounded-2xl flex flex-col items-center transition-all hover:-translate-y-1 duration-300 hover:border-primary group-hover:bg-accent cursor-pointer border border-border">
          <h2 className="text-lg font-semibold">This Week</h2>
          <h2 className="text-2xl font-bold text-primary">${summary.week}</h2>
        </div>

        <div className="p-6 shadow-md bg-accent/50 rounded-2xl flex flex-col items-center transition-all hover:-translate-y-1 duration-300 hover:border-primary group-hover:bg-accent cursor-pointer border border-border">
          <h2 className="text-lg font-semibold">This Month</h2>
          <h2 className="text-2xl font-bold text-primary">${summary.month}</h2>
        </div>
      </div>

      {/* Chart + Period toggle */}
      <div className="p-6 shadow-md rounded-2xl hover:border-primary border border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-xl font-semibold">Earnings Chart</h2>
          <div className="flex gap-2 mt-2 sm:mt-0">
            {["daily","weekly","monthly"].map((p) => (
              <button
                key={p}
                className={`px-4 py-1 rounded-lg font-medium transition-colors ${period===p ? "bg-primary text-background":"bg-gray-100 hover:bg-primary/20 text-gray-700"}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>

          <div className="overflow-x-auto p-6">
            <Bar data={data} options={options} />
          </div>
      </div>
    </div>
  );
}
