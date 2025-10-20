"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, DollarSign, User, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RideHistory() {
  const [rideHistory, setRideHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 🧩 Ride History & Reviews fetch
  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/all`);
        if (!res.ok) throw new Error("Failed to fetch ride history");
        const data = await res.json();
        setRideHistory(data);
      } catch (err) {
        console.error(" Ride History Error:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride-reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Reviews Error:", err);
      }
    };

    Promise.all([fetchRideHistory(), fetchReviews()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // 🧮 Summary
  const completedRides = rideHistory.filter((ride) => ride.status === "Paid");
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
      : 0;

  const summary = {
    totalRides: rideHistory.length,
    totalCompletedRides: completedRides.length,
    totalCommission: rideHistory.reduce(
      (acc, ride) => acc + (ride.rideDetails?.fareBreakdown?.totalAmount || 0),
      0
    ),
    totalReviews: reviews.length,
    avgRating,
  };

  // Pagination data
  const totalPages = Math.ceil(rideHistory.length / itemsPerPage);
  const paginatedRides = rideHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🌟 Skeleton Loader for Table
  const TableSkeleton = () => (
    <tbody>
      {[...Array(itemsPerPage)].map((_, i) => (
        <tr key={i} className="border-t">
          {[...Array(8)].map((_, j) => (
            <td key={j} className="px-4 py-2">
              <Skeleton className="h-4 w-full bg-accent/80 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // 🌟 Star icon list generate
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= rating ? "text-primary" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="p-4 space-y-6 mt-6 max-w-screen mx-auto lg:w-full md:w-full">
      {/* Summary cards */}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Rides */}

        <div
          className="mr-10 p-6 bg-accent/30 rounded-2xl flex flex-col items-center border border-primary "
        >
          <User className="w-8 h-8 text-primary mb-2" />
          <h2 className="text-lg font-semibold md:text-[16px]">Total Rides</h2>
          {loading ? (
            <Skeleton className="h-6 w-12 mt-2 bg-accent/80" />
          ) : (
            <h2 className="text-2xl font-bold text-primary">
              {summary.totalRides}
            </h2>
          )}
        </div>

        {/* Completed Rides */}
        <div
          className="
       mr-10 p-6 bg-accent/30 rounded-2xl flex flex-col items-center border border-primary"
        >
          <Check className="w-8 h-8 mt-2 text-primary mb-2" />
          <h2 className="text-lg mt-2 font-semibold md:text-[16px]">
            Completed Rides
          </h2>
          {loading ? (
            <Skeleton className="h-6 w-12  bg-accent/80" />
          ) : (
            <h2 className="text-2xl font-bold text-primary">
              {summary.totalCompletedRides}
            </h2>
          )}
        </div>

        {/* Average Rating */}
        <div
           className="
       mr-10 p-6 bg-accent/30 rounded-2xl flex flex-col items-center border border-primary"
        >
          <Star className="w-8 h-8 text-primary mb-2" />
          <h2 className="text-lg  font-semibold mt-2 md:text-[16px]">
            Average Rating
          </h2>
          <div className="flex items-center space-x-0">
            {loading ? (
              <Skeleton className="h-5 w-16 mt-1 bg-accent/80" />
            ) : (
              <>
                <span className="ml-2 text-primary md:text-[18px] font-bold">
                  {summary.avgRating.toFixed(1)}/5
                </span>
                {renderStars(Math.round(summary.avgRating))}
              </>
            )}
          </div>
        </div>



        {/* Total Amount */}
        <div
          className="
       mr-10 p-6 bg-accent/30 rounded-2xl flex flex-col items-center border border-primary"
        >
          <DollarSign className="w-8 h-8 text-primary mb-2" />
          <h2 className="text-lg font-semibold md:text-[16px]">Total Amount</h2>
          {loading ? (
            <Skeleton className="h-6 w-16 mt-2 bg-accent/80" />
          ) : (
            <h2 className="text-2xl font-bold text-primary">
              ৳{summary.totalCommission.toFixed(2)}
            </h2>
          )}
        </div>
      </div>

      {/* Ride Table */}
      <div className="overflow-x-auto mr-10 border border-accent  mt-10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-accent text-left">
            <tr>
              <th className="px-4 py-2">User Email</th>
              <th className="px-4 py-2">Pickup → Drop</th>
              <th className="px-4 py-2">Vehicle</th>
              <th className="px-4 py-2">Distance (km)</th>
              <th className="px-4 py-2">Fare (৳)</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment Time</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : paginatedRides.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-4 text-muted-foreground"
                >
                  No rides found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {paginatedRides.map((ride) => (
                <tr
                  key={ride._id}
                  className="border-t hover:bg-primary "
                >
                  <td className="px-4 py-2 ">{ride.userEmail || "N/A"}</td>
                  <td className="px-4 py-2">
                    {ride.rideDetails?.pickup?.split(",")[0]} →{" "}
                    {ride.rideDetails?.drop?.split(",")[0]}
                  </td>
                  <td className="px-4 py-2">
                    {ride.rideDetails?.vehicleType || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {ride.rideDetails?.distance?.toFixed(2) || 0}
                  </td>
                  <td className="px-4 py-2 font-semibold hover:text-white">
                    {ride.rideDetails?.fareBreakdown?.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{ride.paymentMethod || "N/A"}</td>
                  <td
                    className={`px-4 py-2 hover:text-white font-semibold ${
                      ride.status === "Paid"
                        ? "text-green-600"
                        : "text-primary"
                    }`}
                  >
                    {ride.status}
                  </td>
                  <td className="px-4 py-2">
                    {ride.timestamps?.paymentInitiatedAt
                      ? new Date(
                          ride.timestamps.paymentInitiatedAt
                        ).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && rideHistory.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
