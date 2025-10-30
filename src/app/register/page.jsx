"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import CarLogo from "../../Assets/car-icon.png";
import GuestOnlyRoute from "../hooks/GuestOnlyRoute";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          `https://api.imgbb.com/1/upload?key=${
            process.env.NEXT_PUBLIC_IMGBB_KEY || process.env.IMGBB_KEY
          }`,
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

      // Remove the image file object before sending to backend
      const { image, ...rest } = data;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rest),
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center space-y-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <Image src={CarLogo} alt="car-logo" width={80} height={80} className="relative z-10 drop-shadow-lg" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Join RideX
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-medium">
              Create your account to get started
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card shadow-2xl p-6 md:p-10 rounded-2xl space-y-6 border border-primary/20 backdrop-blur-sm"
          >
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-semibold flex items-center gap-1">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full h-11 border-primary/30 focus:border-primary transition-colors"
            />
            {errors.fullName && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <span>⚠</span> {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-base font-semibold flex items-center gap-1">
              Profile Image <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image", { required: "Profile image is required" })}
              onChange={handleImageChange}
              className="w-full h-11 border-primary/30 focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:transition-colors file:cursor-pointer cursor-pointer"
            />
            {errors.image && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <span>⚠</span> {errors.image.message}
              </p>
            )}
            {previewImage && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2 font-medium">Preview:</p>
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded-xl border-2 border-primary/30 shadow-md"
                />
              </div>
            )}
          </div>

          {/* Date of Birth & NID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-base font-semibold flex items-center gap-1">
                Date Of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                className="w-full h-11 border-primary/30 focus:border-primary transition-colors"
              />
              {errors.dateOfBirth && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span>⚠</span> {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="NIDno" className="text-base font-semibold flex items-center gap-1">
                NID Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="NIDno"
                type="number"
                placeholder="Enter your NID number"
                {...register("NIDno", { required: "NID number is required" })}
                className="w-full h-11 border-primary/30 focus:border-primary transition-colors"
              />
              {errors.NIDno && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span>⚠</span> {errors.NIDno.message}
                </p>
              )}
            </div>
          </div>

          {/* Email & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold flex items-center gap-1">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", { required: "Email is required" })}
                className="w-full h-11 border-primary/30 focus:border-primary transition-colors"
              />
              {errors.email && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-base font-semibold flex items-center gap-1">
                Gender <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-4 mt-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender", { required: "Gender is required" })}
                    className="w-4 h-4 text-primary border-primary/30 focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                  <span className="group-hover:text-primary transition-colors">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="female"
                    {...register("gender", { required: "Gender is required" })}
                    className="w-4 h-4 text-primary border-primary/30 focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                  <span className="group-hover:text-primary transition-colors">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="custom"
                    {...register("gender", { required: "Gender is required" })}
                    className="w-4 h-4 text-primary border-primary/30 focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                  <span className="group-hover:text-primary transition-colors">Custom</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span>⚠</span> {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative space-y-2">
              <Label htmlFor="password" className="text-base font-semibold flex items-center gap-1">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password", { required: "Password is required" })}
                className="w-full h-11 border-primary/30 focus:border-primary transition-colors pr-10"
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-semibold flex items-center gap-1">
                Confirm Password <span className="text-destructive">*</span>
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
                className="w-full h-11 border-primary/30 focus:border-primary transition-colors pr-10"
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                {...register("terms", { required: true })} 
                className="w-5 h-5 mt-0.5 text-primary border-primary/30 rounded focus:ring-primary focus:ring-2 cursor-pointer"
              />
              <label className="text-sm text-muted-foreground cursor-pointer flex-1">
                I agree to the{" "}
                <span className="text-primary font-semibold hover:underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-primary font-semibold hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>
            {errors.terms && (
              <p className="text-destructive text-sm mt-2 flex items-center gap-1 ml-8">
                <span>⚠</span> You must agree to continue
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
          >
            Create Account
          </Button>

          {/* Toggle Sign In */}
          <div className="text-center pt-4 border-t border-primary/10">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signIn"
                className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                Sign In
                <span className="text-lg">→</span>
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </GuestOnlyRoute>
  );
}

export default RegisterPage;
