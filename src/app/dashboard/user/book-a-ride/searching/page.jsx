"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bike, BusFront, Car, MapPin, Navigation, Clock, DollarSign, X, Star, Phone, User, Hash, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/hooks/AuthProvider";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const LiveTrackingMap = dynamic(
  () => import("@/components/Shared/LiveTrackingMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-xl bg-card border border-border flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }
);

const rideTypeIcon = {
  Bike: Bike,
  Cng: BusFront,
  Car: Car,
};

export default function SearchingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  
  // Demo data - মনে করো rider accept করেছে
  const [riderInfo, setRiderInfo] = useState({
    fullName: "Mehedi Hasan",
    rating: 4.8,
    totalRides: 256,
    vehicleType: "Bike",
    vehicleModel: "Honda CB150R",
    vehicleRegisterNumber: "DHAKA-BA-123456",
    contact: "+8801712345684",
    drivingLicense: "DL-444555666",
    status: "On the way",
    email: "mehedi02@email.com",
    location: {
      type: "Point",
      coordinates: [90.4125, 23.8103] // Dhaka coordinates
    }
  });

  // Get all info from query params
  const pickup = searchParams.get("pickup") || "";
  const drop = searchParams.get("drop") || "";
  const type = searchParams.get("type") || "Bike";
  const fare = searchParams.get("fare") || "";
  const distance = searchParams.get("distance") || "";
  const eta = searchParams.get("eta") || "3-7 min";
  const rideId = searchParams.get("rideId") || "";
  const riderId = searchParams.get("riderId") || "";
  const riderName = searchParams.get("riderName") || "";
  const riderDistance = searchParams.get("riderDistance") || "";
  const mode = searchParams.get("mode") || "auto";
  const promo = searchParams.get("promo") || "";

  // Get the icon component
  const VehicleIcon = rideTypeIcon[type] || Bike;

  // Fetch rider info from API (commented for demo)
  // useEffect(() => {
  //   if (!rideId) return;

  //   const fetchRideStatus = async () => {
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${rideId}`);
  //       const data = await res.json();
  //       if (data.status === "accepted" && data.riderInfo) {
  //         setRiderInfo(data.riderInfo);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching ride status:", err);
  //     }
  //   };

  //   // প্রথমবার call করা
  //   fetchRideStatus();

  //   // প্রতি 5 সেকেন্ডে একবার call হবে
  //   const interval = setInterval(fetchRideStatus, 5000);

  //   // cleanup: component unmount হলে interval clear হবে
  //   return () => clearInterval(interval);
  // }, [rideId]); // rideId change হলে নতুন interval set হবে

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-card to-background px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Main Card */}
        <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your {type} is on the way</h2>
                  <p className="text-background text-sm">Track your ride in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {eta}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1">
                  {mode === "auto" ? "Auto" : "Scheduled"}
                </Badge>
              </div>
            </div>
            
            {/* Ride Summary Bar */}
            {promo && (
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium text-xs">{promo} Applied</span>
                </div>
        </div>
            )}
          </div>

          {/* Two Column Layout for Large Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Rider Info Section */}
            <div className="border border-border rounded-xl bg-gradient-to-br from-card to-background p-6 space-y-6">
              {/* Success Banner */}
              {/* <div className="text-center pb-4 border-b border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-1">
                  Rider Assigned!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your ride has been confirmed
                </p>
              </div> */}

              {/* Rider Profile */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                {riderInfo ? (
                  <>
                    <Avatar className="w-20 h-20 border-4 border-primary shadow-lg">
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                        {riderInfo.fullName?.charAt(0) || "R"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-foreground mb-1">
                        {riderInfo.fullName}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-semibold text-foreground">
                            {riderInfo.rating || "4.8"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({riderInfo.totalRides || 0} rides)
                        </span>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {riderInfo.status || "On the way"}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-muted-foreground uppercase">
                  Vehicle Information
                </h5>
                {riderInfo ? (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className="p-2 rounded-full bg-primary/10">
                        <VehicleIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Vehicle Type</p>
                        <p className="text-sm font-semibold text-foreground">
                          {riderInfo.vehicleType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="text-sm font-semibold text-foreground">
                          {riderInfo.vehicleModel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Hash className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Registration</p>
                        <p className="text-sm font-semibold text-foreground">
                          {riderInfo.vehicleRegisterNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Chat Button */}
                <Button 
                  disabled={!riderInfo}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity h-12 text-base font-semibold shadow-lg disabled:opacity-50"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Chat
                </Button>

                {/* Cancel Ride Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 transition-opacity h-12 text-base font-semibold shadow-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel Ride
                </Button>

                {/* Make Payment Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:opacity-90 transition-opacity h-12 text-base font-semibold shadow-lg"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Make Payment
                </Button>
              </div>
            </div>

            {/* Ride Details Section */}
            <div className="space-y-4 border border-border rounded-xl p-6 bg-card/30">
            {/* Live Tracking Map */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Live Tracking</h3>
              <LiveTrackingMap 
                rideId={rideId} 
                riderInfo={riderInfo}
                vehicleType={type}
              />
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-4">Ride Details</h3>
            
            {/* Location Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Pickup Location</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{pickup || "Setting pickup..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                <div className="p-2 rounded-full bg-red-500/10">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Drop Location</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{drop || "Setting destination..."}</p>
                </div>
              </div>
            </div>

            {/* Trip Info Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex flex-col items-center text-center">
                  <DollarSign className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Fare</p>
                  <p className="text-lg font-bold text-primary">{fare ? `৳${fare}` : "--"}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex flex-col items-center text-center">
                  <Navigation className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Distance</p>
                  <p className="text-lg font-bold text-primary">{distance ? `${distance} km` : "--"}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex flex-col items-center text-center">
                  <Clock className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">ETA</p>
                  <p className="text-sm font-bold text-primary">{eta}</p>
                </div>
              </div>
            </div>

            {/* Promo Code Display */}
            {promo && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    PROMO
                  </Badge>
                  <span className="text-sm font-semibold text-green-700">{promo}</span>
          </div>
                <span className="text-xs text-green-600">Applied</span>
          </div>
            )}
          </div>
          </div>

        </div>
      </div>
    </div>
  );
}
