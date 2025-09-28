"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bike, Car, BusFront, Star, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Static ride data
const rideHistory = [
  { id: "RDX-001", date: "2025-09-25", from: "Banani, Dhaka", to: "Dhanmondi, Dhaka", type: "Bike", fare: 120, driver: "John D.", rating: 4.9, status: "Completed" },
  { id: "RDX-002", date: "2025-09-20", from: "Uttara, Dhaka", to: "Gulshan, Dhaka", type: "Car", fare: 350, driver: "Amit H.", rating: 4.7, status: "Completed" },
  { id: "RDX-003", date: "2025-09-15", from: "Mirpur, Dhaka", to: "Motijheel, Dhaka", type: "CNG", fare: 200, driver: "Rahim U.", rating: 4.8, status: "Cancelled" },
];

// Icons mapping
const typeIcon = {
  Bike: <Bike className="w-5 h-5 text-primary" />,
  Car: <Car className="w-5 h-5 text-primary" />,
  CNG: <BusFront className="w-5 h-5 text-primary" />,
};

// Status badge helper (JS version)
const statusBadge = (status) => {
  if (status === "Completed")
    return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Completed</Badge>;
  if (status === "Cancelled")
    return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Cancelled</Badge>;
  return <Badge className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
};

// Skeleton loader
function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <Skeleton className="h-8 w-48 rounded" />
      <Skeleton className="h-10 w-full rounded" />
      <Skeleton className="h-10 w-full rounded" />
      <Skeleton className="h-10 w-full rounded" />
      <Skeleton className="h-64 w-full rounded" />
    </div>
  );
}

export default function RideHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);//skelet

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  const filtered = rideHistory.filter((ride) => {
    const matchesSearch =
      ride.id.toLowerCase().includes(search.toLowerCase()) ||
      ride.from.toLowerCase().includes(search.toLowerCase()) ||
      ride.to.toLowerCase().includes(search.toLowerCase()) ||
      ride.driver.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ride.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Show Skeleton while loading
  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6 min-h-screen bg-accent/10 flex flex-col items-center py-10 px-2">
      {/* Header Section */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Ride History</h1>
          <p className="text-foreground/50 mt-1">All your completed and cancelled rides</p>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full max-w-6xl space-y-4">
        <div className="bg-background rounded-lg border border-accent p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search rides..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
            <div className="text-2xl font-bold text-foreground">{rideHistory.length}</div>
            <div className="text-sm text-foreground/50">Total Rides</div>
          </div>
          <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
            <div className="text-2xl font-bold text-primary">{rideHistory.filter(r => r.status === "Completed").length}</div>
            <div className="text-sm text-foreground/50">Completed</div>
          </div>
          <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
            <div className="text-2xl font-bold text-destructive">{rideHistory.filter(r => r.status === "Cancelled").length}</div>
            <div className="text-sm text-foreground/50">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Ride Table */}
      <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4">
        <div className="p-4 border-b border-accent flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Rides</h2>
          <div className="text-sm text-foreground/50">Showing {filtered.length} of {rideHistory.length} rides</div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/30">
              <TableRow>
                <TableHead className="text-left text-muted-foreground">#</TableHead>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">From</TableHead>
                <TableHead className="text-left">To</TableHead>
                <TableHead className="text-left">Type</TableHead>
                <TableHead className="text-left">Fare</TableHead>
                <TableHead className="text-left">Driver</TableHead>
                <TableHead className="text-left">Rating</TableHead>
                <TableHead className="text-left">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? (
                filtered.map((ride, idx) => (
                  <TableRow key={ride.id} className="hover:bg-accent/20 transition-colors">
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>{ride.date}</TableCell>
                    <TableCell>{ride.from}</TableCell>
                    <TableCell>{ride.to}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {typeIcon[ride.type]} <span className="font-medium text-foreground">{ride.type}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="font-semibold text-primary">৳{ride.fare}</span></TableCell>
                    <TableCell>{ride.driver}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        {ride.rating} <Star className="w-4 h-4 text-yellow-400" />
                      </span>
                    </TableCell>
                    <TableCell>{statusBadge(ride.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No rides found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
