"use client";
import { useState, useEffect, useRef } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { toast } from "sonner"; 

const RiderStatus = () => {
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [riderId, setRiderId] = useState(null);
  const locationIntervalRef = useRef(null);
  const { user } = useAuth();

  // fetch rider + status from backend on mount
  useEffect(() => {
    if (user?.role !== "rider") return;

    const fetchRider = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/userId?userId=${user.id}`
        );
        const userData = await res.json();

        if (userData?._id) {
          setRiderId(userData._id);
          // set status from backend
          setOnline(userData.status === "online");
        }
      } catch (err) {
        console.error("Fetch rider error:", err);
      }
    };

    fetchRider();
  }, [user]);

  // location updates only if backend status confirmed online
  useEffect(() => {
    if (online && riderId && navigator.geolocation) {
      updateLocation(); // immediate

      locationIntervalRef.current = setInterval(() => {
        updateLocation();
      }, 5000);
    }

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, riderId]);

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
          body: JSON.stringify({ riderId, latitude, longitude }),
        }
      );
      const locData = await locRes.json();
      console.log(locData?.message);
    } catch (err) {
      console.error("Update location error:", err);
    }
  };

  // toggling — check backend first then update
  const toggleStatus = async () => {
    if (!riderId) return;
    setLoading(true);

    try {
      // always get fresh status from backend first
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/userId?userId=${user.id}`
      );
      const checkData = await checkRes.json();
      const currentStatus = checkData?.status || "offline";

      const newStatus = currentStatus === "online" ? "offline" : "online";

      // call backend to update
      const statusRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ riderId, status: newStatus }),
        }
      );
      const statusData = await statusRes.json();
      console.log(statusData?.message);

      // only update UI if backend confirmed
      if (statusData?.success) {
        setOnline(newStatus === "online");

        // toast notify
        toast.success(`Status changed to ${newStatus}`);
      } else {
        console.warn("Status update failed, not changing UI");
        toast.error("Status update failed");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("Something went wrong updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading || !riderId}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40
        ${online
          ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-200"
          : "bg-red-100 border-red-500 text-red-700 hover:bg-red-200"}
        ${loading || !riderId ? "opacity-60 cursor-not-allowed" : ""}`}
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
