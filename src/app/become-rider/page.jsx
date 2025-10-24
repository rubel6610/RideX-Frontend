"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/AuthProvider";
import FaceVerificationModal from "@/components/Shared/FaceVerification/FaceVerificationModal";
import Stepper from "@/components/Shared/Stepper";
import UserInfoStep from "@/components/Shared/BecomeRiderSteps/UserInfoStep";
import VehicleInfoStep from "@/components/Shared/BecomeRiderSteps/VehicleInfoStep";
import PasswordIdentityStep from "@/components/Shared/BecomeRiderSteps/PasswordIdentityStep";
import StepNavigation from "@/components/Shared/BecomeRiderSteps/StepNavigation";
import gsap from "gsap";

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

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user?email=${user.email}`);
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Error fetching user");
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
      console.error(err);
    }
  };

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
        // Include the captured face image if available
        frontFace: capturedFaceImage
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/become-rider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
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
        console.log(result.rider);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
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
    setCapturedFaceImage(imageData);
    setFaceVerified(true);
    
    // Animate face capture success
    if (formContainerRef.current) {
      gsap.fromTo(formContainerRef.current,
        { scale: 0.98 },
        { scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
    
    console.log("Face verification image captured:", imageData);
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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserInfoStep 
            register={register} 
            errors={errors} 
            setValue={setValue} 
          />
        );
      case 1:
        return (
          <VehicleInfoStep 
            register={register} 
            errors={errors} 
            handleLicenseChange={handleLicenseChange}
            licensePreview={licensePreview}
            licenseFileName={licenseFileName}
          />
        );
      case 2:
        return (
          <PasswordIdentityStep 
            register={register} 
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

  return (
    <div className="mt-14 flex justify-center p-4 md:p-6 lg:p-8">
      <div 
        ref={formContainerRef}
        className="w-full max-w-5xl transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="text-center mb-10 px-6 py-10 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
            Become a Rider
          </h1>
          <p className="text-teal-100 text-xl max-w-3xl mx-auto">
            Join our rider network and start your journey today. Complete the steps below to get started.
          </p>
        </div>

        <div className="flex flex-col p-6 md:p-10 border-2 border-teal-500/30 dark:border-teal-500/20 gap-8 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
          {/* Stepper */}
          <Stepper steps={steps} currentStep={currentStep} />
          
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="min-h-[500px]">
            <div ref={stepContainerRef} className="min-h-[400px]">
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
    </div>
  );
}