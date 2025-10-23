"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatModal from "@/components/Shared/ChatModal";

export default function OngoingRidePage() {

    const { user } = useAuth();
    const [rideData, setRideData] = useState(null);
    const [users, setusers] = useState(null);
    const [currentRider, setCurrentRider] = useState(null);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("");
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

    // passengger data fetch 
    useEffect(() => {
        if (!matchedRide?.userId) return;

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
        acceptedAt,
        createdAt,
        assignedAt,
        riderInfo
    } = matchedRide;

    const CurrentRideLocation = matchedRide?.drop?.coordinates;
    const longitude = CurrentRideLocation?.[0];
    const latitude = CurrentRideLocation?.[1];
    console.log(longitude, latitude);

    const fetchLocationName = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            return data.display_name || "Location not found";
        } catch (error) {
            console.error(error);
            return "Location not found";
        }
    };

    useEffect(() => {
        const CurrentRideLocation = matchedRide?.drop?.coordinates;
        const longitude = CurrentRideLocation?.[0];
        const latitude = CurrentRideLocation?.[1];

        if (longitude !== undefined && latitude !== undefined) {
            const getLocation = async () => {
                const name = await fetchLocationName(latitude, longitude);
                setLocationName(name);
            };
            getLocation();
        }
    }, [matchedRide]);

    // Check if chat is allowed based on ride status
    const isChatAllowed = matchedRide?.status === 'accepted' || matchedRide?.status === 'pending';

    if (error) return <p>Error: {error}</p>;

    if (!matchedRide || !rideData) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 mb-6 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-6h6v6m2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z"
                    />
                </svg>

                <h2 className="text-2xl font-bold mb-2">No ongoing rides</h2>
                <p className="text-center max-w-sm">
                    You currently have no ongoing rides. Start a ride to see it listed here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-2 md:p-4">
            <div className="w-full max-w-5xl rounded-2xl p-4 md:p-6 lg:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
                    Ride Details
                </h2>

                {/* Chat Button */}
                {isChatAllowed ? (
                    <div className="flex justify-center mb-4 md:mb-6">
                        <Button
                            onClick={() => setChatOpen(true)}
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-6 md:px-8 py-4 md:py-6 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 md:gap-3 text-base md:text-lg font-semibold"
                        >
                            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                            Chat with Passenger
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center mb-4 md:mb-6">
                        <div className="px-4 md:px-8 py-3 md:py-4 rounded-full bg-muted border border-border text-muted-foreground text-center">
                            <p className="text-xs md:text-sm font-medium">
                                {matchedRide?.status === 'completed' && '✅ Ride completed - Chat is no longer available'}
                                {matchedRide?.status === 'cancelled' && '❌ Ride cancelled - Chat is not available'}
                                {matchedRide?.status === 'rejected' && '❌ Ride rejected - Chat is not available'}
                                {(!matchedRide?.status || (matchedRide.status !== 'accepted' && matchedRide.status !== 'pending')) && '⚠️ Chat is not available'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Grid Layout for Left & Right Part */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border">
                    {/* LEFT SIDE - Passenger Info */}
                    <div className="p-4 md:p-6 shadow-md bg-chart-2/80 flex flex-col border-b md:border-b-0 md:border-r border-border">

                        {/* Profile Image */}
                        <div className="flex text-start justify-center mb-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
                                <img
                                    src={users?.photoUrl || "/default-avatar.png"}
                                    alt={users?.fullName || "User"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Passenger Info */}
                        <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4 border-b border-border pb-2 w-full text-center text-foreground">
                            Passenger Information
                        </h3>
                        <div className="flex-1">
                            <ul className="space-y-2 text-xs md:text-sm lg:text-base w-full text-left">
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Name:</strong> 
                                    <span className="text-foreground">{users?.fullName || 'N/A'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Email:</strong> 
                                    <span className="text-foreground break-all">{users?.email || 'N/A'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Gender:</strong> 
                                    <span className="text-foreground">{users?.gender || 'N/A'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Completed Rides:</strong> 
                                    <span className="text-foreground">{users?.completedRides || 0}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Verified:</strong> 
                                    <span className="text-foreground">{users?.isVerified ? '✅ Yes' : '❌ No'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">NID No:</strong> 
                                    <span className="text-foreground">{users?.NIDno || 'N/A'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Phone:</strong> 
                                    <span className="text-foreground">{users?.phoneNumber || 'N/A'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Ride Info */}
                    <div className="p-4 md:p-6 shadow-md bg-accent/30 flex flex-col">
                        <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4 border-b border-border pb-2 text-foreground">
                            Ride Information
                        </h3>
                        <ul className="space-y-2 text-xs md:text-sm lg:text-base">
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Fare:</strong> 
                                <span className="text-foreground font-semibold">৳{fare?.toFixed(2) || 'N/A'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Vehicle Type:</strong> 
                                <span className="text-foreground">{vehicleType || 'N/A'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Status:</strong>{" "}
                                <span className="px-2 py-1 rounded-md text-xs md:text-sm font-medium text-primary border border-primary bg-primary/10">
                                    {status || 'N/A'}
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Accept At:</strong>{" "}
                                <span className="text-foreground">{acceptedAt ? new Date(acceptedAt).toLocaleString() : 'N/A'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Assigned At:</strong>{" "}
                                <span className="text-foreground">{assignedAt ? new Date(assignedAt).toLocaleString() : 'N/A'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Created At:</strong>{" "}
                                <span className="text-foreground">{createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <strong className="min-w-[100px] md:min-w-[140px] text-muted-foreground">Drop Location:</strong> 
                                <span className="text-foreground">{locationName || "Loading..."}</span>
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
