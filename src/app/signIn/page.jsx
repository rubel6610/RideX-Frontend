'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CarLogo from "../../Assets/car-icon.png";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // email state

  const handleForgotPassword = () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
    // এখানে তুমি Firebase বা API call করতে পারো
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="mt-28 container mx-auto mb-16">
      {/* title and logo  */}
      <div className="flex flex-col items-center space-y-2 my-6">
        <Image src={CarLogo} alt="car-logo" width={60} height={60} />
        <h2 className="text-3xl text-primary font-bold">Welcome Back</h2>
        <p className="text-black dark:text-white text-lg">Rejoin to get started</p>
      </div>

      {/* login page form  */}
      <form className="shadow-lg p-8 rounded-xl space-y-4 max-w-xl mx-auto border border-primary">
        {/* email field  */}
        <label>Email</label>
        <Input
          type="email"
          placeholder="your@email.com"
          className="border border-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* password field with toggle  */}
        <label>Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="border border-primary pr-12"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* forgot password link */}
        <p
          className="text-right text-sm text-primary underline cursor-pointer"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>

        {/* sign In button */}
        <Button className="w-full bg-primary hover:bg-primary text-white dark:background">
          Sign In
        </Button>

        {/* toggle sign Up page  */}
        <p className="text-center text-foreground">
          Don't have an account? Please{" "}
          <span className="text-primary underline cursor-pointer">
            <Link href="/register">Sign Up</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
