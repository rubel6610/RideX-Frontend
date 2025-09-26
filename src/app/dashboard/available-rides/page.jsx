"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Info, User, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AvailableRides() {
  // Dummy ride requests
  const [rides, setRides] = useState([
    {
      id: "RIDE-101",
      passenger: { name: "Jahid", rating: 4.8, phone: "+8801712345678" },
      fare: 170,
      status: "pending",
    },
    {
      id: "RIDE-102",
      passenger: { name: "Rahima", rating: 4.9, phone: "+8801711111111" },
      fare: 120,
      status: "pending",
    },
  ]);

  const [selectedRide, setSelectedRide] = useState(null);

  // Update ride status
  const handleStatus = (id, newStatus) =>
    setRides(rides.map(r => (r.id === id ? { ...r, status: newStatus } : r)));

  // Status color helper
  const statusColor = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Available Rides</h1>

      {/* Ride Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-accent rounded-xl">
          <thead className="bg-accent">
            <tr>
              <th className="px-4 py-2 text-left">Passenger</th>
              <th className="px-4 py-2 text-left">Fare ($)</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} className="border-t border-accent">
                <td className="px-4 py-2 gap-2">
                  {ride.passenger.name}
                </td>
                <td className="px-4 py-2 gap-1">
                   {ride.fare}
                </td>
                <td className="px-4 py-2">
                  <Badge className={statusColor(ride.status)}>{ride.status}</Badge>
                </td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {ride.status === "pending" && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleStatus(ride.id, "accepted")}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(ride.id, "rejected")}>
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setSelectedRide(ride)}>
                        <Info className="w-4 h-4 mr-1" /> Details
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Passenger Details Modal */}
      {selectedRide && (
        <Dialog open={!!selectedRide} onOpenChange={() => setSelectedRide(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Passenger Info</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><User className="w-4 h-4 inline-block mr-1" /> {selectedRide.passenger.name}</p>
              <p>Rating: {selectedRide.passenger.rating} ⭐</p>
              <p>Phone: {selectedRide.passenger.phone}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
