"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`;

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null); // ✅ track which code is copied

  // Fetch Active Offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${API_URL}/promotions`);
        const activeOffers = res.data.filter(
          (offer) => offer.status === "Active"
        );
        setOffers(activeOffers);
      } catch (error) {
        console.error("❌ Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // ✅ Copy handler with temporary feedback
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000); // reset after 2s
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading offers...
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        No active offers found.
      </div>
    );
  }

  return (
    <div className="p-6 mt-16 space-y-8 max-w-7xl mx-auto">
      {/* ✅ Header Section */}
      <div className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-10 rounded-xl shadow-sm">
        <h1 className="text-5xl font-extrabold text-primary drop-shadow-sm mb-3">
          RideX Exclusive Offers
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          💸 Save more on every ride — unlock special discounts, ride credits,
          and seasonal offers before they expire!
        </p>
      </div>

      {/* ✅ Offers Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <Card
            key={offer._id}
            className="relative border border-accent shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl"
          >
            {/* Discount Badge */}
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                {offer.discount}% OFF
              </Badge>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary line-clamp-2">
                {offer.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {offer.description ||
                  "Enjoy seamless rides at discounted rates!"}
              </p>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex justify-between items-center">
                <p className="text-sm font-mono">
                  Code:{" "}
                  <span className="font-bold text-primary">{offer.code}</span>
                </p>
                <Badge
                  className={`${
                    offer.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                      : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {offer.status}
                </Badge>
              </div>

              {/* ✅ Highlighted Validity Period */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="font-semibold">Valid:</span>{" "}
                <span className="bg-primary/10 text-primary font-medium px-2 py-1 rounded">
                  {offer.startDate}
                </span>{" "}
                <span className="mx-1 text-gray-400">→</span>{" "}
                <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-medium px-2 py-1 rounded">
                  {offer.endDate}
                </span>
              </div>

              {/* ✅ Copy Button with feedback */}
              <Button
                variant="default"
                className={`w-full mt-3 rounded-lg transition ${
                  copiedCode === offer.code
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-primary hover:bg-primary/90"
                } text-white`}
                onClick={() => handleCopyCode(offer.code)}
              >
                {copiedCode === offer.code ? "Code Copied" : "Copy Code"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
