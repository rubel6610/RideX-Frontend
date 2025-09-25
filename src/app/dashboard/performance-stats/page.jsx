"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Star, XCircle, CheckCircle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PerformanceStats() {
  // Dummy data initially
  const [performance, setPerformance] = useState({
    rating: 4.5,          // average rating
    cancelledRate: 8,     // %
    acceptanceRate: 92,   // %
    trend: [5, 4, 4.5, 4, 4.8, 5, 4.7], // weekly rating trend
  });

  // Chart data for trend
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
    datasets: [
      {
        label: "Rating Trend",
        data: performance.trend,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Performance Trend", font: { size: 18 } },
    },
    scales: { y: { beginAtZero: true, max: 5 } },
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Top 3 summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rating */}
        <div className="p-6 shadow-md bg-accent/50 rounded-2xl flex flex-col items-center transition-all hover:-translate-y-1 duration-300 hover:border-primary group-hover:bg-accent cursor-pointer border border-border">
          <Star className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">Rating</h3>
          <h3 className="text-2xl font-bold">{performance.rating}/5</h3>
        </div>

        {/* Cancellation Rate */}
        <div className="p-6 shadow-md bg-accent/50 rounded-2xl flex flex-col items-center transition-all hover:-translate-y-1 duration-300 hover:border-primary group-hover:bg-accent cursor-pointer border border-border">
          <XCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">Cancellation Rate</h3>
          <h3 className="text-2xl font-bold">{performance.cancelledRate}%</h3>
        </div>

        {/* Acceptance Rate */}
        <div className="p-6 shadow-md bg-accent/50 rounded-2xl flex flex-col items-center transition-all hover:-translate-y-1 duration-300 hover:border-primary group-hover:bg-accent cursor-pointer border border-border">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold">Acceptance Rate</h3>
          <h3 className="text-2xl font-bold">{performance.acceptanceRate}%</h3>
        </div>
      </div>

      {/* Trend chart */}
      <div className="p-6 shadow-md rounded-2xl hover:border-primary border border-border">
        <div className="p-6">
          <CardTitle className="text-xl font-semibold">Rating Trend (Last 7 Weeks)</CardTitle>
        </div>

          <div className="overflow-x-auto p-6">
            <Bar data={data} options={options} />
          </div>
      </div>
    </div>
  );
}
