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
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Type icon mapping
const typeIcon = {
  Bike: <Bike className="w-5 h-5 text-primary" />,
  Car: <Car className="w-5 h-5 text-primary" />,
  CNG: <BusFront className="w-5 h-5 text-primary" />,
};

// Status badge
const statusBadge = (status) => {
  if (status === "Completed")
    return (
      <Badge className="bg-green-500/20 text-green-600 border border-green-500 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">
        {status}
      </Badge>
    );
  if (status === "Cancelled")
    return (
      <Badge className="bg-red-500/20 text-red-600 border border-red-500 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">
        {status}
      </Badge>
    );
  return (
    <Badge className="rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">
      {status}
    </Badge>
  );
};

// Skeleton loader
function TableSkeletonWrapper() {
  return (
    <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4 overflow-x-auto">
      <Table className="min-w-[700px] md:min-w-full">
        <TableHeader className="bg-accent/30">
          <TableRow>
            {[
              "#",
              "Date",
              "From",
              "To",
              "Type",
              "Fare",
              "Driver",
              "Rating",
              "Status",
            ].map((head, i) => (
              <TableHead key={i} className="text-xs md:text-sm">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(9)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-20 rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Function to convert coordinates to real location (via backend proxy)
const fetchLocationName = async (coordinates) => {
  if (!coordinates) return "Unknown location";
  const [lon, lat] = coordinates;
  try {
    const data = await apiRequest("reverse-geocode", "GET", {}, { lat, lon });
    return data?.display_name || "Unknown location";
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
  const [loading, setLoading] = useState(true); // Loading state for fetching
  const [processing, setProcessing] = useState(true); // Processing state for location resolution

  // Fetch rides via hook
  const { data: ridesData = [], isLoading } = useFetchData("rides", "rides", null);

  // Enrich rides with human-readable locations
  useEffect(() => {
    // Only update when the set of ride IDs changes to avoid infinite update loops
    const lastSignatureRef = (useRef.__ridesSig ||= { ref: { current: "" } }).ref;
    const ids = Array.isArray(ridesData) ? ridesData.map((r) => r?._id).filter(Boolean) : [];
    const signature = ids.join(",");

    if (!ids.length) {
      if (lastSignatureRef.current !== "__empty__") {
        lastSignatureRef.current = "__empty__";
        setRides([]);
        setLoading(false); // No rides found, stop loading
        setProcessing(false); // Data processing is done
      }
      return;
    }

    if (lastSignatureRef.current === signature) {
      return; // no change in data identity relevant to rendering
    }

    lastSignatureRef.current = signature;

    const enrich = async () => {
      try {
        const ridesWithLocations = await Promise.all(
          ridesData.map(async (ride) => {
            const pickupName = await fetchLocationName(ride.pickup?.coordinates);
            const dropName = await fetchLocationName(ride.drop?.coordinates);
            return { ...ride, pickupName, dropName };
          })
        );
        setRides(ridesWithLocations);
        setLoading(false); // Data loaded, stop loading
        setProcessing(false); // Data processing is done
      } catch (e) {
        console.error("Failed to enrich rides:", e);
        setRides(ridesData);
        setLoading(false); // Data loaded, stop loading
        setProcessing(false); // Data processing is done
      }
    };
    enrich();
  }, [ridesData]);

  // Filtering logic
  const filtered = rides.filter((ride) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      ride.riderInfo?.fullName.toLowerCase().includes(searchText) ||
      ride.vehicleType.toLowerCase().includes(searchText) ||
      ride.fare.toString().includes(searchText) ||
      ride.pickupName?.toLowerCase().includes(searchText) ||
      ride.dropName?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || ride.status === statusFilter;

    const matchesDate =
      !selectedDate ||
      new Date(ride.createdAt).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Check if data has been fully processed and fetched
  const isDataReady = !loading && !processing;

  return (
    <TooltipProvider>
      <div className="max-w-screen mx-auto lg:w-full md:w-full -ml-4 px-4">
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

        <div className="w-full max-w-6xl">
          <div className="bg-background rounded-lg border border-accent p-4 flex flex-col lg:flex-row gap-14 lg:items-end">
            <div className="lg:w-70">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pr-12 "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rides"
                />
              </div>
            </div>

            <div className="lg:w-32">
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

          {/* Skeleton or No Rides Found Message */}
          {isDataReady && filtered.length === 0 ? (
            <div className="text-center py-6">No rides found. Try adjusting your search, filters, or date.</div>
          ) : (
            <>
              {processing ? (
                <TableSkeletonWrapper />
              ) : (
                <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4 overflow-x-auto">
                  <Table className="min-w-[700px] md:min-w-full">
                    <TableHeader className="bg-accent/30">
                      <TableRow>
                        {[
                          "#",
                          "Date",
                          "From",
                          "To",
                          "Type",
                          "Fare",
                          "Driver",
                          "Rating",
                          "Status",
                        ].map((head, i) => (
                          <TableHead key={i} className="text-xs md:text-sm">
                            {head}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((ride, idx) => (
                        <TableRow key={ride._id}>
                          <TableCell className="text-xs md:text-sm">{idx + 1}</TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {new Date(ride.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {shortLocation(ride.pickupName)}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {shortLocation(ride.dropName)}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {typeIcon[ride.vehicleType]}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">{ride.fare}</TableCell>
                          <TableCell className="text-xs md:text-sm">
                            <Tooltip>
                              <TooltipTrigger>
                                <Avatar>
                                  <AvatarImage src={ride?.userPhotoUrl || ride?.driver?.profilePicture} />
                                  <AvatarFallback>{ride.driver?.fullName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>{ride.driver?.fullName}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {ride.driver?.rating && (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400" />
                                {ride.driver?.rating}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {statusBadge(ride.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
