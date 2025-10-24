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
import { Bike, Car, BusFront, Star, Search, CalendarIcon } from "lucide-react";
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
  PopoverContent
} from "@/components/ui/popover";  // <-- adjust path if your Popover is elsewhere
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
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

// Type icon mapping
const typeIcon = {
  Bike: <Bike className="w-5 h-5 text-primary" />,
  Car:  <Car  className="w-5 h-5 text-primary" />,
  CNG:  <BusFront className="w-5 h-5 text-primary" />,
};

// Status badge
const statusBadge = (status) => {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-500/20 text-green-600 border border-green-500 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">
        {status}
      </Badge>
    );
  }
  if (status === "Cancelled") {
    return (
      <Badge className="bg-red-500/20 text-red-600 border border-red-500 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">
        {status}
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">
      {status}
    </Badge>
  );
};

// Function to convert coordinates to real location (via backend proxy)
// Optimized with caching to avoid redundant API calls
const locationCache = new Map();

const fetchLocationName = async (coordinates) => {
  if (!coordinates) return "Unknown location";
  const [lon, lat] = coordinates;
  
  // Create a cache key based on coordinates (rounded to reduce cache misses)
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  
  // Return cached result if available
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/reverse-geocode?lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    const displayName = data.display_name || "Unknown location";
    
    // Cache the result
    locationCache.set(cacheKey, displayName);
    
    return displayName;
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Unknown location";
  }
};

// Function to shorten location string
const shortLocation = (location, length = 15) => {
  if (!location) return "Unknown";
  if (location.length <= length) return location;
  return location.slice(0, length) + "...";
};

export default function RideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [processing, setProcessing] = useState(true);

  const { data: ridesData = [], isLoading } = useFetchData("rides", "/rides", null);

  useEffect(() => {
    const lastSignatureRef = (useRef.__ridesSig ||= { ref: { current: "" } }).ref;
    const ids = Array.isArray(ridesData)
      ? ridesData.map((r) => r?._id).filter(Boolean)
      : [];
    const signature = ids.join(",");

    if (!ids.length) {
      if (lastSignatureRef.current !== "__empty__") {
        lastSignatureRef.current = "__empty__";
        setRides([]);
        setProcessing(false);
      }
      return;
    }

    if (lastSignatureRef.current === signature) {
      return;
    }

    lastSignatureRef.current = signature;

    const enrich = async () => {
      try {
        setProcessing(true);
        
        // Batch process rides with limited concurrency to avoid overwhelming the API
        const BATCH_SIZE = 5; // Process 5 rides at a time
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
          
          // Update UI progressively as batches complete
          setRides([...ridesWithLocations]);
        }
      } catch (e) {
        console.error("Failed to enrich rides:", e);
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

  return (
    <TooltipProvider>
      <div className="max-w-screen mx-auto lg:w-full md:w-full -ml-5 px-2">
        {/* Header */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              My Ride History
            </h1>
            <p className="text-sm md:text-base text-foreground/60 mt-1">
              All your completed and cancelled rides
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="w-full ml-0 max-w-6xl">
          <div className="bg-background rounded-lg border border-accent p-4 flex flex-col lg:flex-row gap-10 lg:items-end">
            {/* Search */}
            <div className="lg:w-70">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search
              </label>
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

            {/* Datepicker */}
            <div className="w-full lg:w-70">
              <label className="text-sm font-medium text-foreground mb-2 block text-left">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="border border-primary rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-1 border-primary rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    >
                      { selectedDate
                        ? selectedDate.toDateString()
                        : "Select Date"
                      }
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto rounded-2xl bg-background border border-primary p-2 space-y-2">
                  <Calendar
                    className="w-70 rounded-2xl"
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(null)}
                      className="w-full text-red-500 hover:bg-red-100"
                    >
                      Clear Date
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="lg:w-70 md:w-full">
              <label className="text-sm font-medium text-foreground mb-2 block text-left">
                Status
              </label>
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
          <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4 overflow-x-auto">
            <div className="p-4 border-b border-primary flex justify-between items-center">
              <h2 className="text-lg font-semibold">All Rides</h2>
              <div className="text-sm text-foreground/50">
                Showing {pagination.startIndex}-{pagination.endIndex} of {filtered.length} rides
              </div>
            </div>

            {isLoading || !isDataReady ? (
              <TableSkeleton />
            ) : (
              <Table className="min-w-[700px] md:min-w-full custom-scrollbar">
                <TableHeader className="bg-accent/30">
                  <TableRow>
                    <TableHead className="text-left text-xs md:text-sm text-muted-foreground">#</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">Date</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">From</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">To</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">Type</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">Fare</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">Driver</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">Rating</TableHead>
                    <TableHead className="text-left text-xs md:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.currentData.length ? (
                    pagination.currentData.map((ride, idx) => (
                      <TableRow
                        key={ride._id}
                        className="hover:bg-accent/20 transition-colors"
                      >
                        <TableCell className="text-xs md:text-sm text-muted-foreground">
                          {(pagination.currentPage - 1) * 10 + idx + 1}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm">
                          { new Date(ride.createdAt).toLocaleDateString() }
                        </TableCell>

                        {/* Pickup with tooltip */}
                        <TableCell className="text-xs md:text-sm">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{ shortLocation(ride.pickupName) }</span>
                            </TooltipTrigger>
                            <TooltipContent>{ ride.pickupName }</TooltipContent>
                          </Tooltip>
                        </TableCell>

                        {/* Drop with tooltip */}
                        <TableCell className="text-xs md:text-sm">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{ shortLocation(ride.dropName) }</span>
                            </TooltipTrigger>
                            <TooltipContent>{ ride.dropName }</TooltipContent>
                          </Tooltip>
                        </TableCell>

                        <TableCell className="text-xs md:text-sm">
                          <div className="flex items-center gap-1">
                            { typeIcon[ride.vehicleType] || <Car className="w-5 h-5 text-primary" /> }
                            <span className="font-medium text-foreground">
                              { ride.vehicleType }
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs md:text-sm">
                          <span className="font-semibold text-primary">৳{ ride.fare }</span>
                        </TableCell>

                        {/* Driver details */}
                        <TableCell className="text-xs md:text-sm">
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="flex items-center gap-2 cursor-pointer">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={"/driver/bike offer.png"}
                                    alt={ride.riderInfo?.fullName}
                                  />
                                  <AvatarFallback>
                                    { ride.riderInfo?.fullName?.charAt(0) }
                                  </AvatarFallback>
                                </Avatar>
                                <span>{ ride.riderInfo?.fullName }</span>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 bg-background p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                              <Avatar className="h-16 w-16">
                                <AvatarImage
                                  src={"/driver/bike offer.png"}
                                  alt={ride.riderInfo?.fullName}
                                />
                                <AvatarFallback>
                                  { ride.riderInfo?.fullName?.charAt(0) }
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="font-semibold text-lg">{ ride.riderInfo?.fullName }</h3>
                              <p className="text-sm text-muted-foreground mt-2">
                                Vehicle: { ride.riderInfo?.vehicleModel }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Reg: { ride.riderInfo?.vehicleRegisterNumber }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Fare: ৳{ ride.fare }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Status: { ride.status }
                              </p>
                            </PopoverContent>
                          </Popover>
                        </TableCell>

                        <TableCell className="text-xs md:text-sm">
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            4.8 <Star className="w-4 h-4 text-yellow-400" />
                          </span>
                        </TableCell>

                        <TableCell className="text-xs md:text-sm">
                          { statusBadge(ride.status) }
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-24 text-center text-muted-foreground text-sm md:text-base"
                      >
                        No rides found. Try adjusting your search, filters, or date.
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
      </div>
    </TooltipProvider>
  );
}
