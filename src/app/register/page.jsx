"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CarLogo from "../../Assets/car-icon.png";

function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // For showing selected image preview

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      // Handle image upload
      if (data.image && data.image.length > 0) {
        const imgForm = new FormData();
        imgForm.append("image", data.image[0]);
        const res = await fetch(process.env.NEXT_PUBLIC_IMGBB_KEY, {
          method: "POST",
          body: imgForm,
        });
        const imgData = await res.json();
        data.photoUrl = imgData?.data?.url; // Store uploaded image URL
      }

     
      

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
        }),
      });

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

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  return (
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
            <Label>
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Full name"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

        
        

        {/* Image Upload */}
        <div>
          <Label>
            Profile Image <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="image/*"
            {...register("image", { required: "Profile image is required" })}
            onChange={handleImageChange}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}

          {/* Image Preview */}
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
            <Label>
              Date Of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              {...register("dateOfBirth", { required: "Date of birth is required" })}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <Label>
              NID Number <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="NID no"
              {...register("NIDno", { required: "NID number is required" })}
            />
            {errors.nidNo && (
              <p className="text-red-500 text-sm">{errors.nidNo.message}</p>
            )}
          </div>
        </div>

    
        {/* Email & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="your@email.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="male"
                  {...register("gender", { required: "Gender is required" })}
                />
                Male
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="female"
                  {...register("gender", { required: "Gender is required" })}
                />
                Female
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="custom"
                  {...register("gender", { required: "Gender is required" })}
                />
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
          {/* Password */}
          <div className="relative">
            <Label>
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              className="absolute top-6 right-3"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Label>
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              className="absolute top-6 right-3"
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
        <div className="flex items-center gap-2">
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
        <Button className="w-full bg-primary hover:bg-primary text-white dark:text-black">
          Create Account
        </Button>

        {/* Sign In Toggle */}
        <p className="text-center text-foreground">
          Already have an account?{" "}
          <span className="text-primary underline cursor-pointer">
            <Link href="/signIn">Sign In</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
