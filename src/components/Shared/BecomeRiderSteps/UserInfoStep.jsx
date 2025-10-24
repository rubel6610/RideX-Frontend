import React, { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import gsap from 'gsap';

// User Information Step Component
// Collects user's personal details and address information with crazy animations
const UserInfoStep = ({ register, errors }) => {
  const stepRef = useRef(null);
  const containerRef = useRef(null);
  const fullNameRef = useRef(null);
  const dobRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressHeaderRef = useRef(null);
  const villageRef = useRef(null);
  const postRef = useRef(null);
  const upazilaRef = useRef(null);
  const districtRef = useRef(null);

  // Crazy entrance animations
  useEffect(() => {
    if (containerRef.current) {
      // Container entrance with crazy effect
      gsap.fromTo(containerRef.current,
        { opacity: 0, x: 150, rotationY: 30 },
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
      fullNameRef.current,
      dobRef.current,
      emailRef.current,
      phoneRef.current,
      addressHeaderRef.current,
      villageRef.current,
      postRef.current,
      upazilaRef.current,
      districtRef.current
    ];

    elements.forEach((element, index) => {
      if (element) {
        // Crazy entrance for each element
        gsap.fromTo(element,
          { opacity: 0, y: 30, scale: 0.9, rotation: 5 },
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

  // Add crazy focus effects to inputs
  useEffect(() => {
    const inputs = [
      fullNameRef.current?.querySelector('input'),
      dobRef.current?.querySelector('input'),
      emailRef.current?.querySelector('input'),
      phoneRef.current?.querySelector('input'),
      villageRef.current?.querySelector('input'),
      postRef.current?.querySelector('input'),
      upazilaRef.current?.querySelector('input'),
      districtRef.current?.querySelector('input')
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
            boxShadow: "none"
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
        {/* Row 1: Full Name & DOB */}
        <div className="flex flex-col md:flex-row gap-6">
          <div ref={fullNameRef} className="flex-1 group relative">
            <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Full Name</Label>
            <Input
              type="text"
              {...register("fullName", { required: "Name is required" })}
              className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
              placeholder="Enter your name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.fullName.message}</p>}
          </div>
          <div ref={dobRef} className="flex-1 group relative">
            <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Date of Birth</Label>
            <Input
              type="date"
              {...register("dob", { required: "DOB is required" })}
              className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
            />
            {errors.dob && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.dob.message}</p>}
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="flex flex-col md:flex-row gap-6">
          <div ref={emailRef} className="flex-1 group relative">
            <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Email</Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid Email" }
              })}
              className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
              placeholder="Enter Your Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.email.message}</p>}
          </div>
          <div ref={phoneRef} className="flex-1 group relative">
            <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Phone</Label>
            <Input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^\+?8801[3-9]\d{8}$/, message: "Invalid Phone Number" }
              })}
              className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
              placeholder="Enter Your Phone Number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Present Address */}
        <div ref={addressHeaderRef} className="group relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center transition-transform duration-300">
            <span className="w-4 h-4 bg-teal-500 rounded-full mr-3 animate-pulse"></span>
            Present Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div ref={villageRef} className="group relative">
              <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Village</Label>
              <Input
                type="text"
                {...register("present_address.village", { required: "Village is required" })}
                className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
                placeholder="Village"
              />
              {errors.present_address?.village && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.present_address.village.message}</p>}
            </div>
            <div ref={postRef} className="group relative">
              <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Post</Label>
              <Input
                type="text"
                {...register("present_address.post", { required: "Post is required" })}
                className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
                placeholder="Post"
              />
              {errors.present_address?.post && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.present_address.post.message}</p>}
            </div>
            <div ref={upazilaRef} className="group relative">
              <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">Upazila</Label>
              <Input
                type="text"
                {...register("present_address.upazila", { required: "Upazila is required" })}
                className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
                placeholder="Upazila"
              />
              {errors.present_address?.upazila && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.present_address.upazila.message}</p>}
            </div>
            <div ref={districtRef} className="group relative">
              <Label className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg transition-all duration-300 group-focus-within:text-teal-600 group-focus-within:scale-105">District</Label>
              <Input
                type="text"
                {...register("present_address.district", { required: "District is required" })}
                className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg h-14"
                placeholder="District"
              />
              {errors.present_address?.district && <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.present_address.district.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoStep;