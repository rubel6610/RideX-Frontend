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

function OngoingRideContent() {
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
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  // Initialize Socket.IO for real-time chat notifications
  useEffect(() => {
    if (!user?.id || !urlParams.rideId) return;

    try {
      const socket = initSocket(user.id, false);
      
      // ✅ Handle socket connection errors
      socket.on('connect_error', (error) => {
        console.warn('⚠️ Socket connection error (will retry):', error.message);
        // Don't show toast, socket will auto-retry
      });

      socket.on('error', (error) => {
        console.warn('⚠️ Socket error:', error);
      });
      
      // Join ride chat room
      socket.emit('join_ride_chat', {
        rideId: urlParams.rideId,
        userId: user.id,
        userType: 'user'
      });
      console.log('✅ User joined ride chat room:', urlParams.rideId);

      // Listen for chat messages from rider (auto-open chat modal)
      socket.on('receive_ride_message', (data) => {
        console.log('Chat message received in ongoing-ride:', data);
        if (data.rideId === urlParams.rideId && data.message.senderType === 'rider') {
          // Auto-open chat modal when rider sends message
          setIsChatOpen(true);
          toast.info('New message from rider', {
            description: data.message.text.substring(0, 50) + (data.message.text.length > 50 ? "..." : ""),
            duration: 3000,
          });
        }
      });

      // Also listen for new_message_notification (when rider sends from ongoing-ride)
      socket.on('new_message_notification', (data) => {
        console.log('New message notification received:', data);
        if (data.rideId === urlParams.rideId) {
          // Auto-open chat modal when rider sends message
          setIsChatOpen(true);
          toast.info('New message from rider', {
            description: data.message || "You have a new message",
            duration: 3000,
          });
        }
      });

      // 🔥 Listen for ride status changes (completed/cancelled)
      socket.on('ride_status_changed', (data) => {
        console.log('Ride status changed:', data);
        if (data.rideId === urlParams.rideId) {
          toast.info(`Ride status: ${data.status}`);
          
          // Handle different status updates
          if (data.status === 'cancelled_by_rider' || data.status === 'cancelled') {
            toast.error('Ride cancelled by rider');
            clearStoredRide(urlParams.rideId);
            router.push('/dashboard/user/book-a-ride');
          } else if (data.status === 'completed') {
            toast.success('Ride completed successfully!');
            clearStoredRide(urlParams.rideId);
            // Navigate to payment page
            handleCompleteRide();
          }
        }
      });

      return () => {
        socket.off('receive_ride_message');
        socket.off('new_message_notification');
        socket.off('ride_status_changed');
        socket.off('connect_error');
        socket.off('error');
        socket.emit('leave_ride_chat', {
          rideId: urlParams.rideId,
          userId: user.id,
          userType: 'user'
        });
      };
    } catch (error) {
      console.warn('⚠️ Socket initialization error:', error.message);
      // Don't crash the app, socket features will just be unavailable
    }
  }, [user, urlParams.rideId]);

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
      case 'cng':
        avgSpeed = 70; // cng average speed
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

  // 🔥 Load ride params from localStorage or URL
  const loadRideParams = () => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') return null;
      
      // First, try to get from URL params
      if (searchParams) {
        const params = new URLSearchParams(searchParams.toString());
        const rideId = params.get("rideId");
        
        if (rideId) {
          // ✅ Save to localStorage for future use (USER END)
          const allParams = Object.fromEntries(params.entries());
          localStorage.setItem(`user_ongoing_ride_${rideId}`, JSON.stringify(allParams));
          console.log('✅ Saved ride data to localStorage:', rideId);
          return params;
        }
      }
      
      // If no URL params, check localStorage
      const storedRides = Object.keys(localStorage).filter(key => key.startsWith('user_ongoing_ride_'));
      
      if (storedRides.length > 0) {
        // Get the most recent ride (last key)
        const latestRideKey = storedRides[storedRides.length - 1];
        const storedParams = JSON.parse(localStorage.getItem(latestRideKey) || '{}');
        
        if (storedParams.rideId) {
          console.log('✅ Loaded ride data from localStorage:', storedParams.rideId);
          // Create URLSearchParams from stored data
          const params = new URLSearchParams();
          Object.entries(storedParams).forEach(([key, value]) => {
            if (value) params.set(key, value);
          });
          return params;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading ride params:', error);
      return null;
    }
  };

  // 🔥 Fetch ongoing ride from backend if no params available
  const fetchOngoingRideFromBackend = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user-rides/${userId}`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      const rides = data?.rides || [];
      
      // Find accepted or ongoing ride
      const ongoingRide = rides.find(ride => 
        (ride.status === 'accepted' || ride.status === 'pending' || ride.status === 'started')
      );
      
      if (!ongoingRide) {
        return null;
      }
      
      // Fetch rider info
      const riderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/${ongoingRide.riderId}`
      );
      const riderData = await riderResponse.ok ? await riderResponse.json() : null;
      
      // Construct params from backend data
      const pickupCoords = ongoingRide.pickup?.coordinates || [];
      const dropCoords = ongoingRide.drop?.coordinates || [];
      
      const params = new URLSearchParams();
      params.set('rideId', ongoingRide._id || '');
      params.set('userId', userId || '');
      params.set('riderId', ongoingRide.riderId || '');
      params.set('amount', (ongoingRide.fare || 0).toString());
      params.set('vehicleType', ongoingRide.vehicleType || 'Bike');
      params.set('distance', (ongoingRide.distance || 0).toString());
      params.set('arrivalTime', '00h:00m');
      
      if (pickupCoords.length === 2) {
        params.set('pickup', `${pickupCoords[1]},${pickupCoords[0]}`);
      }
      
      if (dropCoords.length === 2) {
        params.set('drop', `${dropCoords[1]},${dropCoords[0]}`);
      }
      
      params.set('riderName', riderData?.fullName || 'Unknown Rider');
      params.set('riderEmail', riderData?.email || '');
      params.set('vehicleModel', riderData?.vehicleModel || '');
      params.set('vehicleRegisterNumber', riderData?.vehicleRegisterNumber || '');
      params.set('ratings', (riderData?.ratings || 0).toString());
      params.set('completedRides', (riderData?.completedRides || 0).toString());
      params.set('baseFare', '0');
      params.set('distanceFare', '0');
      params.set('timeFare', '0');
      params.set('tax', '0');
      params.set('total', (ongoingRide.fare || 0).toString());
      params.set('mode', 'auto');
      params.set('promo', ongoingRide.promoCode || '');
      
      // ✅ Save to localStorage (browser only)
      const rideId = ongoingRide._id;
      if (rideId && typeof window !== 'undefined') {
        localStorage.setItem(`user_ongoing_ride_${rideId}`, JSON.stringify(Object.fromEntries(params.entries())));
        console.log('✅ Saved ride data from backend to localStorage:', rideId);
      }
      
      return params;
    } catch (error) {
      console.error('Error fetching ongoing ride from backend:', error);
      return null;
    }
  };

  // 🔥 Clear localStorage when ride is cancelled/completed
  const clearStoredRide = (rideId) => {
    try {
      if (typeof window === 'undefined') return;
      
      if (!rideId) {
        console.warn('⚠️ clearStoredRide: No rideId provided');
        return;
      }
      
      const key = `user_ongoing_ride_${rideId}`;
      console.log('🗑️ Attempting to clear localStorage:', key);
      
      // Check if key exists before removing
      const existingData = localStorage.getItem(key);
      if (existingData) {
        localStorage.removeItem(key);
        console.log('✅ Successfully cleared ride data from localStorage:', rideId);
      } else {
        console.warn('⚠️ No data found in localStorage for key:', key);
      }
      
      // Also clear any old keys (cleanup)
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('user_ongoing_ride_')) {
          console.log('🧹 Cleaning up old key:', k);
          localStorage.removeItem(k);
        }
      });
      
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }
  };

  // Parse pickup and drop locations from URL parameters
  useEffect(() => {
    const parseLocations = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        let params = loadRideParams();
        
        // If no params from URL or localStorage, try fetching from backend
        if (!params) {
          params = await fetchOngoingRideFromBackend(user.id);
        }
        
        // If still no params, show no ongoing ride message
        if (!params) {
          setIsLoading(false);
          toast.info("No ongoing ride", {
            description: "You don't have any active rides at the moment."
          });
          // Redirect to book-a-ride after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/user/book-a-ride");
          }, 2000);
          return;
        }
        
      const pickup = params.get("pickup") || "";
      const drop = params.get("drop") || "";
      
      
      
      
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
        riderName: params.get("riderName") || "",
        riderEmail: params.get("riderEmail") || "",
        vehicleType: params.get("vehicleType") || "",
        vehicleModel: params.get("vehicleModel") || "",
        vehicleRegisterNumber: params.get("vehicleRegisterNumber") || "",
        completedRides: params.get("completedRides") || "0",
        ratings: params.get("ratings") || "0",
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
        
        // Check if it's coordinates (lat,lng) or address string
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            setPickupLocation({ lat, lng });
            
            // Convert coordinates to address
            const address = await reverseGeocode(lat, lng);
            setPickupAddress(address);
          } else {
            console.warn("❌ Invalid pickup coordinates:", { lat, lng });
          }
        } else {
          // It's an address string, use geocoding
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              setPickupLocation({ lat, lng });
              setPickupAddress(pickup); // Use the original address string
            } else {
              console.warn("❌ No coordinates found for address:", pickup);
            }
          } catch (error) {
            console.error("❌ Geocoding failed:", error);
          }
        }
      } else {
        console.warn("❌ No pickup parameter:", pickup);
      }
      
      // Parse drop location
      if (drop && drop.includes(",")) {
        const coords = drop.split(",");
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            setDropLocation({ lat, lng });
          }
        }
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      toast.error('Failed to load ride details', {
        description: 'Please try booking a new ride'
      });
    } finally {
      setIsLoading(false);
    }
    };

    parseLocations();
  }, [searchParams, user]);

  // 🔥 CRITICAL: Poll ride status to check if cancelled by rider (Hybrid Approach)
  useEffect(() => {
    if (!urlParams.rideId) return;

    const checkRideStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${urlParams.rideId}`);
        if (response.ok) {
          const rideData = await response.json();
          
          // Check if ride was cancelled by rider
          if (rideData.status === 'cancelled_by_rider' || rideData.status === 'cancelled') {
            console.log('🔍 Polling detected: Ride cancelled by rider');
            toast.error('Ride cancelled by rider');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/user/book-a-ride');
            }, 1000);
          }
          // Check if ride was completed
          else if (rideData.status === 'completed') {
            console.log('🔍 Polling detected: Ride completed');
            toast.success('Ride completed successfully!');
            clearStoredRide(urlParams.rideId);
            // Navigate to payment
            handleCompleteRide();
          }
        }
      } catch (error) {
        console.warn('⚠️ Ride status check error:', error.message);
      }
    };

    //  Check every 3 seconds
    const statusInterval = setInterval(checkRideStatus, 3000);
    checkRideStatus(); // Check immediately

    return () => clearInterval(statusInterval);
  }, [urlParams.rideId, router]);

  // Fetch rider's real-time location
  useEffect(() => {
    const fetchRiderLocation = async () => {
      try {
        // ✅ Validate riderId before fetching
        if (!urlParams.riderId || urlParams.riderId === 'undefined' || urlParams.riderId === 'null') {
          console.warn('⚠️ No valid riderId available for location fetch');
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/${urlParams.riderId}`);
        if (response.ok) {
          const riderData = await response.json();
          if (riderData.location && riderData.location.coordinates) {
            setRiderLocation(riderData.location);
            
            // Calculate ETA if pickup location is available
            if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
              const distance = calculateDistance(
                riderData.location.coordinates[1], // lat
                riderData.location.coordinates[0], // lng
                pickupLocation.lat,
                pickupLocation.lng
              );
              const eta = calculateETA(distance, urlParams.vehicleType || 'bike');
              setCalculatedEta(eta);
            }
          }
        } else {
          console.warn('⚠️ Failed to fetch rider location, status:', response.status);
        }
      } catch (error) {
        console.warn('⚠️ Rider location fetch error (will retry):', error.message);
        // Don't show error toast, just log and continue
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
    distance = "",
    eta = "00h:00m",
    rideId = "",
    userId = "",
    riderId = "",
    riderName = "",
    riderEmail = "",
    vehicleType = "",
    vehicleModel = "",
    vehicleRegisterNumber = "",
    completedRides = "0",
    ratings = "0",
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

  const riderInfo = {
    fullName: riderName || "N/A",
    email: riderEmail || "",
    vehicleType: vehicleType || type,
    vehicleModel: vehicleModel || "Unknown Model",
    vehicleRegisterNumber: vehicleRegisterNumber || "N/A",
    status: "On the way",
    location: riderLocation,
  };

  

  //  Updated Complete Ride Handler with enhanced error protection
  const handleCompleteRide = () => {
    try {
      // 🔥 Clear localStorage before navigating to payment
      clearStoredRide(rideId);
      
      // Create new URLSearchParams object from scratch
      const queryParams = new URLSearchParams();
      
      // Add parameters one by one with safe string conversion
      const safeAppend = (key, value) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      };

      safeAppend('rideId', rideId);
      safeAppend('userId', userId);
      safeAppend('riderId', riderId);
      safeAppend('ratings', ratings);
      safeAppend('riderName', riderName);
      safeAppend('riderEmail', riderEmail);
      safeAppend('pickup', pickup);
      safeAppend('drop', drop);
      safeAppend('vehicleType', type);
      safeAppend('vehicleModel', vehicleModel);
      safeAppend('vehicleRegisterNumber', vehicleRegisterNumber);
      safeAppend('distance', distance);
      safeAppend('baseFare', baseFare);
      safeAppend('distanceFare', distanceFare);
      safeAppend('timeFare', timeFare);
      safeAppend('tax', tax);
      safeAppend('total', total);
      safeAppend('promo', promo);
      safeAppend('fare', fare);
      safeAppend('arrivalTime', eta);
      safeAppend('completedRides', completedRides);
      safeAppend('mode', mode);

      const queryString = queryParams.toString();
      router.push(`/dashboard/user/payment?${queryString}`);
    } catch (error) {
      console.error('Error creating payment URL:', error);
      toast.error('Navigation error', {
        description: 'Failed to proceed to payment. Please try again.'
      });
      // Fallback: try navigation with minimal params
      try {
        router.push(`/dashboard/user/payment?rideId=${rideId}&userId=${userId}`);
      } catch (fallbackError) {
        console.error('Fallback navigation failed:', fallbackError);
        router.push('/dashboard/user/payment');
      }
    }
  };

  //  Updated Cancel Ride Handler
  const handleCancelRide = async () => {
    if (!rideId || !userId) {
      toast.error("Missing ride information");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, userId }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        toast.success("Ride cancelled successfully");
        // 🔥 Clear localStorage
        clearStoredRide(rideId);
        // Redirect back to book a ride
        router.push("/dashboard/user/book-a-ride");
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
                    {calculatedEta ? `Your captain is on the way to pickup (${calculatedEta})` : liveEta ? `Your captain is on the way to pickup (${liveEta})` : eta ? `Your captain is on the way to pickup (${eta})` : `Your ${type} is on the way`}
                  </h2>
                  <p className="text-background text-sm">
                    {calculatedEta || liveEta || eta ? "Captain will reach your pickup location soon" : "Track your ride in real-time"}
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
        rideId={rideId}
        riderId={riderId}
      />
    </div>
  );
}

export default function OngoingRide() {
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
        <OngoingRideContent />
      </ErrorBoundary>
    </Suspense>
  );
}
