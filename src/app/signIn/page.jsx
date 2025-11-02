"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/AuthProvider";
import GuestOnlyRoute from "../hooks/GuestOnlyRoute";

function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();


  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/signIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const responseData = await res.json();
      login(responseData.token);
      router.push("/");
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center py-8 px-4">
        <div className="container mx-auto max-w-md">
          {/* title and logo */}
          <div className="flex flex-col items-center space-y-4 mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative z-10 bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-full">
                <Car className="w-20 h-20 text-primary drop-shadow-2xl" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-medium">
              Sign in to continue your journey
            </p>
          </div>

          {/* login page form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card/50 backdrop-blur-xl shadow-2xl p-8 md:p-10 rounded-3xl space-y-6 border border-primary/20 relative overflow-hidden"
          >
            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-6">
              {/* error message */}
              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
                  <div className="bg-destructive/20 p-2 rounded-full">
                    <span className="text-xl">⚠</span>
                  </div>
                  <p className="font-medium flex-1">{errorMsg}</p>
                </div>
              )}

              {/* email field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span className="text-primary"></span> Email Address
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full h-12 border-primary/20 focus:border-primary bg-background/50 transition-all duration-300 hover:border-primary/40"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <span className="text-primary"></span> Password
                    <span className="text-destructive">*</span>
                  </label>
                  {/* 👉 Forgot Password Link */}
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 border-primary/20 focus:border-primary bg-background/50 transition-all duration-300 hover:border-primary/40"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <span>⚠</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* sign In button */}
              <Button
                type="submit"
                className="w-full h-13 text-base font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-300 mt-4 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin text-xl">⟳</span> Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <span className="text-lg">→</span>
                  </span>
                )}
              </Button>

              {/* toggle sign Up page */}
              <div className="text-center pt-6 border-t border-primary/10">
                <p className="text-muted-foreground text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1 hover:gap-2 duration-300"
                  >
                    Create Account
                    <span className="text-base">→</span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </GuestOnlyRoute>
  );
}

export default LoginPage;
