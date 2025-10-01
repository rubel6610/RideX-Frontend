"use client";
import { Button } from "@/components/ui/button";
import { Bike, BusFront, Car, Clock, Star } from "lucide-react";

const VehicleTypeSelector = ({ selectedType, setSelectedType }) => {
  const vehicleTypes = [
    {
      id: "Bike",
      label: "Bike",
      icon: <Bike className="w-6 h-6" />,
    },
    {
      id: "Cng",
      label: "CNG",
      icon: <BusFront className="w-6 h-6" />,
    },
    {
      id: "Car",
      label: "Car",
      icon: <Car className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Car className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Choose Vehicle Type</h3>
      </div>

      {/* Vehicle Type Options - Simple */}
      <div className="flex gap-2">
        {vehicleTypes.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => setSelectedType(vehicle.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              selectedType === vehicle.id
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-foreground border border-accent hover:bg-primary/50 hover:text-foreground"
            }`}
          >
            {vehicle.icon}
            <span>{vehicle.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehicleTypeSelector;
