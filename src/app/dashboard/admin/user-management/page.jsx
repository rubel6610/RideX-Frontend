// app/components/UserManagementClient.jsx
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
import UserActions from "./UserActions";

async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return Array.isArray(data) 
    ? data.filter((user) => user && typeof user === "object" && user._id)
    : [];
}

export default function UserManagementClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to pending
  
  const { data: users = [], error, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Filter users based on status and search
  const filteredUsers = users.filter((user) => {
    if (!user || typeof user !== "object") return false;

    const userStatus = user.isVerified?.toLowerCase() || "pending";
    return statusFilter === userStatus;
  });

  // Count users by status for badges
  const statusCounts = {
    pending: users.filter(user => !user.isVerified || user.isVerified?.toLowerCase() === "pending").length,
    approved: users.filter(user => user.isVerified?.toLowerCase() === "approved").length,
    rejected: users.filter(user => user.isVerified?.toLowerCase() === "rejected").length,
  };

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">User Management</h1>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Status Filter Tabs - Only 3 categories */}
      <div className="flex space-x-4">
        {[
          { key: "pending", label: "Pending Requests", count: statusCounts.pending },
          { key: "approved", label: "Approved Users", count: statusCounts.approved },
          { key: "rejected", label: "Rejected Users", count: statusCounts.rejected },
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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} {statusFilter} users
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers
                .filter((user) => {
                  // Additional search filtering
                  if (!search) return true;
                  const name = user.fullName || "";
                  const email = user.email || "";
                  const term = search.toLowerCase();
                  return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
                })
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.fullName || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          user.isVerified?.toLowerCase() === "approved" ? "default" :
                          user.isVerified?.toLowerCase() === "rejected" ? "destructive" :
                          "secondary"
                        }
                      >
                        {user.isVerified ? user.isVerified : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role || "User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <UserActions 
                        user={user} 
                        onAction={() => refetch()} 
                        currentStatus={user.isVerified?.toLowerCase() || "pending"}
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No {statusFilter} users found
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