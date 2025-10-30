"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NoRide from "./components/NoRide";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/components/Shared/socket/socket";
import { toast } from "sonner";
import { usePagination, PaginationControls } from "@/components/ui/pagination-table";

function RideModal({ open, onClose, ride }) {
  if (!open || !ride) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
      <div className="bg-[var(--color-background)] text-[var(--color-card-foreground)] rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">Ride Details</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Pickup:</strong> {ride.pickupAddress || "Loading..."}</p>
          <p><strong>Drop:</strong> {ride.dropAddress || "Loading..."}</p>
          <p><strong>Fare:</strong> {ride.fare} ৳</p>
          <p><strong>Vehicle:</strong> {ride.vehicleType}</p>
          <p><strong>Status:</strong> {ride.status}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
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
        return <Badge className="bg-[var(--color-accent)]">{status}</Badge>;
      case "accepted":
        return <Badge className="bg-[var(--color-primary)]">{status}</Badge>;
      case "rejected":
        return <Badge className="bg-[var(--color-destructive)]">{status}</Badge>;
      case "cancelled":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="p-6 text-center">Loading rides...</div>;
  if (!rides.length) return <NoRide />;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Ride Requests</h2>
      <div className="overflow-hidden rounded-xl shadow-md border border-[var(--color-border)]">
        <Table className="text-[var(--color-foreground)] bg-[var(--color-background)]">
          <TableHeader className="bg-[var(--color-card)]">
            <TableRow>
              <TableHead>Pickup</TableHead>
              <TableHead>Drop</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.currentData.map((ride, idx) => (
              <TableRow
                key={ride._id}
                className={`transition-colors hover:bg-[var(--color-card)] ${
                  idx % 2 === 0 ? "bg-[var(--color-muted)]/30" : ""
                }`}
              >
                <TableCell className="max-w-[220px] truncate">
                  {ride.pickupAddress || "Loading..."}
                </TableCell>
                <TableCell className="max-w-[220px] truncate">
                  {ride.dropAddress || "Loading..."}
                </TableCell>
                <TableCell>{ride.fare} ৳</TableCell>
                <TableCell>{ride.vehicleType}</TableCell>
                <TableCell>{getStatusBadge(ride.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedRide(ride)}
                  >
                    Details
                  </Button>
                  {ride.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAccept(ride._id, ride.riderId)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleReject(ride._id, ride.riderId)
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {ride.status === "accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCancel(ride._id, ride.riderId)
                      }
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls pagination={pagination} />
      <RideModal
        open={!!selectedRide}
        ride={selectedRide}
        onClose={() => setSelectedRide(null)}
      />
    </div>
  );
};

export default AvailableRidesPage;
