"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Settings, Star, MapPin, Clock, DollarSign } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import CountUp from "react-countup";
import { useAuth } from "@/app/hooks/AuthProvider";

/* ---------- utils ---------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------- Card Components ---------- */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-500",
      "dark:border-neutral-800 dark:hover:border-sidebar-primary-foreground hover:border-card dark:bg-neutral-900 hover:dark:bg-neutral-800 dark:text-neutral-100",
      "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 hover:text-destructive dark:hover:text-[#ef4444]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 p-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "font-bold leading-none tracking-tight text-lg",
      "dark:text-neutral-100 text-neutral-800 group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-all duration-500"
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("pr-4 pt-0 -ml-4", className)} {...props} />
);

/* ---------- PassengerDash ---------- */
export default function PassengerDash() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [ridesRes, paymentsRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/rides`),
          fetch(`http://localhost:5000/api/payment/all`),
          fetch(`http://localhost:5000/api/ride-reviews`),
        ]);

        const ridesData = await ridesRes.json();
        const paymentsData = await paymentsRes.json();
        const reviewsData = await reviewsRes.json();

        const userRides = ridesData.filter((r) => r.userId === user.id);
        const userPayments = paymentsData.filter((p) => p.userId === user.id);
        const userReviews = reviewsData.filter((r) => r.userId === user.id);

        setRides(userRides);
        setPayments(userPayments);
        setReviews(userReviews);

        const avgRating =
          userReviews.length > 0
            ? userReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              userReviews.length
            : 0;

        setUserRating(avgRating.toFixed(1));
      } catch (err) {
        console.error("API থেকে ডেটা আনতে সমস্যা:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading)
    return <p className="text-center text-lg">⏳ ডাটা লোড হচ্ছে...</p>;

  // ---------- Stats ----------
  const totalRides = rides.length;
  const activeBookings = rides.filter((r) => r.status === "accepted").length;
  const totalSpent = payments.reduce(
    (sum, p) =>
      sum +
      (p.amount ??
        p.totalAmount ??
        p.subtotal ??
        p.rideDetails?.fareBreakdown?.totalAmount ??
        0),
    0
  );

  // ---------- Weekly Rides ----------
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyRidesCount = rides.reduce((acc, ride) => {
    const date = new Date(
      ride.createdAt || ride.date || ride.timestamps?.createdAt
    );
    const day = weekDays[date.getDay()];
    if (day) acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const weeklyRidesData = weekDays.map((day) => ({
    day,
    rides: weeklyRidesCount[day] || 0,
  }));

  // ---------- Monthly Spending (dropdown controlled) ----------
  const currentYear = new Date().getFullYear();
  const monthlySpending = payments
    .filter((p) => {
      const date = new Date(p.paymentCompletedAt || p.createdAt);
      return (
        (p.status === "Completed" || p.rideDetails?.fareBreakdown?.totalAmount > 0) &&
        date.getMonth() === selectedMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, p) => {
      const amount =
        p.amount ??
        p.totalAmount ??
        p.subtotal ??
        p.rideDetails?.fareBreakdown?.totalAmount ??
        0;
      return sum + amount;
    }, 0);

  const monthlySpendingData = [
    {
      month: monthNames[selectedMonth] + " " + currentYear,
      amount: monthlySpending,
    },
  ];

  // ---------- Ratings Over Time ----------
  const ratingsOverTime = reviews.map((r) => ({
    week: new Date(r.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    rating: r.rating ?? 0,
  }));

  const stats = [
    { title: "Total Rides", icon: MapPin, value: totalRides },
    { title: "Active Bookings", icon: Clock, value: activeBookings },
    { title: "Total Spent", icon: DollarSign, value: totalSpent },
    { title: "Avg. Rating", icon: Star, value: userRating },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <h1 className="flex gap-2 text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100">
          <Settings className="h-10 w-10 text-destructive dark:text-primary animate-spin-slow" />
          PASSENGER ANALYSIS
        </h1>
        {user.photoUrl && (
          <img
            src={user.photoUrl}
            alt="User"
            className="w-12 h-12 rounded-full border-2 border-blue-400"
          />
        )}
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <Card key={idx} className="flex flex-col justify-center p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{item.title}</CardTitle>
              <item.icon className="h-7 w-7 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold ml-8 pb-2">
                {item.title === "Total Spent" ? (
                  <CountUp
                    end={Number(item.value)}
                    duration={2.2}
                    delay={0.4}
                    separator=","
                    prefix="৳ "
                  />
                ) : (
                  <CountUp
                    end={Number(item.value)}
                    duration={2.2}
                    delay={0.4}
                    separator=","
                    decimals={item.title === "Avg. Rating" ? 1 : 0}
                  />
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Monthly Spending */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5 flex justify-between items-center">
            <CardTitle>Monthly Spending</CardTitle>
            <select
              className="border rounded p-1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx}>
                  {name}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpendingData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#87e64b" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#87e64b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `৳ ${value}`} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6bcf32"
                  fill="url(#colorSpend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Rides */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Weekly Rides</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRidesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rides" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ratings Over Time */}
        <Card className="h-[280px] md:h-[300px]">
          <CardHeader className="mt-5">
            <CardTitle>Ratings Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingsOverTime}>
                <XAxis dataKey="week" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#87e64b"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
