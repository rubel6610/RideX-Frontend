"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowUp, ArrowDown, Play, StopCircle, XCircle, DollarSign, Repeat, Clock, Info, CheckCircle } from "lucide-react";

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
        <div className="space-y-4">
            <div className="p-8 shadow-md rounded-2xl hover:border-primary border border-border bg-accent/50">
                {/* Card Header */}
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-8 h-8 text-primary" /> Trip Details
                </h2>
                {/* Current Trip Info */}
                <div className="space-y-2 mt-4 border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ArrowUp className="w-4 h-4" />
                            <span className="font-medium">Pickup:</span>
                        </div>
                        <span>{ride.pickup}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ArrowDown className="w-4 h-4" />
                            <span className="font-medium">Dropoff:</span>
                        </div>
                        <span>{ride.dropoff}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Repeat className="w-4 h-4" />
                            <span className="font-medium">Distance:</span>
                        </div>
                        <span>{ride.distance} km</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Estimated Time:</span>
                        </div>
                        <span>{ride.estTime} min</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span className="font-medium">Status:</span>
                        </div>
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
                    </div>
                </div>

                {/* Fare Details */}
                <div className="space-y-2 mt-4 border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Base Fare</span>
                        </div>
                        <span>${ride.fare.base}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Repeat className="w-4 h-4" />
                            <span>Distance Fare</span>
                        </div>
                        <span>${ride.fare.distance}</span>
                    </div>

                    <div className="flex justify-between items-center font-medium">
                        <div className="flex items-center gap-2">
                            <Repeat className="w-4 h-4" />
                            <span>Total</span>
                        </div>
                        <span>${ride.fare.total}</span>
                    </div>

                    <div className="flex justify-between items-center text-red-600">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>Commission</span>
                        </div>
                        <span>-${ride.fare.commission}</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-green-600">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Earning</span>
                        </div>
                        <span>${ride.fare.total - ride.fare.commission}</span>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
                {ride.status === "assigned" && (
                    <Button onClick={handleStart} className="flex items-center gap-2 cursor-pointer">
                        <Play className="w-4 h-4" /> Start Ride
                    </Button>
                )}

                {ride.status === "on_the_way" && (
                    <Button onClick={handleEnd} className="flex items-center gap-2 cursor-pointer">
                        <StopCircle className="w-4 h-4" /> End Ride
                    </Button>
                )}

                {ride.status !== "completed" && ride.status !== "cancelled" && (
                    <Button onClick={handleCancel} variant="destructive" className="flex items-center gap-2 cursor-pointer">
                        <XCircle className="w-4 h-4" /> Cancel Ride
                    </Button>
                )}

                {ride.status == "cancelled" && (
                    <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2 border" disabled>
                        <XCircle className="w-4 h-4" /> Ride Canceled
                    </Button>
                )}
            </div>
        </div>

    )
}

