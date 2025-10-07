"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bike, BusFront, Car, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const rideTypeIcon = {
  Bike: <Bike className="w-8 h-8 text-primary animate-bounce" />,
  Cng: <BusFront className="w-8 h-8 text-primary animate-bounce" />,
  Car: <Car className="w-8 h-8 text-primary animate-bounce" />,
};

const searchIcon = (
  <span className="inline-block animate-bounce text-primary">
    <Search className="w-12 h-12" />
  </span>
);

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

  // Fake searching progress
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 10), 250);
      return () => clearTimeout(timer);
    }
    // After search, you can redirect or show found rider
  }, [progress]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 px-4 py-10">
      <div className="w-full max-w-lg bg-background rounded-2xl shadow-xl border border-primary/20 p-8 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="mb-2">{searchIcon}</div>
          <h2 className="text-2xl font-bold text-primary mb-1 text-center">
            Searching for nearest {type} rider...
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Looking for the fastest available {type} rider for you.
          </p>
        </div>
        <div className="w-full bg-card rounded-xl p-4 border border-accent flex flex-col gap-2">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-muted-foreground">Pickup:</span>
            <span className="text-foreground">{pickup}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-muted-foreground">Drop:</span>
            <span className="text-foreground">{drop}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-muted-foreground">Estimated Fare:</span>
            <span className="text-primary font-bold">{fare ? `৳${fare}` : "--"}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-muted-foreground">Distance:</span>
            <span className="text-primary">{distance ? `${distance} km` : "--"}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-muted-foreground">Estimated Arrival:</span>
            <span className="text-primary">{eta}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4 text-primary border-primary hover:bg-primary/10"
          onClick={() => router.back()}
        >
          Cancel & Go Back
        </Button>
      </div>
    </div>
  );
}

/* Add this to your global CSS if not present:
@keyframes pulse-infinite {
  0% { margin-left: -40%; opacity: 0.5; }
  50% { margin-left: 60%; opacity: 1; }
  100% { margin-left: 100%; opacity: 0.5; }
}
.animate-pulse-infinite {
  animation: pulse-infinite 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
}
*/
