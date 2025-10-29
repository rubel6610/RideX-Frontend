"use client";

import React, { useMemo, useState } from "react";
// import { TableSkeleton } from "@/app/hooks/Skeleton/TableSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Input
              placeholder="Search by Ride ID, Rider or Passenger..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
              size={16}
            />
          </div>
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Ride ID</TableHead>
                <TableHead>Rider Name</TableHead>
                <TableHead>Passenger Name</TableHead>
                <TableHead>Current Ride / Tip</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ride, idx) => (
                <TableRow
                  key={ride.id}
                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() =>
                    console.log("open details for", ride.id)
                  }
                >
                  <TableCell className="text-sm">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-sm">
                    {ride.id}
                  </TableCell>
                  <TableCell className="text-sm">{ride.riderName}</TableCell>
                  <TableCell className="text-sm">{ride.passengerName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {renderStatusBadge(ride.status)}
                      <span className="text-xs text-muted-foreground">
                        Tip: {ride.tip ? `৳${ride.tip}` : "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-primary/10"
                      onClick={(e) => onMessage(e, ride)}
                    >
                      Message
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-sm text-muted-foreground"
                  >
                    No rides found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </div>
  );
}
