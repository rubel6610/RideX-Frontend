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

function RideModal({ open, onClose, ride }) {
  if (!open || !ride) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
      <div className="bg-[var(--color-background)] text-[var(--color-card-foreground)] rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">Ride Details</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Pickup:</strong> {ride.pickup.address || JSON.stringify(ride.pickup)}</p>
          <p><strong>Drop:</strong> {ride.drop.address || JSON.stringify(ride.drop)}</p>
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
  const [riderInfo, setRiderInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);

  // fetch rides once we have token + user
  useEffect(() => {
    if (!user?.id) return;

    const fetchRides = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rides/${user.id}`);
        const data = await res.json();

        setRides(data.rides);
        setRiderInfo(data.riderInfo);
      } catch (err) {
        console.error(err);
        setRides([]);
        setRiderInfo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user]);

  // accept handler
  const handleAccept = async (rideId, riderId) => {
    console.log("🟡 Accept pressed:", rideId, riderId);

    if (!rideId || !riderId) {
      console.error("❌ Missing IDs");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/req/ride-accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, riderId }),
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      if (data.success) {
        setRides((prev) =>
          prev.map((r) => (r._id === rideId ? { ...r, status: "accepted" } : r))
        );
      } else {
        console.error("❌ Ride accept failed:", data.message);
      }
    } catch (err) {
      console.error("🔥 Fetch error:", err);
    }
  };

  // reject handler
  const handleReject = async (rideId, riderId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/req/ride-reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, riderId }),
      });
      setRides((prev) => prev.filter(r => r._id !== rideId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (rideId, riderId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/ride-cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, riderId }),
      });
      setRides((prev) => prev.map(r => r._id === rideId ? { ...r, status: "cancelled" } : r));
    } catch (err) {
      console.error(err);
    }
  };

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

  if (loading) {
    return <div className="p-6 text-center">Loading rides...</div>;
  }

  if (rides?.length == 0) {
    return <NoRide />;
  }

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
            {rides?.map((ride, idx) => (
              <TableRow
                key={ride._id}
                className={`transition-colors hover:bg-[var(--color-card)] ${idx % 2 === 0 ? "bg-[var(--color-muted)]/30" : ""}`}
              >
                <TableCell>{ride.pickup.address || JSON.stringify(ride.pickup)}</TableCell>
                <TableCell>{ride.drop.address || JSON.stringify(ride.drop)}</TableCell>
                <TableCell>{ride.fare} ৳</TableCell>
                <TableCell>{ride.vehicleType}</TableCell>
                <TableCell>{getStatusBadge(ride.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedRide(ride)}>Details</Button>
                  {ride.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleAccept(ride._id, ride.riderId)}>Accept</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(ride._id, ride.riderId)}>Reject</Button>
                    </>
                  )}
                  {ride.status === "accepted" && (
                    <Button size="sm" variant="outline" onClick={() => handleCancel(ride._id, ride.riderId)}>Cancel</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <RideModal open={!!selectedRide} ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </div>
  );
};

export default AvailableRidesPage;