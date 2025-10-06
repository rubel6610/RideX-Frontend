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
import { useAuth } from "@/app/hooks/AuthProvider";


const BookARide = () => {
  // Main state management
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
  const {user}=useAuth();

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  // Get current location and set as default pickup
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        // Check if current location is saved in localStorage
        const savedCurrentLocation = localStorage.getItem('currentLocation');
        if (savedCurrentLocation) {
          const location = JSON.parse(savedCurrentLocation);
          setCurrentLocation(location);
          setPickup(location.coordinates);
          setPickupName(location.name);
          setIsCurrentLocationActive(true);
          return;
        }

        // Get current location from browser
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                // Reverse geocode to get location name
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const data = await response.json();
                const locationName = data.display_name || `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                
                const locationData = {
                  coordinates: `${latitude},${longitude}`,
                  name: locationName,
                  lat: latitude,
                  lng: longitude
                };
                
                setCurrentLocation(locationData);
                setPickup(locationData.coordinates);
                setPickupName(locationData.name);
                setIsCurrentLocationActive(true);
                
                // Save to localStorage
                localStorage.setItem('currentLocation', JSON.stringify(locationData));
              } catch (error) {
                console.error('Error getting location name:', error);
                // Fallback location
                const fallbackLocation = {
                  coordinates: `${latitude},${longitude}`,
                  name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                  lat: latitude,
                  lng: longitude
                };
                setCurrentLocation(fallbackLocation);
                setPickup(fallbackLocation.coordinates);
                setPickupName(fallbackLocation.name);
                setIsCurrentLocationActive(true);
                localStorage.setItem('currentLocation', JSON.stringify(fallbackLocation));
              }
            },
            (error) => {
              console.error('Error getting current location:', error);
              // Set default Dhaka location
              const defaultLocation = {
                coordinates: "23.8103,90.4125",
                name: "Dhaka, Bangladesh",
                lat: 23.8103,
                lng: 90.4125
              };
              setCurrentLocation(defaultLocation);
              setPickup(defaultLocation.coordinates);
              setPickupName(defaultLocation.name);
              setIsCurrentLocationActive(true);
              localStorage.setItem('currentLocation', JSON.stringify(defaultLocation));
            }
          );
        }
      } catch (error) {
        console.error('Error in getCurrentLocation:', error);
      }
    };

    getCurrentLocation();
  }, []);

  // URL Parameters Handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Create a new URLSearchParams instance to avoid read-only issues
        const searchParams = new URLSearchParams(window.location.search);
        
        // Auto-fill from URL parameters
        const pickupParam = searchParams.get("pickup");
        const dropParam = searchParams.get("drop");
        const promoParam = searchParams.get("promo");
        const typeParam = searchParams.get("type");
        const modeParam = searchParams.get("mode");

        if (pickupParam) {
          setPickup(pickupParam);
        }
        if (dropParam) {
          setDrop(dropParam);
        }
        if (promoParam) {
          setPromo(promoParam);
          setAppliedPromo(promoParam);
        }
        if (typeParam) {
          setSelectedType(typeParam);
        }
        if (modeParam) {
          setMode(modeParam);
        }

        // Show success message if coming from URL
        if (pickupParam || dropParam) {
          toast.success("Route loaded from URL", {
            description: "Your route has been automatically filled from the link.",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error parsing URL parameters:", error);
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
      // Prepare coordinates from map data
      let pickupCoords, dropCoords;
      
      // Parse pickup coordinates
      if (pickup.includes(',')) {
        const [lat, lng] = pickup.split(',').map(Number);
        pickupCoords = { 
          type: 'Point', 
          coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
        };
      } else {
        // Fallback to current location if no coordinates
        pickupCoords = currentLocation ? {
          type: 'Point',
          coordinates: [currentLocation.lng, currentLocation.lat]
        } : { 
          type: 'Point', 
          coordinates: [90.4125, 23.8103] // Default Dhaka
        };
      }
      
      // Parse dropoff coordinates
      if (drop.includes(',')) {
        const [lat, lng] = drop.split(',').map(Number);
        dropCoords = { 
          type: 'Point', 
          coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
        };
      } else {
        dropCoords = { 
          type: 'Point', 
          coordinates: [90.4125, 23.8103] // Default Dhaka
        };
      }

      const requestData = {
        userId: user?.id || "demo-user-id", // Use actual user ID from auth context
        pickup: pickupCoords,
        drop: dropCoords,
        vehicleType: selectedType,
        fare: rideData.cost,
        promoCode: appliedPromo || null,
        distance: rideData.distanceKm || null,
        pickupName: pickupName || pickup,
        dropName: dropName || drop,
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
      console.log("Ride request result:", result);
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
                // Check if pickup is different from current location
                setIsCurrentLocationActive(
                  currentLocation && 
                  location.coordinates === currentLocation.coordinates
                );
                  } else {
                setDropName(location.name);
              }
            }}
          />


          {/* Vehicle Type and Promo Code Row */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <VehicleTypeSelector 
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            </div>
            <div className="flex-1">
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
            currentLocation={currentLocation}
            isCurrentLocationActive={isCurrentLocationActive}
            onLocationSelect={(location, type) => {
              if (type === 'pickup') {
                setPickup(location.coordinates);
                setPickupName(location.name);
                // Check if pickup is different from current location
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
    </div>
  );
};

export default BookARide;