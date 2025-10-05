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
import { Bike, Car, BusFront, Star, Search, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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

// Function to convert coordinates to real location
const fetchLocationName = async (coordinates) => {
  if (!coordinates) return "Unknown location";
  const [lon, lat] = coordinates; // swap lon & lat for Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    return data.display_name || "Unknown location";
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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rides from API
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rides");
        const data = await res.json();

        // Fetch real locations for pickup and drop
        const ridesWithLocations = await Promise.all(
          data.map(async (ride) => {
            const pickupName = await fetchLocationName(
              ride.pickup?.coordinates
            );
            const dropName = await fetchLocationName(ride.drop?.coordinates);
            return { ...ride, pickupName, dropName };
          })
        );

        setRides(ridesWithLocations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rides:", error);
        setIsLoading(false);
      }
    };
    fetchRides();
  }, []);

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

  return (
    <TooltipProvider>
      {/*  className="space-y-6 w-7xl  lg:w-full md:w-12/12 min-h-screen bg-accent/10 flex flex-col items-center py-6 px-2" */}
      <div className="max-w-screen mx-auto lg:w-full md:w-full px-4">
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
        <div className="w-full max-w-6xl">
          <div className="bg-background rounded-lg border border-accent p-4 flex flex-col lg:flex-row gap-4 lg:items-end">
            {/* Search */}
            <div className="lg:w-70">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by, location, driver, type, fare..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className=""
                />
              </div>
            </div>

            {/* Datepicker */}
            <div className="">
              <div className="w-full lg:w-70 ">
                <label className="text-sm font-medium text-foreground mb-2 block text-left">
                  Date
                </label>
                <Popover className=" bg-muted">
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedDate
                        ? selectedDate.toDateString()
                        : "Select Date"}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto  rounded-2xl -p-7  space-y-2">
                    <Calendar
                      className="w-70 bg-muted rounded-2xl"
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(null)}
                        className="w-full  text-red-500 hover:bg-red-100"
                      >
                        Clear Date
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Status */}
            <div className="lg:w-70 md:w-full">
              <label className="text-sm font-medium text-foreground mb-2 block text-left">
                Status
              </label>
              <Select
                className="border border-primary w-full"
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="border border-primary">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Ride Table */}
        <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4 overflow-x-auto">
          <div className="p-4 border-b border-primary flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Rides</h2>
            <div className="text-sm text-foreground/50">
              Showing {filtered.length} of {rides.length} rides
            </div>
          </div>

          {isLoading ? (
            <TableSkeletonWrapper />
          ) : (
            <Table className="min-w-[700px] md:min-w-full custom-scrollbar">
              <TableHeader className="bg-accent/30">
                <TableRow>
                  <TableHead className="text-left text-xs md:text-sm text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    Date
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    From
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    To
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    Type
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    Fare
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    Driver
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    Rating
                  </TableHead>
                  <TableHead className="text-left text-xs md:text-sm">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((ride, idx) => (
                    <TableRow
                      key={ride._id}
                      className="hover:bg-accent/20 transition-colors"
                    >
                      <TableCell className="text-xs md:text-sm text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Pickup with tooltip */}
                      <TableCell className="text-xs md:text-sm">
                        <Tooltip className="text-black">
                          <TooltipTrigger asChild>
                            <span>{shortLocation(ride.pickupName)}</span>
                          </TooltipTrigger>
                          <TooltipContent>{ride.pickupName}</TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Drop with tooltip */}
                      <TableCell className="text-xs md:text-sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{shortLocation(ride.dropName)}</span>
                          </TooltipTrigger>
                          <TooltipContent>{ride.dropName}</TooltipContent>
                        </Tooltip>
                      </TableCell>

                      <TableCell className="text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                          {typeIcon[ride.vehicleType] || (
                            <Car className="w-5 h-5 text-primary" />
                          )}
                          <span className="font-medium text-foreground">
                            {ride.vehicleType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">
                        <span className="font-semibold text-primary">
                          ৳{ride.fare}
                        </span>
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
                                  {ride.riderInfo?.fullName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{ride.riderInfo?.fullName}</span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 bg-background p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={"/driver/bike offer.png"}
                                alt={ride.riderInfo?.fullName}
                              />
                              <AvatarFallback>
                                {ride.riderInfo?.fullName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-lg">
                              {ride.riderInfo?.fullName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              Vehicle: {ride.riderInfo?.vehicleModel}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Reg: {ride.riderInfo?.vehicleRegisterNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Fare: ৳{ride.fare}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Status: {ride.status}
                            </p>
                          </PopoverContent>
                        </Popover>
                      </TableCell>

                      <TableCell className="text-xs md:text-sm">
                        <span className="flex items-center gap-1 text-foreground font-medium">
                          4.8 <Star className="w-4 h-4 text-yellow-400" />
                        </span>
                      </TableCell>
                      <TableCell>{statusBadge(ride.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground text-sm md:text-base"
                    >
                      No rides found. Try adjusting your search, filters, or
                      date.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
