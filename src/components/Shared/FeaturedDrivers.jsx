'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';

// --- DRIVER/SERVICE ASSET IMPORTS (You need to update these paths) ---
import servicePic1 from '../../Assets/driver-michael.jpg'; // Michael's Photo
import servicePic2 from '../../Assets/driver-sarah.jpg';   // Sarah's Photo
import servicePic3 from '../../Assets/driver-featured.jpg'; // David's Photo

gsap.registerPlugin(ScrollTrigger);

const ServiceHighlightsSection = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  // Data updated to reflect a mix of driver and service context (RideX related)
  const services = [
    {
      id: 1,
      image: servicePic1,
      title: "Executive Business Rides by Michael J.",
      // Description made highly relevant to the 'driver' context
      description: "Michael Johnson ensures prompt, professional executive transport. Highly rated for airport transfers and multi-stop business logistics. Travel with the best.",
      rating: 4.9,
      totalRides: 2847, // Use the real ride count
    },
    {
      id: 2,
      image: servicePic2,
      title: "City Tours & Long Hauls with Sarah C.",
      description: "Sarah Chen offers comfortable long-distance travel and personalized city tours. Known for her safe, smooth driving and local expertise.",
      rating: 4.8,
      totalRides: 1956,
    },
    {
      id: 3,
      image: servicePic3,
      title: "Premium Event Transport by David R.",
      description: "David Rodriguez delivers flawless 5-star service for weddings and exclusive events in a luxury fleet vehicle. Discretion and elegance guaranteed.",
      rating: 5.0,
      totalRides: 3245,
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, index) => {
        // Alternating animation: Left for index 0, Right for index 1, Left for index 2, etc.
        const direction = index % 2 === 0 ? -100 : 100;

        gsap.fromTo(card,
          { opacity: 0, x: direction },
          {
            opacity: 1,
            x: 0,
            duration: 0.8, // Animation duration is set to 0.8s (fast)
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Rating component (Unchanged, uses data correctly)
  const ServiceRating = ({ rating, totalRides }) => (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <Star className="h-5 w-5 md:h-6 md:w-6 lg:w-7 lg:h-7 text-yellow-400 transition-colors" fill="currentColor" />
        <span className="font-bold text-lg lg:text-xl text-foreground group-hover:text-white/90">{rating.toFixed(1)}</span>
      </div>
      <span className="text-sm lg:text-base leading-3.5 text-muted-foreground group-hover:text-white/70">
        (Based on {totalRides.toLocaleString()} successful rides)
      </span>
    </div>
  );

  return (
    <section ref={sectionRef} className="pb-24 sm:pb-30 md:pb-40 lg:pb-46 xl:pb-56 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section (Updated Titles to be RideX/Driver relevant) */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 md:gap-8 mb-8 pt-4">
          <div className="flex flex-col justify-end">
            <div className="flex items-center space-x-2 mb-2 sm:mb-4">
              <div className="text-primary text-xs sm:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.2em]">
                PREMIUM DRIVER SERVICE
              </div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-3xl lg:text-[40px] xl:text-5xl font-black text-foreground uppercase leading-7.5 sm:leading-11 md:leading-7.5 lg:leading-10 xl:leading-11">
              Meet Our <span className="text-primary">Featured Drivers</span>
              <br />
              And Their Expertise
            </h2>
            {/* Divider uses primary color */}
            <div className="w-12 sm:w-20 lg:w-16 xl:w-20 h-0.5 sm:h-1 mt-2 bg-primary"></div>
          </div>
          <div className="flex flex-col justify-end md:text-right text-sm sm:text-lg md:text-sm lg:text-lg xl:text-xl text-muted-foreground md:pt-6 leading-5 sm:leading-5.5 md:leading-5 lg:leading-5.5 xl:leading-6">
            <p className="mb-2 sm:mb-4 md:mb-3 lg:mb-4">
              Our commitment is to excellence, driven by our top-rated chauffeurs. They define the RideX premium experience with safety, professionalism, and local knowledge.
            </p>
            <a href="#" className="font-semibold text-primary">
              View All Driver Profiles &rarr;
            </a>
          </div>
        </div>

        {/* Services Cards (Now Driver/Service Highlights) */}
        <div className="border-t border-border">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="group relative h-auto transition-all duration-300 overflow-hidden" 
            >

              {/* Background Overlay for Hover Effect (SLIDE-IN EFFECT IMPLEMENTED) */}
              <div
                className="absolute inset-0 rounded-none z-0 bg-background transition-transform duration-300 group-hover:translate-y-full"
              ></div>
              <div
                // Primary color slides down from the top
                className="absolute inset-0 rounded-none z-0 bg-primary transition-transform duration-300 -translate-y-full group-hover:translate-y-0"
              ></div>

              {/* Card Content Wrapper: Applies small right shift on hover */}
              <div
                className="relative z-10 p-4 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 py-8 border-b border-border transition-transform duration-300 group-hover:translate-x-1"
              >
                {/* Left Image Section (BORDER ON HOVER IMPLEMENTED) */}
                <div
                  className={`w-full h-52 sm:w-[270px] md:w-[350px] sm:h-54 lg:h-60 xl:h-52 relative flex-shrink-0 overflow-hidden border-8 border-transparent group-hover:border-white transition-all duration-300`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                {/* Right Content Section */}
                <div className="w-full md:w-auto flex flex-col justify-center">

                  {/* Title (Driver/Service Name) and Description */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 text-foreground leading-6.5 sm:leading-7 lg:leading-8.5 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] lg:text-base leading-3.5 sm:leading-[15px] lg:leading-4.5 mb-3 sm:mb-2 md:mb-0 text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                    {service.description}
                  </p>

                  {/* Rating and Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">

                    {/* Service Rating component (Displays Driver Rating) */}
                    <div className='w-6/8'>
                      <ServiceRating rating={service.rating} totalRides={service.totalRides} />
                    </div>

                    {/* Circular Arrow Button: Rotates 45deg on hover */}
                    <button
                      className={`ml-auto sm:ml-0 flex items-center justify-center w-16 h-16 sm:w-12 sm:h-12 md:h-14 md:w-14 lg:w-20 lg:h-20 rounded-full -rotate-45 shadow-md transition-all duration-300 bg-muted text-muted-foreground hover:cursor-pointer
                            group-hover:bg-white group-hover:text-primary group-hover:rotate-0`}
                    >
                      <ArrowRight className="w-7 h-7 sm:w-5 sm:h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlightsSection;