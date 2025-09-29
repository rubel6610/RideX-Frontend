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
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { calculateFare } from "@/components/Shared/fareCalculator";
import RideRequestMode from "@/components/Shared/RideRequestMode";

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
    type: "Cng",
    icon: <BusFront className="inline-block mr-1 text-primary" />,
    price: 200,
    driver: "Rahim U.",
    rating: 4.8,
    vehicle: "Cng",
    eta: "Arrives in 7 min",
    rides: 410,
  },
  {
    type: "Bike",
    icon: <Bike className="inline-block mr-1 text-primary" />,
    price: 130,
    driver: "Sami R.",
    rating: 4.6,
    vehicle: "Honda CB Shine",
    eta: "Arrives in 6 min",
    rides: 450,
  },
  {
    type: "Bike",
    icon: <Bike className="inline-block mr-1 text-primary" />,
    price: 125,
    driver: "Rony K.",
    rating: 4.8,
    vehicle: "Yamaha FZ",
    eta: "Arrives in 4 min",
    rides: 520,
  },
  {
    type: "Car",
    icon: <Car className="inline-block mr-1 text-primary" />,
    price: 400,
    driver: "Nabil S.",
    rating: 4.9,
    vehicle: "Honda City",
    eta: "Arrives in 10 min",
    rides: 360,
  },
  {
    type: "Car",
    icon: <Car className="inline-block mr-1 text-primary" />,
    price: 320,
    driver: "Tariq M.",
    rating: 4.7,
    vehicle: "Suzuki Swift",
    eta: "Arrives in 7 min",
    rides: 280,
  },
  {
    type: "Cng",
    icon: <BusFront className="inline-block mr-1 text-primary" />,
    price: 210,
    driver: "Fahim L.",
    rating: 4.8,
    vehicle: "Cng",
    eta: "Arrives in 6 min",
    rides: 430,
  },
  {
    type: "Cng",
    icon: <BusFront className="inline-block mr-1 text-primary" />,
    price: 190,
    driver: "Imran A.",
    rating: 4.7,
    vehicle: "Cng",
    eta: "Arrives in 5 min",
    rides: 390,
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
    type: "Cng",
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
  const [mode, setMode] = useState("auto");

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
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Booking Form */}
        <div className="md:col-span-2 bg-background rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-accent flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <h2 className="md:text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-foreground">
            Book Your Ride Now{" "}
            <Bike className="inline-block text-primary w-6 h-6 sm:w-7 sm:h-7" />
          </h2>
          {/* Ride Mode Select */}
          <RideRequestMode mode={mode} setMode={setMode} />
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
            <div className="flex items-center gap-2 mb-2 relative max-w-xs w-full">
              <Input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo code"
                className="pr-12 text-sm w-full"
              />
              {promo && (
                <Button
                  type="button"
                  variant="outline"
                  className="absolute right-19 top-1/2 -translate-y-1/2 z-20 rounded-full px-2"
                  onClick={() => { setPromo(""); setAppliedPromo(""); }}
                  tabIndex={-1}
                  aria-label="Clear promo code"
                  style={{ lineHeight: 0 }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                className="px-3 py-1 text-xs sm:text-sm absolute right-0 top-1/2 -translate-y-1/2 z-10"
                onClick={() => setAppliedPromo(promo)}
                disabled={!promo}
                style={{ minWidth: 60 }}
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
            {["Bike", "Cng", "Car"].map((type) => (
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
                {type === "Cng" && <BusFront className="w-4 h-4 sm:w-5 sm:h-5" />}
                {type === "Car" && <Car className="w-4 h-4 sm:w-5 sm:h-5" />}
                {type}
              </button>
            ))}
          </div>

          {/* Ride Option Cards */}
          {mode === "auto" && (
            pickup && drop ? (
              (() => {
                const opt = rideOptions.find((o) => o.type === selectedType);
                if (!opt) return null;
                return (
                  <div
                    key={selectedType}
                    className="rounded-2xl border border-primary/30 bg-card shadow-lg p-4 flex flex-col sm:flex-row items-center gap-4 w-full mt-4"
                  >
                    {/* Left: Icon + Type */}
                    <div className="flex flex-col items-center justify-center min-w-[90px]">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                        {opt.icon}
                      </div>
                      <span className="text-base font-bold text-primary uppercase tracking-wide text-center">{opt.type}</span>
                    </div>
                    {/* Center: Fare + Promo */}
                    <div className="flex-1 flex flex-col items-center sm:items-start gap-1">
                      <div className="flex items-end gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                          <BdtIcon />{rideData?.cost || opt.price}
                        </span>
                        {rideData?.promoApplied && (
                          <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100/80 px-2 py-0.5 rounded">
                            -{rideData.discountPercent}%
                          </span>
                        )}
                        {rideData?.promoApplied && (
                          <span className="line-through text-muted-foreground text-base ml-2">
                            <BdtIcon />{rideData.cost && rideData.discountPercent ? (rideData.cost / (1 - rideData.discountPercent / 100)).toFixed(2) : ''}
                          </span>
                        )}
                      </div>
                      {rideData?.promoApplied && (
                        <div className="text-xs text-green-700 font-medium">
                          Promo <span className="font-bold">{rideData.promoApplied}</span> applied!
                        </div>
                      )}
                    </div>
                    {/* Right: Distance, ETA, Button */}
                    <div className="flex flex-col items-center sm:items-end gap-2 min-w-[120px] w-full sm:w-auto">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{rideData?.distanceKm ? `${rideData.distanceKm} km` : '--'}</span>
                        <span className="mx-1">•</span>
                        <span>{opt.eta}</span>
                      </div>
                      <Button variant="primary" className="w-full sm:w-auto py-2 text-base font-semibold rounded-lg mt-2 sm:mt-0">
                        Request Now
                      </Button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="rounded-xl border-2 border-dashed border-primary/30 bg-background/60 shadow-none p-6 flex flex-col items-center justify-center w-full mt-4 text-center">
                <span className="text-lg font-semibold text-primary mb-2">Please, select two locations to start</span>
                <span className="text-sm text-muted-foreground">Please select both pickup and drop off locations to see fare details and request a ride.</span>
              </div>
            )
          )}

          {mode === "manual" && (
            pickup && drop ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
                {rideOptions.filter((opt) => opt.type === selectedType).map((opt) => (
                  <div
                    key={opt.driver + opt.vehicle}
                    className="rounded-2xl border-2 border-primary/30 bg-card shadow-md p-4 flex flex-col items-center gap-4 w-full"
                  >
                    {/* Left: Icon + Type */}
                    <div className="flex flex-col items-center justify-center min-w-[90px]">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                        {opt.icon}
                      </div>
                      <span className="text-base font-bold text-primary uppercase tracking-wide text-center">{opt.type}</span>
                    </div>
                    {/* Center: Fare + Promo */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex items-end gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                          <BdtIcon />{rideData?.cost || opt.price}
                        </span>
                        {rideData?.promoApplied && (
                          <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100/80 px-2 py-0.5 rounded">
                            -{rideData.discountPercent}%
                          </span>
                        )}
                        {rideData?.promoApplied && (
                          <span className="line-through text-muted-foreground text-base ml-2">
                            <BdtIcon />{rideData.cost && rideData.discountPercent ? (rideData.cost / (1 - rideData.discountPercent / 100)).toFixed(2) : ''}
                          </span>
                        )}
                      </div>
                      {rideData?.promoApplied && (
                        <div className="text-xs text-green-700 font-medium">
                          Promo <span className="font-bold">{rideData.promoApplied}</span> applied!
                        </div>
                      )}
                    </div>
                    {/* Right: Distance, ETA, Rider Info, Button */}
                    <div className="flex flex-col items-center gap-2 min-w-[160px] w-full">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{rideData?.distanceKm ? `${rideData.distanceKm} km` : '--'}</span>
                        <span className="mx-1">•</span>
                        <span>{opt.eta}</span>
                      </div>
                      {/* Rider Info */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-foreground text-sm">{opt.driver}</span>
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-500">{opt.rating}</span>
                        <span className="mx-1 text-primary">•</span>
                        <span className="text-xs text-muted-foreground">{opt.vehicle}</span>
                      </div>
                      <Button variant="primary" className="w-full py-2 text-base font-semibold rounded-lg mt-2">
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-primary/30 bg-background/60 shadow-none p-6 flex flex-col items-center justify-center w-full mt-4 text-center">
                <span className="text-lg font-semibold text-primary mb-2">Select two locations to start</span>
                <span className="text-sm text-muted-foreground">Please select both pickup and dropoff locations to see fare details and book a ride.</span>
              </div>
            )
          )}
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
              className="flex flex-col items-center gap-2 border border-accent bg-card hover:bg-accent/20 hover:border-primary rounded-xl px-4 py-4 mb-1 transition-colors min-w-0 w-full"
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
