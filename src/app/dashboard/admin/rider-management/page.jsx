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
import { TableSkeleton } from "@/components/Shared/Skeleton/TableSkeleton";
import { RefreshCw } from "lucide-react";
import { useFetchData } from "@/app/hooks/useApi";
import { usePagination, PaginationControls } from "@/components/ui/pagination-table";

export default function RiderManagementClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  // Use reusable fetch hook
  const { data, error, isLoading, refetch } = useFetchData("riders", "/riders");

  // Support both array directly or object.riders
  const riders = (data?.riders || data || []).filter((r) => r && typeof r === "object");

  const filteredRiders = riders.filter((rider) => {
    const riderStatus = rider.status?.toLowerCase() || "pending";
    if (statusFilter !== riderStatus) return false;
    
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (rider.fullName || "").toLowerCase().includes(term) ||
      (rider.email || "").toLowerCase().includes(term) ||
      (rider.vehicleType || "").toLowerCase().includes(term) ||
      (rider.vehicleModel || "").toLowerCase().includes(term)
    );
  });

  const pagination = usePagination(filteredRiders, 10);

  const statusCounts = {
    pending: riders.filter((r) => !r.status || r.status?.toLowerCase() === "pending").length,
    approved: riders.filter((r) => r.status?.toLowerCase() === "approved").length,
    rejected: riders.filter((r) => r.status?.toLowerCase() === "rejected").length,
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6 shadow-lg rounded-2xl bg-background border border-border">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Rider Management</h1>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

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
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            {tab.label}
            <Badge
              variant={statusFilter === tab.key ? "secondary" : "outline"}
              className="text-xs"
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
          className="w-full sm:max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {pagination.startIndex}-{pagination.endIndex} of {filteredRiders.length} {statusFilter} riders
        </div>
      </div>

      <div className="rounded-2xl shadow-sm overflow-x-auto bg-background border border-border">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-accent/30">
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Vehicle</TableHead>
              <TableHead className="whitespace-nowrap">Model</TableHead>
              <TableHead className="whitespace-nowrap">Reg. No</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="text-center whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pagination.currentData.length > 0 ? (
              pagination.currentData.map((rider) => (
                  <TableRow
                    key={rider._id}
                    className="hover:bg-accent/20 transition-colors duration-200"
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
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No {statusFilter} riders found
                  {search && ` matching "${search}"`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredRiders.length > 0 && (
        <PaginationControls pagination={pagination} />
      )}
    </div>
  );
}
