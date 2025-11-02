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

  return (
    <div ref={stepRef} className="flex flex-col gap-4">
      <div ref={containerRef} className="flex flex-col gap-4">
        {/* Row 1: Full Name & DOB */}
        <div className="flex flex-col md:flex-row gap-4">
          <div ref={fullNameRef} className="flex-1">
            <Label className="block mb-1 font-bold text-foreground text-lg">Full Name</Label>
            <Input
              type="text"
              {...register("fullName", { required: "Name is required" })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
              placeholder="Enter your name"
            />
            {errors.fullName && <p className="text-destructive text-sm mt-1 font-bold">{errors.fullName.message}</p>}
          </div>
          <div ref={dobRef} className="flex-1">
            <Label className="block mb-1 font-bold text-foreground text-lg">Date of Birth</Label>
            <Input
              type="date"
              {...register("dob", { required: "DOB is required" })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
            />
            {errors.dob && <p className="text-destructive text-sm mt-1 font-bold">{errors.dob.message}</p>}
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="flex flex-col md:flex-row gap-4">
          <div ref={emailRef} className="flex-1">
            <Label className="block mb-1 font-bold text-foreground text-lg">Email</Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid Email" }
              })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
              placeholder="Enter Your Email"
            />
            {errors.email && <p className="text-destructive text-sm mt-1 font-bold">{errors.email.message}</p>}
          </div>
          <div ref={phoneRef} className="flex-1">
            <Label className="block mb-1 font-bold text-foreground text-lg">Phone</Label>
            <Input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^\+?8801[3-9]\d{8}$/, message: "Invalid Phone Number" }
              })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
              placeholder="Enter Your Phone Number"
            />
            {errors.phone && <p className="text-destructive text-sm mt-1 font-bold">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Present Address */}
        <div ref={addressHeaderRef}>
          <h2 className="text-xl font-bold mb-4 text-foreground flex items-center">
            <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
            Present Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div ref={villageRef}>
              <Label className="block mb-1 font-bold text-foreground text-lg">Village</Label>
              <Input
                type="text"
                {...register("present_address.village", { required: "Village is required" })}
                className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
                placeholder="Village"
              />
              {errors.present_address?.village && <p className="text-destructive text-sm mt-1 font-bold">{errors.present_address.village.message}</p>}
            </div>
            <div ref={postRef}>
              <Label className="block mb-1 font-bold text-foreground text-lg">Post</Label>
              <Input
                type="text"
                {...register("present_address.post", { required: "Post is required" })}
                className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
                placeholder="Post"
              />
              {errors.present_address?.post && <p className="text-destructive text-sm mt-1 font-bold">{errors.present_address.post.message}</p>}
            </div>
            <div ref={upazilaRef}>
              <Label className="block mb-1 font-bold text-foreground text-lg">Upazila</Label>
              <Input
                type="text"
                {...register("present_address.upazila", { required: "Upazila is required" })}
                className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
                placeholder="Upazila"
              />
              {errors.present_address?.upazila && <p className="text-destructive text-sm mt-1 font-bold">{errors.present_address.upazila.message}</p>}
            </div>
            <div ref={districtRef}>
              <Label className="block mb-1 font-bold text-foreground text-lg">District</Label>
              <Input
                type="text"
                {...register("present_address.district", { required: "District is required" })}
                className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground outline-none text-base h-12"
                placeholder="District"
              />
              {errors.present_address?.district && <p className="text-destructive text-sm mt-1 font-bold">{errors.present_address.district.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoStep;