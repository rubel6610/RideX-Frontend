"use client";
import { useState } from "react";
import { Bike, BusFront, Car, ChevronDown } from "lucide-react";

const VehicleTypeSelector = ({ selectedType, setSelectedType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const vehicleTypes = [
    {
      id: "Bike",
      label: "Bike",
      icon: <Bike className="w-5 h-5" />,
    },
    {
      id: "Cng",
      label: "CNG",
      icon: <BusFront className="w-5 h-5" />,
    },
    {
      id: "Car",
      label: "Car",
      icon: <Car className="w-5 h-5" />,
    },
  ];

  const selectedVehicle = vehicleTypes.find(v => v.id === selectedType);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Car className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Choose Vehicle Type</h3>
      </div>

      {/* Vehicle Type Select Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-12 flex items-center justify-between px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            {selectedVehicle?.icon}
            <span className="text-base font-medium text-gray-900">
              {selectedVehicle?.label}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
            {vehicleTypes.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => {
                  setSelectedType(vehicle.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedType === vehicle.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                }`}
              >
                {vehicle.icon}
                <span className="text-base font-medium">{vehicle.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleTypeSelector;