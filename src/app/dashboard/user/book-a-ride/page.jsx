"use client";
import React, { useState, useEffect } from "react";
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

const BookARide = () => {
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
  const { user } = useAuth();

  const router = useRouter();
  const baseUrl = process?.env?.NEXT_PUBLIC_SERVER_BASE_URL;

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const saved = localStorage.getItem("currentLocation");
        if (saved) {
          setCurrentLocation(JSON.parse(saved));
          return;
        }
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
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
            }
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p1 = params.get("pickup");
    const p2 = params.get("drop");
    const promoP = params.get("promo");
    const typeP = params.get("type");
    const modeP = params.get("mode");

    if (p1) setPickup(p1);
    if (p2) setDrop(p2);
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
  }, []);

  useEffect(() => {
    const fetchDistance = async () => {
      if (!pickup || !drop) {
        setRideData(null);
        return;
      }
      try {
        const type = selectedType.toLowerCase();
        const result = await calculateFare(pickup, drop, type, appliedPromo);
        setRideData(result);
      } catch (error) {
        toast.error("Fare calculation failed");
      }
    };
    fetchDistance();
  }, [pickup, drop, selectedType, appliedPromo]);

  const handleRideRequest = async () => {
    if (!pickup || !drop || !selectedType || !rideData?.cost) {
      toast.warning("Please complete all fields");
      return;
    }
    setIsLoading(true);
    const loadingToastId = toast.loading("Requesting ride...");
    try {
      let pickupCoords, dropCoords;
      if (pickup.includes(",")) {
        const [lat, lng] = pickup.split(",").map(Number);
        pickupCoords = { type: "Point", coordinates: [lng, lat] };
      } else {
        pickupCoords = currentLocation
          ? {
            type: "Point",
            coordinates: [currentLocation.lng, currentLocation.lat],
          }
          : { type: "Point", coordinates: [90.4125, 23.8103] };
      }
      if (drop.includes(",")) {
        const [lat, lng] = drop.split(",").map(Number);
        dropCoords = { type: "Point", coordinates: [lng, lat] };
      } else {
        dropCoords = { type: "Point", coordinates: [90.4125, 23.8103] };
      }

      const requestData = {
        userId: user?.id || "demo-user-id",
        pickup: pickupCoords,
        drop: dropCoords,
        vehicleType: selectedType,
        fare: rideData.cost,
        promoCode: appliedPromo || null,
        distance: rideData.distanceKm || null,
        pickupName: pickupName || pickup,
        dropName: dropName || drop,
      };

      const response = await fetch(`${baseUrl}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json"))
        throw new Error("Server returned non-JSON response.");
      const result = await response.json();
      if (response.ok) {
        toast.dismiss(loadingToastId);
        toast.success("Ride request sent successfully!");
        setTimeout(() => {
          const params = new URLSearchParams({
            pickup,
            drop,
            type: selectedType,
            promo: appliedPromo,
            fare: rideData?.cost?.toString() || "",
            distance: rideData?.distanceKm?.toString() || "",
            rideId: result.rideId || "demo-ride-id",
            riderId: result.rider?._id || "demo-rider-id",
            riderName: result.rider?.fullName || "Demo Rider",
            riderDistance: result.rider?.distance || "2 km",
            mode: mode,
          }).toString();
          router.push(`/dashboard/user/book-a-ride/searching?${params}`);
        }, 2000);
      } else {
        throw new Error(result.message || `Server error`);
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Ride Request Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Left side form scrollable */}
      <div className="md:overflow-y-auto space-y-5 custom-scrollbar">
        <ModeSelector mode={mode} setMode={setMode} />
        <LocationInputs
          pickup={pickup}
          setPickup={setPickup}
          drop={drop}
          setDrop={setDrop}
          onLocationChange={(location, type) => {
            if (type === "pickup") {
              setPickupName(location.name);
              setIsCurrentLocationActive(
                currentLocation &&
                location.coordinates === currentLocation.coordinates
              );
            } else {
              setDropName(location.name);
            }
          }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3">
          <div className="w-full flex-1">
            <VehicleTypeSelector
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </div>
          <div className="w-full flex-1">
            <PromoCodeSection
              promo={promo}
              setPromo={setPromo}
              appliedPromo={appliedPromo}
              setAppliedPromo={setAppliedPromo}
              promoError={promoError}
              setPromoError={setPromoError}
            />
          </div>
        </div>
        <ConsolidatedRideCard
          pickup={pickup}
          drop={drop}
          pickupName={pickupName}
          dropName={dropName}
          selectedType={selectedType}
          rideData={rideData}
          onRequestRide={handleRideRequest}
          isLoading={isLoading}
        />
      </div>

      {/* Right side map full height */}
      <div className="h-full bg-white rounded-xl shadow-lg hidden md:block">
        <RideMap
          pickup={pickup}
          drop={drop}
          pickupCoords={null}
          dropCoords={null}
          currentLocation={currentLocation}
          isCurrentLocationActive={isCurrentLocationActive}
          onLocationSelect={(location, type) => {
            if (type === "pickup") {
              setPickup(location.coordinates);
              setPickupName(location.name);
              setIsCurrentLocationActive(
                currentLocation &&
                location.coordinates === currentLocation.coordinates
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
  );
};

export default BookARide;
