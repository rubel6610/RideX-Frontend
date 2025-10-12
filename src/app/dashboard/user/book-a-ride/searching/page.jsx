"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bike, BusFront, Car, MapPin, Navigation, Clock, DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const rideTypeIcon = {
  Bike: Bike,
  Cng: BusFront,
  Car: Car,
};

export default function SearchingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [progress, setProgress] = useState(0);

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

  // Fake searching progress
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 10), 250);
      return () => clearTimeout(timer);
    }
    // After search, you can redirect or show found rider
  }, [progress]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-card)] to-[var(--color-background)] px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <VehicleIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Finding Your Ride</h1>
                  <p className="text-white/90 text-sm">Searching for nearest {type} rider...</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {mode === "auto" ? "Auto" : "Scheduled"}
              </Badge>
            </div>
          </div>

          {/* Animated Center Section */}
          <div className="py-12 px-6 flex flex-col items-center justify-center border-b border-[var(--color-border)]">
            {/* Animated Loader */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 animate-ping" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 animate-pulse" />
              </div>
              <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] shadow-2xl">
                <MapPin className="w-20 h-20 text-white animate-bounce" />
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">
                Connecting you with nearby riders
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)] max-w-md">
                We're finding the best rider for your journey. Hang tight!
              </p>
            </div>

            {/* Animated Progress Dots */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>

          {/* Ride Details Section */}
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">Ride Details</h3>
            
            {/* Location Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">Pickup Location</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-1">{pickup || "Setting pickup..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
                <div className="p-2 rounded-full bg-red-500/10">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">Drop Location</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-1">{drop || "Setting destination..."}</p>
                </div>
              </div>
            </div>

            {/* Trip Info Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/20">
                <div className="flex flex-col items-center text-center">
                  <DollarSign className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Fare</p>
                  <p className="text-lg font-bold text-[var(--color-primary)]">{fare ? `৳${fare}` : "--"}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/20">
                <div className="flex flex-col items-center text-center">
                  <Navigation className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Distance</p>
                  <p className="text-lg font-bold text-[var(--color-primary)]">{distance ? `${distance} km` : "--"}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/20">
                <div className="flex flex-col items-center text-center">
                  <Clock className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">ETA</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">{eta}</p>
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

          {/* Cancel Button at Bottom */}
          <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-card)]">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full group hover:bg-[var(--color-destructive)] hover:text-white hover:border-[var(--color-destructive)] transition-all duration-300 h-12 text-base font-semibold"
            >
              <X className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Cancel Ride Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
