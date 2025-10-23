"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/AuthProvider";
import FaceVerificationCheckbox from "@/components/Shared/FaceVerification/FaceVerificationCheckbox";
import FaceVerificationModal from "@/components/Shared/FaceVerification/FaceVerificationModal";
import gsap from "gsap";

export default function BecomeRiderPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [capturedFaceImage, setCapturedFaceImage] = useState(null);
  const { user } = useAuth();
  const facePreviewRef = useRef(null);

  useEffect(() => {
    if (user?.id || user?.email) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    // Animate face preview when verified
    if (faceVerified && facePreviewRef.current) {
      gsap.fromTo(facePreviewRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [faceVerified]);

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
      if (!user) return alert("User not logged in");

      // Age check
      const dob = new Date(data.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        alert("You must be at least 18 years old.");
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
        alert("Rider request submitted successfully!");
        console.log(result.rider);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
    console.log("Face verification image captured:", imageData);
  };

  return (
    <div className="mt-14 flex justify-center lg:p-6 xl:p-16">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Become a Rider</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join our rider network and start your journey today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-6 border border-primary dark:border-primary gap-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        >
          {/* Row 1: Full Name & DOB */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Name is required" })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "DOB is required" })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
              />
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid Email" }
                })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter Your Email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Phone</label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^\+?8801[3-9]\d{8}$/, message: "Invalid Phone Number" }
                })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter Your Phone Number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Present Address */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Present Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Village</label>
                <input
                  type="text"
                  {...register("present_address.village", { required: "Village is required" })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Village"
                />
                {errors.present_address?.village && <p className="text-red-500 text-sm mt-1">{errors.present_address.village.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Post</label>
                <input
                  type="text"
                  {...register("present_address.post", { required: "Post is required" })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Post"
                />
                {errors.present_address?.post && <p className="text-red-500 text-sm mt-1">{errors.present_address.post.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Upazila</label>
                <input
                  type="text"
                  {...register("present_address.upazila", { required: "Upazila is required" })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Upazila"
                />
                {errors.present_address?.upazila && <p className="text-red-500 text-sm mt-1">{errors.present_address.upazila.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">District</label>
                <input
                  type="text"
                  {...register("present_address.district", { required: "District is required" })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="District"
                />
                {errors.present_address?.district && <p className="text-red-500 text-sm mt-1">{errors.present_address.district.message}</p>}
              </div>
            </div>
          </div>

          {/* Row 3: Emergency Contact & Vehicle Type */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Emergency Contact</label>
              <input
                type="tel"
                {...register("emergencyContact", { required: "Emergency contact is required" })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Emergency Contact"
              />
              {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Vehicle Type</label>
              <select
                {...register("vehicle", { required: "Please select a vehicle" })}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 dark:text-white"
              >
                <option value="">Select vehicle</option>
                <option value="bike">Bike</option>
                <option value="cng">CNG</option>
                <option value="car">Car</option>
              </select>
              {errors.vehicle && <p className="text-red-500 text-sm mt-1">{errors.vehicle.message}</p>}
            </div>
          </div>

          {/* Vehicle Model & Registration */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Vehicle Model</label>
            <input
              type="text"
              {...register("vehicleModel", { required: "Vehicle model is required" })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Vehicle Model"
            />
            {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Vehicle Registration Number</label>
            <input
              type="text"
              {...register("vehicleReg", { required: "Registration number is required" })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Vehicle Registration Number"
            />
            {errors.vehicleReg && <p className="text-red-500 text-sm mt-1">{errors.vehicleReg.message}</p>}
          </div>

          {/* Driving License */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">Driving License</label>
            <input
              type="file"
              accept="image/*,.pdf"
              {...register("drivingLicense", { required: "Driving license is required" })}
              onChange={handleLicenseChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {errors.drivingLicense && <p className="text-red-500 text-sm mt-1">{errors.drivingLicense.message}</p>}

            {licensePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Preview:</p>
                <img
                  src={licensePreview}
                  alt="Driving License Preview"
                  className="mt-2 w-40 h-28 object-cover border rounded-lg"
                />
              </div>
            )}
            {!licensePreview && licenseFileName && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Selected File: <span className="font-medium">{licenseFileName}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full">
              <Label className="font-semibold text-lg text-gray-900 dark:text-gray-100">Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white pr-12"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Face Verification */}
          <div>
            <FaceVerificationCheckbox
              onOpenModal={handleOpenModal}
              isVerified={faceVerified}
            />
            
            {faceVerified && capturedFaceImage && (
              <div 
                ref={facePreviewRef}
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={capturedFaceImage} 
                      alt="Captured Face" 
                      className="w-32 h-32 rounded-lg border-2 border-green-500 object-cover shadow-md"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 dark:text-green-400 font-semibold">Identity Verified</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      Your identity has been successfully verified. You can retake the photo if needed.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="text-sm text-primary hover:text-primary/80 font-medium w-fit"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            className="mt-4 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Become a Rider
          </Button>
        </form>

        <FaceVerificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCapture={handleFaceCapture}
        />
      </div>
    </div>
  );
}