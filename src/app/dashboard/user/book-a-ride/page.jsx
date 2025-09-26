"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bike,
  BusFront,
  Car,
  MapPin,
  Navigation,
  Star,
  UserCircle2,
  MoveVertical,
} from "lucide-react";
import dynamic from "next/dynamic";
import { calculateFare } from "@/components/Shared/fareCalculator";

const MapPopup = dynamic(() => import("@/components/Shared/MapPopup"), {
  ssr: false,
});

const BdtIcon = () => (
  <span className="inline-block font-bold text-primary align-middle mr-1">
    ৳
  </span>
);

const rideOptions = [
  {
    type: "Bike",
    icon: <Bike className="inline-block mr-1 text-primary" />,
    price: 120,
    driver: "John D.",
    rating: 4.9,
    vehicle: "Pulsar 150",
    eta: "Arrives in 5 min",
    rides: 500,
  },
  {
    type: "Car",
    icon: <Car className="inline-block mr-1 text-primary" />,
    price: 350,
    driver: "Amit H.",
    rating: 4.7,
    vehicle: "Toyota Aqua",
    eta: "Arrives in 8 min",
    rides: 320,
  },
  {
    type: "CNG",
    icon: <BusFront className="inline-block mr-1 text-primary" />,
    price: 200,
    driver: "Rahim U.",
    rating: 4.8,
    vehicle: "CNG",
    eta: "Arrives in 7 min",
    rides: 410,
  },
];

const topRiders = [
  {
    name: "Akram Hosen",
    type: "Bike",
    rating: 4.9,
    rides: 500,
    vehicle: "Pulsar NS 150",
  },
  {
    name: "Siam",
    type: "CNG",
    rating: 4.9,
    rides: 500,
    vehicle: "Bajaj",
  },
  {
    name: "Asgor Ali",
    type: "Bike",
    rating: 4.9,
    rides: 500,
    vehicle: "Pulsar NS 150",
  },
  {
    name: "Abdur Rahim",
    type: "Car",
    rating: 4.9,
    rides: 500,
    vehicle: "Corolla- 2000",
  },
  {
    name: "Istiak",
    type: "Bike",
    rating: 4.9,
    rides: 500,
    vehicle: "Pulsar NS 150",
  },
];

const BookARide = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedType, setSelectedType] = useState("Bike");
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropMap, setShowDropMap] = useState(false);
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("pickup")) setPickup(params.get("pickup"));
      if (params.get("drop")) setDrop(params.get("drop"));
    }
  }, []);

  useEffect(() => {
    const fetchDistance = async () => {
      if (!pickup || !drop) return;

      const type = selectedType.toLowerCase();
      const result = await calculateFare(pickup, drop, type);
      setRideData(result);
      console.log("Ride Data:", result);
    };

    fetchDistance();
  }, [pickup, drop, selectedType]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20 p-10 rounded-2xl">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Booking Form */}
        <div className="md:col-span-2 bg-background rounded-2xl shadow-lg p-8 border border-accent flex flex-col gap-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2 text-foreground">
            Book Your Ride Now <Bike className="inline-block text-primary" />
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0 relative">
              <div className="flex items-center gap-2 relative z-10">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                <Input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onClick={() => setShowPickupMap(true)}
                  className="pl-10 pr-3 py-2 bg-accent/10 border border-primary rounded-lg text-base font-medium focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                  placeholder="Pickup location"
                />
              </div>
              {/* Vertical line */}
              <div className="flex flex-col items-center relative">
                <MoveVertical className="h-8 text-foreground/30 my-1" />
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                <Input
                  type="text"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  onClick={() => setShowDropMap(true)}
                  className="pl-10 pr-3 py-2 bg-accent/10 border border-primary rounded-lg text-base font-medium focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                  placeholder="Where to go?"
                />
              </div>
            </div>

            {/* Popups */}
            {showPickupMap && (
              <MapPopup
                title="Select Pickup Location"
                onClose={() => setShowPickupMap(false)}
                onSelect={(loc) => {
                  setPickup(loc);
                //   setShowPickupMap(false);
                }}
                defaultCurrent={true}
              />
            )}
            {showDropMap && (
              <MapPopup
                title="Select Drop Location"
                onClose={() => setShowDropMap(false)}
                onSelect={(loc) => {
                  setDrop(loc);
                  setShowDropMap(false);
                }}
                // defaultCurrent={false}
              />
            )}
          </div>

          {/* Ride Type Tabs */}
          <div className="flex gap-2 mb-2">
            {["Bike", "CNG", "Car"].map((type) => (
              <button
                key={type}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-lg ${
                  selectedType === type
                    ? "bg-primary text-foreground"
                    : "bg-accent text-foreground border-accent hover:bg-primary/50 hover:text-foreground"
                }`}
                onClick={() => setSelectedType(type)}
                type="button"
              >
                {type === "Bike" && <Bike className="w-5 h-5" />}
                {type === "CNG" && <BusFront className="w-5 h-5" />}
                {type === "Car" && <Car className="w-5 h-5" />}
                {type}
              </button>
            ))}
          </div>

          {/* Ride Option Cards */}
          <div className="flex flex-col gap-4">
            {rideOptions
              .filter((opt) => opt.type === selectedType)
              .map((opt) => (
                <div
                  key={opt.type}
                  className="rounded-xl border-2 border-accent bg-accent/10 hover:bg-accent/50 hover:border-primary p-5 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-1">
                    {opt.icon}
                    <span className="text-2xl font-bold text-primary">
                      <BdtIcon />
                      {rideData?.cost || opt.price}
                    </span>
                  </div>
                  <div className="text-base text-foreground font-semibold flex items-center gap-2">
                    {opt.driver} <Star className="w-4 h-4 text-yellow-400" />{" "}
                    {opt.rating} <span className="mx-1 text-primary">•</span>{" "}
                    {opt.vehicle}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {rideData?.distanceKm
                      ? `${rideData.distanceKm} km • ${opt.eta}`
                      : opt.eta}
                  </div>
                  <Button variant="primary" className=" ml-auto">
                    Book Now
                  </Button>
                </div>
              ))}

            {/* Show other ride options */}
            {rideOptions
              .filter((opt) => opt.type !== selectedType)
              .map((opt) => (
                <div
                  key={opt.type}
                  className="rounded-xl border-2 border-accent bg-accent/10 hover:bg-accent/50 hover:border-primary p-5 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-1">
                    {opt.icon}
                    <span className="text-2xl font-bold text-primary">
                      <BdtIcon />
                      {opt.price}
                    </span>
                  </div>
                  <div className="text-base text-foreground font-semibold flex items-center gap-2">
                    {opt.driver} <Star className="w-4 h-4 text-yellow-400" />{" "}
                    {opt.rating} <span className="mx-1 text-primary">•</span>{" "}
                    {opt.vehicle}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {opt.eta}
                  </div>
                  <Button variant="primary" className=" ml-auto">
                    Book Now
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Top Rated Riders */}
        <div className="md:col-span-1 bg-background rounded-2xl border border-accent p-6 flex flex-col gap-4 shadow-md h-max">
          <h3 className="text-2xl font-bold text-center text-primary mb-2">
            Top Rated - Popular Riders
          </h3>
          {topRiders.map((rider, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border-2 border-accent bg-accent/10 hover:bg-accent/50 hover:border-primary rounded-xl px-4 py-3 mb-1 transition-colors"
            >
              <div className="flex-shrink-0">
                <UserCircle2 className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground leading-tight">
                  {rider.name}
                </div>
                <div className="text-xs text-primary font-medium">
                  {rider.type}
                </div>
                <div className="text-xs text-muted-foreground">
                  {rider.rating} Ratings ({rider.rides} Rides)
                </div>
                <div className="text-xs text-muted-foreground">
                  {rider.vehicle}
                </div>
              </div>
              <Button variant="primary" className="px-4 py-1 text-sm ml-auto">
                Ride Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookARide;
