"use client";

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
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/app/hooks/Skeleton/TableSkeleton";
import { RefreshCw } from "lucide-react";

async function fetchRiders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/riders`);
  if (!res.ok) throw new Error("Failed to fetch riders");
  const data = await res.json();

  return Array.isArray(data.riders)
    ? data.riders.filter((rider) => rider && typeof rider === "object" && rider._id)
    : [];
}

export default function RiderManagementClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: riders = [], error, isLoading, refetch } = useQuery({
    queryKey: ["riders"],
    queryFn: fetchRiders,
  });

  const filteredRiders = riders.filter((rider) => {
    if (!rider || typeof rider !== "object") return false;
    const riderStatus = rider.status?.toLowerCase() || "pending";
    return statusFilter === riderStatus;
  });

  const statusCounts = {
    pending: riders.filter((r) => !r.status || r.status?.toLowerCase() === "pending").length,
    approved: riders.filter((r) => r.status?.toLowerCase() === "approved").length,
    rejected: riders.filter((r) => r.status?.toLowerCase() === "rejected").length,
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6 shadow-lg rounded-2xl bg-background border border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Rider Management</h1>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-blue-400 text-blue-600 hover:bg-blue-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {[
          { key: "pending", label: "Pending Riders", count: statusCounts.pending },
          { key: "approved", label: "Approved Riders", count: statusCounts.approved },
          { key: "rejected", label: "Rejected Riders", count: statusCounts.rejected },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={statusFilter === tab.key ? "default" : "outline"}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 text-sm sm:text-base ${
              statusFilter === tab.key
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border-blue-300 text-blue-600"
            }`}
          >
            {tab.label}
            <Badge
              variant={statusFilter === tab.key ? "secondary" : "outline"}
              className={`text-xs ${
                statusFilter === tab.key
                  ? "bg-blue-50 text-blue-600"
                  : "border-blue-300 text-blue-500"
              }`}
            >
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Input
          placeholder="Search by name, email, or vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm border-blue-300 focus-visible:ring-blue-400"
        />
        <div className="text-sm text-blue-700">
          Showing {filteredRiders.length} {statusFilter} riders
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl  border-blue-300 shadow-sm overflow-x-auto bg-background border">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="whitespace-nowrap text-blue-700">Name</TableHead>
              <TableHead className="whitespace-nowrap text-blue-700">Email</TableHead>
              <TableHead className="whitespace-nowrap text-blue-700">Vehicle</TableHead>
              <TableHead className="whitespace-nowrap text-blue-700">Model</TableHead>
              <TableHead className="whitespace-nowrap text-blue-700">Reg. No</TableHead>
              <TableHead className="whitespace-nowrap text-blue-700">Status</TableHead>
              <TableHead className="text-center whitespace-nowrap text-blue-700">Actions</TableHead>
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
                  <TableRow
                    key={rider._id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
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
                        className={
                          rider.status?.toLowerCase() === "approved"
                            ? "bg-blue-600 text-white"
                            : rider.status?.toLowerCase() === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-blue-100 text-blue-700"
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
                <TableCell colSpan={7} className="text-center py-6 text-blue-500">
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
