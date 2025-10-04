import {
  AlarmClockCheck,
  Car,
  DollarSign,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
const BeRidersAndPassenger = () => {
  return (
    <section className="pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="rounded-2xl p-10 shadow-lg bg-amber-300/5 backdrop-blur-md border border-accent flex flex-col justify-center hover:-translate-y-1 duration-300 transition-all">
            <div className="flex items-center gap-2 bg-accent/30 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-border mb-4 max-w-max">
              <Users className="h-5 w-5" />
              <span>For RideX Passenger</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Become a <span className="text-primary">RideX Passenger</span>
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Join millions of Riders who choose RideX for safe, reliable, and
              affordable transportation.
            </p>
            <ul className="space-y-6">
              <li>
                <div className="flex gap-4 items-center">
                  <span className="text-primary bg-primary/30 rounded p-2">
                    <ShieldCheck />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">Safe & Verified</span>
                    <span className="mt-1 text-muted-foreground text-sm">Safe & Secure Rides anytime, anywhere</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4 items-center">
                  <span className="text-primary bg-accent rounded p-2">
                    <DollarSign />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">Affordable Rates</span>
                    <span className="mt-1 text-muted-foreground text-sm">Affordable pricing with no hidden costs</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4 items-center">
                  <span className="bg-primary/20 rounded p-2 text-primary">
                    <AlarmClockCheck />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">24/7 Availability</span>
                    <span className="mt-1 text-muted-foreground text-sm">24/7 Availability with dedicated support</span>
                  </div>
                </div>
              </li>
            </ul>
            <Button asChild variant="primary" size="lg" className="mt-7 w-full flex items-center justify-center gap-2">
              <Link href="/register">
                <Users className="h-5 w-5" />
                Sign Up as a Passenger
              </Link>
            </Button>
            <span className="text-muted-foreground mt-6 text-center">Already have an account? <Link href="/signin" className="text-primary font-semibold">Sign in here</Link></span>
          </div>

          {/* Right / Driver Section */}
          <div className="rounded-2xl p-10 shadow-lg bg-accent/20 backdrop-blur-md border border-border flex flex-col justify-center hover:-translate-y-1 duration-300 transition-all">
            <div className="flex items-center gap-2 bg-accent/0 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-border mb-4 max-w-max">
              <Car className="h-5 w-5" />
              <span>For RideX Rider</span>
            </div>
            
              
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Become a <span className="text-primary">RideX Rider</span>
            </h3>

            <p className="text-muted-foreground mb-6 text-lg">
              Turn your car into a money-making opportunity. Drive on your own
              schedule with extra earnings.
            </p>
            <ul className="space-y-6">
              <li>
                <div className="flex gap-4 items-center">
                  <span className="text-primary bg-primary/30 rounded p-2">
                    <DollarSign />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">Earn More</span>
                    <span className="mt-1 text-muted-foreground text-sm">Earn more with flexible hours</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4 items-center">
                  <span className="bg-primary/20 rounded p-2 text-primary">
                    <AlarmClockCheck />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">Flexible Schedule</span>
                    <span className="mt-1 text-muted-foreground text-sm">Freedom to drive when you want</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4 items-center">
                  <span className="bg-accent rounded p-2 text-primary">
                    <Star />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">Driver Support</span>
                    <span className="mt-1 text-muted-foreground text-sm">Partner support whenever you need help</span>
                  </div>
                </div>
              </li>
            </ul>

            <Button asChild variant="primary" size="lg" className="mt-7 w-full flex items-center justify-center gap-2">
              <Link href="/register">
                <Car className="h-5 w-5" />
                Apply to Driver
              </Link>
            </Button>
            <span className="text-muted-foreground mt-6 text-center">Requirements: Valid license, insurance, and vehicle inspection</span>

          </div>
          
      </div>
    </section>
  );
};

export default BeRidersAndPassenger;
