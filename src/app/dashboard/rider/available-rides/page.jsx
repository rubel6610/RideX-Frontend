"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NoRide from "./components/NoRide";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/components/Shared/socket/socket";
import { toast } from "sonner";
import { usePagination, PaginationControls } from "@/components/ui/pagination-table";
import { 
  MapPin, 
  Navigation, 
  DollarSign, 
  Car, 
  Clock,
  Check,
  X,
  Info,
  Bike,
  BusFront
} from "lucide-react";

function RideModal({ open, onClose, ride }) {
  if (!open || !ride) return null;
  
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case "bike":
        return <Bike className="w-6 h-6" />;
      case "car":
        return <Car className="w-6 h-6" />;
      case "cng":
        return <BusFront className="w-6 h-6" />;
      default:
        return <Car className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white capitalize">{status}</Badge>;
      case "accepted":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white capitalize">{status}</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 hover:bg-red-700 text-white capitalize">{status}</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Ride Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Vehicle */}
          <div className="flex items-center justify-between">
            {getStatusBadge(ride.status)}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
              {getVehicleIcon(ride.vehicleType)}
              <span className="font-semibold capitalize">{ride.vehicleType}</span>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pickup Location</p>
                <p className="text-sm font-medium text-foreground">
                  {ride.pickupAddress || "Loading..."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 flex-shrink-0">
                <Navigation className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Drop Location</p>
                <p className="text-sm font-medium text-foreground">
                  {ride.dropAddress || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30">
            <DollarSign className="w-8 h-8 text-primary" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Fare</p>
              <p className="text-4xl font-bold text-primary">৳{ride.fare}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 p-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

const AvailableRidesPage = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [riderId, setRiderId] = useState(null);
  const pagination = usePagination(rides, 10);

  // Fetch rider profile to get riderId
  useEffect(() => {
    if (!user?.id) return;

    const fetchRiderProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/specific-rider-ride/${user.id}`
        );
        const data = await res.json();
        if (data.rider?._id) {
          setRiderId(data.rider._id);
        }
      } catch (err) {
        console.error("Error fetching rider profile:", err);
      }
    };

    fetchRiderProfile();
  }, [user]);

  // Initialize Socket.IO for real-time ride requests
  useEffect(() => {
    if (!riderId) return;

    try {
      const socket = initSocket(user?.id, false);
      
      // Join rider-specific room
      socket.emit('join_rider', riderId);
      console.log('Rider joined room:', riderId);

      // Listen for new ride requests
      socket.on('new_ride_request', async (data) => {
        try {
          console.log('✅ New ride request received:', data);
          toast.success('New ride request!', {
            description: 'A passenger nearby needs a ride',
          });

          // Fetch addresses for the new ride
          const enrichedRide = await enrichRideWithAddresses(data.ride);
          setRides((prev) => [enrichedRide, ...prev]);
        } catch (error) {
          console.error('Error processing new ride request:', error);
        }
      });

      // Listen for auto-rejection notifications
      socket.on('ride_auto_rejected', (data) => {
        try {
          console.log('Ride auto-rejected:', data.rideId);
          toast.info('Ride request expired');
          setRides((prev) => prev.filter((r) => r._id !== data.rideId));
        } catch (error) {
          console.error('Error processing auto-rejection:', error);
        }
      });

      // Listen for user cancellations
      socket.on('ride_cancelled_by_user', (data) => {
        try {
          console.log('Ride cancelled by user:', data.rideId);
          toast.info('Passenger cancelled the ride');
          setRides((prev) => prev.filter((r) => r._id !== data.rideId));
        } catch (error) {
          console.error('Error processing user cancellation:', error);
        }
      });

      return () => {
        socket.off('new_ride_request');
        socket.off('ride_auto_rejected');
        socket.off('ride_cancelled_by_user');
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }, [riderId, user]);

  // Helper function to enrich ride with addresses
  const enrichRideWithAddresses = async (ride) => {
    try {
      const pickup = ride.pickup?.coordinates || [];
      const drop = ride.drop?.coordinates || [];

      const [pickupRes, dropRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/reverse-geocode?lat=${pickup[1]}&lon=${pickup[0]}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/reverse-geocode?lat=${drop[1]}&lon=${drop[0]}`
        ),
      ]);

      const [pickupData, dropData] = await Promise.all([
        pickupRes.json(),
        dropRes.json(),
      ]);

      return {
        ...ride,
        pickupAddress: pickupData?.display_name || "Unknown pickup location",
        dropAddress: dropData?.display_name || "Unknown drop location",
      };
    } catch (err) {
      console.error("Error enriching ride:", err);
      return {
        ...ride,
        pickupAddress: "Failed to load pickup",
        dropAddress: "Failed to load drop",
      };
    }
  };

  // Fetch rides
  useEffect(() => {
    if (!user?.id) return;

    const fetchRides = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rides/${user.id}`
        );
        const data = await res.json();

        // 🟡 Initialize rides
        const updatedRides = await Promise.all(
          data.rides.map(async (ride) => {
            try {
              const pickup = ride.pickup?.coordinates || [];
              const drop = ride.drop?.coordinates || [];

              // reverse geocode pickup
              const pickupRes = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/reverse-geocode?lat=${pickup[1]}&lon=${pickup[0]}`
              );
              const pickupData = await pickupRes.json();

              // reverse geocode drop
              const dropRes = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/reverse-geocode?lat=${drop[1]}&lon=${drop[0]}`
              );
              const dropData = await dropRes.json();

              return {
                ...ride,
                pickupAddress:
                  pickupData?.display_name || "Unknown pickup location",
                dropAddress:
                  dropData?.display_name || "Unknown drop location",
              };
            } catch (err) {
              console.error("Reverse geocode error:", err);
              return {
                ...ride,
                pickupAddress: "Failed to load pickup",
                dropAddress: "Failed to load drop",
              };
            }
          })
        );

        setRides(updatedRides);
      } catch (err) {
        console.error(err);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user]);

  // Accept Ride
  const handleAccept = async (rideId, rideRiderId) => {
    try {
      // Use the riderId from state (fetched rider profile) instead of ride.riderId
      const actualRiderId = riderId || rideRiderId;
      
      console.log('Accepting ride:', { rideId, actualRiderId });
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/req/ride-accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId: actualRiderId }),
        }
      );

      const data = await res.json();
      
      if (data.success) {
        setRides((prev) =>
          prev.map((r) =>
            r._id === rideId ? { ...r, status: "accepted" } : r
          )
        );
        toast.success('Ride accepted successfully!');
        
        // Navigate to rider accept-ride page with ride details
        const ride = rides.find(r => r._id === rideId);
        if (ride) {
          const params = new URLSearchParams();
          
          // Add ride details
          params.append('rideId', rideId);
          params.append('userId', ride.userId || '');
          params.append('riderId', actualRiderId);
          params.append('amount', ride.fare?.toString() || '');
          params.append('vehicleType', ride.vehicleType || '');
          params.append('distance', '0'); // Will be calculated
          params.append('arrivalTime', '00h:00m'); // Will be calculated
          
          // Add pickup and drop coordinates
          if (ride.pickup?.coordinates) {
            const [lng, lat] = ride.pickup.coordinates;
            params.append('pickup', `${lat},${lng}`);
          }
          if (ride.drop?.coordinates) {
            const [lng, lat] = ride.drop.coordinates;
            params.append('drop', `${lat},${lng}`);
          }
          
          // Add passenger info from backend response (data.ride.userInfo)
          const userInfo = data.ride?.userInfo;
          params.append('passengerName', userInfo?.fullName || ride.passengerName || 'Unknown Passenger');
          params.append('passengerEmail', userInfo?.email || ride.passengerEmail || '');
          params.append('passengerPhone', userInfo?.phone || ride.passengerPhone || '');
          params.append('passengerRating', userInfo?.rating?.toString() || ride.passengerRating || '0');
          
          // Add vehicle info
          params.append('vehicleModel', ride.vehicleModel || 'Unknown Model');
          params.append('vehicleRegisterNumber', ride.vehicleRegisterNumber || 'N/A');
          
          // Add fare details
          params.append('baseFare', '0');
          params.append('distanceFare', '0');
          params.append('timeFare', '0');
          params.append('tax', '0');
          params.append('total', ride.fare?.toString() || '0');
          params.append('mode', 'auto');
          params.append('promo', '');
          
          // Navigate to ongoing-ride page
          window.location.href = `/dashboard/rider/ongoing-ride?${params.toString()}`;
        }
      } else {
        // Handle specific error cases
        if (data.requiresOnline) {
          toast.error('You must be online to accept rides', {
            description: 'Please set your status to online first'
          });
        } 
        // COMMENTED OUT: Active ride check - temporarily disabled for testing
        // else if (data.hasActiveRide) {
        //   toast.error('Active ride in progress', {
        //     description: 'Complete your current ride before accepting another'
        //   });
        // } 
        else if (data.currentStatus) {
          toast.error(`Ride is already ${data.currentStatus}`, {
            description: 'This ride is no longer available'
          });
        } else {
          toast.error(data.message || 'Failed to accept ride');
        }
      }
    } catch (err) {
      console.error("Ride accept error:", err);
      toast.error('Network error', {
        description: 'Failed to accept ride. Please try again.'
      });
    }
  };

  // Reject Ride
  const handleReject = async (rideId, rideRiderId) => {
    try {
      const actualRiderId = riderId || rideRiderId;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/req/ride-reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId: actualRiderId }),
        }
      );
      
      const data = await res.json();
      
      if (data.success || res.ok) {
        setRides((prev) => prev.filter((r) => r._id !== rideId));
        toast.info('Ride rejected', {
          description: 'Finding another nearby rider for this request'
        });
      } else {
        toast.error(data.message || 'Failed to reject ride');
      }
    } catch (err) {
      console.error("Reject ride error:", err);
      toast.error('Network error', {
        description: 'Failed to reject ride. Please try again.'
      });
    }
  };

  // Cancel Ride
  const handleCancel = async (rideId, rideRiderId) => {
    try {
      const actualRiderId = riderId || rideRiderId;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/ride-cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId, riderId: actualRiderId }),
        }
      );
      
      const data = await res.json();
      
      if (data.success || res.ok) {
        setRides((prev) =>
          prev.map((r) =>
            r._id === rideId ? { ...r, status: "cancelled" } : r
          )
        );
        toast.success('Ride cancelled successfully');
      } else {
        toast.error(data.message || 'Failed to cancel ride');
      }
    } catch (err) {
      console.error("Cancel ride error:", err);
      toast.error('Network error', {
        description: 'Failed to cancel ride. Please try again.'
      });
    }
  };

  // Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white capitalize">{status}</Badge>;
      case "accepted":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white capitalize">{status}</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 hover:bg-red-700 text-white capitalize">{status}</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };

  // Get vehicle icon
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case "bike":
        return <Bike className="w-5 h-5" />;
      case "car":
        return <Car className="w-5 h-5" />;
      case "cng":
        return <BusFront className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading available rides...</p>
        </div>
      </div>
    );
  }
  
  if (!rides.length) return <NoRide />;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Available Rides</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {rides.length} ride{rides.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Updates
        </Badge>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {pagination.currentData.map((ride) => (
          <div
            key={ride._id}
            className="bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Status and Vehicle Type */}
              <div className="flex items-center justify-between">
                {getStatusBadge(ride.status)}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
                  {getVehicleIcon(ride.vehicleType)}
                  <span className="text-sm font-medium capitalize">{ride.vehicleType}</span>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Pickup Location</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">
                      {ride.pickupAddress || "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="flex items-center gap-3 pl-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-green-500 to-red-500"></div>
                </div>

                {/* Drop Location */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 flex-shrink-0 mt-0.5">
                    <Navigation className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Drop Location</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">
                      {ride.dropAddress || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fare Display */}
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                <DollarSign className="w-5 h-5 text-primary" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Fare Amount</p>
                  <p className="text-2xl font-bold text-primary">৳{ride.fare}</p>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="border-t border-border bg-muted/30 p-4 space-y-2">
              {ride.status === "pending" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAccept(ride._id, ride.riderId)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleReject(ride._id, ride.riderId)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              
              {ride.status === "accepted" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCancel(ride._id, ride.riderId)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel Ride
                </Button>
              )}

              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => setSelectedRide(ride)}
              >
                <Info className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <PaginationControls pagination={pagination} />

      {/* Ride Details Modal */}
      <RideModal
        open={!!selectedRide}
        ride={selectedRide}
        onClose={() => setSelectedRide(null)}
      />
    </div>
  );
};

export default AvailableRidesPage;
