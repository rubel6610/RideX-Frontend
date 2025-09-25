"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, PhoneCall, Play, StopCircle, XCircle, DollarSign } from "lucide-react";

export default function OngoingRidePage() {

    // Dummy ride data (later API দিয়ে আনবেন)
    const [ride, setRide] = useState({
        id: "RIDE-2025",
        pickup: "Uttara, Sector 10",
        dropoff: "Dhanmondi, Road 11",
        distance: 12,
        estTime: 25,
        fare: { base: 50, distance: 120, total: 170, commission: 10 },
        passenger: { name: "Jahid", phone: "+8801712345678" },
        status: "assigned",
    });

    // Passenger Modal state
    const [showPassenger, setShowPassenger] = useState(false);

    // Control button handlers
    const handleStart = () => setRide({ ...ride, status: "on_the_way" });
    const handleEnd = () => setRide({ ...ride, status: "completed" });
    const handleCancel = () => setRide({ ...ride, status: "cancelled" });

    return (
        <div className="p-4  space-y-4">
            {/* Current Trip Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Current Trip Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Pickup:</span> {ride.pickup}
                    </p>
                    <p>
                        <span className="font-medium">Dropoff:</span> {ride.dropoff}
                    </p>
                    <p>
                        <span className="font-medium">Distance:</span> {ride.distance} km
                    </p>
                    <p>
                        <span className="font-medium">Estimated Time:</span> {ride.estTime} min
                    </p>
                    <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                            className={`px-2 py-1 rounded text-xs ${ride.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : ride.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                        >
                            {ride.status}
                        </span>
                    </p>
                </CardContent>
            </Card>

            {/* Fare Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Fare Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="flex justify-between">
                        <span>Base Fare</span>
                        <span>${ride.fare.base}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Distance Fare</span>
                        <span>${ride.fare.distance}</span>
                    </p>
                    <p className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${ride.fare.total}</span>
                    </p>
                    <p className="flex justify-between text-red-600">
                        <span>Commission</span>
                        <span>-${ride.fare.commission}</span>
                    </p>
                    <p className="flex justify-between font-bold text-green-600">
                        <span>Earning</span>
                        <span>${ride.fare.total - ride.fare.commission}</span>
                    </p>
                </CardContent>
            </Card>

            {/* Passenger Info (Modal) */}
            <div>
                <Button variant="outline" onClick={() => setShowPassenger(true)}>
                    View Passenger Info
                </Button>
                <Dialog open={showPassenger} onOpenChange={setShowPassenger}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Passenger Info</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Name:</span> {ride.passenger.name}
                            </p>
                            <p>
                                <span className="font-medium">Phone:</span> {ride.passenger.phone}
                            </p>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 mt-2"
                                onClick={() => window.open(`tel:${ride.passenger.phone}`, "_self")}
                            >
                                <PhoneCall className="w-4 h-4" /> Call Passenger
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Control Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Controls</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {ride.status === "assigned" && (
                        <Button onClick={handleStart} className="flex items-center gap-2 cursor-pointer">
                            <Play className="w-4 h-4" /> Start Ride
                        </Button>
                    )}

                    {ride.status === "on_the_way" && (
                        <Button onClick={handleEnd} className="flex items-center gap-2  cursor-pointer">
                            <StopCircle className="w-4 h-4" /> End Ride
                        </Button>
                    )}

                    {ride.status !== "completed" && ride.status !== "cancelled" && (
                        <Button
                            onClick={handleCancel}
                            variant="destructiveOutline"
                        >
                            <XCircle className="w-4 h-4" /> Cancel Ride
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

