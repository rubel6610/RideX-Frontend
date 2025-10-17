"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Bike,
  BusFront,
  Car,
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  X,
  Phone,
  Hash,
  CheckCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/hooks/AuthProvider";
import dynamic from "next/dynamic";
import ChatModal from "@/components/Shared/ChatModal";

// Dynamically import map component to prevent SSR issues
const LiveTrackingMap = dynamic(
  () => import("@/components/Shared/LiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-xl bg-card border border-border flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

// Vehicle icon mapping
const rideTypeIcon = {
  Bike: Bike,
  Cng: BusFront,
  Car: Car,
};

export default function AcceptRide() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Extract ride details from URL query parameters
  const pickup = searchParams.get("pickup") || "";
  const drop = searchParams.get("drop") || "";
  const type = searchParams.get("vehicleType") || "Bike";
  const fare = searchParams.get("amount") || "";
  const distance = searchParams.get("distance") || "";
  const eta = searchParams.get("arrivalTime") || "00h:00m";
  const rideId = searchParams.get("rideId") || "";
  const userId = searchParams.get("userId") || "";
  const riderId = searchParams.get("riderId") || "";
  const riderName = searchParams.get("riderName") || "";
  const riderEmail = searchParams.get("riderEmail") || "";
  const vehicleType = searchParams.get("vehicleType") || "";
  const vehicleModel = searchParams.get("vehicleModel") || "";
  const vehicleRegisterNumber = searchParams.get("vehicleRegisterNumber") || "";
  const completedRides = searchParams.get("completedRides") || "0";
  const ratings = searchParams.get("ratings") || "0";
  const baseFare = searchParams.get("baseFare") || "0";
  const distanceFare = searchParams.get("distanceFare") || "0";
  const timeFare = searchParams.get("timeFare") || "0";
  const tax = searchParams.get("tax") || "0";
  const total = searchParams.get("total") || "0";
  const mode = searchParams.get("mode") || "auto";
  const promo = searchParams.get("promo") || "";

  // Set vehicle icon
  const VehicleIcon = rideTypeIcon[type] || Bike;

  // Rider information fetched from URL
  const riderInfo ={
    fullName: riderName || "N/A",
    email: riderEmail || "",
    vehicleType: vehicleType || type,
    vehicleModel: vehicleModel || "Unknown Model",
    vehicleRegisterNumber: vehicleRegisterNumber || "N/A",
    status: "On the way",
    location: {
      type: "Point",
      coordinates: [90.4125, 23.8103],
    },
  };

  // ✅ Updated Complete Ride Handler
  const handleCompleteRide = () => {

    const params = new URLSearchParams({
      rideId,
      userId,
      riderId,
      ratings,
      riderName,
      riderEmail,
      pickup,
      drop,
      vehicleType,
      vehicleModel,
      vehicleRegisterNumber,
      distance,
      baseFare,
      distanceFare,
      timeFare,
      tax,
      total,
      promo,
      fare,
      arrivalTime: eta,
      vehicleType: type,
      completedRides,
      mode,
    });

    router.push(
      `http://localhost:3000/dashboard/user/payment?${params.toString()}`
    );
  };

  // ✅ Updated Cancel Ride Handler
  const handleCancelRide = () => {
    console.log("Ride cancelled:", rideId);
    // You can add cancel ride logic here (API call, etc.)
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-card to-background px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Main Container */}
        <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your {type} is on the way</h2>
                  <p className="text-background text-sm">
                    Track your ride in real-time
                  </p>
                </div>
              </div>

              {/* ETA and Mode */}
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {eta}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1"
                >
                  {mode === "auto" ? "Auto" : "Scheduled"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Rider Info Section */}
            <div className="border border-border rounded-xl bg-gradient-to-br from-card to-background p-6 space-y-6">
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
                      <h4 className="text-3xl font-bold text-foreground mb-1 uppercase">
                        {riderInfo.fullName}
                      </h4>
                      <Badge className="bg-green-600 text-white">
                        {riderInfo.status}
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
                  Location Details
                </h5>

                {/* Pickup and Drop */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <Navigation className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Pickup Location
                      </p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {pickup || "Setting pickup..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="p-2 rounded-full bg-red-500/10">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Drop Location
                      </p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {drop || "Setting destination..."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1">
                  <h5 className="my-2 text-sm font-semibold text-muted-foreground uppercase">
                    Vehicle Information
                  </h5>

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
              </div>

               {/* Buttons */}
               <div className="space-y-3">
                 <Button 
                   onClick={() => setIsChatOpen(true)}
                   variant="default"
                   className="w-full h-12 text-base font-semibold"
                 >
                   <Phone className="w-5 h-5 mr-2" />
                   Chat with {riderInfo.fullName.split(" ")[0]}
                 </Button>

                <Button
                  onClick={handleCancelRide}
                  variant="destructive"
                  className="w-full h-12 text-base font-semibold"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel Ride
                </Button>

                <Button
                  onClick={handleCompleteRide}
                  variant="default"
                  className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Complete Ride
                </Button>
              </div>
            </div>

            {/* Ride Details Section */}
            <div className="space-y-4 border border-border rounded-xl p-6 bg-card/30">
              {/* Map */}
              <div className="mb-6">
                <h5 className="mb-2 text-sm font-semibold text-muted-foreground uppercase">
                  Live Tracking
                </h5>
                <LiveTrackingMap
                  rideId={rideId}
                  riderInfo={riderInfo}
                  vehicleType={type}
                />
              </div>

              {/* Ride Details */}
              <h5 className="mb-2 text-sm font-semibold text-muted-foreground uppercase">
                Ride Details
              </h5>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex flex-col items-center text-center">
                    <DollarSign className="w-6 h-6 text-primary mb-1" />
                    <p className="text-sm text-muted-foreground mb-1">Fare</p>
                    <p className="text-2xl font-bold text-primary uppercase">
                      {fare ? `৳${fare}` : "--"}
                    </p>
                  </div>
                </div>

                <div className="w-full flex gap-3">
                  <div className="w-full p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex flex-col items-center text-center">
                      <Navigation className="w-6 h-6 text-primary mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">Distance</p>
                      <p className="text-xl font-bold text-primary uppercase">
                        {distance ? `${distance} km` : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-6 h-6 text-primary mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">ETA</p>
                      <p className="text-xl font-bold text-primary uppercase">{eta}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Display */}
              {promo && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      PROMO
                    </Badge>
                    <span className="text-sm font-semibold text-green-700">
                      {promo}
                    </span>
                  </div>
                  <span className="text-xs text-green-600">Applied</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        riderName={riderInfo.fullName}
        riderVehicle={`${riderInfo.vehicleType} - ${riderInfo.vehicleRegisterNumber}`}
      />
    </div>
  );
}
