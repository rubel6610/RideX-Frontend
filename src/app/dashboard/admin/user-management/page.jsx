"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/Shared/Skeleton/TableSkeleton";
import { useFetchData, useUpdateData } from "@/app/hooks/useApi";
import { Alert } from "@/components/ui/alert";
import { usePagination, PaginationControls } from "@/components/ui/pagination-table";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // QueryClient for refetching
  const queryClient = useQueryClient();

  //  Fetch all users
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useFetchData("users", "/users");

  //  Role update mutation (using reusable hook)
  const mutation = useUpdateData("/user", {
    onSuccess: () => {
      toast.success("User role updated successfully ");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Failed to update role ❌");
    },
  });

  //  Count roles safely
  const roleCounts = useMemo(() => {
    const counts = { all: users.length, admin: 0, user: 0, rider: 0 };
    users.forEach((u) => {
      if (u.role === "admin") counts.admin++;
      else if (u.role === "user") counts.user++;
      else if (u.role === "rider") counts.rider++;
    });
    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          (u.fullName || "").toLowerCase().includes(term) ||
          (u.email || "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [users, roleFilter, search]);

  const pagination = usePagination(filteredUsers, 10);

  //  Handle loading / error
  if (isLoading) return <TableSkeleton />;

  if (error)
    return (
      <Alert variant="destructive" className="text-center mt-8">
        <Alert.Title className="text-lg">Failed to load users 😢</Alert.Title>
        <Alert.Description>Please try again later.</Alert.Description>
      </Alert>
    );

  return (
    <Card className="p-4 sm:p-6 space-y-6 shadow-lg rounded-2xl bg-background border border-border">
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-primary text-center sm:text-left">
            User Management
          </h1>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Refresh
          </Button>
        </div>

        {/* Role Tabs */}
        <div className="overflow-x-auto flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
          {[
            { key: "all", label: "All Users", count: roleCounts.all },
            { key: "admin", label: "Admins", count: roleCounts.admin },
            { key: "user", label: "Users", count: roleCounts.user },
            { key: "rider", label: "Riders", count: roleCounts.rider },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={roleFilter === tab.key ? "default" : "outline"}
              onClick={() => setRoleFilter(tab.key)}
              className="flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              {tab.label}
              <Badge
                variant={roleFilter === tab.key ? "secondary" : "outline"}
                className="text-xs"
              >
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Search Section */}
        <div className="overflow-x-auto flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Showing {pagination.startIndex}-{pagination.endIndex} of {filteredUsers.length} {roleFilter} users
          </div>
        </div>

        {/* Table */}
        <div className="border border-accent mt-10 rounded-xl">
          {/* Scroll indicator for mobile */}
          <div className="text-center py-1.5 bg-accent/20 lg:hidden">
            <p className="text-[10px] sm:text-xs text-muted-foreground">← Swipe to scroll →</p>
          </div>
          <div className="overflow-x-auto overflow-y-auto ">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-accent text-left sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 py-2">Name</th>
                  <th className="px-2 sm:px-4 py-2">Email</th>
                  <th className="px-2 sm:px-4 py-2 text-center">Role</th>
                  <th className="px-2 sm:px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {pagination.currentData.length > 0 ? (
                  pagination.currentData.map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="px-2 sm:px-4 py-2 font-medium">
                        {user.fullName || "N/A"}
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-center">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "rider"
                              ? "secondary"
                              : "outline"
                          }
                          className="capitalize text-xs"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        <div className="flex justify-center">
                          <Select
                            defaultValue={user.role}
                            disabled={mutation.isPending}
                            onValueChange={(value) =>
                              mutation.mutate({ id: user._id, role: value })
                            }
                          >
                            <SelectTrigger className="w-[90px] sm:w-[120px] text-xs">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="rider">Rider</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-muted-foreground"
                    >
                      No {roleFilter} users found
                      {search && ` matching "${search}"`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredUsers.length > 0 && (
          <PaginationControls pagination={pagination} />
        )}
      </CardContent>
    </Card>
  );
}
