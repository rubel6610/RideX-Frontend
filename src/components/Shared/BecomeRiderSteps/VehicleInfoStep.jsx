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
  const licensePreviewRef = useRef(null);

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

  // Crazy license preview animation
  useEffect(() => {
    if (licensePreview && licensePreviewRef.current) {
      // Crazy entrance animation
      gsap.fromTo(licensePreviewRef.current,
        { opacity: 0, scale: 0.5, rotation: 15 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0,
          duration: 0.8, 
          ease: "elastic.out(1, 0.7)"
        }
      );
    }
  }, [licensePreview]);

  // Add crazy focus effects to inputs
  useEffect(() => {
    const inputs = [
      emergencyContactRef.current?.querySelector('input'),
      vehicleModelRef.current?.querySelector('input'),
      vehicleRegRef.current?.querySelector('input'),
      drivingLicenseRef.current?.querySelector('input'),
      vehicleTypeRef.current?.querySelector('select')
    ];

    inputs.forEach(input => {
      if (input) {
        // Add crazy focus effect
        input.addEventListener('focus', () => {
          gsap.to(input, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "0 0 0px rgba(20, 184, 166, 0)"
          });
        });
        
        input.addEventListener('blur', () => {
          gsap.to(input, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "none"
          });
        });
      }
    });

    // Cleanup event listeners
    return () => {
      inputs.forEach(input => {
        if (input) {
          input.removeEventListener('focus', () => {});
          input.removeEventListener('blur', () => {});
        }
      });
    };
  }, []);

  return (
    <div ref={stepRef} className="flex flex-col gap-8">
      <div ref={containerRef} className="flex flex-col gap-8">
        {/* Row: Emergency Contact & Vehicle Type */}
        <div className="flex flex-col md:flex-row gap-6">
          <div ref={emergencyContactRef} className="flex-1 group relative">
            <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Emergency Contact</Label>
            <Input
              type="tel"
              {...register("emergencyContact", { required: "Emergency contact is required" })}
              className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-16"
              placeholder="Emergency Contact"
            />
            {errors.emergencyContact && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.emergencyContact.message}</p>}
          </div>
          <div ref={vehicleTypeRef} className="flex-1 group relative">
            <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Vehicle Type</Label>
            <select
              {...register("vehicle", { required: "Please select a vehicle" })}
              className="w-full px-5 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 text-gray-900 dark:text-white transition-all duration-300 shadow-lg appearance-none h-16 text-lg"
            >
              <option value="">Select vehicle</option>
              <option value="bike">Bike</option>
              <option value="cng">CNG</option>
              <option value="car">Car</option>
            </select>
            {errors.vehicle && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.vehicle.message}</p>}
          </div>
        </div>

        {/* Vehicle Model & Registration */}
        <div ref={vehicleModelRef} className="group relative">
          <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Vehicle Model</Label>
          <Input
            type="text"
            {...register("vehicleModel", { required: "Vehicle model is required" })}
            className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-16"
            placeholder="Vehicle Model"
          />
          {errors.vehicleModel && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.vehicleModel.message}</p>}
        </div>
        <div ref={vehicleRegRef} className="group relative">
          <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Vehicle Registration Number</Label>
          <Input
            type="text"
            {...register("vehicleReg", { required: "Registration number is required" })}
            className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-16"
            placeholder="Vehicle Registration Number"
          />
          {errors.vehicleReg && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.vehicleReg.message}</p>}
        </div>

        {/* Driving License */}
        <div ref={drivingLicenseRef} className="group relative">
          <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Driving License</Label>
          <Input
            type="file"
            accept="image/*,.pdf"
            {...register("drivingLicense", { required: "Driving license is required" })}
            onChange={handleLicenseChange}
            className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-lg file:font-bold file:bg-teal-500/20 file:text-teal-700 transition-all duration-300 shadow-lg h-16 flex items-center"
          />
          {errors.drivingLicense && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.drivingLicense.message}</p>}

          {(licensePreview || licenseFileName) && (
            <div 
              ref={licensePreviewRef}
              className="mt-6 p-6 rounded-2xl border-2 border-teal-300 dark:border-teal-700 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 transition-all duration-300 shadow-xl"
            >
              {licensePreview ? (
                <>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                    Preview:
                  </p>
                  <img
                    src={licensePreview}
                    alt="Driving License Preview"
                    className="w-full max-w-md h-40 object-contain border-2 border-teal-300 rounded-xl shadow-lg"
                  />
                </>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Selected File: <span className="font-bold text-teal-600">{licenseFileName}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoStep;