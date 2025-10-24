"use client";
import { useState, useEffect, useRef } from "react";
import { OctagonPause, OctagonX } from "lucide-react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { toast } from "sonner";

const RiderStatus = () => {
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [riderId, setRiderId] = useState(null);
  const locationIntervalRef = useRef(null);
  const { user } = useAuth();

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
          setOnline(userData.status === "online");
        }
      } catch (err) {
        console.error("Fetch rider error:", err);
      }
    };

    fetchRider();
  }, [user]);

  useEffect(() => {
    if (online && riderId && navigator.geolocation) {
      updateLocation();

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

  const toggleStatus = async () => {
    if (!riderId) return;
    setLoading(true);

    try {
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/userId?userId=${user.id}`
      );
      const checkData = await checkRes.json();
      const currentStatus = checkData?.status || "offline";

      const newStatus = currentStatus === "online" ? "offline" : "online";

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

      if (statusData?.success) {
        setOnline(newStatus === "online");
        toast.success(`Status changed to ${newStatus}`);
      } else {
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
      className={`flex items-center justify-center p-2.5 rounded-full bg-muted hover:bg-accent transition cursor-pointer duration-300
        ${loading || !riderId ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      aria-pressed={online}
    >
      {online ? (
        <OctagonPause className="w-5 h-5 text-destructive" />
      ) : (
        <OctagonX className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
};

export default RiderStatus;
