"use client";
import { Button } from "@/components/ui/button";
import { Bike, BusFront, Car, MapPin, Navigation, Clock, Star, Loader2 } from "lucide-react";

const ConsolidatedRideCard = ({
  pickup,
  drop,
  pickupName,
  dropName,
  selectedType,
  rideData,
  onRequestRide,
  isLoading
}) => {
  const vehicleIcons = {
    Bike: <Bike className="w-16 h-16" />,
    Cng: <BusFront className="w-20 h-20" />,
    Car: <Car className="w-20 h-20" />,
  };

  const getVehicleIcon = () => vehicleIcons[selectedType] || <Bike className="text-primary h-16 w-18 md:w-16 md:h-16 lg:w-18 lg:h-18" />;

  if (!pickup || !drop) {
    return (
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-background/60 px-8 py-4 text-center mb-4">
        <MapPin className="w-12 h-12 text-foreground mx-auto mb-4" />
        <strong className="text-xl font-bold text-primary mb-1">
          Please select both locations!
        </strong>
        <p className="text-sm text-muted-foreground">
          Select both pickup and drop off locations to see ride details.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mb-4">
      <div className="w-full flex flex-col sm:flex-row md:flex-col xl:flex-row items-center justify-between gap-4 sm:gap-0 md:gap-4 lg:gap-0 p-4 bg-accent/60 rounded-md">
        <div className="w-full md:w-full xl:w-1/2 flex items-center gap-3">
          <div className="h-18 w-18 md:w-16 md:h-16 xl:w-18 xl:h-18 p-2 rounded-md bg-foreground text-background flex items-center justify-center">
            {getVehicleIcon()}
          </div>

          <div className="flex flex-col justify-between h-18 md:h-16 lg:h-18">
            <h3 className="text-2xl md:text-xl lg:text-2xl font-semibold text-foreground uppercase leading-none">
              {selectedType} Ride
            </h3>

            {/* Location Details */}
            <div className="grid grid-cols-1 leading-none">
              <div className="flex items-start gap-0.5">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex items-center gap-1 text-sm">
                  <div className="font-semibold text-foreground">Pick</div>
                  <div className="text-muted-foreground text-xs truncate w-32 sm:w-64 md:w-48 xl:w-54 overflow-hidden text-ellipsis whitespace-nowrap">{pickupName || pickup}</div>
                </div>
              </div>

              <div className="flex items-start gap-0.5">
                <Navigation className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex items-center gap-1 text-sm">
                  <strong className="font-semibold text-foreground">Drop</strong>
                  <div className="text-muted-foreground text-xs truncate w-32 sm:w-64 md:w-48 xl:w-54 overflow-hidden text-ellipsis whitespace-nowrap">{dropName || drop}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-full xl:w-1/2 flex flex-col md:flex-col lg:flex-col sm:items-end md:items-start xl:items-end justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>4.8+</span>
          </div>

          {/* Ride Info */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {rideData?.arrivalTime || 'Calculating...'}
            </span>
          </div>

          <div className={`relative text-2xl font-bold text-primary ${rideData?.promoApplied && 'pr-2 pt-1'}`}>
            ৳{rideData?.cost || 0}
            {rideData?.promoApplied && (
              <div className="absolute top-0 right-0 z-10 text-lg font-bold text-background">
                P
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Button */}
      <Button
        onClick={onRequestRide}
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold mt-4"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Requesting...
          </>
        ) : (
          "Request Now"
        )}
      </Button>
    </div>
  );
};

export default ConsolidatedRideCard;

