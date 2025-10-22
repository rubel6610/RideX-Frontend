"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatModal from "@/components/Shared/ChatModal";

export default function OngoingRidePage() {


    // Passenger Modal state
    const { user } = useAuth();
    const [rideData, setRideData] = useState(null);
    const [users, setusers] = useState(null);
    const [currentRider, setCurrentRider] = useState(null);
    const [error, setError] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const riderId = user?.id;


    useEffect(() => {
        if (!riderId) return;

        const fetchRide = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/specific-rider-ride/${riderId}`);
                const data = await res.json();
                // console.log(data);
                setRideData(data?.rides);
                setCurrentRider(data?.rider?._id)
            }
            catch (err) {
                setError(err.message);
            };
        }
        fetchRide();
    }, [riderId]);

    // this is current ride data so this data show in UI
    const matchedRide = rideData?.find(ride => ride.riderId === currentRider) || [];
    console.log(matchedRide?.userId);


    // when passender info come from server side then this useeffect open
    useEffect(() => {
  if (!matchedRide?.userId) return; // userId না থাকলে কিছু করব না

  const fetchPassenger = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?userId=${matchedRide.userId}`
      );
      const data = await res.json();
      setusers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchPassenger();
}, [matchedRide?.userId]);

    const {
        fare,
        vehicleType,
        status,
        pickup,
        drop,
        createdAt,
        riderInfo
    } = matchedRide;

    if (error) return <p>Error: {error}</p>;
    if (!rideData) return <p>No ride found</p>;
    if (!matchedRide) return <p>No ride found</p>;

    // Check if chat is allowed (only for accepted rides, not completed/cancelled)
    const isChatAllowed = matchedRide.status === 'accepted' || matchedRide.status === 'pending';

    return (
        <div className="flex justify-center p-4">
            <div className="w-full max-w-5xl rounded-2xl p-6 md:p-10">
                <h2 className="text-3xl font-bold text-foreground text-center mb-10">
                    Ride Details
                </h2>

                {/* Chat Button */}
                {isChatAllowed ? (
                    <div className="flex justify-center mb-6">
                        <Button
                            onClick={() => setChatOpen(true)}
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-3 text-lg font-semibold"
                        >
                            <MessageCircle className="w-6 h-6" />
                            Chat with Passenger
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center mb-6">
                        <div className="px-8 py-4 rounded-full bg-muted border border-border text-muted-foreground text-center">
                            <p className="text-sm font-medium">
                                {matchedRide.status === 'completed' && '✅ Ride completed - Chat is no longer available'}
                                {matchedRide.status === 'cancelled' && '❌ Ride cancelled - Chat is not available'}
                                {matchedRide.status === 'rejected' && '❌ Ride rejected - Chat is not available'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Grid Layout for Left & Right Part */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT SIDE - Rider Info */}
                    <div className="p-6 shadow-md bg-accent/50 hover:bg-accent/80 rounded-2xl flex flex-col transition-all hover:border-primary border border-border">
                        <h3 className="text-lg md:text-xl font-semibold mb-4  border-b pb-2">
                            Passenger Information
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <strong>Name:</strong> {riderInfo?.fullName}
                            </li>
                            <li>
                                <strong>Email:</strong> {riderInfo?.email}
                            </li>
                            <li>
                                <strong>Vehicle:</strong> {riderInfo?.vehicleModel} (
                                {riderInfo?.vehicleType})
                            </li>
                            <li>
                                <strong>Register No:</strong> {riderInfo?.vehicleRegisterNumber}
                            </li>
                            <li>
                                <strong>Completed Rides:</strong> {riderInfo?.completedRides}
                            </li>
                            <li>
                                <strong>Ratings:</strong> {riderInfo?.ratings} ⭐
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT SIDE - Ride Info */}
                    <div className="p-6 shadow-md bg-accent/50 hover:bg-accent/80 rounded-2xl flex flex-col transition-all hover:border-primary border border-border">
                        <h3 className="text-lg md:text-xl font-semibold mb-4  border-b pb-2">
                            Ride Information
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <strong>Fare:</strong> ৳{fare?.toFixed(2)}
                            </li>
                            <li>
                                <strong>Vehicle Type:</strong> {vehicleType}
                            </li>
                            <li>
                                <strong>Status:</strong>{" "}
                                <span
                                    className="px-2 py-1 rounded-md text-sm font-medium text-primary border"
                                >
                                    {status}
                                </span>
                            </li>
                            <li>
                                <strong>Pickup Coordinates:</strong>{" "}
                                {pickup?.coordinates.join(", ")}
                            </li>
                            <li>
                                <strong>Drop Coordinates:</strong> {drop?.coordinates.join(", ")}
                            </li>
                            <li>
                                <strong>Created At:</strong>{" "}
                                {new Date(createdAt).toLocaleString()}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Chat Modal */}
                {matchedRide?._id && isChatAllowed && (
                    <ChatModal
                        open={chatOpen}
                        onClose={() => setChatOpen(false)}
                        riderName={users?.fullName || "Passenger"}
                        riderVehicle={users?.email || ""}
                        rideId={matchedRide._id}
                        riderId={currentRider}
                    />
                )}
            </div>
        </div>
    )
}
