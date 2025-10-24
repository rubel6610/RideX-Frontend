import React, { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import FaceVerificationCheckbox from "@/components/Shared/FaceVerification/FaceVerificationCheckbox";
import gsap from "gsap";

// Password and Identity Verification Step Component
// Handles password setup and face verification process with crazy animations
const PasswordIdentityStep = ({ 
  register, 
  errors, 
  showPassword, 
  setShowPassword,
  handleOpenModal,
  faceVerified,
  capturedFaceImage
}) => {
  const facePreviewRef = useRef(null);
  const stepRef = useRef(null);
  const containerRef = useRef(null);
  const passwordRef = useRef(null);
  const faceVerificationRef = useRef(null);
  const eyeIconRef = useRef(null);

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
      passwordRef.current,
      faceVerificationRef.current
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

  // Crazy face preview animation
  useEffect(() => {
    if (faceVerified && facePreviewRef.current) {
      // Crazy entrance animation
      gsap.fromTo(facePreviewRef.current,
        { opacity: 0, scale: 0.5, rotation: 15 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0,
          duration: 0.8, 
          ease: "elastic.out(1, 0.7)"
        }
      );
      
      // Add a subtle pulse effect to the verified badge
      const verifiedBadge = facePreviewRef.current.querySelector('.verified-badge');
      if (verifiedBadge) {
        gsap.to(verifiedBadge, {
          scale: 1.2,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }
  }, [faceVerified]);

  // Animate eye icon on hover
  useEffect(() => {
    if (eyeIconRef.current) {
      eyeIconRef.current.addEventListener('mouseenter', () => {
        gsap.to(eyeIconRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
      
      eyeIconRef.current.addEventListener('mouseleave', () => {
        gsap.to(eyeIconRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    }
    
    // Cleanup event listeners
    return () => {
      if (eyeIconRef.current) {
        eyeIconRef.current.removeEventListener('mouseenter', () => {});
        eyeIconRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <div ref={stepRef} className="flex flex-col gap-8">
      <div ref={containerRef} className="flex flex-col gap-8">
        {/* Password */}
        <div ref={passwordRef} className="flex flex-col gap-4 group relative">
          <div className="relative w-full">
            <Label className="font-bold text-xl text-gray-900 dark:text-gray-100 transition-colors group-focus-within:text-teal-600">Password & Identity</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 dark:bg-gray-700 dark:text-white pr-14 transition-all duration-300 shadow-lg h-16"
            />
            <button
              ref={eyeIconRef}
              type="button"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 font-bold animate-bounce">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Face Verification */}
        <div ref={faceVerificationRef}>
          <FaceVerificationCheckbox
            onOpenModal={handleOpenModal}
            isVerified={faceVerified}
          />
          
          {faceVerified && capturedFaceImage && (
            <div 
              ref={facePreviewRef}
              className="mt-8 p-6 rounded-2xl border-2 border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={capturedFaceImage} 
                      alt="Captured Face" 
                      className="w-32 h-32 rounded-2xl border-4 border-green-500 object-cover shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center verified-badge">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 dark:text-green-400 font-bold text-xl">Identity Verified</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-5">
                    Your identity has been successfully verified. You can retake the photo if needed.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="text-lg bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-2xl w-fit transition-all duration-300 shadow-lg"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordIdentityStep;