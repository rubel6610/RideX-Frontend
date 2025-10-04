import React, { useEffect, useState } from "react";

const User = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rides data
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rides");
        const data = await res.json();
        setRides(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rides:", error);
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) return <p>Loading rides...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rides.map((ride) => (
        <div
          key={ride._id}
          className="bg-white text-black shadow-md rounded-lg p-4 border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">
            Rider: {ride.riderInfo?.fullName}
          </h2>
          <p>
            <strong>Vehicle:</strong> {ride.riderInfo?.vehicleModel} (
            {ride.vehicleType})
          </p>
          <p>
            <strong>Reg No:</strong> {ride.riderInfo?.vehicleRegisterNumber}
          </p>
          <p>
            <strong>Fare:</strong> {ride.fare} ৳
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                ride.status === "pending"
                  ? "text-yellow-600"
                  : ride.status === "accepted"
                  ? "text-green-600"
                  : "text-red-600"
              } font-medium`}
            >
              {ride.status}
            </span>
          </p>
          <p>
            <strong>Distance:</strong>{" "}
            {ride.distance ? ride.distance.toFixed(2) : 0} km
          </p>
          <p className="text-sm text-gray-500">
            Created At: {new Date(ride.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default User
