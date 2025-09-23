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

function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login submit function
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/signIn`, data, {
        withCredentials: true,
      });

      // save token in localStorage
      localStorage.setItem("token", res.data.token);

      router.push("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <p className="text-red-500 text-center">{errorMsg}</p>
        )}

        {/* email field */}
        <label>Email</label>
        <Input
          type="email"
          placeholder="your@email.com"
          className="border border-primary"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        {/* password field */}
        <label>Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          className="border border-primary"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        {/* sign In button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Sign In"}
        </Button>

        {/* toggle sign Up page */}
        <p className="text-center text-foreground ">
          Don&apos;t have account? Please{" "}
          <span className="text-primary underline cursor-pointer">
            <Link href="/register">Sign Up</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
