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
  Search,
  ArrowRight,
  Star,
  MessageCircle,
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

// No Ongoing Ride Component
function NoOngoingRide({ onBookRide }) {
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
          Ready to book your next ride?
        </p>

        <div className="space-y-3">
          <Button
            onClick={onBookRide}
            className="w-full h-12 text-base font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Book a Ride Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Get started by booking a new ride from your location
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
  const [riderLocation, setRiderLocation] = useState({
    type: "Point",
    coordinates: [90.4125, 23.8103], // Fallback to Dhaka
  });
  const [calculatedEta, setCalculatedEta] = useState(null);
  const [tripEta, setTripEta] = useState(null); // Trip ETA (pickup to drop)
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [riderRating, setRiderRating] = useState({ rating: 0, totalReviews: 0 });

  // Initialize Socket.IO for real-time chat notifications
  useEffect(() => {
    if (!user?.id || !urlParams.rideId) return;

    try {
      const socket = initSocket(user.id, false);
      
      // Handle socket connection errors
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
      console.log(' User joined ride chat room:', urlParams.rideId);

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

      // 🔥 Listen for ride started event
      socket.on('ride_started', (data) => {
        console.log(' Ride started event received:', data);
        if (data.rideId === urlParams.rideId) {
          toast.success('Your ride has started!', {
            description: 'Your rider is now on the way to drop location'
          });
        }
      });

      return () => {
        socket.off('receive_ride_message');
        socket.off('new_message_notification');
        socket.off('ride_status_changed');
        socket.off('ride_started');
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

  // Calculate ETA based on distance and vehicle type (for rider to pickup)
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

  // Calculate Trip ETA (pickup to drop) based on distance and vehicle type
  const calculateTripETA = (pickupLat, pickupLng, dropLat, dropLng, vehicleType) => {
    if (!pickupLat || !dropLat) return null;
    
    const tripDistance = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
    if (!tripDistance || tripDistance <= 0) return null;
    
    let avgSpeed; // Average speed in km/h
    switch (vehicleType?.toLowerCase()) {
      case 'bike':
        avgSpeed = 40; // Bike average speed in city
        break;
      case 'car':
        avgSpeed = 50; // Car average speed in city
        break;
      case 'cng':
        avgSpeed = 30; // CNG average speed
        break;
      default:
        avgSpeed = 40; // Default speed
    }
    
    const timeInHours = tripDistance / avgSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  //  Load ride params from localStorage or URL
  const loadRideParams = () => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') return null;
      
      // First, try to get from URL params
      if (searchParams) {
        const params = new URLSearchParams(searchParams.toString());
        const rideId = params.get("rideId");
        
        if (rideId) {
          //  Save to localStorage for future use (USER END)
          const allParams = Object.fromEntries(params.entries());
          localStorage.setItem(`user_ongoing_ride_${rideId}`, JSON.stringify(allParams));
          console.log(' Saved ride data to localStorage:', rideId);
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
          console.log(' Loaded ride data from localStorage:', storedParams.rideId);
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

  //  Fetch ongoing ride from backend if no params available
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
      
      // Debug: Log entire rider data from backend
      console.log('🔍 Complete rider data from backend:', riderData);
      
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
      const photoUrl = riderData?.photoUrl || riderData?.photo || riderData?.photoURL || '';
      params.set('riderPhoto', photoUrl);
      console.log('📸 All photo fields:', {
        photoUrl: riderData?.photoUrl,
        photo: riderData?.photo,
        photoURL: riderData?.photoURL,
        selected: photoUrl
      });
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
      
      //  Save to localStorage (browser only)
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

  //  Clear localStorage when ride is cancelled/completed
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
        riderName: params.get("riderName") || "",
        riderEmail: params.get("riderEmail") || "",
        riderPhoto: params.get("riderPhoto") || "",
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
            // Be gentle to the service
            await new Promise(resolve => setTimeout(resolve, 100));
            // Use Nominatim without restricted headers to avoid CORS issues in browsers
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}&limit=1`);
            if (!response.ok) {
              console.warn('⚠️ Nominatim forward geocoding failed with status:', response.status);
              setPickupLocation(null);
              setPickupAddress(pickup);
            } else {
              const data = await response.json();
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                setPickupLocation({ lat, lng });
                setPickupAddress(pickup); // Use the original address string
              } else {
                console.warn("❌ No coordinates found for address:", pickup);
                setPickupLocation(null);
                setPickupAddress(pickup);
              }
            }
          } catch (error) {
            console.warn('⚠️ Forward geocoding failed (likely CORS). Using fallback address only:', error?.message || error);
            // Fallback: keep the address string without coordinates
            setPickupLocation(null);
            setPickupAddress(pickup);
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
            
            // Convert coordinates to address
            const address = await reverseGeocode(lat, lng);
            setDropAddress(address);
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

  // Calculate Trip ETA when locations are available
  useEffect(() => {
    // Try to calculate from coordinates first
    if (pickupLocation && dropLocation && urlParams.vehicleType) {
      console.log('🔄 Calculating Trip ETA from coordinates:', { 
        pickup: pickupLocation, 
        drop: dropLocation, 
        vehicleType: urlParams.vehicleType 
      });
      
      const eta = calculateTripETA(
        pickupLocation.lat, 
        pickupLocation.lng, 
        dropLocation.lat, 
        dropLocation.lng, 
        urlParams.vehicleType
      );
      
      console.log('✅ Trip ETA calculated from coordinates:', eta);
      setTripEta(eta);
    } 
    // Fallback: Calculate from distance if available in urlParams
    else if (urlParams.distance && urlParams.vehicleType) {
      const distance = parseFloat(urlParams.distance);
      if (!isNaN(distance) && distance > 0) {
        console.log('🔄 Calculating Trip ETA from distance:', { 
          distance, 
          vehicleType: urlParams.vehicleType 
        });
        
        let avgSpeed;
        switch (urlParams.vehicleType?.toLowerCase()) {
          case 'bike':
            avgSpeed = 40;
            break;
          case 'car':
            avgSpeed = 50;
            break;
          case 'cng':
            avgSpeed = 30;
            break;
          default:
            avgSpeed = 40;
        }
        
        const timeInHours = distance / avgSpeed;
        const timeInMinutes = Math.round(timeInHours * 60);
        const eta = timeInMinutes < 60 
          ? `${timeInMinutes} min` 
          : `${Math.floor(timeInMinutes / 60)}h ${timeInMinutes % 60}m`;
        
        console.log('✅ Trip ETA calculated from distance:', eta);
        setTripEta(eta);
      }
    } else {
      console.log('⚠️ Trip ETA not calculated - missing data:', {
        pickupLocation: !!pickupLocation,
        dropLocation: !!dropLocation,
        distance: urlParams.distance,
        vehicleType: urlParams.vehicleType
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupLocation, dropLocation, urlParams.vehicleType, urlParams.distance]);

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

  // Fetch rider's ratings
  useEffect(() => {
    const fetchRiderRatings = async () => {
      console.log("Current urlParams:", urlParams); // Debug log for all URL params

      if (!urlParams.riderId) {
        console.log("No riderId available for fetching ratings");
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
        if (!baseUrl) {
          console.error("Server base URL is not defined in environment variables!");
          return;
        }
        console.log("Base URL:", baseUrl); // Debug log for base URL
        // Add fallback for local development
        const serverUrl = baseUrl;
        const apiUrl = `${serverUrl}/api/ride-reviews`;
        console.log("Fetching ratings from URL:", apiUrl);
        
        const response = await fetch(apiUrl);
        console.log("Rating API response status:", response.status);
        
        const responseText = await response.text(); // Get raw response text first
        console.log("Raw API response:", responseText);
        
        if (response.ok) {
          const data = JSON.parse(responseText); // Parse the text to JSON
          console.log("All reviews data:", data);
          
          // Filter reviews for the current rider
          const riderReviews = Array.isArray(data) ? data.filter(review => review.riderId === urlParams.riderId) : [];
          
          // Calculate average rating from the filtered reviews
          const totalReviews = riderReviews.length;
          const sumRatings = riderReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
          
          console.log("Calculated ratings:", {
            averageRating: avgRating,
            totalReviews: totalReviews
          });
          
          setRiderRating({
            rating: avgRating,
            totalReviews: totalReviews
          });
        } else {
          console.warn("Failed to fetch ratings - server returned:", response.status);
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch rider ratings:', error);
        console.error('Error details:', error.message);
      }
    };

    fetchRiderRatings();
  }, [urlParams.riderId]);

  // Fetch rider's real-time location
  useEffect(() => {
    const fetchRiderLocation = async () => {
      try {
        // Validate riderId before fetching
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

  // Show no ride UI if no active ride found
  if (!isLoading && hasNoRide) {
    return (
      <NoOngoingRide 
        onBookRide={() => router.push("/dashboard/user/book-a-ride")} 
      />
    );
  }

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
    riderPhoto = "",
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
    photoUrl: riderPhoto || "",
    vehicleType: vehicleType || type,
    vehicleModel: vehicleModel || "Unknown Model",
    vehicleRegisterNumber: vehicleRegisterNumber || "N/A",
    rating: parseFloat(ratings) || 0,
    completedRides: parseInt(completedRides) || 0,
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
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Status Bar */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-primary p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">Your Ride is On The Way</h2>
                  <p className="text-xs sm:text-sm text-white/90 truncate">
                    {calculatedEta || liveEta ? `Arriving in ${calculatedEta || liveEta}` : "Tracking your rider"}
                  </p>
                </div>
              </div>
              <Badge className="bg-white text-primary font-semibold px-3 py-1 flex-shrink-0">
                {mode === "auto" ? "Auto" : "Scheduled"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Map Section - Full Width */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Live Tracking</h3>
              <Badge variant="outline" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real-time
              </Badge>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="h-[260px] sm:h-[340px] lg:h-[420px] w-full">
              <LiveTrackingMap
              rideId={rideId}
              riderInfo={riderInfo}
              vehicleType={type}
              pickupLocation={pickupLocation}
              dropLocation={dropLocation}
              onEtaUpdate={setLiveEta}
              />
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Left Column - Rider Info & Actions (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Rider Profile Card */}
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  {riderInfo ? (
                    <>
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary shadow-xl">
                        <AvatarImage 
                          src={riderInfo.photoUrl} 
                          alt={riderInfo.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                          {riderInfo.fullName?.charAt(0) || "R"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {riderInfo.fullName}
                          </h4>
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{riderRating.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>{riderRating.totalReviews} reviews</span>
                          {riderInfo.completedRides > 0 && (
                            <>
                              <span>•</span>
                              <span>{riderInfo.completedRides} rides</span>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="p-5 sm:p-6 space-y-4">
                <h5 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">
                  Vehicle Information
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <VehicleIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="text-sm font-bold text-foreground capitalize">{riderInfo.vehicleType}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <Car className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Model</p>
                    <p className="text-sm font-bold text-foreground">{riderInfo.vehicleModel}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <Hash className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Plate</p>
                    <p className="text-sm font-bold text-foreground">{riderInfo.vehicleRegisterNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Route Card */}
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border bg-muted/30">
                <h5 className="text-sm font-bold text-foreground uppercase tracking-wide">Trip Route</h5>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                {/* Pickup */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pickup Point</p>
                    <p className="text-sm font-medium text-foreground">
                      {pickupAddress || pickup || "Setting pickup..."}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 pl-5">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-green-500 via-primary to-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Navigation className="w-3 h-3" />
                      <span>{distance ? `${distance} km` : "Calculating..."}</span>
                      {tripEta && (
                        <>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>Trip: {tripEta}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Drop */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Drop Point</p>
                    <p className="text-sm font-medium text-foreground">
                      {dropAddress || drop || "Setting destination..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => setIsChatOpen(true)}
                variant="default"
                className="w-full h-12 text-base font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </Button>
              <Button
                onClick={handleCancelRide}
                variant="destructive"
                className="w-full h-12 text-base font-semibold"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleCompleteRide}
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-5 h-5 mr-2" />
                Complete
              </Button>
            </div>
          </div>

          {/* Right Column - Fare & Trip Details (1/3 width on desktop) */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Fare Card */}
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <h5 className="text-sm font-bold text-foreground uppercase tracking-wide">Fare Breakdown</h5>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div className="text-center p-4 xl:p-6 rounded-xl bg-primary/10 border-2 border-primary/30">
                  <DollarSign className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Fare</p>
                  <p className="text-2xl xl:text-3xl font-bold text-primary">
                    {fare ? `৳${fare}` : "--"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 xl:p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground block lg:hidden xl:block">Distance</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {distance ? ` ${distance} km` : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground block lg:hidden xl:block">Trip ETA</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {tripEta || "Calculating..."}
                  </span>
                  </div>
                </div>

                {promo && (
                  <div className="p-4 rounded-xl bg-green-500/10 border-2 border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600 text-white">PROMO</Badge>
                        <span className="text-sm font-bold text-green-700">{promo}</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                )}
              </div>
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
