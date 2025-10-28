"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

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
  User,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/hooks/AuthProvider";
import dynamic from "next/dynamic";
import ChatModal from "@/components/Shared/ChatModal";
import { initSocket } from "@/components/Shared/socket/socket";

// Dynamically import map component to prevent SSR issues
const RiderLiveTrackingMap = dynamic(
  () => import("./components/RiderLiveTrackingMap"),
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

function RiderAcceptRideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [liveEta, setLiveEta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [urlParams, setUrlParams] = useState({});
  const [riderLocation, setRiderLocation] = useState({
    type: "Point",
    coordinates: [90.4125, 23.8103], // Fallback to Dhaka
  });
  const [calculatedEta, setCalculatedEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  // Initialize Socket.IO for real-time updates
  useEffect(() => {
    if (!user?.id || !urlParams.rideId) return;

    try {
      const socket = initSocket(user.id, false);
      
      // Join ride-specific room
      socket.emit('join_ride', urlParams.rideId);
      console.log('Rider joined ride room:', urlParams.rideId);

      // Listen for ride status updates
      socket.on('ride_status_update', (data) => {
        console.log('Ride status update received:', data);
        if (data.rideId === urlParams.rideId) {
          toast.info(`Ride status: ${data.status}`);
          
          // Handle different status updates
          if (data.status === 'cancelled_by_user') {
            toast.error('Passenger cancelled the ride');
            router.push('/dashboard/rider/available-rides');
          } else if (data.status === 'completed') {
            toast.success('Ride completed successfully!');
            router.push('/dashboard/rider/available-rides');
          }
        }
      });

      // Listen for passenger location updates
      socket.on('passenger_location_update', (data) => {
        console.log('Passenger location update:', data);
        if (data.rideId === urlParams.rideId) {
          // Update pickup location if passenger moved
          if (data.location) {
            setPickupLocation({
              lat: data.location.lat,
              lng: data.location.lng
            });
          }
        }
      });

      // Listen for chat messages
      socket.on('ride_chat_message', (data) => {
        console.log('Chat message received:', data);
        if (data.rideId === urlParams.rideId) {
          toast.info(`New message from ${data.senderName}`);
        }
      });

      return () => {
        socket.off('ride_status_update');
        socket.off('passenger_location_update');
        socket.off('ride_chat_message');
        socket.disconnect();
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }, [user, urlParams.rideId, router]);

  // Geocoding function to convert coordinates to address
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Extract meaningful parts of the address
        const addressParts = data.display_name.split(', ');
        // Take first 3 parts for a cleaner address
        return addressParts.slice(0, 3).join(', ');
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Calculate ETA based on distance and vehicle type
  const calculateETA = (distance, vehicleType = 'bike') => {
    if (!distance || distance <= 0) return null;
    
    let avgSpeed; // Average speed in km/h
    switch (vehicleType.toLowerCase()) {
      case 'bike':
        avgSpeed = 60; // Bike average speed
        break;
      case 'car':
        avgSpeed = 80; // Car average speed
        break;
      case 'bus':
        avgSpeed = 70; // Bus average speed
        break;
      default:
        avgSpeed = 60; // Default speed
    }
    
    const timeInHours = distance / avgSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Parse pickup and drop locations from URL parameters
  useEffect(() => {
    const parseLocations = async () => {
      console.log("🔍 Rider Accept Ride - useEffect triggered, searchParams:", searchParams);
      if (!searchParams) {
        console.warn("❌ searchParams is null/undefined");
        setIsLoading(false);
        return;
      }

      try {
      // Create a safe copy of searchParams to avoid read-only issues
      const params = new URLSearchParams(searchParams.toString());
      const pickup = params.get("pickup") || "";
      const drop = params.get("drop") || "";
      
      console.log("🔍 Rider Accept Ride - URL parsing debug:", { pickup, drop, searchParams: searchParams.toString() });
      
      // Store all params in state to avoid repeated access
      const allParams = {
        pickup,
        drop,
        type: params.get("vehicleType") || "Bike",
        fare: params.get("amount") || "",
        distance: params.get("distance") || "",
        eta: params.get("arrivalTime") || "00h:00m",
        rideId: params.get("rideId") || "",
        userId: params.get("userId") || "",
        riderId: params.get("riderId") || "",
        passengerName: params.get("passengerName") || "",
        passengerEmail: params.get("passengerEmail") || "",
        passengerPhone: params.get("passengerPhone") || "",
        passengerRating: params.get("passengerRating") || "0",
        vehicleType: params.get("vehicleType") || "",
        vehicleModel: params.get("vehicleModel") || "",
        vehicleRegisterNumber: params.get("vehicleRegisterNumber") || "",
        baseFare: params.get("baseFare") || "0",
        distanceFare: params.get("distanceFare") || "0",
        timeFare: params.get("timeFare") || "0",
        tax: params.get("tax") || "0",
        total: params.get("total") || "0",
        mode: params.get("mode") || "auto",
        promo: params.get("promo") || ""
      };
      
      setUrlParams(allParams);
      
      // Parse pickup location - handle both coordinates and address
      if (pickup) {
        const coords = pickup.split(",");
        console.log("📍 Rider Accept Ride - Pickup coords:", coords);
        
        // Check if it's coordinates (lat,lng) or address string
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          console.log("📍 Rider Accept Ride - Parsed pickup coordinates:", { lat, lng });
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            setPickupLocation({ lat, lng });
            console.log("✅ Rider Accept Ride - Pickup location set from coordinates:", { lat, lng });
            
            // Convert coordinates to address
            const address = await reverseGeocode(lat, lng);
            setPickupAddress(address);
            console.log("✅ Rider Accept Ride - Pickup address:", address);
          } else {
            console.warn("❌ Rider Accept Ride - Invalid pickup coordinates:", { lat, lng });
          }
        } else {
          // It's an address string, use geocoding
          console.log("📍 Rider Accept Ride - Converting address to coordinates:", pickup);
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              setPickupLocation({ lat, lng });
              setPickupAddress(pickup); // Use the original address string
              console.log("✅ Rider Accept Ride - Pickup location set from geocoding:", { lat, lng });
            } else {
              console.warn("❌ Rider Accept Ride - No coordinates found for address:", pickup);
            }
          } catch (error) {
            console.error("❌ Rider Accept Ride - Geocoding failed:", error);
          }
        }
      } else {
        console.warn("❌ Rider Accept Ride - No pickup parameter:", pickup);
      }
      
      // Parse drop location
      if (drop && drop.includes(",")) {
        const coords = drop.split(",");
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            setDropLocation({ lat, lng });
            
            // Convert coordinates to address
            const address = await reverseGeocode(lat, lng);
            setDropAddress(address);
            console.log("✅ Rider Accept Ride - Drop address:", address);
          }
        }
      } else if (drop) {
        // It's an address string
        setDropAddress(drop);
        console.log("✅ Rider Accept Ride - Drop address set from string:", drop);
      }
    } catch (error) {
      console.error('Rider Accept Ride - Error parsing URL parameters:', error);
      toast.error('Failed to load ride details', {
        description: 'Please try accepting a new ride'
      });
    } finally {
      setIsLoading(false);
    }
    };

    parseLocations();
  }, [searchParams]);

  // Fetch rider's real-time location
  useEffect(() => {
    const fetchRiderLocation = async () => {
      try {
        if (!urlParams.riderId) return;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/${urlParams.riderId}`);
        if (response.ok) {
          const riderData = await response.json();
          if (riderData.location && riderData.location.coordinates) {
            setRiderLocation(riderData.location);
            console.log('Rider Accept Ride - Rider location updated:', riderData.location.coordinates);
            
            // Calculate ETA if pickup location is available
            if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
              const calculatedDistance = calculateDistance(
                riderData.location.coordinates[1], // lat
                riderData.location.coordinates[0], // lng
                pickupLocation.lat,
                pickupLocation.lng
              );
              const eta = calculateETA(calculatedDistance, urlParams.vehicleType || 'bike');
              setCalculatedEta(eta);
              setDistance(calculatedDistance);
              console.log('📏 Rider Accept Ride - Distance & ETA calculated:', { distance: calculatedDistance.toFixed(2) + ' km', eta });
            }
          }
        }
      } catch (error) {
        console.error('Rider Accept Ride - Failed to fetch rider location:', error);
      }
    };

    // Fetch immediately and then every 5 seconds
    fetchRiderLocation();
    const interval = setInterval(fetchRiderLocation, 5000);

    return () => clearInterval(interval);
  }, [urlParams.riderId, pickupLocation]);

  // Early return if still loading or searchParams is not available
  if (isLoading || !searchParams) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-card to-background px-4 py-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading ride details...</p>
        </div>
      </div>
    );
  }

  // Extract ride details from URL query parameters with safe fallbacks
  const {
    pickup = "",
    drop = "",
    type = "Bike",
    fare = "",
    urlDistance = "",
    eta = "00h:00m",
    rideId = "",
    userId = "",
    riderId = "",
    passengerName = "",
    passengerEmail = "",
    passengerPhone = "",
    passengerRating = "0",
    vehicleType = "",
    vehicleModel = "",
    vehicleRegisterNumber = "",
    baseFare = "0",
    distanceFare = "0",
    timeFare = "0",
    tax = "0",
    total = "0",
    mode = "auto",
    promo = ""
  } = urlParams;

  // Set vehicle icon
  const VehicleIcon = rideTypeIcon[type] || Bike;

  const passengerInfo = {
    fullName: passengerName || "N/A",
    email: passengerEmail || "",
    phone: passengerPhone || "",
    rating: parseFloat(passengerRating) || 0,
    status: "Waiting for pickup",
  };

  // ✅ Start Ride Handler
  const handleStartRide = async () => {
    if (!rideId || !riderId) {
      toast.error("Missing ride information");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/start-ride`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        toast.success("Ride started successfully!");
        // Navigate to ongoing ride page or update UI
        router.push(`/dashboard/rider/ongoing-ride?rideId=${rideId}`);
      } else {
        toast.error(result.message || "Failed to start ride");
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      toast.error("Failed to start ride. Please try again.");
    }
  };

  // ✅ Cancel Ride Handler
  const handleCancelRide = async () => {
    if (!rideId || !riderId) {
      toast.error("Missing ride information");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/ride-cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        toast.success("Ride cancelled successfully");
        // Redirect back to available rides
        router.push("/dashboard/rider/available-rides");
      } else {
        toast.error(result.message || "Failed to cancel ride");
      }
    } catch (error) {
      console.error("Error cancelling ride:", error);
      toast.error("Failed to cancel ride. Please try again.");
    }
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
                  <h2 className="text-xl font-bold">
                    {calculatedEta ? `Pickup passenger in ${calculatedEta}` : liveEta ? `Pickup passenger in ${liveEta}` : eta ? `Pickup passenger in ${eta}` : `Ready to pickup ${type} passenger`}
                  </h2>
                  <p className="text-background text-sm">
                    {calculatedEta || liveEta || eta ? "Navigate to pickup location" : "Track your ride in real-time"}
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
                  {liveEta || eta}
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
            {/* Passenger Info Section */}
            <div className="border border-border rounded-xl bg-gradient-to-br from-card to-background p-6 space-y-6">
              {/* Passenger Profile */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                {passengerInfo ? (
                  <>
                    <Avatar className="w-20 h-20 border-4 border-primary shadow-lg">
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                        {passengerInfo.fullName?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-3xl font-bold text-foreground mb-1 uppercase">
                        {passengerInfo.fullName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white">
                          {passengerInfo.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{passengerInfo.rating.toFixed(1)}</span>
                        </div>
                      </div>
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

              {/* Location Details */}
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
                        {pickupAddress || pickup || "Setting pickup..."}
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
                        {dropAddress || drop || "Setting destination..."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 space-y-3">
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
                        {vehicleType || type}
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
                        {vehicleModel || "Unknown Model"}
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
                        {vehicleRegisterNumber || "N/A"}
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
                   Chat with {passengerInfo.fullName.split(" ")[0]}
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
                  onClick={handleStartRide}
                  variant="default"
                  className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Start Ride
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
                  <RiderLiveTrackingMap
                    rideId={rideId}
                    riderInfo={{ location: riderLocation }}
                    vehicleType={type}
                    pickupLocation={pickupLocation}
                    dropLocation={dropLocation}
                    onEtaUpdate={setLiveEta}
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
                      <p className="text-xs text-muted-foreground mb-1">Distance to Pickup</p>
                      <p className="text-xl font-bold text-primary uppercase">
                        {calculatedEta ? `${distance?.toFixed(1) || '0.0'} km` : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-6 h-6 text-primary mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">ETA to Pickup</p>
                      <p className="text-xl font-bold text-primary uppercase">
                        {calculatedEta || eta || "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
        riderName={passengerInfo.fullName}
        riderVehicle={`${vehicleType || type} - ${vehicleRegisterNumber || "N/A"}`}
        rideId={rideId}
        riderId={riderId}
      />
    </div>
  );
}

export default function RiderAcceptRide() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center bg-gradient-to-br from-card to-background px-4 py-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading ride details...</p>
        </div>
      </div>
    }>
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center bg-gradient-to-br from-card to-background px-4 py-10">
          <div className="text-center">
            <p className="text-sm text-red-500">Error loading ride details. Please try again.</p>
          </div>
        </div>
      }>
        <RiderAcceptRideContent />
      </ErrorBoundary>
    </Suspense>
  );
}
