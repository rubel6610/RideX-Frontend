"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { calculateFare } from "@/components/Shared/fareCalculator";
import ModeSelector from "./components/ModeSelector";
import LocationInputs from "./components/LocationInputs";
import PromoCodeSection from "./components/PromoCodeSection";
import VehicleTypeSelector from "./components/VehicleTypeSelector";
import ConsolidatedRideCard from "./components/ConsolidatedRideCard";
import RideMap from "./components/RideMap";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/components/Shared/socket/socket";
import { Button } from "@/components/ui/button";

const BookARideContent = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupName, setPickupName] = useState("");
  const [dropName, setDropName] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCurrentLocationActive, setIsCurrentLocationActive] = useState(false);
  const [selectedType, setSelectedType] = useState("Bike");
  const [mode, setMode] = useState("auto");
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const [rideData, setRideData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rideId, setRideId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  // ✅ Get Current Location (with fallback + caching)
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const saved = localStorage.getItem("currentLocation");
        if (saved) {
          const parsedLocation = JSON.parse(saved);
          setCurrentLocation(parsedLocation);
          
          // Set current location as default pickup if no pickup is set
          if (!pickup) {
            setPickup(parsedLocation.coordinates);
            setPickupName(parsedLocation.name);
            setIsCurrentLocationActive(true);
          }
          return;
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              
              const loc = {
                coordinates: `${latitude},${longitude}`,
                name: data?.display_name,
                lat: latitude,
                lng: longitude,
              };
              setCurrentLocation(loc);
              localStorage.setItem("currentLocation", JSON.stringify(loc));
              
              // Set current location as default pickup if no pickup is set
              if (!pickup) {
                setPickup(`${latitude},${longitude}`);
                setPickupName(data?.display_name || `${latitude},${longitude}`);
                setIsCurrentLocationActive(true);
              }
            },
            () => {
              const def = {
                coordinates: "23.8103,90.4125",
                name: "Dhaka, Bangladesh",
                lat: 23.8103,
                lng: 90.4125,
              };
              setCurrentLocation(def);
              localStorage.setItem("currentLocation", JSON.stringify(def));
              
              // Set default location as pickup if no pickup is set
              if (!pickup) {
                setPickup("23.8103,90.4125");
                setPickupName("Dhaka, Bangladesh");
                setIsCurrentLocationActive(true);
              }
            }
          );
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };
    getCurrentLocation();
  }, [pickup]);

  // ✅ Counter animation for modal loader
  useEffect(() => {
    if (!isLoading || !isModalOpen) {
      setCounter(0);
      setCountdown(60);
      return;
    }
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading, isModalOpen]);

  // ✅ Load route params from URL if available
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const params = new URLSearchParams(window.location.search);
      const p1 = params.get("pickup");
      const p2 = params.get("drop");
      const promoP = params.get("promo");
      const typeP = params.get("type");
      const modeP = params.get("mode");

      if (p1) {
        // If pickup location is provided from hero page, use it
        setPickup(p1);
        setPickupName(p1); // Initially set name to the value, will be updated when geocoded
      }
      if (p2) {
        // If drop location is provided from hero page, use it
        setDrop(p2);
        setDropName(p2); // Initially set name to the value, will be updated when geocoded
      }
      if (promoP) {
        setPromo(promoP);
        setAppliedPromo(promoP);
      }
      if (typeP) setSelectedType(typeP);
      if (modeP) setMode(modeP);

      if (p1 || p2)
        toast.success("Route loaded from URL", {
          description: "Your route has been automatically filled from the link.",
        });
    } catch (error) {
      console.error('Error loading URL parameters:', error);
    }
  }, []);

  // ✅ Fare calculation effect (optimized)
  useEffect(() => {
    const isValidCoordinate = (str) => {
      if (!str) return false;
      const [lat, lng] = str.split(",").map(Number);
      return (
        !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
      );
    };

    // If we have both pickup and drop but they're not valid coordinates, try to geocode them
    if (pickup && drop && (!isValidCoordinate(pickup) || !isValidCoordinate(drop))) {
      const geocodeLocation = async (locationName) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1&countrycodes=bd`
          );
          const data = await response.json();

          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return `${lat},${lon}`;
          }
          return null;
        } catch (error) {
          console.error('Geocoding error:', error);
          return null;
        }
      };

      const processLocations = async () => {
        let newPickup = pickup;
        let newDrop = drop;

        // Geocode pickup if it's not coordinates
        if (pickup && !isValidCoordinate(pickup)) {
          const geocodedPickup = await geocodeLocation(pickup);
          if (geocodedPickup) {
            newPickup = geocodedPickup;
            setPickup(newPickup);
          }
        }

        // Geocode drop if it's not coordinates
        if (drop && !isValidCoordinate(drop)) {
          const geocodedDrop = await geocodeLocation(drop);
          if (geocodedDrop) {
            newDrop = geocodedDrop;
            setDrop(newDrop);
          }
        }

        // If both are now valid coordinates, calculate fare
        if (newPickup && newDrop && isValidCoordinate(newPickup) && isValidCoordinate(newDrop)) {
          try {
            const type = selectedType.toLowerCase();
            const result = await calculateFare(newPickup, newDrop, type, appliedPromo);
            setRideData(result);
          } catch (error) {
            toast.error("Fare calculation failed");
          }
        }
      };

      processLocations();
    } else if (pickup && drop && isValidCoordinate(pickup) && isValidCoordinate(drop)) {
      // If both are already valid coordinates, calculate fare immediately
      const fetchDistance = async () => {
        try {
          const type = selectedType.toLowerCase();
          const result = await calculateFare(pickup, drop, type, appliedPromo);
          setRideData(result);
        } catch (error) {
          toast.error("Fare calculation failed");
        }
      };

      fetchDistance();
    } else {
      setRideData(null);
    }
  }, [pickup, drop, selectedType, appliedPromo]);

  // ✅ Auto-cancel after 60 seconds
  useEffect(() => {
    if (!rideId || !isLoading) return;
    
    const timeout = setTimeout(async () => {
      // Check if ride is still pending
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${rideId}`);
        const data = await res.json();
        
        if (data.status === 'pending' || data.status === 'auto-rejected' || data.status === 'no_riders_available') {
          toast.error("No riders available", {
            description: "Your ride request timed out. Please try again."
          });
          setIsLoading(false);
          setIsModalOpen(false);
          setRideId(null);
        }
      } catch (err) {
        console.error("Error checking ride status:", err);
      }
    }, 60000); // 60 seconds

    return () => clearTimeout(timeout);
  }, [rideId, isLoading]);

  // ✅ Ride status polling (optimized)
  useEffect(() => {
    if (!rideId) return;
    let hasPushed = false;
    const fetchRideStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${rideId}`);
        const data = await res.json();
        if (!hasPushed && data.status === "accepted" && data?.rideInfo) {
          hasPushed = true;

          // Create a new URLSearchParams object
          const params = new URLSearchParams();
          
          // Add parameters safely with null checks
          try {
            if (rideId) params.append('rideId', rideId);
            if (user?.id) params.append('userId', user.id);
            if (data?.rideInfo?.riderId) params.append('riderId', data.rideInfo.riderId);
            if (data?.rideInfo?.fare) params.append('amount', data.rideInfo.fare.toString());
            if (pickupName || pickup) params.append('pickup', pickupName || pickup);
            if (dropName || drop) params.append('drop', dropName || drop);
            if (selectedType) params.append('vehicleType', selectedType);
            if (rideData?.distanceKm) params.append('distance', rideData.distanceKm.toString());
            if (rideData?.arrivalTime) params.append('arrivalTime', rideData.arrivalTime);
            if (appliedPromo) params.append('promo', appliedPromo);
            if (rideData?.baseFare) params.append('baseFare', rideData.baseFare.toString());
            if (rideData?.distanceFare) params.append('distanceFare', rideData.distanceFare.toString());
            if (rideData?.timeFare) params.append('timeFare', rideData.timeFare.toString());
            if (rideData?.tax) params.append('tax', rideData.tax.toString());
            if (data?.rideInfo?.fare) params.append('total', data.rideInfo.fare.toString());
            if (data?.rideInfo?.riderInfo?.fullName) params.append('riderName', data.rideInfo.riderInfo.fullName);
            if (data?.rideInfo?.riderInfo?.email) params.append('riderEmail', data.rideInfo.riderInfo.email);
            if (data?.rideInfo?.riderInfo?.vehicleModel) params.append('vehicleModel', data.rideInfo.riderInfo.vehicleModel);
            if (data?.rideInfo?.riderInfo?.vehicleRegisterNumber) params.append('vehicleRegisterNumber', data.rideInfo.riderInfo.vehicleRegisterNumber);
            if (data?.rideInfo?.riderInfo?.ratings) params.append('ratings', data.rideInfo.riderInfo.ratings.toString());
            if (data?.rideInfo?.riderInfo?.completedRides) params.append('completedRides', data.rideInfo.riderInfo.completedRides.toString());

            router.push(`/dashboard/user/book-a-ride/accept-ride?${params.toString()}`);
          } catch (paramError) {
            console.error("Error building URL parameters:", paramError);
            toast.error("Failed to navigate to ride details");
          }
        }
      } catch (err) {
        console.error("Error fetching ride status:", err);
      }
    };

    const interval = setInterval(fetchRideStatus, 1000);
    return () => clearInterval(interval);
  }, [rideId, user, rideData, pickup, drop, pickupName, dropName, selectedType, appliedPromo, router]);

  // ✅ Handle Ride Request
  const handleRideRequest = useCallback(async () => {
    if (!pickup || !drop || !selectedType || !rideData?.cost) {
      toast.warning("Please complete all fields");
      return;
    }
    setIsLoading(true);
    setIsModalOpen(true);

    try {
      const parseCoords = (coord, fallback) => {
        if (coord && coord.includes(",")) {
          const [lat, lng] = coord.split(",").map(Number);
          return { type: "Point", coordinates: [lng, lat] };
        }
        return fallback;
      };

      const pickupCoords = parseCoords(
        pickup,
        currentLocation
          ? { type: "Point", coordinates: [currentLocation.lng, currentLocation.lat] }
          : { type: "Point", coordinates: [90.4125, 23.8103] }
      );

      const dropCoords = parseCoords(
        drop,
        { type: "Point", coordinates: [90.4125, 23.8103] }
      );

      const requestData = {
        userId: user?.id,
        pickup: pickupCoords,
        drop: dropCoords,
        vehicleType: selectedType,
        fare: rideData.cost,
        promoCode: appliedPromo || null,
        distance: rideData.distanceKm || null,
        pickupName: pickupName || pickup,
        dropName: dropName || drop,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Server error");

      const result = await response.json();
      setRideId(result?.rideId);
      toast.success("Ride request sent successfully!");
      
      // Initialize socket for real-time updates
      const socket = initSocket(user?.id, false);
      
      // Listen for ride status updates (optional: already using polling)
      socket.on('ride_accepted', (data) => {
        if (data.rideId === result?.rideId) {
          toast.success("Rider accepted your request!");
        }
      });
      
    } catch (error) {
      toast.error("Ride Request Failed");
      setIsModalOpen(false);
      setIsLoading(false);
      console.error(error);
    }
  }, [
    pickup,
    drop,
    selectedType,
    rideData,
    appliedPromo,
    user,
    currentLocation,
    pickupName,
    dropName,
  ]);

  // ✅ Handle Cancel Ride Request
  const handleCancelRequest = useCallback(async () => {
    if (!rideId || !user?.id) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, userId: user.id }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Ride request cancelled");
        setIsLoading(false);
        setIsModalOpen(false);
        setRideId(null);
      } else {
        toast.error(result.message || "Failed to cancel ride");
      }
    } catch (error) {
      toast.error("Failed to cancel ride request");
      console.error(error);
    }
  }, [rideId, user]);

  // ✅ Handle Location Change
  const handleLocationChange = useCallback((location, type) => {
    if (type === "pickup") {
      setPickup(location.coordinates);
      setPickupName(location.name);
      setIsCurrentLocationActive(
        currentLocation && location.coordinates === currentLocation.coordinates
      );
    } else {
      setDrop(location.coordinates);
      setDropName(location.name);
    }
  }, [currentLocation]);

  // Debug logging
  console.log('BookARideContent - pickup:', pickup, 'drop:', drop);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="md:overflow-y-auto space-y-5 custom-scrollbar">
         
          <LocationInputs 
            pickup={pickup} 
            setPickup={setPickup} 
            drop={drop} 
            setDrop={setDrop} 
            onLocationChange={handleLocationChange}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3">
            <VehicleTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />
            <PromoCodeSection
              promo={promo}
              setPromo={setPromo}
              appliedPromo={appliedPromo}
              setAppliedPromo={setAppliedPromo}
              promoError={promoError}
              setPromoError={setPromoError}
            />
          </div>
          <ConsolidatedRideCard
            pickup={pickupName || pickup}
            drop={dropName || drop}
            pickupName={pickupName}
            dropName={dropName}
            selectedType={selectedType}
            rideData={rideData}
            onRequestRide={handleRideRequest}
            isLoading={isLoading}
          />
        </div>

        <div className="h-full bg-white rounded-xl shadow-lg hidden md:block">
          <RideMap
            pickup={pickup}
            drop={drop}
            currentLocation={currentLocation}
            isCurrentLocationActive={isCurrentLocationActive}
            onLocationSelect={(location, type) => {
              if (type === "pickup") {
                setPickup(location.coordinates);
                setPickupName(location.name);
                setIsCurrentLocationActive(
                  currentLocation && location.coordinates === currentLocation.coordinates
                );
              } else {
                setDrop(location.coordinates);
                setDropName(location.name);
              }
            }}
            onCurrentLocationClick={() => {
              if (currentLocation) {
                setPickup(currentLocation.coordinates);
                setPickupName(currentLocation.name);
                setIsCurrentLocationActive(true);
                toast.success("Current location set as pickup point");
              }
            }}
          />
        </div>
      </div>

      {/* ✅ Custom Loader Modal with Cancel Button */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-card rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* Spinning Loader */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="h-24 w-24 rounded-full border-6 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin" />
                <div className="absolute text-3xl font-bold text-primary">{counter}</div>
              </div>
              
              {/* Status Text */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Finding Nearby Riders
              </h3>
              <p className="text-muted-foreground mb-6">
                Auto-cancel in <span className="font-bold text-destructive">{countdown}s</span>
              </p>
              
              {/* Cancel Button */}
              <Button
                onClick={handleCancelRequest}
                variant="destructive"
                className="w-full h-12 text-base font-semibold"
              >
                Cancel Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function BookARide() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading ride booking...</p>
        </div>
      </div>
    }>
      <BookARideContent />
    </Suspense>
  );
}