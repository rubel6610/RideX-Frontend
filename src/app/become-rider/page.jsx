"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function BecomeRiderPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    // Age check
    const dob = new Date(data.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      alert("আপনার বয়স কমপক্ষে 18 হতে হবে");
      return;
    }

    console.log("Form Data:", data);
    alert("Form submitted successfully!");
  };

  // Driving License change handler
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

  return (
    <div className="mt-14 flex justify-center lg:p-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl text-center font-bold mb-6">Become a Rider</h1>

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="flex flex-col p-6 border border-primary dark:border-primary gap-6 rounded-lg"
        >
          {/* Row 1: Full Name & DOB */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Name is required" })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { value: /^\S+@\S+$/i, message: "ইনভ্যালিড ইমেইল" }
                })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Phone</label>
              <input
                type="tel"
                {...register("phone", { 
                  required: "Phone number is required",
                  pattern: { value: /^\+?8801[3-9]\d{8}$/, message: "ইনভ্যালিড ফোন নম্বর" }
                })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Present Address */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Present Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Village */}
              <div>
                <label className="block mb-1 font-semibold">Village</label>
                <select
                  {...register("present_address.village", { required: "Village is required" })}
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-primary rounded"
                >
                  <option value="">Select Village</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                  <option value="Mohammadpur">Mohammadpur</option>
                  <option value="Mirpur">Mirpur</option>
                  <option value="Banani">Banani</option>
                </select>
                {errors.present_address?.village && (
                  <p className="text-red-500 text-sm">{errors.present_address.village.message}</p>
                )}
              </div>

              {/* Post */}
              <div>
                <label className="block mb-1 font-semibold">Post</label>
                <select
                  {...register("present_address.post", { required: "Post is required" })}
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-primary rounded"
                >
                  <option value="">Select Post</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                </select>
                {errors.present_address?.post && (
                  <p className="text-red-500 text-sm">{errors.present_address.post.message}</p>
                )}
              </div>

              {/* Upazila */}
              <div>
                <label className="block mb-1 font-semibold">Upazila</label>
                <select
                  {...register("present_address.upazila", { required: "Upazila is required" })}
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-primary rounded"
                >
                  <option value="">Select Upazila</option>
                  <option value="Savar">Savar</option>
                  <option value="Keraniganj">Keraniganj</option>
                  <option value="Dhamrai">Dhamrai</option>
                </select>
                {errors.present_address?.upazila && (
                  <p className="text-red-500 text-sm">{errors.present_address.upazila.message}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block mb-1 font-semibold">District</label>
                <select
                  {...register("present_address.district", { required: "District is required" })}
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-primary rounded"
                >
                  <option value="">Select District</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                  <option value="Tangail">Tangail</option>
                </select>
                {errors.present_address?.district && (
                  <p className="text-red-500 text-sm">{errors.present_address.district.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Emergency Contact & Vehicle Type */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Emergency Contact</label>
              <input
                type="tel"
                {...register("emergencyContact", { required: "Emergency contact is required" })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.emergencyContact && <p className="text-red-500 text-sm">{errors.emergencyContact.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Vehicle Type</label>
              <select
                {...register("vehicle", { required: "Please select a vehicle" })}
                className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 rounded"
              >
                <option value="">Select vehicle</option>
                <option value="bike">Bike</option>
                <option value="cng">CNG</option>
                <option value="car">Car</option>
              </select>
              {errors.vehicle && <p className="text-red-500 text-sm">{errors.vehicle.message}</p>}
            </div>
          </div>

          {/* Rest of the fields */}
          <div>
            <label className="block mb-1 font-semibold">Vehicle Model</label>
            <input
              type="text"
              {...register("vehicleModel", { required: "Vehicle model is required" })}
              className="w-full p-2 border border-primary rounded"
            />
            {errors.vehicleModel && <p className="text-red-500 text-sm">{errors.vehicleModel.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Vehicle Registration Number</label>
            <input
              type="text"
              {...register("vehicleReg", { required: "Registration number is required" })}
              className="w-full p-2 border border-primary rounded"
            />
            {errors.vehicleReg && <p className="text-red-500 text-sm">{errors.vehicleReg.message}</p>}
          </div>

          {/* Driving License */}
          <div>
            <label className="block mb-1 font-semibold">Driving License</label>
            <input
              type="file"
              accept="image/*,.pdf"
              {...register("drivingLicense", { required: "Driving license is required" })}
              onChange={handleLicenseChange}
              className="w-full p-2 border border-primary rounded"
            />
            {errors.drivingLicense && <p className="text-red-500 text-sm">{errors.drivingLicense.message}</p>}

            {/* Preview */}
            {licensePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium">Preview:</p>
                <img
                  src={licensePreview}
                  alt="Driving License Preview"
                  className="mt-2 w-40 h-28 object-cover border rounded"
                />
              </div>
            )}

            {/* PDF হলে শুধু ফাইল নাম দেখাবে */}
            {!licensePreview && licenseFileName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected File: <span className="font-medium">{licenseFileName}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", { required: "Please confirm your password" })}
                className="w-full p-2 border border-primary rounded"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg">
            Become a Rider
          </Button>
        </form>
      </div>
    </div>
  );
}
