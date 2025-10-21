"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";

export default function OngoingRidePage() {

    // Passenger Modal state
    const [showPassenger, setShowPassenger] = useState(false);
    const { user } = useAuth();
    const [rideData, setRideData] = useState(null);
    const [users, setusers] = useState(null);
    const [currentRider, setCurrentRider] = useState(null);
    const [error, setError] = useState(null);
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

    // Current passenger info 
    // useEffect(() => {
    //     const fetchPassenger = async () => {
    //         try {
    //             const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?userId=${matchedRide?.userId}`);
    //             const data = await res.json();
    //             setusers(data)
    //         }
    //         catch (err) {
    //             setError(err.message);
    //         };
    //     }
    //     fetchPassenger()
    // }, []);
    // console.log(users);

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
    // if (!rideData) return <p className="max-w-full text-center">Loading . . .</p>;
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
        <div className="flex justify-center p-4">
            <div className="w-full max-w-5xl rounded-2xl p-6 md:p-10">
                <h2 className="text-3xl font-bold text-foreground text-center mb-6">
                    Ride Details
                </h2>

                {/* Grid Layout for Left & Right Part */}
                <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl">
                    {/* LEFT SIDE - Rider Info */}
                    <div className="p-6 shadow-md bg-chart-2 flex flex-col">
                        <h3 className="text-lg md:text-xl font-semibold mb-4  border-b pb-2">
                            Passenger Information
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <strong>Name:</strong> {riderInfo.fullName}
                            </li>
                            <li>
                                <strong>Email:</strong> {riderInfo.email}
                            </li>
                            <li>
                                <strong>Vehicle:</strong> {riderInfo.vehicleModel} (
                                {riderInfo.vehicleType})
                            </li>
                            <li>
                                <strong>Register No:</strong> {riderInfo.vehicleRegisterNumber}
                            </li>
                            <li>
                                <strong>Completed Rides:</strong> {riderInfo.completedRides}
                            </li>
                            <li>
                                <strong>Ratings:</strong> {riderInfo.ratings} ⭐
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT SIDE - Ride Info */}
                    <div className="p-6 shadow-md bg-accent/30 flex flex-col">
                        <h3 className="text-lg md:text-xl font-semibold mb-4  border-b pb-2">
                            Ride Information
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <strong>Fare:</strong> ৳{fare.toFixed(2)}
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
                                {pickup.coordinates.join(", ")}
                            </li>
                            <li>
                                <strong>Drop Coordinates:</strong> {drop.coordinates.join(", ")}
                            </li>
                            <li>
                                <strong>Created At:</strong>{" "}
                                {new Date(createdAt).toLocaleString()}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

