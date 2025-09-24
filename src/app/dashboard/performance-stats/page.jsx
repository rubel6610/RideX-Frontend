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
    <div className="p-4 space-y-6">
      {/* Top 3 summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rating */}
        <Card className="shadow-md rounded-xl p-4 flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-500" />
          <div>
            <CardTitle className="text-lg font-semibold">Rating</CardTitle>
            <CardContent className="text-2xl font-bold">{performance.rating}/5</CardContent>
          </div>
        </Card>

        {/* Cancellation Rate */}
        <Card className="shadow-md rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500" />
          <div>
            <CardTitle className="text-lg font-semibold">Cancellation Rate</CardTitle>
            <CardContent className="text-2xl font-bold">{performance.cancelledRate}%</CardContent>
          </div>
        </Card>

        {/* Acceptance Rate */}
        <Card className="shadow-md rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <CardTitle className="text-lg font-semibold">Acceptance Rate</CardTitle>
            <CardContent className="text-2xl font-bold">{performance.acceptanceRate}%</CardContent>
          </div>
        </Card>
      </div>

      {/* Trend chart */}
      <Card className="max-w-4xl mx-auto shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Rating Trend (Last 7 Weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Bar data={data} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
