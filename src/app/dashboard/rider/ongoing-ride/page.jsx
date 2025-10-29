"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatModal from "@/components/Shared/ChatModal";
import { initSocket } from "@/components/Shared/socket/socket";
import { toast } from "sonner";

export default function OngoingRidePage() {

    const { user } = useAuth();
    const [rideData, setRideData] = useState(null);
    const [users, setusers] = useState(null);
    const [currentRider, setCurrentRider] = useState(null);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const riderId = user?.id;

    useEffect(() => {
        if (!user?.id) return;

        const socket = initSocket(user.id, false);

        socket.on('new_message_notification', (data) => {
            toast.info('New message from passenger', {
                description: data.message,
                duration: 5000,
            });
        });

        return () => {
            socket.off('new_message_notification');
        };
    }, [user]);

    useEffect(() => {
        if (!riderId) return;

        const fetchRide = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/specific-rider-ride/${riderId}`);
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                // console.log(data);
                setRideData(data?.rides || []);
                setCurrentRider(data?.rider?._id);
                setError(null); // Clear any previous errors
            }
            catch (err) {
                console.error('Error fetching ride data:', err);
                setError(err.message);
                setRideData([]);
            } finally {
                setLoading(false);
            }
        }
        fetchRide();
    }, [riderId]);

    // this is current ride data so this data show in UI - Only show accepted rides
    const matchedRide = rideData?.find(ride => ride.riderId === currentRider && ride.status === 'accepted') || null;
    console.log(matchedRide?.userId);

    // passengger data fetch 
    useEffect(() => {
        if (!matchedRide?.userId) return;

        const fetchPassenger = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?userId=${matchedRide.userId}`
                );
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                setusers(data);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching passenger data:', err);
                setError(err.message);
            }
        };

        fetchPassenger();
    }, [matchedRide?.userId]);

    //  Safely destructure with fallback to prevent null errors
    const {
<<<<<<< HEAD
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
    console.log(matchedRide);
=======
        fare = null,
        vehicleType = null,
        status = null,
        pickup = null,
        drop = null,
        acceptedAt = null,
        createdAt = null,
        assignedAt = null,
        riderInfo = null
    } = matchedRide || {};

    //  Safely extract coordinates with null checks
    const CurrentRideLocation = matchedRide?.drop?.coordinates || [];
    const longitude = CurrentRideLocation[0];
    const latitude = CurrentRideLocation[1];
>>>>>>> 6f10498a21f748179b94f9a20ac6cf5f63e40e35

    const fetchLocationName = async (lat, lon) => {
        try {
            if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                return "Invalid coordinates";
            }
            
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            return data.display_name || "Location not found";
        } catch (error) {
            console.error("Error fetching location name:", error);
            return "Location unavailable";
        }
    };

    useEffect(() => {
        const CurrentRideLocation = matchedRide?.drop?.coordinates;
        const longitude = CurrentRideLocation?.[0];
        const latitude = CurrentRideLocation?.[1];

        if (longitude !== undefined && latitude !== undefined) {
            const getLocation = async () => {
                try {
                    const name = await fetchLocationName(latitude, longitude);
                    setLocationName(name);
                } catch (error) {
                    console.error("Error fetching location name:", error);
                    setLocationName("Location unavailable");
                }
            };
            getLocation();
        }
    }, [matchedRide]);

    // Check if chat is allowed based on ride status
    const isChatAllowed = matchedRide?.status === 'accepted' || matchedRide?.status === 'pending';

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border">
                    <div className="p-4 md:p-6 bg-chart-2/80 flex flex-col border-b md:border-b-0 md:border-r border-border">
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted animate-pulse"></div>
                        </div>
                        <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4 mx-auto"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                                    <div className="h-4 flex-1 bg-muted animate-pulse rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-accent/30 flex flex-col">
                        <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                                    <div className="h-4 flex-1 bg-muted animate-pulse rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center text-destructive p-6">Error: {error}</p>;

    if (!matchedRide) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border-2 border-dashed border-border">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-28 h-28 text-muted-foreground relative z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                    </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">No Active Rides</h2>
                <p className="text-center max-w-md text-muted-foreground text-sm md:text-base px-4">
                    You currently have no ongoing rides between you and any passenger. Accept a ride from the Available Rides section to see it here.
                </p>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                        href="/dashboard/rider/available-rides"
                        className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    >
                        View Available Rides
                    </a>
                </div>
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
