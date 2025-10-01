"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { calculateFare } from "@/components/Shared/fareCalculator";

// Import all components
import ModeSelector from "./components/ModeSelector";
import LocationInputs from "./components/LocationInputs";
import PromoCodeSection from "./components/PromoCodeSection";
import VehicleTypeSelector from "./components/VehicleTypeSelector";
import ConsolidatedRideCard from "./components/ConsolidatedRideCard";
import RideMap from "./components/RideMap";


const BookARide = () => {
  // Main state management
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupName, setPickupName] = useState("");
  const [dropName, setDropName] = useState("");
  const [selectedType, setSelectedType] = useState("Bike");
  const [mode, setMode] = useState("auto");
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const [rideData, setRideData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  // URL Parameters Handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      
      // Auto-fill from URL parameters
      if (params.get("pickup")) {
        setPickup(params.get("pickup"));
      }
      if (params.get("drop")) {
        setDrop(params.get("drop"));
      }
      if (params.get("promo")) {
        const urlPromo = params.get("promo");
        setPromo(urlPromo);
        setAppliedPromo(urlPromo);
      }
      if (params.get("type")) {
        setSelectedType(params.get("type"));
      }
      if (params.get("mode")) {
        setMode(params.get("mode"));
      }

      // Show success message if coming from URL
      if (params.get("pickup") || params.get("drop")) {
        toast.success("Route loaded from URL", {
          description: "Your route has been automatically filled from the link.",
          duration: 3000,
        });
      }
    }
  }, []);

  // Fare calculation when locations or vehicle type changes
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
      console.log("Ride Data:", result);
      } catch (error) {
        console.error("Fare calculation error:", error);
        toast.error("Fare calculation failed", {
          description: "Unable to calculate fare. Please try again.",
        });
      }
    };

    fetchDistance();
  }, [pickup, drop, selectedType, appliedPromo]);

  // Main ride request handler
  const handleRideRequest = async () => {
    if (!pickup || !drop || !selectedType || !rideData?.cost) {
      toast.warning("Please complete all fields", {
        description: "Pickup location, drop location, vehicle type and fare must be selected.",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    // Show loading toast
    const loadingToastId = toast.loading("Requesting ride...", {
      description: "Please wait while we find the best rider for you.",
    });

    try {
      // Prepare coordinates
      const pickupCoords = pickup.includes(',') ? 
        { type: 'Point', coordinates: pickup.split(',').map(Number).reverse() } : 
        { type: 'Point', coordinates: [90.4125, 23.8103] }; // Default Dhaka coordinates
      
      const dropCoords = drop.includes(',') ? 
        { type: 'Point', coordinates: drop.split(',').map(Number).reverse() } : 
        { type: 'Point', coordinates: [90.4125, 23.8103] }; // Default Dhaka coordinates

      const requestData = {
        userId: "user123", // Replace with actual user ID from auth context
        pickup: pickupCoords,
        drop: dropCoords,
        vehicleType: selectedType,
        fare: rideData.cost,
        promoCode: appliedPromo || null,
        distance: rideData.distanceKm || null,
      };

      console.log("Sending ride request:", requestData);

      // API call to backend
      const response = await fetch(`${baseUrl}/api/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if the API endpoint is correct.');
      }

      const result = await response.json();

      if (response.ok) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToastId);
        toast.success("Ride request sent successfully!", {
          description: "We're finding the best rider for you. Please wait...",
          duration: 3000,
        });

        // Redirect to confirmation/searching page
        setTimeout(() => {
          const params = new URLSearchParams({
            pickup,
            drop,
            type: selectedType,
            promo: appliedPromo,
            fare: rideData?.cost?.toString() || '',
            distance: rideData?.distanceKm?.toString() || '',
            rideId: result.rideId || 'demo-ride-id',
            riderId: result.rider?._id || 'demo-rider-id',
            riderName: result.rider?.fullName || 'Demo Rider',
            riderDistance: result.rider?.distance || '2 km',
            mode: mode
          }).toString();
          
          router.push(`/dashboard/user/book-a-ride/searching?${params}`);
        }, 2000);
      } else {
        throw new Error(result.message || `Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Ride request error:', error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      
      if (error.message.includes('non-JSON response')) {
        toast.error("API Endpoint Error", {
          description: "The ride request API endpoint is not available. Please contact support or try again later.",
          duration: 6000,
        });
      } else if (error.message.includes('Failed to fetch')) {
        toast.error("Network Error", {
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Ride Request Failed", {
          description: error.message || "Something went wrong. Please try again.",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent/20 p-4">
      <style jsx>{`
        .hidden-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        .hidden-scrollbar::-webkit-scrollbar {
          display: none; /* WebKit */
        }
      `}</style>
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 h-screen">
        
        {/* Left Column - Main Booking Form */}
        <div className="space-y-4 overflow-y-auto pr-2 hidden-scrollbar">

          {/* Mode Selector */}
          <ModeSelector mode={mode} setMode={setMode} />

          {/* Location Inputs */}
          <LocationInputs 
            pickup={pickup}
            setPickup={setPickup}
            drop={drop}
            setDrop={setDrop}
            onLocationChange={(location, type) => {
              console.log('Location changed:', { location, type });
              // Store location name separately for display
              if (type === 'pickup') {
                setPickupName(location.name);
              } else {
                setDropName(location.name);
              }
            }}
          />

          {/* Promo Code Section */}
          <PromoCodeSection 
            promo={promo}
            setPromo={setPromo}
            appliedPromo={appliedPromo}
            setAppliedPromo={setAppliedPromo}
            promoError={promoError}
            setPromoError={setPromoError}
          />

          {/* Vehicle Type Selector */}
          <VehicleTypeSelector 
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Consolidated Ride Card */}
          <ConsolidatedRideCard 
            pickup={pickup}
            drop={drop}
            selectedType={selectedType}
            rideData={rideData}
            onRequestRide={handleRideRequest}
            isLoading={isLoading}
          />
          </div>

        {/* Right Column - Interactive Map */}
        <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
          <RideMap 
            pickup={pickup}
            drop={drop}
            pickupCoords={null}
            dropCoords={null}
            onLocationSelect={(location, type) => {
              if (type === 'pickup') {
                setPickup(location);
              } else {
                setDrop(location);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookARide;