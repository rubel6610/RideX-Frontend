import React, { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import gsap from 'gsap';

// Vehicle Information Step Component
// Collects vehicle details and driving license information with crazy animations
const VehicleInfoStep = ({ register, errors, handleLicenseChange, licensePreview, licenseFileName }) => {
  const stepRef = useRef(null);
  const containerRef = useRef(null);
  const emergencyContactRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  const vehicleModelRef = useRef(null);
  const vehicleRegRef = useRef(null);
  const drivingLicenseRef = useRef(null);

  // Crazy entrance animations
  useEffect(() => {
    if (containerRef.current) {
      // Container entrance with crazy effect
      gsap.fromTo(containerRef.current,
        { opacity: 0, x: -150, rotationY: -30 },
        { 
          opacity: 1, 
          x: 0, 
          rotationY: 0,
          duration: 1.2, 
          ease: "elastic.out(1, 0.5)"
        }
      );
    }

    // Animate individual form elements with crazy staggered effects
    const elements = [
      emergencyContactRef.current,
      vehicleTypeRef.current,
      vehicleModelRef.current,
      vehicleRegRef.current,
      drivingLicenseRef.current
    ];

    elements.forEach((element, index) => {
      if (element) {
        // Crazy entrance for each element
        gsap.fromTo(element,
          { opacity: 0, y: 30, scale: 0.9, rotation: -5 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.7)",
            delay: index * 0.1
          }
        );
      }
    });
  }, []);

  return (
    <div ref={stepRef} className="flex flex-col gap-4">
      <div ref={containerRef} className="flex flex-col gap-4">
        {/* Row: Emergency Contact & Vehicle Type */}
        <div className="flex flex-col md:flex-row gap-4">
          <div ref={emergencyContactRef} className="flex-1">
            <Label className="block mb-1 font-bold text-foreground text-lg">Emergency Contact</Label>
            <Input
              type="tel"
              {...register("emergencyContact", { required: "Emergency contact is required" })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
              placeholder="Emergency Contact"
            />
            {errors.emergencyContact && <p className="text-destructive text-sm mt-1 font-bold">{errors.emergencyContact.message}</p>}
          </div>
          <div ref={vehicleTypeRef} className="flex-1">
            <Label className="block mb-1 font-bold text-foreground text-lg">Vehicle Type</Label>
            <select
              {...register("vehicle", { required: "Please select a vehicle" })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12 w-full"
            >
              <option value="">Select vehicle</option>
              <option value="bike">Bike</option>
              <option value="cng">CNG</option>
              <option value="car">Car</option>
            </select>
            {errors.vehicle && <p className="text-destructive text-sm mt-1 font-bold">{errors.vehicle.message}</p>}
          </div>
        </div>

        {/* Vehicle Model & Registration */}
        <div ref={vehicleModelRef}>
          <Label className="block mb-1 font-bold text-foreground text-lg">Vehicle Model</Label>
          <Input
            type="text"
            {...register("vehicleModel", { required: "Vehicle model is required" })}
            className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
            placeholder="Vehicle Model"
          />
          {errors.vehicleModel && <p className="text-destructive text-sm mt-1 font-bold">{errors.vehicleModel.message}</p>}
        </div>
        <div ref={vehicleRegRef}>
          <Label className="block mb-1 font-bold text-foreground text-lg">Vehicle Registration Number</Label>
          <Input
            type="text"
            {...register("vehicleReg", { required: "Registration number is required" })}
            className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
            placeholder="Vehicle Registration Number"
          />
          {errors.vehicleReg && <p className="text-destructive text-sm mt-1 font-bold">{errors.vehicleReg.message}</p>}
        </div>

        {/* Driving License */}
        <div ref={drivingLicenseRef}>
          <Label className="block mb-1 font-bold text-foreground text-lg">Driving License</Label>
          <Input
            type="file"
            accept="image/*,.pdf"
            {...register("drivingLicense", { required: "Driving license is required" })}
            onChange={handleLicenseChange}
            className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-medium file:bg-accent file:text-foreground outline-none text-base h-12 flex items-center"
          />
          {errors.drivingLicense && <p className="text-destructive text-sm mt-1 font-bold">{errors.drivingLicense.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoStep;