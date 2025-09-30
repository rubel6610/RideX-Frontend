"use client";
import { useState, useEffect, useRef } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

const RiderStatus = ({ userId }) => {
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const locationIntervalRef = useRef(null); // interval id store

  // প্রথমে rider-এর তথ্য আনা
  useEffect(() => {
    if (!userId) return;

    const fetchRider = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/${userId}`
        );
        const rider = await res.json();

        if (rider) {
          setOnline(rider.status === "online");
        }
      } catch (err) {
        console.error("Fetch rider error:", err);
      }
    };

    fetchRider();
  }, [userId]);

  // online হলে প্রতি 5 সেকেন্ডে location আপডেট
  useEffect(() => {
    if (online && userId && navigator.geolocation) {
      // first immediate call
      updateLocation();

      // set interval for every 5 sec
      locationIntervalRef.current = setInterval(() => {
        updateLocation();
      }, 5000);
    }

    // cleanup interval when offline or unmount
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, userId]);

  const updateLocation = async () => {
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = pos.coords;

      const locRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/location`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, latitude, longitude }),
        }
      );
      const locData = await locRes.json();
      console.log(locData.modifiedCount);
    } catch (err) {
      console.error("Update location error:", err);
    }
  };

  const toggleStatus = async () => {
    if (!userId) return;

    const newStatus = online ? "offline" : "online";
    setLoading(true);

    try {
      // status update by userId
      const statusRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status: newStatus }),
        }
      );
      const statusData = await statusRes.json();
      // console.log("Status response:", statusData);

      // যদি offline হয় interval clear হবে useEffect cleanup থেকে
      setOnline(newStatus === "online");
    } catch (err) {
      console.error("Toggle status error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading || !userId}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40
        ${online
          ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-200"
          : "bg-red-100 border-red-500 text-red-700 hover:bg-red-200"}
        ${loading || !userId ? "opacity-60 cursor-not-allowed" : ""}`}
      aria-pressed={online}
    >
      {online ? (
        <ToggleRight className="w-5 h-5" />
      ) : (
        <ToggleLeft className="w-5 h-5" />
      )}
      <span className="ml-1">{online ? "Online" : "Offline"}</span>
    </button>
  );
};

export default RiderStatus;
