"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import heroImage from "@/Assets/hero-ridex.webp";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MapPopup = dynamic(() => import("./MapPopup"), { ssr: false });

const Hero = () => {
    const router = useRouter();
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [showPickupMap, setShowPickupMap] = useState(false);
    const [showDropMap, setShowDropMap] = useState(false);

    // Refs for GSAP animations
    const heroRef = useRef(null);
    const leftContentRef = useRef(null);
    const rightContentRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const formRef = useRef(null);
    const imageRef = useRef(null);
    const shapesRef = useRef([]);

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

    // GSAP Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate left content from left
            gsap.fromTo(leftContentRef.current,
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    delay: 0.2
                }
            );

            // Animate title with typewriter effect
            gsap.fromTo(titleRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.4
                }
            );

            // Animate subtitle
            gsap.fromTo(subtitleRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.6
                }
            );

            // Animate form with stagger
            gsap.fromTo(formRef.current,
                { y: 40, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)",
                    delay: 0.8
                }
            );

            // Animate right content from right
            gsap.fromTo(rightContentRef.current,
                { x: 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    delay: 0.3
                }
            );

            // Animate image with scale effect
            gsap.fromTo(imageRef.current,
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.5
                }
            );

            // Animate background shapes with stagger
            gsap.fromTo(shapesRef.current,
                { scale: 0, opacity: 0, rotation: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 360,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                    stagger: 0.1,
                    delay: 0.7
                }
            );

        }, heroRef);

        return () => ctx.revert();
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
        <section ref={heroRef} className="dark:bg-background primary/20 py-14 sm:py-18 md:py-20 lg:py-22 xl:py-26 mt-20 sm:mt-24">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 items-center px-10 xllg:px-0 overflow-hidden">
                {/* Left Content - UI only changes */}
                <div ref={leftContentRef} className="w-full md:w-3/7">
                    <h1 ref={titleRef} className="text-[180%] sm:text-6xl md:text-4xl lg:text-[52px] xl:text-6xl font-extrabold tracking-tight leading-7 sm:leading-13.5 md:leading-9 lg:leading-11.5 xl:leading-13.5 text-foreground">
                        Your Ride, Your Way with <span className="text-primary">RideX</span>
                    </h1>
                    <p ref={subtitleRef} className="mt-2 sm:mt-3 lg:mt-4 xllg:mt-6 text-[80%] sm:text-lg md:text-sm lg:text-base text-muted-foreground max-w-2xl leading-3.5 sm:leading-6 md:leading-3.5 lg:leading-4">
                        Discover the convenience of RideX. Request a ride now, or schedule one for later directly from your browser.
                    </p>

                    {/* Booking Form container styled like reference */}
                    <div ref={formRef} className="relative mt-16 w-full max-w-sm pl-12 pb-2">
                        <form onSubmit={handleSubmit}>
                            {/* Pickup */}
                            <div className="relative flex items-center h-12" onClick={() => setShowPickupMap(true)}>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                                <Input
                                    type="text"
                                    placeholder="Pickup location"
                                    className="px-8 h-14 rounded-lg border-none bg-accent/30 dark:bg-primary/20 focus-visible:ring-0"
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
                                    className="px-8 h-14 rounded-lg border-none bg-accent/30 dark:bg-primary/20 focus-visible:ring-0"
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
                <div ref={rightContentRef} className="relative w-full md:w-4/7 md:max-w-md mx-auto">
                    {/* Background shapes to mimic the jagged/broken frame effect */}
                    <div className="absolute inset-0 z-0">
                        {/* Top-Left block */}
                        <span ref={(el) => (shapesRef.current[0] = el)} className="absolute -top-10 -left-10 xl:top-0 xl:-left-14 h-16 w-16 bg-primary/60 transform rotate-12" />
                        {/* Top-Right block */}
                        <span ref={(el) => (shapesRef.current[1] = el)} className="absolute top-0 right-0 md:right-6 lg:right-0 h-10 w-20 bg-primary/60 translate-x-1/2 -translate-y-1/2" />
                        {/* Left-Center Block */}
                        <span ref={(el) => (shapesRef.current[2] = el)} className="absolute top-2/4 -left-11 md:-left-5 lg:-left-11 h-16 w-10 bg-primary/60" />
                        {/* Right-Center Block (thin strip) */}
                        <span ref={(el) => (shapesRef.current[3] = el)} className="absolute top-1/2 -right-4 sm:-right-7 md:-right-3 h-10 w-4 bg-primary/60 translate-x-1/2" />
                        {/* Bottom-Right block (large) */}
                        <span ref={(el) => (shapesRef.current[4] = el)} className="absolute -bottom-10 -right-10 md:-right-7 lg:-right-10 h-24 w-24 bg-primary/60 transform -rotate-12" />
                    </div>

                    <div ref={imageRef} className="z-10 w-full pt-[75%]"> {/* Aspect ratio container for image */}
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
