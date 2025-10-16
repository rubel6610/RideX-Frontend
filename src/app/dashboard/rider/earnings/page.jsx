"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EarningPage = () => {
  const [period, setPeriod] = useState("daily");
  const [earnings, setEarnings] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [loading, setLoading] = useState(true);

  //  Fetch earnings data from backend
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payment/all");
        const data = await res.json();

        // ধরো backend থেকে daily, weekly, monthly আলাদা করে আসবে
        // যেমনঃ { daily: [..], weekly: [..], monthly: [..] }
        setEarnings({
          daily: data.daily || [],
          weekly: data.weekly || [],
          monthly: data.monthly || [],
        });
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const labels = {
    daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    monthly: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  const currentEarnings = earnings[period] || [];
  const currentLabels = labels[period];

  const chartData = currentLabels.map((label, i) => ({
    label,
    value: currentEarnings[i] || 0,
  }));

  const summary = {
    today: earnings.daily[earnings.daily.length - 1] || 0,
    week: earnings.weekly.reduce((a, b) => a + b, 0),
    month: earnings.monthly.reduce((a, b) => a + b, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Loading earnings data...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto transition-colors duration-300">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Today's Earning", value: summary.today },
          { title: "This Week", value: summary.week },
          { title: "This Month", value: summary.month },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center bg-white dark:bg-gray-800 transition-colors duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {item.title}
            </h2>
            <h2 className="text-2xl font-bold text-blue-600">${item.value}</h2>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 bg-background dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Earnings Chart
          </h2>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                className={`px-4 py-1 rounded-lg font-medium transition-colors duration-300 ${
                  period === p
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
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
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="label" stroke="#888" />
            <YAxis stroke="#888" />
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
