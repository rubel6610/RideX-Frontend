"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, CheckCircle, DollarSign } from "lucide-react";

export default function RideHistory() {
  // Dummy ride data
  const [rideHistory, setRideHistory] = useState([
    {
      rideId: "RIDE-001",
      date: "2025-09-20",
      pickup: "Uttara",
      dropoff: "Dhanmondi",
      distance: "12 km",
      fare: 150,
      commission: 15,
      rating: 4.5,
      status: "Completed",
    },
    {
      rideId: "RIDE-002",
      date: "2025-09-21",
      pickup: "Gulshan",
      dropoff: "Banani",
      distance: "8 km",
      fare: 100,
      commission: 10,
      rating: 5,
      status: "Pending",
    },
    {
      rideId: "RIDE-003",
      date: "2025-09-22",
      pickup: "Mirpur",
      dropoff: "Motijheel",
      distance: "15 km",
      fare: 200,
      commission: 20,
      rating: 4.8,
      status: "Completed",
    },
  ]);

  // Calculate summary
  const summary = {
    totalRides: rideHistory.length,
    avgRating:
      rideHistory.reduce((acc, ride) => acc + ride.rating, 0) /
      rideHistory.length || 0,
    totalCommission: rideHistory.reduce(
      (acc, ride) => acc + ride.commission,
      0
    ),
  };

  return (
    <div className="p-4 space-y-6  max-w-5xl mx-auto">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Completed Rides */}
        <Card className="shadow-md rounded-xl p-4 flex flex-col items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <CardTitle className="text-lg font-semibold">Completed Rides</CardTitle>
          <CardContent className="text-2xl font-bold text-primary">
            {summary.totalRides}
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="shadow-md rounded-xl p-4 flex flex-col items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <CardTitle className="text-lg font-semibold">Average Rating</CardTitle>
          <CardContent className="text-2xl font-bold text-primary">
            {summary.avgRating.toFixed(1)}/5
          </CardContent>
        </Card>

        {/* Total Commission */}
        <Card className="shadow-md rounded-xl p-4 flex flex-col items-center gap-2">
          <DollarSign className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-lg font-semibold">Total Commission</CardTitle>
          <CardContent className="text-2xl font-bold text-primary">
            ${summary.totalCommission}
          </CardContent>
        </Card>
      </div>

      {/* Ride Table */}
      <div className="overflow-x-auto">
        <table className="w-full  border border-primary/30 rounded-xl">
          <thead className="bg-primary">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Pickup → Dropoff</th>
              <th className="px-4 py-2 text-left">Distance</th>
              <th className="px-4 py-2 text-left">Fare ($)</th>
              <th className="px-4 py-2 text-left">Commission ($)</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rideHistory.map((ride) => (
              <tr key={ride.rideId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{ride.date}</td>
                <td className="px-4 py-2">{ride.pickup} → {ride.dropoff}</td>
                <td className="px-4 py-2">{ride.distance}</td>
                <td className="px-4 py-2 text-primary font-bold">${ride.fare}</td>
                <td className="px-4 py-2 text-primary font-bold">${ride.commission}</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {ride.rating}
                </td>
                <td className="px-4 py-2">{ride.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
