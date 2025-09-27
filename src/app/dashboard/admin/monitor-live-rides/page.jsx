"use client"

import React, {useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Sample data (replace with backend fetch)
const SAMPLE_RIDES = [
  { id: "RID-1001", riderName: "Rashed Khan", passengerName: "Anika Sultana", status: "On Trip", tip: 50, updatedAt: "2025-09-28T12:30:00Z" },
  { id: "RID-1002", riderName: "Tuhin Ahmed", passengerName: "Rita Roy", status: "Completed", tip: 0, updatedAt: "2025-09-28T11:15:00Z" },
  { id: "RID-1003", riderName: "Sabbir Hossain", passengerName: "Mamun Mia", status: "Cancelled", tip: 0, updatedAt: "2025-09-27T18:05:00Z" },
  { id: "RID-1004", riderName: "Nadia Akter", passengerName: "Rafiq", status: "On Trip", tip: 30, updatedAt: "2025-09-28T12:45:00Z" }
];

export default function MonitorLiveRides() {
  const [query, setQuery] = useState("");
  const [rides, setRides] = useState(SAMPLE_RIDES);
  // const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return rides;
    const q = query.toLowerCase();
    return rides.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.riderName.toLowerCase().includes(q) ||
      r.passengerName.toLowerCase().includes(q)
    );
  }, [rides, query]);

  function onMessage(e, ride) {
    e.stopPropagation();
    // Implement message action: open modal or call API to message rider/passenger
    console.log("Message action for:", ride.id);
  }

  function renderStatusBadge(status) {
    if (status === "On Trip") return <Badge className="uppercase">On Trip</Badge>;
    if (status === "Completed") return <Badge className="bg-primary dark:text-foreground">Completed</Badge>;
    if (status === "Cancelled") return <Badge className="bg-destructive text-background">Cancelled</Badge>;
    return <Badge>{status}</Badge>;
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4">
        {/* <div>
          <CardTitle className="text-lg">Live Rides / Rides Table</CardTitle>
          <p className="text-sm text-muted-foreground">Index · Ride ID · Rider · Passenger · Current ride / Current tip</p>
        </div> */}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <Input
              placeholder="Search by Ride ID, Rider or Passenger..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60" size={16} />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setQuery("")}>Clear</Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Ride ID</TableHead>
                <TableHead>Rider Name</TableHead>
                <TableHead>Passenger Name</TableHead>
                <TableHead>Current Ride / Current Tip</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ride, idx) => (
                <TableRow key={ride.id} className="hover:bg-muted cursor-pointer" onClick={() => console.log('open details for', ride.id)}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{ride.id}</TableCell>
                  <TableCell>{ride.riderName}</TableCell>
                  <TableCell>{ride.passengerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {renderStatusBadge(ride.status)}
                      <div className="text-sm">Tip: {ride.tip ? `৳${ride.tip}` : '—'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={(e) => onMessage(e, ride)}>Message</Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">No rides found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
