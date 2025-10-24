'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ArrowRight, Star } from 'lucide-react';

// --- DRIVER/SERVICE ASSET IMPORTS ---
import servicePic1 from '../../Assets/driver-michael.jpg'; // Michael's Photo
import servicePic2 from '../../Assets/driver-sarah.jpg';   // Sarah's Photo
import servicePic3 from '../../Assets/driver-featured.jpg'; // David's Photo

const FeaturedDrivers = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  // Data for driver/service highlights
  const services = [
    {
      id: 1,
      image: servicePic1,
      title: "Executive Business Rides by Michael J.",
      description:
        "Michael Johnson ensures prompt, professional executive transport. Highly rated for airport transfers and multi-stop business logistics. Travel with the best.",
      rating: 4.9,
      totalRides: 2847,
    },
    {
      id: 2,
      image: servicePic2,
      title: "City Tours & Long Hauls with Sarah C.",
      description:
        "Sarah Chen offers comfortable long-distance travel and personalized city tours. Known for her safe, smooth driving and local expertise.",
      rating: 4.8,
      totalRides: 1956,
    },
    {
      id: 3,
      image: servicePic3,
      title: "Premium Event Transport by David R.",
      description:
        "David Rodriguez delivers flawless 5-star service for weddings and exclusive events in a luxury fleet vehicle. Discretion and elegance guaranteed.",
      rating: 5.0,
      totalRides: 3245,
    },
  ];

  // Initial mount animation (not scroll-based)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Rating component
  const ServiceRating = ({ rating, totalRides }) => (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <Star
          className="h-5 w-5 md:h-6 md:w-6 lg:w-7 lg:h-7 text-yellow-400 transition-colors"
          fill="currentColor"
        />
        <span className="font-bold text-lg lg:text-2xl xl:text-3xl xl:teaxt-text-foreground group-hover:text-white/90">
          {rating.toFixed(1)}
        </span>
      </div>
      <span className="text-sm lg:text-lg xl:text-xl leading-3.5 text-muted-foreground group-hover:text-white/70">
        (Based on {totalRides.toLocaleString()} successful rides)
      </span>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="pb-24 sm:pb-28 md:pb-40 lg:pb-46 xl:pb-56 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-10">
          <div className="flex flex-col justify-end">
            <div className="flex items-center space-x-2 mb-2 sm:mb-4">
              <div className="text-primary text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.2em]">
                PREMIUM DRIVER SERVICE
              </div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-[34px] lg:text-[40px] xl:text-[50px] font-black text-foreground uppercase leading-8 sm:leading-11 md:leading-[31px] lg:leading-10 xl:leading-11.5">
              MEET OUR <span className="text-primary">FEATURED DRIVERS</span>
              <br />
              AND THEIR EXPERTISE
            </h2>

            <div className="w-14 sm:w-24 md:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 md:h-[3px] lg:h-1 mt-2 sm:mt-3 md:mt-2 lg:mt-3 bg-primary"></div>
          </div>

          <div className="flex flex-col justify-end md:text-right text-base sm:text-lg md:text-lg lg:text-[19px] xl:text-[22px] text-muted-foreground md:pt-6 leading-4.5 sm:leading-5.5 md:leading-[19px] lg:leading-5 xl:leading-6">
            <p className="mb-2 sm:mb-4 md:mb-3 xl:mb-4">
              Our commitment is to excellence, driven by our top-rated chauffeurs. They define the RideX premium experience with safety, professionalism, and local knowledge.
            </p>

            <a href="#" className="font-semibold text-primary">
              View All Driver Profiles &rarr;
            </a>
          </div>
        </div>

        {/* Service Cards */}
        <div className="border-t border-border">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="group relative h-auto transition-all duration-300 overflow-hidden"
            >
              {/* Hover Background Overlay */}
              <div className="absolute inset-0 rounded-none z-0 bg-background transition-transform duration-300 group-hover:translate-y-full"></div>
              <div className="absolute inset-0 rounded-none z-0 bg-primary transition-transform duration-300 -translate-y-full group-hover:translate-y-0"></div>

              {/* Card Content */}
              <div className="relative z-10 p-4 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 py-8 border-b border-border transition-transform duration-300 group-hover:translate-x-1">
                {/* Image Section */}
                <div className="w-full h-52 sm:w-[270px] md:w-[350px] sm:h-54 lg:h-60 xl:h-52 relative flex-shrink-0 overflow-hidden border-8 border-transparent group-hover:border-white transition-all duration-300">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-auto flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-[26px] md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold mb-3 md:mb-4 text-foreground leading-6.5 sm:leading-[27px] md:leading-7.5 lg:leading-8.5 xl:leading-9 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] lg:text-base xl:text-xl leading-3.5 sm:leading-[15px] lg:leading-4.5 xl:leading-[21px mb-3 sm:mb-2 md:mb-0 text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                    {service.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                    <div className="w-6/8">
                      <ServiceRating rating={service.rating} totalRides={service.totalRides} />
                    </div>

                    <button
                      className="ml-auto sm:ml-0 flex items-center justify-center w-16 h-16 sm:w-12 sm:h-12 md:h-14 md:w-14 lg:w-20 lg:h-20 rounded-full -rotate-45 shadow-md transition-all duration-300 bg-muted text-muted-foreground hover:cursor-pointer group-hover:bg-white group-hover:text-primary group-hover:rotate-0"
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

export default FeaturedDrivers;
