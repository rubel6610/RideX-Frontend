"use client";
import { useState } from "react";

export default function RequestRide() {
  const [pickup, setPickup] = useState("23.7509,90.3939");
  const [drop, setDrop] = useState("23.8103,90.4125");
  const [vehicleType, setVehicleType] = useState("Car");
  const [fare, setFare] = useState(350);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const requestRide = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "USER123",
          pickup: {
            type: "Point",
            coordinates: pickup
              .split(",")
              .map((coord) => parseFloat(coord.trim())),
          },
          drop: {
            type: "Point",
            coordinates: drop
              .split(",")
              .map((coord) => parseFloat(coord.trim())),
          },
          vehicleType,
          fare: parseFloat(fare),
        }),
      });

      const data = await res.json();
      setResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error requesting ride:", error);
      setResponse({ success: false, message: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Request a Ride</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Pickup (lat,lng)</label>
        <input
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Drop (lat,lng)</label>
        <input
          type="text"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="CNG">CNG</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fare</label>
        <input
          type="number"
          value={fare}
          onChange={(e) => setFare(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={requestRide}
        disabled={loading}
        className={`w-full py-2 rounded-md font-semibold text-white transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Requesting..." : "Request Ride"}
      </button>

      {response && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md border">
          <h3 className="font-medium mb-2">Response:</h3>
          <pre className="text-xs text-gray-700">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
