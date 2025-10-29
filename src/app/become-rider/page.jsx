"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/AuthProvider";
import FaceVerificationModal from "@/components/Shared/FaceVerification/FaceVerificationModal";
import UserInfoStep from "@/components/Shared/BecomeRiderSteps/UserInfoStep";
import VehicleInfoStep from "@/components/Shared/BecomeRiderSteps/VehicleInfoStep";
import PasswordIdentityStep from "@/components/Shared/BecomeRiderSteps/PasswordIdentityStep";
import StepNavigation from "@/components/Shared/BecomeRiderSteps/StepNavigation";
import Image from "next/image";
import gsap from "gsap";

// Import the images
import darkImage from "../../Assets/become-rider.webp";

export default function BecomeRiderPage() {
  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm();
  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [capturedFaceImage, setCapturedFaceImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Refs for animations
  const formContainerRef = useRef(null);
  const stepContainerRef = useRef(null);

  const steps = ["User Information", "Vehicle Information", "Password & Identity"];

  useEffect(() => {
    if (user?.id || user?.email) {
      fetchUser();
    }
  }, [user]);

  // Animate form container on initial load
  useEffect(() => {
    if (formContainerRef.current) {
      gsap.fromTo(formContainerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // Animate step transitions
  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(stepContainerRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [currentStep]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (!user) return alert("User not logged in");

      // Age check
      const dob = new Date(data.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        alert("You must be at least 18 years old.");
        setIsSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        userId: user.id,
        present_address: {
          village: data.present_address.village,
          post: data.present_address.post,
          upazila: data.present_address.upazila,
          district: data.present_address.district,
        },
        vehicleType: data.vehicle,
        vehicleModel: data.vehicleModel,
        vehicleRegisterNumber: data.vehicleReg,
        drivingLicense: licenseFileName,
        password: data.password,
        // Include the captured face image URL if available
        frontFace: capturedFaceImage // This will now be an ImgBB URL or base64 fallback
      };

      console.log("Sending become-rider request with payload:", payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/become-rider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Become-rider response:", result);
      
      if (res.ok) {
        // Animate success message
        if (formContainerRef.current) {
          gsap.to(formContainerRef.current, {
            backgroundColor: "#d1fae5",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              alert("Rider request submitted successfully!");
            }
          });
        } else {
          alert("Rider request submitted successfully!");
        }
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Become-rider request error:", err);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?email=${user.email}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error fetching user");
        return;
      }

      // Set default values for form fields except emergency/vehicle/license
      setValue("fullName", data.fullName || "");
      setValue("dob", data.dateOfBirth || "");
      setValue("email", data.email || "");
      setValue("phone", data.phoneNumber || "");
      setValue("present_address.village", data.present_address?.village || "");
      setValue("present_address.post", data.present_address?.post || "");
      setValue("present_address.upazila", data.present_address?.upazila || "");
      setValue("present_address.district", data.present_address?.district || "");
    } catch (err) {
      alert("Error fetching user");
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFileName(file.name);
      if (file.type.startsWith("image/")) {
        setLicensePreview(URL.createObjectURL(file));
      } else {
        setLicensePreview(null);
      }
    } else {
      setLicenseFileName("");
      setLicensePreview(null);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFaceCapture = (imageData) => {
    console.log("Face capture received:", imageData);
    setCapturedFaceImage(imageData);
    setFaceVerified(true);
    
    // Animate face capture success
    if (formContainerRef.current) {
      gsap.fromTo(formContainerRef.current,
        { scale: 0.98 },
        { scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  const nextStep = async () => {
    // Trigger validation for current step before proceeding
    const isValid = await trigger();
    if (isValid) {
      // Animate current step out
      if (stepContainerRef.current) {
        gsap.to(stepContainerRef.current, {
          opacity: 0,
          x: -100,
          duration: 0.3,
          onComplete: () => {
            setCurrentStep((prev) => prev + 1);
          }
        });
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    // Animate current step out
    if (stepContainerRef.current) {
      gsap.to(stepContainerRef.current, {
        opacity: 0,
        x: 100,
        duration: 0.3,
        onComplete: () => {
          setCurrentStep((prev) => prev - 1);
        }
      });
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Create a safe wrapper for the register function
  const safeRegister = (name, options = {}) => {
    // Create a new object to avoid passing read-only properties
    const registration = register(name, options);
    // Return a new object with only the necessary properties
    return {
      name: registration.name,
      onBlur: registration.onBlur,
      onChange: registration.onChange,
      ref: registration.ref,
    };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserInfoStep 
            register={safeRegister} 
            errors={errors} 
            setValue={setValue} 
          />
        );
      case 1:
        return (
          <VehicleInfoStep 
            register={safeRegister} 
            errors={errors} 
            handleLicenseChange={handleLicenseChange}
            licensePreview={licensePreview}
            licenseFileName={licenseFileName}
          />
        );
      case 2:
        return (
          <PasswordIdentityStep 
            register={safeRegister} 
            errors={errors} 
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleOpenModal={handleOpenModal}
            faceVerified={faceVerified}
            capturedFaceImage={capturedFaceImage}
          />
        );
      default:
        return null;
    }
  };

  // Component for Step Indicator (1, 2, 3...)
  const Step = ({ active, number, title }) => {
    const activeClass = active ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground';
    const numberClass = active ? 'bg-primary text-primary-foreground' : 'bg-border text-foreground';

    return (
      <div className={`flex items-center text-sm font-medium rounded-full py-1.5 px-3 ${activeClass}`}>
        <div className={`h-4 w-4 mr-2 flex items-center justify-center rounded-full text-xs font-bold ${numberClass}`}>
          {number}
        </div>
        {title}
      </div>
    );
  };

  return (
    <div className="flex w-full max-w-7xl mx-auto mt-28 mb-8 rounded-xl shadow-2xl overflow-hidden bg-background md:mt-16 md:mb-16">
      {/* Left Panel (Illustration) - Hidden on mobile */}
      <div className="hidden md:block w-2/5">
        {/* Rider Illustration Image - Full height */}
        <div className="text-foreground text-center w-full h-full">
          <div className="w-full h-full block">
            <Image
              src={darkImage} 
              alt="Become a Rider"
              height={940} 
              width={725} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Panel (Form) - Full width on mobile */}
      <div className="w-full md:w-3/5 p-4 bg-background md:p-12 md:pl-12 md:pr-6 md:py-6">
        {/* Step Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          <Step active={currentStep === 0} number={1} title="Personal Info" />
          <Step active={currentStep === 1} number={2} title="Vehicle Info" />
          <Step active={currentStep === 2} number={3} title="Security Info" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col">
          <div ref={stepContainerRef} className="flex-grow min-h-[400px]">
            {renderStep()}
          </div>
          
          {/* Navigation */}
          <StepNavigation 
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={nextStep}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
            trigger={trigger}
          />
        </form>
      </div>

      <FaceVerificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCapture={handleFaceCapture}
      />
    </div>
  );
}