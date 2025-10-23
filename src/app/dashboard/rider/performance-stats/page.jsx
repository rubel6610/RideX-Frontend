"use client";

import { useAuth } from "@/app/hooks/AuthProvider";
import { da } from "date-fns/locale";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceStats() {
  const { user } = useAuth();
  // console.log(user?.id);
  const [allRiders, setAllRiders] = useState([]);
  const [error, setError] = useState(null);


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

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/riders`);
        const data = await res.json();

        // server থেকে আসা riders array ধরে রাখা
        setAllRiders(Array.isArray(data.riders) ? data.riders : []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRiders();
  }, []);

  const matchedRider = allRiders.find(rider => rider.userId === user?.id);
  console.log("Matched Rider:", matchedRider);

  const reviewOutOfFive = matchedRider?.reviews / 13;
  const formattedReview = reviewOutOfFive?.toFixed(1);
  console.log(formattedReview);

  const stats = [
    { icon: "⭐", title: "Rating", value: `${formattedReview}/5` },
    { icon: "❌", title: "Cancellation Rate", value: `${performance.cancelledRate}%` },
    { icon: "✅", title: "Acceptance Rate", value: `${performance.acceptanceRate}%` },
  ];

  // Loading and error states handling
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-background rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">{stat.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
            <h3 className="text-3xl font-bold mb-2 text-primary">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Additional Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Breakdown */}
        <div className="p-6 bg-background rounded-2xl border border-border">
          <h2 className="text-xl font-semibold mb-4">Payment Status Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Completed Payments
              </span>
              <span className="font-semibold">{performance.paymentBreakdown.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Pending Payments
              </span>
              <span className="font-semibold">{performance.paymentBreakdown.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Failed Payments
              </span>
              <span className="font-semibold">{performance.paymentBreakdown.failed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                Cancelled Payments
              </span>
              <span className="font-semibold">{performance.paymentBreakdown.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Ride Status Breakdown */}
        <div className="p-6 bg-background rounded-2xl border border-border">
          <h2 className="text-xl font-semibold mb-4">Ride Status Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Completed Rides
              </span>
              <span className="font-semibold">{performance.rideBreakdown.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Accepted Rides
              </span>
              <span className="font-semibold">{performance.rideBreakdown.accepted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Pending Rides
              </span>
              <span className="font-semibold">{performance.rideBreakdown.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Rejected/Cancelled
              </span>
              <span className="font-semibold">{performance.rideBreakdown.rejected + performance.rideBreakdown.cancelled}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Trend Chart */}
      <div className="p-6 bg-background rounded-2xl border border-border">
        <h2 className="text-xl font-semibold mb-6">Rating Trend (Last 7 Weeks)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 5]} />
            <Tooltip 
              formatter={(value, name) => [value, "Rating"]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="rating" fill="#3b82f6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
