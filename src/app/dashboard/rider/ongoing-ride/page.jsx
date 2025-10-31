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
  Search,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/hooks/AuthProvider";
import dynamic from "next/dynamic";
import ChatModal from "@/components/Shared/ChatModal";
import { initSocket } from "@/components/Shared/socket/socket";

// Dynamically import map component to prevent SSR issues
const RiderLiveTrackingMap = dynamic(
  () => import("../ongoing-ride/components/RideLiveTrackingMap"),
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

// No Ongoing Ride Component for Rider
function NoOngoingRide({ onViewRides }) {
  return (
    <div className="flex items-center justify-center min-h-[600px] p-4">
      <div className="text-center max-w-md">
        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Animated background circles */}
          <div className="absolute w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping"></div>

          {/* Icon */}
          <div className="relative bg-primary p-6 rounded-full shadow-lg">
            <Car className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-3">
          No Ongoing Ride
        </h2>

        <p className="text-muted-foreground text-lg mb-8">
          You don't have any active rides at the moment.
          <br />
          Check available ride requests to start earning!
        </p>

        <div className="space-y-3">
          <Button
            onClick={onViewRides}
            className="w-full h-12 text-base font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            View Available Rides
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Browse nearby ride requests and start your journey
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Bike className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Bike</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">CAR</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <BusFront className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">CNG</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OngoingRideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [liveEta, setLiveEta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoRide, setHasNoRide] = useState(false);
  const [urlParams, setUrlParams] = useState({});
  const [riderLocation, setRiderLocation] = useState(null);
  const [calculatedEta, setCalculatedEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [rideStatus, setRideStatus] = useState("accepted"); // Track ride status

  // Initialize Socket.IO for real-time updates
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

      // Join ride-specific room
      socket.emit('join_ride', urlParams.rideId);
      // 🔥 Listen for ride status updates (when user cancels/completes)
      socket.on('ride_status_update', (data) => {
        if (data.rideId === urlParams.rideId) {
          toast.info(`Ride status: ${data.status}`);

          // Handle different status updates
          if (data.status === 'cancelled_by_user' || data.status === 'cancelled') {
            toast.error('Ride cancelled by user');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/rider/available-rides');
            }, 1000);
          } else if (data.status === 'completed') {
            toast.success('Ride completed successfully!');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/rider/available-rides');
            }, 1000);
          }
        }
      });

      // 🔥 Also listen for ride_status_changed (alternative event)
      socket.on('ride_status_changed', (data) => {
        if (data.rideId === urlParams.rideId) {
          toast.info(`Ride status: ${data.status}`);

          if (data.status === 'cancelled_by_user' || data.status === 'cancelled') {
            toast.error('Ride cancelled by user');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/rider/available-rides');
            }, 1000);
          } else if (data.status === 'completed') {
            toast.success('Ride completed successfully!');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/rider/available-rides');
            }, 1000);
          }
        }
      });

      // 🔥 Listen for ride started event
      socket.on('ride_started', (data) => {
        if (data.rideId === urlParams.rideId) {
          setRideStatus('ongoing');
          toast.success('Ride is now ongoing!', {
            description: 'Drive safely to the destination'
          });
        }
      });

      // Listen for passenger location updates
      socket.on('passenger_location_update', (data) => {
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

      // Join ride chat room for real-time chat
      socket.emit('join_ride_chat', {
        rideId: urlParams.rideId,
        userId: user.id,
        userType: 'rider'
      });

      // Listen for chat messages from user (auto-open chat modal)
      socket.on('receive_ride_message', (data) => {
        if (data.rideId === urlParams.rideId && data.message.senderType === 'user') {
          // Auto-open chat modal when user sends message
          setIsChatOpen(true);
          toast.info('New message from passenger', {
            description: data.message.text.substring(0, 50) + (data.message.text.length > 50 ? "..." : ""),
            duration: 3000,
          });
        }
      });

      // Also listen for new_message_notification (when user sends from accept-ride)
      socket.on('new_message_notification', (data) => {
        if (data.rideId === urlParams.rideId) {
          // Auto-open chat modal when user sends message
          setIsChatOpen(true);
          toast.info('New message from passenger', {
            description: data.message || "You have a new message",
            duration: 3000,
          });
        }
      });

      return () => {
        socket.off('ride_status_update');
        socket.off('ride_status_changed');
        socket.off('ride_started');
        socket.off('passenger_location_update');
        socket.off('receive_ride_message');
        socket.off('new_message_notification');
        socket.off('connect_error');
        socket.off('error');
        socket.emit('leave_ride_chat', {
          rideId: urlParams.rideId,
          userId: user.id,
          userType: 'rider'
        });
      };
    } catch (error) {
      console.warn('⚠️ Socket initialization error:', error.message);
      // Don't crash the app, socket features will just be unavailable
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
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

  // Load ride params from localStorage or URL
  const loadRideParams = () => {
    try {
      // First, try to get from URL params
      if (searchParams) {
        const params = new URLSearchParams(searchParams.toString());
        const rideId = params.get("rideId");

        if (rideId) {
          // Save to localStorage for future use
          const allParams = Object.fromEntries(params.entries());
          localStorage.setItem(`rider_ongoing_ride_${rideId}`, JSON.stringify(allParams));
          return params;
        }
      }

      // If no URL params, check localStorage
      const storedRides = Object.keys(localStorage).filter(key => key.startsWith('rider_ongoing_ride_'));

      if (storedRides.length > 0) {
        // Get the most recent ride (last key)
        const latestRideKey = storedRides[storedRides.length - 1];
        const storedParams = JSON.parse(localStorage.getItem(latestRideKey) || '{}');

        if (storedParams.rideId) {
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

  // Fetch ongoing ride from backend if no params available
  const fetchOngoingRideFromBackend = async (riderId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/specific-rider-ride/${riderId}`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const rides = data?.rides || [];

      // Find accepted or ongoing ride
      const ongoingRide = rides.find(ride => {
        const rideRiderId = typeof ride.riderId === 'object' ? ride.riderId.toString() : ride.riderId;
        const currentRiderId = typeof riderId === 'object' ? riderId.toString() : riderId;
        return rideRiderId === currentRiderId &&
          (ride.status === 'accepted' || ride.status === 'pending' || ride.status === 'started');
      });

      if (!ongoingRide) {
        return null;
      }

      // Fetch passenger info
      const passengerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?userId=${ongoingRide.userId}`
      );
      const passengerData = await passengerResponse.ok ? await passengerResponse.json() : null;

      // Construct params from backend data
      const pickupCoords = ongoingRide.pickup?.coordinates || [];
      const dropCoords = ongoingRide.drop?.coordinates || [];

      const params = new URLSearchParams();
      params.set('rideId', ongoingRide._id || '');
      params.set('userId', ongoingRide.userId || '');
      params.set('riderId', riderId || '');
      params.set('amount', (ongoingRide.fare || 0).toString());
      params.set('vehicleType', ongoingRide.vehicleType || 'Bike');
      params.set('distance', '0');
      params.set('arrivalTime', '00h:00m');

      if (pickupCoords.length === 2) {
        params.set('pickup', `${pickupCoords[1]},${pickupCoords[0]}`);
      }

      if (dropCoords.length === 2) {
        params.set('drop', `${dropCoords[1]},${dropCoords[0]}`);
      }

      params.set('passengerName', passengerData?.fullName || 'Unknown Passenger');
      params.set('passengerEmail', passengerData?.email || '');
      params.set('passengerPhone', passengerData?.phoneNumber || '');
      params.set('passengerRating', (passengerData?.rating || 0).toString());
      params.set('passengerPhoto', passengerData?.photoUrl || passengerData?.photo || '');
      params.set('baseFare', '0');
      params.set('distanceFare', '0');
      params.set('timeFare', '0');
      params.set('tax', '0');
      params.set('total', (ongoingRide.fare || 0).toString());
      params.set('mode', 'auto');
      params.set('promo', '');

      // Save to localStorage
      const rideId = ongoingRide._id;
      if (rideId) {
        localStorage.setItem(`rider_ongoing_ride_${rideId}`, JSON.stringify(Object.fromEntries(params.entries())));
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

      const key = `rider_ongoing_ride_${rideId}`;

      // Check if key exists before removing
      const existingData = localStorage.getItem(key);
      if (existingData) {
        localStorage.removeItem(key);
      } else {
        console.warn('⚠️ No data found in localStorage for key:', key);
      }

      // Also clear any old keys (cleanup)
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('rider_ongoing_ride_')) {
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

        // If still no params, show no ongoing ride UI
        if (!params) {
          setIsLoading(false);
          setHasNoRide(true);
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
          passengerName: params.get("passengerName") || "",
          passengerEmail: params.get("passengerEmail") || "",
          passengerPhone: params.get("passengerPhone") || "",
          passengerRating: params.get("passengerRating") || "0",
          passengerPhoto: params.get("passengerPhoto") || "",
          vehicleType: params.get("vehicleType") || "",
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
              console.warn("❌ Ongoing Ride - Invalid pickup coordinates:", { lat, lng });
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
                console.warn("❌ Ongoing Ride - No coordinates found for address:", pickup);
              }
            } catch (error) {
              console.error("❌ Ongoing Ride - Geocoding failed:", error);
            }
          }
        } else {
          console.warn("❌ Ongoing Ride - No pickup parameter:", pickup);
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
            }
          }
        } else if (drop) {
          // It's an address string
          setDropAddress(drop);
        }
      } catch (error) {
        console.error('Ongoing Ride - Error parsing URL parameters:', error);
        toast.error('Failed to load ride details', {
          description: 'Please try accepting a new ride'
        });
      } finally {
        setIsLoading(false);
      }
    };

    parseLocations();
  }, [searchParams, user]);

  // CRITICAL: Poll ride status to check if cancelled (Hybrid Approach)
  useEffect(() => {
    if (!urlParams.rideId) return;

    const checkRideStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${urlParams.rideId}`);
        if (response.ok) {
          const rideData = await response.json();

          // Check if ride was cancelled by user
          if (rideData.status === 'cancelled' || rideData.status === 'cancelled_by_user') {
            toast.error('Ride cancelled by user');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/rider/available-rides');
            }, 1000);
          }
          //  Check if ride was completed
          else if (rideData.status === 'completed') {
            toast.success('Ride completed successfully!');
            clearStoredRide(urlParams.rideId);
            setTimeout(() => {
              router.push('/dashboard/rider/available-rides');
            }, 1000);
          }
        }
      } catch (error) {
        console.warn('⚠️ Ride status check error:', error.message);
      }
    };

    // Check every 3 seconds (faster than location polling)
    const statusInterval = setInterval(checkRideStatus, 3000);
    checkRideStatus(); // Check immediately

    return () => clearInterval(statusInterval);
  }, [urlParams.rideId, router]);

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
            }
          }
        }
      } catch (error) {
        console.error('Ongoing Ride - Failed to fetch rider location:', error);
      }
    };

    // Fetch immediately and then every 5 seconds
    fetchRiderLocation();
    const interval = setInterval(fetchRiderLocation, 5000);

    return () => clearInterval(interval);
  }, [urlParams.riderId, pickupLocation]);

  // Show no ride UI if no active ride found
  if (!isLoading && hasNoRide) {
    return (
      <NoOngoingRide
        onViewRides={() => router.push("/dashboard/rider/available-rides")}
      />
    );
  }

  // Early return if still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-card to-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading ride details...</p>
        </div>
      </div>
    );
  }

  // Show no ongoing ride if no params available
  if (!urlParams.rideId || Object.keys(urlParams).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-card to-background px-4 py-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 md:w-28 md:h-28 text-muted-foreground relative z-10 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">No Ongoing Ride</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-8">
            You currently have no ongoing rides. Accept a ride from the Available Rides section to see it here.
          </p>

          <div className="flex justify-center">
            <a
              href="/dashboard/rider/available-rides"
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg text-sm md:text-base"
            >
              View Available Rides
            </a>
          </div>
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
    passengerPhoto = "",
    vehicleType = "",
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
    photoUrl: passengerPhoto || "",
    status: "Waiting for pickup",
  };

  // Start Ride Handler
  const handleStartRide = async () => {
    if (!rideId || !riderId) {
      toast.error("Missing ride information");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update ride status to ongoing
        setRideStatus("ongoing");
        toast.success("Ride started successfully!", {
          description: "The ride status has been updated to ongoing"
        });
        // The socket will handle real-time updates
      } else {
        toast.error(result.message || "Failed to start ride", {
          description: result.currentStatus ? `Current status: ${result.currentStatus}` : undefined
        });
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      toast.error("Failed to start ride. Please try again.");
    }
  };

  // Cancel Ride Handler
  const handleCancelRide = async () => {
    if (!rideId || !riderId) {
      toast.error("Missing ride information");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Ride cancelled successfully");
        clearStoredRide(rideId);
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
    <div className="min-h-screen bg-gradient-to-br from-card to-background px-4 py-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Container */}
        <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-4 md:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-full backdrop-blur-sm">
                  <CheckCircle className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">
                    {calculatedEta ? `Pickup passenger in ${calculatedEta}` : liveEta ? `Pickup passenger in ${liveEta}` : eta ? `Pickup passenger in ${eta}` : `Ready to pickup ${type} passenger`}
                  </h2>
                  <p className="text-background text-xs md:text-sm">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:gap-6 md:p-6">
            {/* Passenger Info Section */}
            <div className="border border-border rounded-xl bg-gradient-to-br from-card to-background p-4 md:p-6 space-y-4 md:space-y-6 h-full flex flex-col">
              {/* Passenger Profile */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                {passengerInfo ? (
                  <>
                    <Avatar className="w-16 md:w-20 h-16 md:h-20 border-4 border-primary shadow-lg">
                      <AvatarImage
                        src={passengerInfo.photoUrl}
                        alt={passengerInfo.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl md:text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                        {passengerInfo.fullName?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 uppercase">
                        {passengerInfo.fullName}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-blue-600 text-white text-xs md:text-sm">
                          {passengerInfo.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 fill-current" />
                          <span className="text-xs md:text-sm font-medium">{passengerInfo.rating.toFixed(1)}</span>
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

              </div>

              {/* Ride Details */}
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-muted-foreground uppercase">
                  Ride Details
                </h5>
                {/* Fare - Full width */}
                <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex flex-col items-center text-center">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary mb-1" />
                    <p className="text-sm text-muted-foreground mb-1">Fare</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary uppercase">
                      {fare ? `৳${fare}` : "--"}
                    </p>
                  </div>
                </div>

                {/* Distance and ETA - Two columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex flex-col items-center text-center">
                      <Navigation className="w-5 h-5 md:w-6 md:h-6 text-primary mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">Distance to Pickup</p>
                      <p className="text-lg md:text-xl font-bold text-primary uppercase">
                        {calculatedEta ? `${distance?.toFixed(1) || '0.0'} km` : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">ETA to Pickup</p>
                      <p className="text-lg md:text-xl font-bold text-primary uppercase">
                        {calculatedEta || eta || "--"}
                      </p>
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

            {/* Map and Buttons Section */}
            <div className="h-full flex flex-col border border-border rounded-xl p-4 md:p-6 bg-card/30">
              {/* Map */}
              <div className="flex-1 min-h-[300px] md:min-h-[400px]">
                <h5 className="mb-2 text-sm font-semibold text-muted-foreground uppercase">
                  Live Tracking
                </h5>
                {console.log('🗺️ Ongoing Ride - Map props:', {
                  rideId,
                  riderLocation,
                  type,
                  pickupLocation,
                  dropLocation
                })}
                <RiderLiveTrackingMap
                  rideId={rideId}
                  riderInfo={{ location: riderLocation }}
                  pickupLocation={pickupLocation}
                  dropLocation={dropLocation}
                  onEtaUpdate={setLiveEta}
                  vehicleType={vehicleType || type}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-5 lg:mt-0 space-y-3">
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
                  disabled={rideStatus === "ongoing"}
                  className={`w-full h-12 text-base font-semibold ${
                    rideStatus === "ongoing"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <Check className="w-5 h-5 mr-2" />
                  {rideStatus === "ongoing" ? "Ongoing" : "Start Ride"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        riderName={passengerInfo.fullName}
        riderVehicle={`${vehicleType || type}`}
        rideId={rideId}
        riderId={riderId}
      />
    </div>
  );
}

export default function OngoingRidePage() {
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