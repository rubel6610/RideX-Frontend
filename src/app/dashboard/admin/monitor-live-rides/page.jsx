"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Sample data (replace with backend fetch)
const SAMPLE_RIDES = [
  {
    id: "RID-1001",
    riderName: "Rashed Khan",
    passengerName: "Anika Sultana",
    status: "On Trip",
    tip: 50,
    updatedAt: "2025-09-28T12:30:00Z",
  },
  {
    id: "RID-1002",
    riderName: "Tuhin Ahmed",
    passengerName: "Rita Roy",
    status: "Completed",
    tip: 0,
    updatedAt: "2025-09-28T11:15:00Z",
  },
  {
    id: "RID-1003",
    riderName: "Sabbir Hossain",
    passengerName: "Mamun Mia",
    status: "Cancelled",
    tip: 0,
    updatedAt: "2025-09-27T18:05:00Z",
  },
  {
    id: "RID-1004",
    riderName: "Nadia Akter",
    passengerName: "Rafiq",
    status: "On Trip",
    tip: 30,
    updatedAt: "2025-09-28T12:45:00Z",
  },
];

export default function MonitorLiveRides() {
  const [query, setQuery] = useState("");
  const [rides] = useState(SAMPLE_RIDES);
  // const [isLoading, setIsLoading] = useState(true);

  const filtered = useMemo(() => {
    if (!query) return rides;
    const q = query.toLowerCase();
    return rides.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.riderName.toLowerCase().includes(q) ||
        r.passengerName.toLowerCase().includes(q)
    );
  }, [rides, query]);

  const onMessage = (e, ride) => {
    e.stopPropagation();
    console.log("Message action for:", ride.id);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "On Trip":
        return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-400/30">On Trip</Badge>;
      case "Completed":
        return <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border border-green-400/30">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border border-red-400/30">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

    // if (isLoading) return <TableSkeleton />;

  return (
    <div className="p-4 space-y-6 mt-6 max-w-screen mx-auto lg:w-full md:w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Monitor Live Rides</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track all ongoing rides in real-time</p>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Input
              placeholder="Search by Ride ID, Rider or Passenger..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-80 pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
              size={16}
            />
          </div>
        </div>
      </div>

      {query && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setQuery("")}
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border border-accent mt-10 rounded-xl">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full text-xs sm:text-sm min-w-[300px]">
            <thead className="bg-accent text-left sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 py-2">#</th>
                <th className="px-2 sm:px-4 py-2">Ride ID</th>
                <th className="px-2 sm:px-4 py-2">Rider Name</th>
                <th className="px-2 sm:px-4 py-2">Passenger Name</th>
                <th className="px-2 sm:px-4 py-2">Current Ride / Tip</th>
                <th className="px-2 sm:px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ride, idx) => (
                <tr
                  key={ride.id}
                  className="border-t border-border"
                  onClick={() =>
                    console.log("open details for", ride.id)
                  }
                >
                  <td className="px-2 sm:px-4 py-2">{idx + 1}</td>
                  <td className="px-2 sm:px-4 py-2 font-medium">
                    {ride.id}
                  </td>
                  <td className="px-2 sm:px-4 py-2">{ride.riderName}</td>
                  <td className="px-2 sm:px-4 py-2">{ride.passengerName}</td>
                  <td className="px-2 sm:px-4 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {renderStatusBadge(ride.status)}
                      <span className="text-xs text-muted-foreground">
                        Tip: {ride.tip ? `৳${ride.tip}` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-primary/10"
                      onClick={(e) => onMessage(e, ride)}
                    >
                      Message
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-muted-foreground"
                  >
                    No rides found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}