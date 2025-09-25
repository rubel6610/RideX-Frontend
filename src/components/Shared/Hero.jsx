"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Star, ArrowRight, MapPin, Navigation, Bike } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import heroImage from "@/Assets/hero-img.svg";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapPopup = dynamic(() => import("./MapPopup"), { ssr: false });

const Hero = () => {
    const router = useRouter();
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [showPickupMap, setShowPickupMap] = useState(false);
    const [showDropMap, setShowDropMap] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pickup || !drop) {
            alert("Please select Pickup and Drop locations!");
            return;
        }
        router.push(
            `/book-ride?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(
                drop
            )}`
        );
    };

    return (
        <section className="bg-accent/30 py-10 px-4 md:px-0">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                    <div className="inline-flex items-center px-4 py-2 bg-accent text-foreground rounded-full text-sm font-medium border border-primary">
                        <Star className="h-4 w-4 mr-2" />
                        #1 Rated Ride-Sharing Platform
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
                        Your Ride, Your Way with <span className="text-primary">RideX</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                        Experience seamless transportation with trusted drivers, affordable
                        prices, and rides that arrive when you need them most.
                    </p>

                    {/* Booking Form */}
                    <div className="bg-accent/50 rounded-xl shadow p-6 w-full max-w-xl backdrop-blur-lg border border-accent">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            Book Your Ride Now
                            <span className="inline-block animate-bounce">
                                <Bike className="h-7 w-7 text-primary" />
                            </span>
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Pickup Field */}
                            <div
                                className="relative flex items-center cursor-pointer"
                                onClick={() => setShowPickupMap(true)}
                            >
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Pickup location"
                                    className="pl-10 pr-3 py-2 bg-transparent"
                                    readOnly
                                    value={pickup}
                                />
                            </div>

                            {/* Drop Field */}
                            <div
                                className="relative flex items-center cursor-pointer"
                                onClick={() => setShowDropMap(true)}
                            >
                                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Where to?"
                                    className="pl-10 pr-3 py-2 bg-transparent"
                                    readOnly
                                    value={drop}
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 mt-2">
                                <Link href="/dashboard/book-a-ride">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full justify-center"
                                    >
                                        Find Ride Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Content */}
                <div className="relative flex justify-center items-center">
                    <Image
                        src={heroImage}
                        alt="RideX Hero"
                        width={600}
                        height={400}
                        className="w-full max-w-xl h-auto rounded-2xl"
                        priority
                    />
                    {/* Floating Stats */}
                    <div className="absolute -bottom-8 left-0 bg-accent border border-primary rounded-xl p-4 shadow-lg flex items-center space-x-3">
                        <Star className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold text-lg">2 min</p>
                            <p className="text-sm text-muted-foreground">Avg pickup time</p>
                        </div>
                    </div>
                    <div className="absolute top-8 right-0 bg-accent border border-primary rounded-xl p-4 shadow-lg flex items-center space-x-3">
                        <ArrowRight className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold text-lg">50K+</p>
                            <p className="text-sm text-muted-foreground">Happy riders</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pickup Map Popup */}
            {showPickupMap && (
                <MapPopup
                    title="Select Pickup Location"
                    onClose={() => setShowPickupMap(false)}
                    onSelect={(locName) => setPickup(locName)}
                    defaultCurrent // This prop ensures current location detection for pickup
                />
            )}

            {/* Drop Map Popup */}
            {showDropMap && (
                <MapPopup
                    title="Select Drop Location"
                    onClose={() => setShowDropMap(false)}
                    onSelect={(locName) => setDrop(locName)}
                    defaultCurrent={false} // Explicitly set to false, so it doesn't try to get current location
                />
            )}
        </section>
    );
};

export default Hero;