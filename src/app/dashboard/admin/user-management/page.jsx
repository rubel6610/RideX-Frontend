"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TableSkeleton } from "@/app/hooks/Skeleton/TableSkeleton";


const BACKEND = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // fetch users
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND}/api/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  // mutation for role update
  const mutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const res = await fetch(`${BACKEND}/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      toast.success("User role updated successfully ✅");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Failed to update role ❌");
    },
  });

  // counts by role
  const roleCounts = useMemo(() => {
    const counts = { all: users.length, admin: 0, user: 0, rider: 0 };
    users.forEach((u) => {
      if (u.role === "admin") counts.admin++;
      else if (u.role === "user") counts.user++;
      else if (u.role === "rider") counts.rider++;
    });
    return counts;
  }, [users]);

  // filter users
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

  if (isLoading) return <TableSkeleton/>

  return (
    <Card className="w-full max-w-6xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">User Management</h1>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Role Tabs */}
        <div className="flex space-x-4">
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
              className="flex items-center gap-2"
            >
              {tab.label}
              <Badge variant={roleFilter === tab.key ? "secondary" : "outline"}>
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} {roleFilter} users
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.fullName || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "default"
                            : user.role === "rider"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) =>
                          mutation.mutate({ userId: user._id, role: value })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="rider">Rider</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No {roleFilter} users found
                    {search && ` matching "${search}"`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
