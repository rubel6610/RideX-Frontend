"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function FaceVerificationCheckbox({ onOpenModal, isVerified }) {
  const [isChecked, setIsChecked] = useState(false);
  const checkboxRef = useRef(null);
  const labelRef = useRef(null);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (checked) {
      // Animate checkbox when checked
      if (checkboxRef.current) {
        gsap.fromTo(checkboxRef.current,
          { scale: 1 },
          { 
            scale: 1.1, 
            duration: 0.2,
            yoyo: true,
            repeat: 1
          }
        );
      }
      onOpenModal();
    }
  };

  // Update checkbox state when verification status changes
  useEffect(() => {
    if (isVerified) {
      setIsChecked(true);
    }
  }, [isVerified]);

  // Animate label on verification status change
  useEffect(() => {
    if (isVerified && labelRef.current) {
      gsap.fromTo(labelRef.current,
        { color: "#000000" },
        { 
          color: "#16a34a", // green-600
          duration: 0.5,
          ease: "power2.out"
        }
      );
    }
  }, [isVerified]);

  return (
    <div className="flex items-center gap-3">
      <input
        ref={checkboxRef}
        type="checkbox"
        id="face-verification"
        checked={isVerified || isChecked}
        onChange={handleCheckboxChange}
        disabled={isVerified}
        className="w-5 h-5 border-2 border-primary rounded cursor-pointer focus:ring-2 focus:ring-primary/50 focus:outline-none"
      />
      <label
        ref={labelRef}
        htmlFor="face-verification"
        className={`text-base font-semibold cursor-pointer transition-colors duration-300 ${
          isVerified ? "text-green-600" : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {isVerified ? "Identity Verified" : "Verify your identity"}
      </label>
    </div>
  );
}