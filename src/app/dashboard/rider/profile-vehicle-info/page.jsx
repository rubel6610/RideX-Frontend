"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`;

export default function ProfileVehicleInfoPage() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // current user id (test purpose)
  const currentUserId = "66f2c60056b78c1234abcd66";

  // 🟡 Fetch all riders data from backend
  const fetchRiders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/riders`);
      console.log("📦 Riders API Response:", res.data);

      // ✅ Handle both possible structures safely
      const fetchedRiders = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      setRiders(fetchedRiders);
    } catch (err) {
      console.error("❌ Error fetching riders:", err);
      setError("Failed to load rider data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  // ✅ Safely find current rider
  const currentRider = Array.isArray(riders)
    ? riders.find((rider) => rider._id === currentUserId)
    : null;

  // Loading state
  if (loading) {
    return <p className="text-center mt-10 text-blue-500">Loading rider data...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  // No rider found
  if (!currentRider) {
    return <p className="text-center mt-10 text-gray-500">No profile data found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-md bg-accent/50 rounded-2xl hover:border-primary group-hover:bg-accent border border-border">
      <CardHeader>
        <h2 className="text-2xl font-semibold">{currentRider.fullName}</h2>
        <p className="text-sm text-muted-foreground">{currentRider.email}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vehicle Info */}
        <div className="border-t pt-3">
          <p>
            <span className="font-medium">Vehicle Type:</span>{" "}
            {currentRider.vehicleType}
          </p>
          <p>
            <span className="font-medium">Model:</span> {currentRider.vehicleModel}
          </p>
          <p>
            <span className="font-medium">Registration No:</span>{" "}
            {currentRider.vehicleRegisterNumber}
          </p>
          <p>
            <span className="font-medium">Driving License:</span>{" "}
            {currentRider.drivingLicense}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-md ${
                currentRider.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {currentRider.status}
            </span>
          </p>
        </div>
      </CardContent>
    </div>
  );
}
