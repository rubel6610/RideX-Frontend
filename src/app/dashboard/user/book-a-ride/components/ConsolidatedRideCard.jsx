"use client";
import { Button } from "@/components/ui/button";
import { Bike, BusFront, Car, MapPin, Navigation, Clock, Star, Loader2 } from "lucide-react";

const ConsolidatedRideCard = ({ 
  pickup, 
  drop, 
  selectedType, 
  rideData, 
  onRequestRide, 
  isLoading 
}) => {
  const vehicleIcons = {
    Bike: <Bike className="w-6 h-6" />,
    Cng: <BusFront className="w-6 h-6" />,
    Car: <Car className="w-6 h-6" />,
  };

  const getVehicleIcon = () => vehicleIcons[selectedType] || <Bike className="w-6 h-6" />;

  if (!pickup || !drop) {
    return (
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-background/60 p-8 text-center">
        <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-2">
          Please select both locations
        </h3>
        <p className="text-sm text-muted-foreground">
          Select both pickup and drop off locations to see ride details.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-card shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {getVehicleIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {selectedType} Ride
            </h3>
            <p className="text-sm text-muted-foreground">
              Best available option
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            ৳{rideData?.cost || 0}
          </div>
          {rideData?.promoApplied && (
            <div className="text-xs text-green-600 font-semibold">
              Promo applied: {rideData.promoApplied}
            </div>
          )}
        </div>
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-foreground">Pickup</div>
            <div className="text-muted-foreground text-xs truncate">{pickup}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Navigation className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-foreground">Drop</div>
            <div className="text-muted-foreground text-xs truncate">{drop}</div>
          </div>
        </div>
      </div>

      {/* Ride Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Arrives in 7 min</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>4.8+ rating</span>
        </div>
      </div>

      {/* Request Button */}
      <Button
        onClick={onRequestRide}
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold"
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

