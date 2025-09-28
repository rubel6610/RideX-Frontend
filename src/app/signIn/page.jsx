"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CarLogo from "../../Assets/car-icon.png";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/AuthProvider"; 
import GuestOnlyRoute from "../hooks/GuestOnlyRoute";

function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth(); 

  // Login submit function
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/signIn`, 
        data, 
        { withCredentials: true }
      );

      login(res.data.token);
      router.push("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <div className="mt-28 container mx-auto mb-16">
        {/* title and logo */}
        <div className="flex flex-col items-center space-y-2 my-6">
          <Image src={CarLogo} alt="car-logo" width={60} height={60} />
          <h2 className="text-3xl text-primary font-bold">Welcome Back</h2>
          <p className="text-black dark:text-white text-lg">
            Rejoin to get started
          </p>
        </div>

        {/* login page form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-lg p-8 rounded-xl space-y-4 max-w-xl mx-auto border border-primary"
        >
          {/* error message */}
          {errorMsg && (
            <p className="text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {errorMsg}
            </p>
          )}

          {/* email field */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              className="border border-primary"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* password field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Password</label>
              {/* 👉 Forgot Password Link */}
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="Enter your password"
              className="border border-primary"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* sign In button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </Button>

          {/* toggle sign Up page */}
          <p className="text-center text-foreground mt-4">
            Don&apos;t have an account? Please{" "}
            <Link 
              href="/register" 
              className="text-primary underline hover:text-primary/80 cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </GuestOnlyRoute>
  );
}

export default LoginPage;
