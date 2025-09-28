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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const rideHistory = [
  { id: "RDX-001", date: "2025-09-25", from: "Banani, Dhaka", to: "Dhanmondi, Dhaka", type: "Bike", fare: 120, driver: "John D.", driverImage: "/driver/bike offer.png", rating: 4.9, status: "Completed" },
  { id: "RDX-002", date: "2025-09-20", from: "Uttara, Dhaka", to: "Gulshan, Dhaka", type: "Car", fare: 350, driver: "Amit H.", driverImage: "/driver/bike offer.png", rating: 4.7, status: "Completed" },
  { id: "RDX-003", date: "2025-09-15", from: "Mirpur, Dhaka", to: "Motijheel, Dhaka", type: "CNG", fare: 200, driver: "Rahim U.", driverImage: "/driver/bike offer.png", rating: 4.8, status: "Cancelled" },
];

// Type icon mapping
const typeIcon = {
  Bike: <Bike className="w-5 h-5 text-primary" />,
  Car: <Car className="w-5 h-5 text-primary" />,
  CNG: <BusFront className="w-5 h-5 text-primary" />,
};

// Status badge
const statusBadge = (status) => {
  if (status === "Completed")
    return <Badge className="bg-green-500/20 text-green-600 border border-green-500 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">{status}</Badge>;
  if (status === "Cancelled")
    return <Badge className="bg-red-500/20 text-red-600 border border-red-500 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">{status}</Badge>;
  return <Badge className="rounded-full px-2 md:px-3 py-1 text-xs md:text-sm">{status}</Badge>;
};

// Skeleton loader
function TableSkeletonWrapper() {
  return (
    <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4 overflow-x-auto">
      <Table className="min-w-[700px] md:min-w-full">
        <TableHeader className="bg-accent/30">
          <TableRow>
            {["#", "Date", "From", "To", "Type", "Fare", "Driver", "Rating", "Status"].map((head, i) => (
              <TableHead key={i} className="text-xs md:text-sm">{head}</TableHead>
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

export default function RideHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = rideHistory.filter((ride) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      ride.from.toLowerCase().includes(searchText) ||
      ride.to.toLowerCase().includes(searchText) ||
      ride.driver.toLowerCase().includes(searchText) ||
      ride.type.toLowerCase().includes(searchText) ||
      ride.fare.toString().includes(searchText);

    const matchesStatus = statusFilter === "all" || ride.status === statusFilter;
    const matchesDate = !selectedDate || new Date(ride.date).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6 min-h-screen bg-accent/10 flex flex-col items-center py-6 px-2">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">My Ride History</h1>
          <p className="text-sm md:text-base text-foreground/60 mt-1">All your completed and cancelled rides</p>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full max-w-6xl">
        <div className="bg-background rounded-lg border border-accent p-4 flex flex-col md:flex-row gap-4 md:items-end">
          {/* Search */}
          <div className="flex-1 md:flex-none md:w-1/3">
            <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by, location, driver, type, fare..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Datepicker */}
          <div className="flex-1 md:flex-none md:w-1/3 flex justify-center">
            <div className="w-full md:w-72">
              <label className="text-sm font-medium text-foreground mb-2 block text-left">Date</label>
              <Popover className="border border-primary bg-muted">
                <PopoverTrigger asChild className="border border-primary">
                  <Button variant="outline" className="w-full justify-between">
                    {selectedDate ? selectedDate.toDateString() : "Select Date"}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto rounded-2xl border border-primary space-y-2">
                  <Calendar
                    className="w-60 bg-muted rounded-2xl p-4 border border-primary"
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
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
          </div>

          {/* Status */}
          <div className="flex-1 md:flex-none md:w-1/3 flex justify-end lg:-ml-10 md:-ml-10">
            <div className="w-full md:w-48">
              <label className="text-sm font-medium text-foreground mb-2 block lg:text-left">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="border border-primary">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Table */}
      <div className="w-full max-w-6xl bg-background rounded-lg border border-accent shadow-sm mt-4 overflow-x-auto">
        <div className="p-4 border-b border-primary flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Rides</h2>
          <div className="text-sm text-foreground/50">Showing {filtered.length} of {rideHistory.length} rides</div>
        </div>

        {isLoading ? (
          <TableSkeletonWrapper />
        ) : (
          <Table className="min-w-[700px] md:min-w-full">
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
              {filtered.length ? (
                filtered.map((ride, idx) => (
                  <TableRow key={ride.id} className="hover:bg-accent/20 transition-colors">
                    <TableCell className="text-xs md:text-sm text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="text-xs md:text-sm">{ride.date}</TableCell>
                    <TableCell className="text-xs md:text-sm">{ride.from}</TableCell>
                    <TableCell className="text-xs md:text-sm">{ride.to}</TableCell>
                    <TableCell className="text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        {typeIcon[ride.type]} <span className="font-medium text-foreground">{ride.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm"><span className="font-semibold text-primary">৳{ride.fare}</span></TableCell>
                   {/* driver  all details  */}
                    <TableCell className="text-xs md:text-sm">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={ride.driverImage} alt={ride.driver} />
                              <AvatarFallback>{ride.driver.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{ride.driver}</span>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-60 bg-background p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={ride.driverImage} alt={ride.driver} />
                            <AvatarFallback>{ride.driver.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg">{ride.driver}</h3>
                          <div className="flex items-center gap-1 text-yellow-400">
                            {ride.rating} <Star className="w-4 h-4" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">Ride Type: {ride.type}</p>
                          <p className="text-sm text-muted-foreground">Fare: ৳{ride.fare}</p>
                          <p className="text-sm text-muted-foreground">Status: {ride.status}</p>
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    <TableCell className="text-xs md:text-sm">
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        {ride.rating} <Star className="w-4 h-4 text-yellow-400" />
                      </span>
                    </TableCell>
                    <TableCell>{statusBadge(ride.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground text-sm md:text-base">
                    No rides found. Try adjusting your search, filters, or date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
