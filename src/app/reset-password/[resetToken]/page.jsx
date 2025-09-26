"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const {resetToken} = useParams(); 
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setMessage("");
    setError("");

    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/reset-password`,
        { resetToken, newPassword: data.newPassword }
      );

      setMessage(res.data.message);

      // redirect after success
      setTimeout(() => router.push("/signIn"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <p className="text-green-600 bg-green-50 dark:bg-green-900/30 p-2 rounded mb-2">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded mb-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* New Password */}
            <div>
              <Input
                type="password"
                placeholder="New password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
