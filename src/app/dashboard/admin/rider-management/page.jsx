"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const riderStaticData = [
          { key: "pending", label: "Pending Riders", count: statusCounts.pending },
          { key: "approved", label: "Approved Riders", count: statusCounts.approved },
          { key: "rejected", label: "Rejected Riders", count: statusCounts.rejected },
        ];

  if (isLoading) return <TableSkeleton />;
  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-4 space-y-6 mt-6 max-w-screen mx-auto lg:w-full md:w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Rider Management</h1>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="overflow-x-auto flex flex-wrap gap-2 sm:gap-4">
        {riderStaticData?.map((tab) => (
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
      <div className="overflow-x-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Input
          placeholder="Search by name, email, or vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {pagination.startIndex}-{pagination.endIndex} of {filteredRiders.length} {statusFilter} riders
        </div>
      </div>

      {/* Table */}
      <div className="border border-accent mt-10 rounded-xl">
        {/* Scroll indicator for mobile */}
        <div className="text-center py-1.5 bg-accent/20 lg:hidden">
          <p className="text-[10px] sm:text-xs text-muted-foreground">← Swipe to scroll →</p>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full text-xs sm:text-sm min-w-[800px]">
            <thead className="bg-accent text-left sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 py-2">Name</th>
                <th className="px-2 sm:px-4 py-2">Email</th>
                <th className="px-2 sm:px-4 py-2">Vehicle</th>
                <th className="px-2 sm:px-4 py-2">Model</th>
                <th className="px-2 sm:px-4 py-2">Reg. No</th>
                <th className="px-2 sm:px-4 py-2">Status</th>
                <th className="px-2 sm:px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pagination.currentData.length > 0 ? (
                pagination.currentData.map((rider) => (
                    <tr
                      key={rider._id}
                      className="border-t"
                    >
                      <td className="px-2 sm:px-4 py-2 font-medium">{rider.fullName || "N/A"}</td>
                      <td className="px-2 sm:px-4 py-2">{rider.email || "N/A"}</td>
                      <td className="px-2 sm:px-4 py-2">{rider.vehicleType || "N/A"}</td>
                      <td className="px-2 sm:px-4 py-2">{rider.vehicleModel || "N/A"}</td>
                      <td className="px-2 sm:px-4 py-2">{rider.vehicleRegisterNumber || "N/A"}</td>
                      <td className="px-2 sm:px-4 py-2">
                        <Badge
                          variant={
                            rider.status?.toLowerCase() === "approved"
                              ? "default"
                              : rider.status?.toLowerCase() === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {rider.status ? rider.status : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <RiderActions
                            user={rider}
                            onAction={() => refetch()}
                            currentStatus={rider.status?.toLowerCase() || "pending"}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-muted-foreground">
                    No {statusFilter} riders found
                    {search && ` matching "${search}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {filteredRiders.length > 0 && (
        <PaginationControls pagination={pagination} />
      )}
    </div>
  );
}
