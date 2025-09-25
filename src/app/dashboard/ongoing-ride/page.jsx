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

          
        </div>
    )
}

