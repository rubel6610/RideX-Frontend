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

  //  Fetch payments from backend
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/all`);
        const payments = await res.json();

        const now = new Date();

        // Daily: payments of today
        const daily = payments.filter((p) => {
          const date = new Date(
            p.timestamps.paymentCompletedAt || p.timestamps.paymentInitiatedAt
          );
          return date.toDateString() === now.toDateString();
        });

        // Weekly: Sunday to Saturday
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekly = payments.filter((p) => {
          const date = new Date(
            p.timestamps.paymentCompletedAt || p.timestamps.paymentInitiatedAt
          );
          return date >= weekStart && date <= weekEnd;
        });

        // Monthly: current month
        const monthly = payments.filter((p) => {
          const date = new Date(
            p.timestamps.paymentCompletedAt || p.timestamps.paymentInitiatedAt
          );
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        });

        // Map only totalAmount for chart
        setEarnings({
          daily: daily.map((d) => d.rideDetails.fareBreakdown.totalAmount),
          weekly: weekly.map((d) => d.rideDetails.fareBreakdown.totalAmount),
          monthly: monthly.map((d) => d.rideDetails.fareBreakdown.totalAmount),
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

  //  summary with 2 decimal places
  const summary = {
    today: earnings.daily.reduce((a, b) => a + b, 0).toFixed(2),
    week: earnings.weekly.reduce((a, b) => a + b, 0).toFixed(2),
    month: earnings.monthly.reduce((a, b) => a + b, 0).toFixed(2),
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
            className="p-6 rounded-2xl border border-accent text-center bg-background hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {item.title}
            </h2>
            <h2 className="text-2xl font-bold text-primary">
              ৳{item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 bg-background rounded-2xl border border-accent transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Earnings Chart
          </h2>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                className={`px-4 py-1 rounded-lg font-medium transition-all duration-300 ${
                  period === p
                    ? "bg-primary text-white"
                    : "bg-accent text-foreground"
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
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="label" tick={{ fill: "#ccc", fontSize: 12 }} stroke="#ccc" />
            <YAxis tick={{ fill: "#ccc", fontSize: 12 }} stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #444",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "#ccc" }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningPage;
