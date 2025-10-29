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
    }
  }, [faceVerified]);

  return (
    <div ref={stepRef} className="flex flex-col gap-4">
      <div ref={containerRef} className="flex flex-col gap-4">
        {/* Password */}
        <div ref={passwordRef} className="flex flex-col gap-2">
          <div className="relative w-full">
            <Label className="font-bold text-xl text-foreground">Password & Identity</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              {...register("password", { required: "Password is required" })}
              className="flex-grow py-2 px-3 border-2 border-border rounded-lg focus:ring-0 focus:border-primary bg-background text-foreground pr-12 outline-none text-base h-12"
            />
            <button
              ref={eyeIconRef}
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-destructive text-sm mt-1 font-bold">{errors.password.message}</p>
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
              className="mt-4"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={capturedFaceImage} 
                      alt="Captured Face" 
                      className="w-24 h-24 rounded-xl border-4 border-primary object-cover"
                    />
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-foreground font-bold text-lg">Identity Verified</span>
                  </div>
                  <p className="text-muted-foreground text-base mb-3">
                    Your identity has been successfully verified. You can retake the photo if needed.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="text-base bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg w-fit"
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