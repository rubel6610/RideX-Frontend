import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CarLogo from "../../Assets/car-icon.png";
import Image from "next/image";
import React from "react";
import Link from "next/link";

function LoginPage() {
  return (
    <div className="mt-28 container mx-auto mb-16">
      {/* title and logo  */}
      <div className="flex flex-col items-center space-y-2 my-6">
        <Image
          src={CarLogo}
          alt="car-logo"
          width={60}
          height={60}
          className=""
        />
        <h2 className="text-3xl text-primary font-bold">Wellcome Back</h2>
        <p className="text-muted-foreground">Rejoin to get started</p>
      </div>

      {/* login page from  */}
      <form className="shadow-lg p-8 rounded-xl space-y-4 max-w-xl mx-auto border border-muted-foreground/10">
        <p className="text-muted-foreground text-center mb-8">
          Sign in to access your account and start your journey with RideX
        </p>

        {/* email field  */}
        <label>Email</label>
        <Input type="email" placeholder="your@email.com"></Input>

        {/* password field  */}
        <label>Password</label>
        <Input type="password" placeholder="Create a strong password"></Input>

        {/* Create account button  */}
        <Button variant="primaryBtn" className="w-full">
          Sign In
        </Button>
        {/* google login button  */}

        {/* facebook login button  */}

        {/* toggle sign Up page  */}
        <p className="text-center text-muted-foreground">
          Din't have account? Please{" "}
          <span className="text-primary">
            <Link href="/register" />
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
