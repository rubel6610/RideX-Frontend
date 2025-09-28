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
  Award,
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

// Demo promo codes for user reference
const availablePromos = [
  { code: "EIDSPECIAL20%", desc: "Eid Special 20% Off" },
  { code: "NEWYEAR10%", desc: "New Year 10% Off" },
  { code: "SUMMER05%", desc: "Summer 5% Off" },
];

const BookARide = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedType, setSelectedType] = useState("Bike");
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropMap, setShowDropMap] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("pickup")) setPickup(params.get("pickup"));
      if (params.get("drop")) setDrop(params.get("drop"));
      if (params.get("promo")) {
        setPromo(params.get("promo"));
        setAppliedPromo(params.get("promo"));
      }
    }
  }, []);

  useEffect(() => {
    const fetchDistance = async () => {
      if (!pickup || !drop) return;
      const type = selectedType.toLowerCase();
      // Pass appliedPromo to calculateFare if needed
      const result = await calculateFare(pickup, drop, type, appliedPromo);
      setRideData(result);
      console.log("Ride Data:", result);
    };
    fetchDistance();
  }, [pickup, drop, selectedType, appliedPromo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20 lg:p-10 rounded-2xl">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left: Booking Form */}
        <div className="md:col-span-3 bg-background rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-accent flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <h2 className="md:text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-foreground">
            Book Your Ride Now{" "}
            <Bike className="inline-block text-primary w-6 h-6 sm:w-7 sm:h-7" />
          </h2>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col gap-0 relative">
              <div className="flex items-center gap-2 relative z-10">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                <Input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onClick={() => setShowPickupMap(true)}
                  className="pl-10 pr-3 py-2 bg-accent/10 border border-primary rounded-lg text-sm sm:text-base font-medium focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                  placeholder="Pickup location"
                />
              </div>
              {/* Vertical line */}
              <div className="flex flex-col items-center relative">
                <MoveVertical className="h-7 sm:h-8 text-foreground/30 my-1" />
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                <Input
                  type="text"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  onClick={() => setShowDropMap(true)}
                  className="pl-10 pr-3 py-2 bg-accent/10 border border-primary rounded-lg text-sm sm:text-base font-medium focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
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

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Promo Code Section */}
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo code"
                className="max-w-xs text-sm"
              />
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-1 text-xs sm:text-sm"
                onClick={() => setAppliedPromo(promo)}
                disabled={!promo}
              >
                {promo === appliedPromo ? "Applied" : "Apply"}
              </Button>
            </div>
            {/* Available Promo Codes */}
            <div className="flex gap-2 mb-2">
              {availablePromos.map((p) => (
                <Button
                  key={p.code}
                  type="button"
                  variant="outline"
                  className="px-2 py-1 text-xs border-primary text-primary hover:bg-primary/10"
                  onClick={() => { setPromo(p.code); setAppliedPromo(p.code); }}
                >
                  {p.code}
                </Button>
              ))}
            </div>
          </div>

          {/* Ride Type Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-2">
            {["Bike", "CNG", "Car"].map((type) => (
              <button
                key={type}
                className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-lg ${selectedType === type
                    ? "bg-primary text-foreground"
                    : "bg-accent text-foreground border-accent hover:bg-primary/50 hover:text-foreground"
                  }`}
                onClick={() => setSelectedType(type)}
                type="button"
              >
                {type === "Bike" && <Bike className="w-4 h-4 sm:w-5 sm:h-5" />}
                {type === "CNG" && <BusFront className="w-4 h-4 sm:w-5 sm:h-5" />}
                {type === "Car" && <Car className="w-4 h-4 sm:w-5 sm:h-5" />}
                {type}
              </button>
            ))}
          </div>

          {/* Ride Option Cards */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {rideOptions
              .filter((opt) => opt.type === selectedType)
              .map((opt) => (
                <div
                  key={opt.type}
                  className="rounded-xl border border-accent bg-accent/10 hover:bg-accent/50 hover:border-primary p-3 sm:p-5 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    {opt.icon}
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      <BdtIcon />
                      {rideData?.cost || opt.price}
                    </span>
                    {rideData?.promoApplied && (
                      <span className="ml-2 text-xs text-green-600 font-semibold bg-green-100/60 px-2 py-0.5 rounded">
                        -{rideData.discountPercent}%
                      </span>
                    )}
                  </div>
                  {rideData?.promoApplied && (
                    <div className="text-xs text-green-700 font-medium mb-1">
                      Promo <span className="font-bold">{rideData.promoApplied}</span> applied!{' '}
                      <span className="line-through text-muted-foreground ml-1">
                        <BdtIcon />{rideData.cost && rideData.discountPercent ? (rideData.cost / (1 - rideData.discountPercent / 100)).toFixed(2) : ''}
                      </span>
                    </div>
                  )}
                  <div className="text-sm sm:text-base text-foreground font-semibold flex items-center gap-2">
                    {opt.driver} <Star className="w-4 h-4 text-yellow-400" />{" "}
                    {opt.rating} <span className="mx-1 text-primary">•</span>{" "}
                    {opt.vehicle}
                  </div>
                  {/* <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {rideData?.distanceKm
                      ? `${rideData.distanceKm} km • ${opt.eta}`
                      : opt.eta}
                  </div> */}
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {rideData?.distanceKm
                      ? `${rideData.distanceKm} km • Arrives in ${rideData.eta} min`
                      : opt.eta}
                  </div>

                  <Button variant="primary" className="ml-auto px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-base">
                    Ride Now
                  </Button>
                </div>
              ))}

            {/* Show other ride options */}
            {rideOptions
              .filter((opt) => opt.type !== selectedType)
              .map((opt) => (
                <div
                  key={opt.type}
                  className="rounded-xl border border-accent bg-accent/10 hover:bg-accent/50 hover:border-primary p-3 sm:p-5 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    {opt.icon}
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      <BdtIcon />
                      {opt.price}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base text-foreground font-semibold flex items-center gap-2">
                    {opt.driver} <Star className="w-4 h-4 text-yellow-400" />{" "}
                    {opt.rating} <span className="mx-1 text-primary">•</span>{" "}
                    {opt.vehicle}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {opt.eta}
                  </div>
                  <Button variant="primary" className="ml-auto px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-base">
                    Book Now
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Top Rated Riders */}
        <div className="md:col-span-1 bg-background rounded-2xl border border-accent p-6 flex flex-col gap-4 shadow-md h-max max-w-sm mx-auto w-full">
          <h3 className=" md:text-2xl font-bold text-center text-primary mb-2 flex items-center justify-center gap-2">
            <Award className="w-7 h-7 text-primary" />
            Top Rated Riders
          </h3>
          {topRiders.map((rider, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 border border-accent bg-accent/10 hover:bg-accent/50 hover:border-primary rounded-xl px-4 py-4 mb-1 transition-colors min-w-0 w-full"
            >
              {/* Avatar and Name/Type */}
              <div className="flex flex-col items-center gap-1 w-full">
                <UserCircle2 className="w-10 h-10 text-primary mb-1" />
                <div className="font-semibold text-foreground text-base text-center truncate w-full">
                  {rider.name}
                </div>
                <div className="text-xs text-primary font-medium text-center mb-1">
                  {rider.type}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-yellow-400 font-semibold">
                  <Star className="w-4 h-4" />
                  {rider.rating}
                </div>
              </div>
              {/* Button */}
              <Button variant="primary" className="mt-2 px-3 py-1 text-xs sm:text-sm w-full max-w-[120px] mx-auto">
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookARide;
