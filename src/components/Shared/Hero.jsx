"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ArrowRight, MapPin, Navigation, Bike } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import heroImage from "@/Assets/hero-ridex.webp"; // Using this image as requested
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapPopup = dynamic(() => import("./MapPopup"), { ssr: false });

const Hero = () => {
    const router = useRouter();
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [showPickupMap, setShowPickupMap] = useState(false);
    const [showDropMap, setShowDropMap] = useState(false);

    // page load এ current location fetch (First occurrence)
    useEffect(() => {
        if (!pickup && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // reverse geocode to get address
                    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                        .then((res) => res.json())
                        .then((data) => {
                            const locName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                            setPickup(locName);
                        })
                        .catch(() => {
                            setPickup(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                        });
                },
                (err) => console.error("Error getting location:", err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // page load এ current location fetch (Second occurrence - kept for consistency)
    useEffect(() => {
        if (!pickup && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // reverse geocode to get address
                    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                        .then((res) => res.json())
                        .then((data) => {
                            const locName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                            setPickup(locName);
                        })
                        .catch(() => {
                            setPickup(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                        });
                },
                (err) => console.error("Error getting location:", err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pickup || !drop) {
            alert("Please select Pickup and Drop locations!");
            return;
        }
        router.push(
            `/dashboard/user/book-a-ride?pickup=${encodeURIComponent(
                pickup
            )}&drop=${encodeURIComponent(drop)}`
        );
    };

    return (
        <section className="bg-accent/30 py-12 sm:py-16 md:py-20 lg:py-22 xl:py-26 mt-20 sm:mt-24">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 items-center px-10 xllg:px-0 overflow-hidden">
                {/* Left Content - UI only changes */}
                <div className="w-full md:w-3/7">
                    <h1 className="text-[180%] sm:text-6xl md:text-4xl lg:text-[52px] xl:text-6xl font-extrabold tracking-tight leading-7 sm:leading-13.5 md:leading-9 lg:leading-11.5 xl:leading-13.5 text-foreground">
                        Your Ride, Your Way with <span className="text-primary">RideX</span>
                    </h1>
                    <p className="mt-2 sm:mt-3 lg:mt-4 xllg:mt-6 text-[80%] sm:text-lg md:text-sm lg:text-base text-muted-foreground max-w-2xl leading-3.5 sm:leading-6 md:leading-3.5 lg:leading-4">
                        Discover the convenience of RideX. Request a ride now, or schedule one for later directly from your browser.
                    </p>

                    {/* Booking Form container styled like reference */}
                    <div className="relative mt-16 w-full max-w-sm pl-12">
                        <form onSubmit={handleSubmit}>
                            {/* Pickup */}
                            <div className="relative flex items-center h-12" onClick={() => setShowPickupMap(true)}>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                                <Input
                                    type="text"
                                    placeholder="Pickup location"
                                    className="px-8 h-14 rounded-lg border-none bg-white/70 dark:bg-background focus-visible:ring-0"
                                    readOnly
                                    value={pickup}
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-primary text-white">
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Divider bar connecting dots */}
                            <div className="ml-3 h-5">
                                <span className="absolute left-12 top-5 h-18 w-[2px] bg-primary/70 translate-x-[14px]" />
                            </div>

                            {/* Drop */}
                            <div className="relative flex items-center h-12" onClick={() => setShowDropMap(true)}>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-sm bg-primary" />
                                <Input
                                    type="text"
                                    placeholder="Dropoff location"
                                    className="px-8 h-14 rounded-lg border-none bg-white/70 dark:bg-background focus-visible:ring-0"
                                    readOnly
                                    value={drop}
                                />
                            </div>

                            <div className="mt-5 absolute -top-19 left-0">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="h-44 w-12 flex flex-col items-center justify-center rounded-lg text-sm tracking-wider leading-2"
                                >
                                    {Array.from("FindaRide").map((char, index) => (
                                        <span key={index}>{char}</span>
                                    ))}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Content - **UPDATED for jagged shape and existing heroImage** */}
                <div className="relative w-full md:w-4/7 md:max-w-md mx-auto">
                    {/* Background shapes to mimic the jagged/broken frame effect */}
                    <div className="absolute inset-0 z-0">
                        {/* Top-Left block */}
                        <span className="absolute -top-10 -left-10 xl:top-0 xl:-left-14 h-16 w-16 bg-accent/70 transform rotate-12" />
                        {/* Top-Right block */}
                        <span className="absolute top-0 right-0 md:right-6 lg:right-0 h-10 w-20 bg-accent/70 translate-x-1/2 -translate-y-1/2" />
                        {/* Left-Center Block */}
                        <span className="absolute top-2/4 -left-11 md:-left-5 lg:-left-11 h-16 w-10 bg-accent/70" />
                        {/* Right-Center Block (thin strip) */}
                        <span className="absolute top-1/2 -right-4 sm:-right-7 md:-right-3 h-10 w-4 bg-accent/70 translate-x-1/2" />
                        {/* Bottom-Right block (large) */}
                        <span className="absolute -bottom-10 -right-10 md:-right-7 lg:-right-10 h-24 w-24 bg-accent/70 transform -rotate-12" />
                    </div>

                    <div className="z-10 w-full pt-[75%]"> {/* Aspect ratio container for image */}
                        <Image
                            src={heroImage} // **Using the existing imported heroImage**
                            alt="RideX Hero"
                            fill
                            className="inset-0 object-cover w-full h-full"
                            priority
                        /> 
                    </div>
                </div>
            </div>

            {/* Pickup Map Popup */}
            {showPickupMap && (
                <MapPopup
                    title="Select Pickup Location"
                    onClose={() => setShowPickupMap(false)}
                    onSelect={(locName) => setPickup(locName)}
                    defaultCurrent // current location detection for pickup
                />
            )}

            {/* Drop Map Popup */}
            {showDropMap && (
                <MapPopup
                    title="Select Drop Location"
                    onClose={() => setShowDropMap(false)}
                    onSelect={(locName) => setDrop(locName)}
                    defaultCurrent={false}
                />
            )}
        </section>
    );
};

export default Hero;