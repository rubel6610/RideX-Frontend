// app/components/RiderManagementClient.jsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RiderActions from "./RiderActions";

async function fetchRiders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/riders`);
  if (!res.ok) throw new Error("Failed to fetch riders");
  const data = await res.json();

  // Ensure array and valid riders
  return Array.isArray(data.riders)
    ? data.riders.filter((rider) => rider && typeof rider === "object" && rider._id)
    : [];
}

export default function RiderManagementClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to pending

  const { data: riders = [], error, isLoading, refetch } = useQuery({
    queryKey: ["riders"],
    queryFn: fetchRiders,
  });

  // Filter riders by status
  const filteredRiders = riders.filter((rider) => {
    if (!rider || typeof rider !== "object") return false;
    const riderStatus = rider.status?.toLowerCase() || "pending";
    return statusFilter === riderStatus;
  });

  // Count by status
  const statusCounts = {
    pending: riders.filter((r) => !r.status || r.status?.toLowerCase() === "pending").length,
    approved: riders.filter((r) => r.status?.toLowerCase() === "approved").length,
    rejected: riders.filter((r) => r.status?.toLowerCase() === "rejected").length,
  };

  if (isLoading) {
    return <div className="p-6">Loading riders...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Rider Management</h1>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-4">
        {[
          { key: "pending", label: "Pending Riders", count: statusCounts.pending },
          { key: "approved", label: "Approved Riders", count: statusCounts.approved },
          { key: "rejected", label: "Rejected Riders", count: statusCounts.rejected },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={statusFilter === tab.key ? "default" : "outline"}
            onClick={() => setStatusFilter(tab.key)}
            className="flex items-center gap-2"
          >
            {tab.label}
            <Badge variant={statusFilter === tab.key ? "secondary" : "outline"}>
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name, email, or vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {filteredRiders.length} {statusFilter} riders
        </div>
      </div>

      {/* Rider Table */}
      <div className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Reg. No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRiders.length > 0 ? (
              filteredRiders
                .filter((rider) => {
                  if (!search) return true;
                  const term = search.toLowerCase();
                  return (
                    (rider.fullName || "").toLowerCase().includes(term) ||
                    (rider.email || "").toLowerCase().includes(term) ||
                    (rider.vehicleType || "").toLowerCase().includes(term) ||
                    (rider.vehicleModel || "").toLowerCase().includes(term)
                  );
                })
                .map((rider) => (
                  <TableRow key={rider._id}>
                    <TableCell className="font-medium">{rider.fullName || "N/A"}</TableCell>
                    <TableCell>{rider.email || "N/A"}</TableCell>
                    <TableCell>{rider.vehicleType || "N/A"}</TableCell>
                    <TableCell>{rider.vehicleModel || "N/A"}</TableCell>
                    <TableCell>{rider.vehicleRegisterNumber || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rider.status?.toLowerCase() === "approved"
                            ? "default"
                            : rider.status?.toLowerCase() === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {rider.status ? rider.status : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <RiderActions
                        user={rider}
                        onAction={() => refetch()}
                        currentStatus={rider.status?.toLowerCase() || "pending"}
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No {statusFilter} riders found
                  {search && ` matching "${search}"`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
