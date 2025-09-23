import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CarLogo from "../../Assets/car-icon.png";
// import GoogleIcon from "../../Assets/google-icon.png";
// import FacebookIcon from "../../Assets/facebook-icon.png";
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
        <h2 className="text-3xl text-primary font-bold">
          Welcome Back
        </h2>
        <p className="text-black dark:text-white text-lg">
          Rejoin to get started
        </p>
      </div>

      {/* login page from  */}
      <form className="shadow-lg p-8 rounded-xl space-y-4 max-w-xl mx-auto border border-primary">
        {/* <p className="text-black/60 dark:text-white/60 text-center mb-8 text-lg w-2/3 flex mx-auto justify-center">
          Sign in to access your account and start your journey with RideX
        </p> */}

        {/* email field  */}
        <label>Email</label>
        <Input
          type="email"
          placeholder="your@email.com"
          className="border border-primary"
        ></Input>

        {/* password field  */}
        <label>Password</label>
        <Input
          type="password"
          placeholder="Create a strong password"
          className="border border-primary"
        ></Input>

        {/* sign In button */}
        <Button className="w-full bg-primary hover:bg-primary text-white dark:background">
          Create Account
        </Button>

        {/* google login button  */}
        {/* <Button
          variant="outline"
          className="w-full dark:bg-white bg-gray-800 hover:bg-gray-900 text-white dark:text-black"
        >
          <Image
            src={GoogleIcon}
            alt="google-icon"
            width={20}
            height={20}
            className=""
          />
          Continue with Google
        </Button> */}

        {/* facebook login button  */}
        {/* <Button
          variant="outline"
          className="w-full dark:bg-white bg-gray-800 hover:bg-gray-900 text-white dark:text-black"
        >
          <Image
            src={FacebookIcon}
            alt="google-icon"
            width={40}
            height={40}
            className=""
          />
          Continue with Facebook
        </Button> */}

        {/* toggle sign Up page  */}
        <p className='text-center text-foreground '>
          Don't have account? Please{" "}
          <span className='text-primary underline cursor-pointer'>
            <Link href="/register" >
            Sign Up
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
