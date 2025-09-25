"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/AuthProvider";

export default function BecomeRiderPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null)
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id || user?.email) {
      fetchUser();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      let query = "";
      if (user.id) query = `id=${user.id}`;
      else if (user.email) query = `email=${user.email}`;

      const res = await fetch(`${NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/become-rider?${query}`);
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Error fetching user");
        return;
      }

      setLoggedUser(data);

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

  const onSubmit = (data) => {
    // Age check
    const dob = new Date(data.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      alert("You must be at least 18 years old.");
      return;
    }

    console.log("Form Data:", data);
    alert("Form submitted successfully!");
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

  return (
    <div className="mt-14 flex justify-center lg:p-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl text-center font-bold mb-2">Become a Rider</h1>
        <p className="text-center text-gray-600 mb-6">
          Join our rider network and start your journey today.
        </p>

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
                placeholder="Enter your name"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "DOB is required" })}
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
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid Email" }
                })}
                className="w-full p-2 border border-primary rounded"
                placeholder="Enter Your Email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Phone</label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^\+?8801[3-9]\d{8}$/, message: "Invalid Phone Number" }
                })}
                className="w-full p-2 border border-primary rounded"
                placeholder="Enter Your Phone Number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Present Address */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Present Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Village</label>
                <input
                  type="text"
                  {...register("present_address.village", { required: "Village is required" })}
                  className="w-full p-2 border border-primary rounded"
                  placeholder="Village"
                />
                {errors.present_address?.village && <p className="text-red-500 text-sm">{errors.present_address.village.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Post</label>
                <input
                  type="text"
                  {...register("present_address.post", { required: "Post is required" })}
                  className="w-full p-2 border border-primary rounded"
                  placeholder="Post"
                />
                {errors.present_address?.post && <p className="text-red-500 text-sm">{errors.present_address.post.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Upazila</label>
                <input
                  type="text"
                  {...register("present_address.upazila", { required: "Upazila is required" })}
                  className="w-full p-2 border border-primary rounded"
                  placeholder="Upazila"
                />
                {errors.present_address?.upazila && <p className="text-red-500 text-sm">{errors.present_address.upazila.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">District</label>
                <input
                  type="text"
                  {...register("present_address.district", { required: "District is required" })}
                  className="w-full p-2 border border-primary rounded"
                  placeholder="District"
                />
                {errors.present_address?.district && <p className="text-red-500 text-sm">{errors.present_address.district.message}</p>}
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
                placeholder="Emergency Contact"
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

          {/* Vehicle Model & Registration */}
          <div>
            <label className="block mb-1 font-semibold">Vehicle Model</label>
            <input
              type="text"
              {...register("vehicleModel", { required: "Vehicle model is required" })}
              className="w-full p-2 border border-primary rounded"
              placeholder="Vehicle Model"
            />
            {errors.vehicleModel && <p className="text-red-500 text-sm">{errors.vehicleModel.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Vehicle Registration Number</label>
            <input
              type="text"
              {...register("vehicleReg", { required: "Registration number is required" })}
              className="w-full p-2 border border-primary rounded"
              placeholder="Vehicle Registration Number"
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
            {!licensePreview && licenseFileName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected File: <span className="font-medium">{licenseFileName}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full">
              <Label className="font-semibold text-lg">Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                className="absolute top-9 right-3"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
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
