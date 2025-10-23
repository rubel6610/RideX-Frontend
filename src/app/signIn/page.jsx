"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/AuthProvider";
import GuestOnlyRoute from "../hooks/GuestOnlyRoute";
import LoginImage from "../../Assets/login.png";
import SidebarCar from "../../Assets/sidebar-car.json"; // ✅ Lottie file import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gsap } from "gsap"; // ✅ GSAP
import Lottie from "lottie-react"; // ✅ Lottie React

function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  // GSAP refs
  const leftRef = useRef(null);
  const formRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

    tl.fromTo(
      leftRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2 }
    )
      .fromTo(
        textRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2 },
        "-=0.8"
      )
      .fromTo(
        formRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.5"
      );
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Login failed");

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
      <div className="min-h-screen w-full grid grid-cols-1 sm:grid-cols-2 font-[Inter] bg-background text-foreground overflow-hidden">
        {/* ---------- Left Side (Illustration) ---------- */}
        <div
          ref={leftRef}
          className="hidden sm:flex w-full h-full items-center justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src={LoginImage}
              alt="Login illustration"
              fill
              className="object-cover scale-y-50"
              priority
            />
          </div>
        </div>

        {/* ---------- Right Side (Form) ---------- */}
<div
  ref={formRef}
  className="flex items-center justify-center w-full p-6 sm:p-8 md:p-12 lg:p-16 h-full bg-card"
>
          <div className="w-full max-w-md">
            {/* Branding */}
            <div ref={textRef} className="relative flex items-center gap-3 mb-10 sm:mb-6 md:mb-4 lg:mb-10">
              <div className="absolute -top-16 -left-6 w-40 h-40 flex items-center justify-center">
                <Lottie
                  animationData={SidebarCar}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
              <span className="ml-30 text-4xl font-bold text-foreground uppercase tracking-wide">
                RideX
              </span>
            </div>

            {/* Welcome text */}
            <div ref={textRef} className="mb-6 lg:mb-10">
              <h1 className="text-3xl md:text-[40px] lg:text-5xl font-extrabold text-foreground mb-1 md:-mb-2 lg:mb-2">
                Welcome <span className="text-primary">Back</span>
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg leading-4.5">
                Sign in to continue your journey
              </p>
            </div>

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {errorMsg && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg text-center border border-destructive/20">
                  {errorMsg}
                </div>
              )}

              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 md:h-14 border-input bg-background text-foreground text-lg"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-destructive text-sm mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  className="-mt-4 md:-mt-3 h-12 md:h-14 border-input bg-background text-foreground text-lg"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-destructive text-sm mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Remember me + forgot */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary border-border rounded focus:ring-ring cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-muted-foreground select-none">
                    Remember me
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In button */}
              <Button
                type="submit"
                className="w-full bg-primary text-lg text-primary-foreground shadow-lg shadow-accent/30 font-semibold py-5.5 rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up link */}
            <p ref={textRef} className="text-center text-muted-foreground mt-12 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GuestOnlyRoute>
  );
}

export default LoginPage;
