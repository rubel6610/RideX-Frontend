"use client";

import React, { useState, useEffect } from "react";
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
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setloading] = useState(true);
  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setloading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/users`
        );
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();

        const validUsers = Array.isArray(data)
          ? data.filter((user) => user && typeof user === "object" && user._id)
          : [];
        setUsers(validUsers);
        setloading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Approve request
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/users/approve/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to approve");
      toast.success("User approved successfully");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve user");
    }
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/users/reject/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to reject");
      toast.error("User rejected");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject user");
    }
  };

  // Safe filter function with null checks
  const filteredUsers = users.filter((user) => {
    if (!user || typeof user !== "object") return false;

    const name = user.name || "";
    const email = user.email || "";
    const searchTerm = search.toLowerCase();

    return (
      name.toLowerCase().includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">User Requests</h1>

      {/* Search Input */}
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm"
      />

      {/* User Table */}
      <div className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.fullName || "N/A"}
                  </TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.isVerified || "Unknown"}</Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleApprove(user._id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(user._id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
