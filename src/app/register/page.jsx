"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import CarLogo from "../../Assets/car-icon.png";
import GuestOnlyRoute from "../hooks/GuestOnlyRoute";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      // Handle image upload
      if (data.image && data.image.length > 0) {
        const imgForm = new FormData();
        imgForm.append("image", data.image[0]);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
          {
            method: "POST",
            body: imgForm,
          }
        );

        const imgData = await res.json();

        if (imgData?.success) {
          data.photoUrl = imgData.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data }),
        }
      );

      const userdata = await res.json();
      if (res.ok) {
        toast.success("Registered successfully! Redirecting to Sign In...");
        setTimeout(() => {
          router.push("/signIn");
        }, 2000);
      } else {
        toast.error(
          userdata.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again later.");
    }

    // নতুন অবজেক্ট বানাও image বাদ দিয়ে
    const { image, ...rest } = data;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest), // ✅ এখানে আর circular হবে না
      }
    );

    const userdata = await res.json();
    if (res.ok) {
      alert("Registered successfully!");
    } else {
      alert(userdata.message);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <GuestOnlyRoute>
      <div className="mt-28 container mx-auto mb-16">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center space-y-2 my-6">
          <Image src={CarLogo} alt="car-logo" width={60} height={60} />
          <h2 className="text-3xl text-primary font-bold">Join RideX</h2>
          <p className="text-black dark:text-white text-lg">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-lg p-8 rounded-xl space-y-4 max-w-2xl mx-auto border border-primary"
        >
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Full name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full mt-2"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">
              Profile Image <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image", { required: "Profile image is required" })}
              onChange={handleImageChange}
              className="w-full mt-2"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
            {previewImage && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Date of Birth & NID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">
                Date Of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                className="w-full mt-2"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="NIDno">
                NID Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="NIDno"
                type="number"
                placeholder="NID no"
                {...register("NIDno", { required: "NID number is required" })}
                className="w-full mt-2"
              />
              {errors.NIDno && (
                <p className="text-red-500 text-sm">{errors.NIDno.message}</p>
              )}
            </div>
          </div>

          {/* Email & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", { required: "Email is required" })}
                className="w-full mt-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender", { required: "Gender is required" })}
                  />{" "}
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="female"
                    {...register("gender", { required: "Gender is required" })}
                  />{" "}
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="custom"
                    {...register("gender", { required: "Gender is required" })}
                  />{" "}
                  Custom
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password", { required: "Password is required" })}
                className="w-full mt-2"
              />
              <button
                type="button"
                className="absolute top-7.5 right-3"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === password || "Passwords do not match",
                })}
                className="w-full mt-2"
              />
              <button
                type="button"
                className="absolute top-7.5 right-3"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" {...register("terms", { required: true })} />
            <small className="text-muted-foreground">
              I agree to the{" "}
              <span className="text-primary">Terms of Service</span> and{" "}
              <span className="text-primary">Privacy Policy</span>
            </small>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm">You must agree to continue</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-6"
            variant="primary"
            color="primary"
          >
            Register
          </Button>
        </form>
      </div>
    </GuestOnlyRoute>
  );
}

export default RegisterPage;
