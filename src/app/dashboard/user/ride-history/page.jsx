"use client";

import { useState, useEffect, useRef } from "react";
import { useFetchData } from "@/app/hooks/useApi";
import { apiRequest } from "@/utils/apiRequest";
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
import { Bike, Car, BusFront, Star, Search, CalendarIcon, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TableSkeleton } from "@/components/Shared/Skeleton/CardSkeleton";
import { Button } from "@/components/ui/button";
import { usePagination, PaginationControls } from "@/components/ui/pagination-table";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// --- Helper Icons ---
const typeIcon = {
  Bike: <Bike className="w-5 h-5 text-primary" />,
  Car: <Car className="w-5 h-5 text-primary" />,
  CNG: <BusFront className="w-5 h-5 text-primary" />,
};

// --- Helper Badge ---
const statusBadge = (status) => {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-500/20 text-green-600 border border-green-500 rounded-full px-3 py-1 text-xs md:text-sm">
        {status}
      </Badge>
    );
  }
  if (status === "Cancelled") {
    return (
      <Badge className="bg-red-500/20 text-red-600 border border-red-500 rounded-full px-3 py-1 text-xs md:text-sm">
        {status}
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full px-3 py-1 text-xs md:text-sm">
      {status}
    </Badge>
  );
};

// --- Helper Location ---
const locationCache = new Map();

const fetchLocationName = async (coordinates) => {
  if (!coordinates) return "Unknown location";
  const [lon, lat] = coordinates;
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

  if (locationCache.has(cacheKey)) return locationCache.get(cacheKey);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: { "User-Agent": "RideX-App/1.0" },
      }
    );
    const data = await response.json();
    const name = data.display_name || "Unknown location";
    locationCache.set(cacheKey, name);
    return name;
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Unknown location";
  }
};

const shortLocation = (loc, length = 15) =>
  loc && loc.length > length ? loc.slice(0, length) + "..." : loc || "Unknown";

export default function RideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [processing, setProcessing] = useState(true);
  const [complaintModal, setComplaintModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const { data: ridesData = [], isLoading } = useFetchData("rides", "/rides", null);

  useEffect(() => {
    const lastSig = (useRef.__ridesSig ||= { ref: { current: "" } }).ref;
    const ids = Array.isArray(ridesData)
      ? ridesData.map((r) => r?._id).filter(Boolean)
      : [];
    const signature = ids.join(",");

    if (!ids.length) {
      if (lastSig.current !== "__empty__") {
        lastSig.current = "__empty__";
        setRides([]);
        setProcessing(false);
      }
      return;
    }

    if (lastSig.current === signature) return;
    lastSig.current = signature;

    const enrich = async () => {
      try {
        setProcessing(true);
        const BATCH_SIZE = 5;
        const ridesWithLocations = [];

        for (let i = 0; i < ridesData.length; i += BATCH_SIZE) {
          const batch = ridesData.slice(i, i + BATCH_SIZE);
          const enrichedBatch = await Promise.all(
            batch.map(async (ride) => {
              const pickupName = await fetchLocationName(ride.pickup?.coordinates);
              const dropName = await fetchLocationName(ride.drop?.coordinates);
              return { ...ride, pickupName, dropName };
            })
          );
          ridesWithLocations.push(...enrichedBatch);
          setRides([...ridesWithLocations]);
        }
      } catch (e) {
        console.error("Enrich error:", e);
        setRides(ridesData);
      } finally {
        setProcessing(false);
      }
    };
    enrich();
  }, [ridesData]);

  const filtered = rides.filter((ride) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      ride.riderInfo?.fullName?.toLowerCase().includes(searchText) ||
      ride.vehicleType?.toLowerCase().includes(searchText) ||
      ride.fare?.toString().includes(searchText) ||
      ride.pickupName?.toLowerCase().includes(searchText) ||
      ride.dropName?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || ride.status === statusFilter;

    const matchesDate =
      !selectedDate ||
      new Date(ride.createdAt).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const isDataReady = !isLoading && !processing;
  const pagination = usePagination(filtered, 10);

  // Complaint Form Handler
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: "User", // In a real app, this would be the actual user's name
        email: "user@example.com", // In a real app, this would be the actual user's email
        subject: formData.subject,
        message: formData.message,
        rideId: selectedRide?._id,
        status: "Pending",
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/complaints`, payload);
      if (res.status === 201) {
        alert("Complaint submitted successfully!");
        setComplaintModal(false);
        setFormData({ subject: "", message: "" });
      }
    } catch (error) {
      console.error("Complaint error:", error);
      alert("Failed to submit complaint. Try again.");
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-screen mx-auto lg:w-full -ml-5 px-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              My Ride History
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              All your completed and cancelled rides
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background rounded-lg border border-accent p-4 flex flex-col lg:flex-row gap-6 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rides"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedDate ? selectedDate.toDateString() : "Select Date"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 border border-primary rounded-lg">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="w-full text-red-500 mt-2"
                  >
                    Clear Date
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ride Table */}
        <div className="w-full mt-4 bg-background rounded-lg border border-accent shadow-sm overflow-x-auto">
          <div className="p-4 border-b border-primary flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Rides</h2>
            <div className="text-sm text-foreground/50">
              Showing {pagination.startIndex}-{pagination.endIndex} of {filtered.length} rides
            </div>
          </div>

          {isLoading || !isDataReady ? (
            <TableSkeleton />
          ) : (
            <Table className="min-w-[700px]">
              <TableHeader className="bg-accent/30">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Complaint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.currentData.length ? (
                  pagination.currentData.map((ride, idx) => (
                    <TableRow key={ride._id}>
                      <TableCell>{(pagination.currentPage - 1) * 10 + idx + 1}</TableCell>
                      <TableCell>{new Date(ride.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{shortLocation(ride.pickupName)}</TableCell>
                      <TableCell>{shortLocation(ride.dropName)}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {typeIcon[ride.vehicleType] || <Car className="w-5 h-5 text-primary" />}
                        {ride.vehicleType}
                      </TableCell>
                      <TableCell>৳{ride.fare}</TableCell>
                      <TableCell>{ride.riderInfo?.fullName}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          4.8 <Star className="w-4 h-4 text-yellow-400" />
                        </span>
                      </TableCell>
                      <TableCell>{statusBadge(ride.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setSelectedRide(ride);
                            setComplaintModal(true);
                          }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" /> Complaint
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      No rides found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {!isLoading && isDataReady && filtered.length > 0 && (
            <PaginationControls pagination={pagination} />
          )}
        </div>
      </div>

      {/* Complaint Modal */}
      <Dialog open={complaintModal} onOpenChange={setComplaintModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a Complaint</DialogTitle>
          </DialogHeader>
          {selectedRide && (
            <form onSubmit={handleComplaintSubmit} className="space-y-3 mt-2">
              <p className="text-sm text-muted-foreground">
                Rider: <strong>{selectedRide.riderInfo?.fullName}</strong> <br />
                Vehicle: {selectedRide.vehicleType} | Fare: ৳{selectedRide.fare}
              </p>
              <Input
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={4}
                placeholder="Write your complaint..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setComplaintModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-white">
                  Submit
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}