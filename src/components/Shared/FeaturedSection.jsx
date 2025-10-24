'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import featuredPic2 from '../../Assets/featured-pic1.jpg';
import featuredPic1 from '../../Assets/featured-pic2.jpg';
import featuredPic from '../../Assets/featured-pic.webp';
import { Car, MapPin, Users, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeaturedSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const sectionRef = useRef(null);
  const leftImagesRef = useRef(null);
  const rightContentRef = useRef(null);
  const cardsRef = useRef([]);
  const [counts, setCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const stats = [
    { id: 1, number: 1200, label: 'Vehicle Fleet', icon: Car, hoverImage: featuredPic },
    { id: 2, number: 5000000, label: 'Kilometer Of Drive', icon: MapPin, hoverImage: featuredPic },
    { id: 3, number: 50000, label: 'Pickup & Drop', icon: Users, hoverImage: featuredPic },
    { id: 4, number: 20000, label: 'Booking Reserved', icon: Calendar, hoverImage: featuredPic },
  ];

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftImagesRef.current, { x: -100, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.fromTo(rightContentRef.current, { x: 100, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.fromTo(cardsRef.current, { y: 50, opacity: 0, scale: 0.8 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.2,
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Count-up effect
  useEffect(() => {
    stats.forEach((stat) => {
      let start = 0;
      const end = stat.number;
      const duration = 2;
      const increment = end / (duration * 60);
      const id = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(id);
          start = end;
        }
        setCounts((prev) => ({ ...prev, [stat.id]: Math.floor(start) }));
      }, 16);
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-28 md:pt-30 lg:pt-32 xl:pt-34 md:pb-40 lg:pb-46 xl:pb-56 bg-background overflow-hidden"
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-6 lg:gap-10 justify-center items-center">
          {/* Left Side - Dual Images with individual animated border overlays */}
          <div
            ref={leftImagesRef}
            className="relative flex-1 w-full md:w-1/2 h-full overflow-visible"
          >
            {/* Mobile stacked */}
            <div className="flex flex-col md:hidden w-full h-full items-center justify-center gap-2 sm:gap-3">
              {[featuredPic1, featuredPic2].map((imgSrc, index) => (
                <div
                  key={index}
                  className="relative w-full sm:h-[80%] overflow-hidden transition-all duration-500"
                >
                  {/* Image */}
                  <Image
                    src={imgSrc}
                    alt={`Featured image ${index + 1}`}
                    width={400}
                    height={500}
                    className={`object-cover w-full h-full transition-all duration-500 ${isSectionHovered ? 'brightness-80' : 'brightness-100'}`}
                    priority
                  />

                  {/* Border overlay (always on top, animates opacity) */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 border-[6px] border-white/70 transition-opacity duration-500 ${isSectionHovered ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>
              ))}
            </div>

            {/* Desktop layered */}
            <div className="hidden md:block relative w-full md:h-[520px] lg:h-[630px] xl:h-[730px]">
              {/* Background image box with border overlay */}
              <div className="absolute top-0 left-0 w-[75%] h-[80%] overflow-hidden transition-all duration-500">
                <Image
                  src={featuredPic1}
                  alt="Luxury car background"
                  fill
                  className={`object-cover transition-all duration-500 ${isSectionHovered ? 'brightness-80' : 'brightness-100'}`}
                  priority
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 border-[6px] border-white/70  transition-opacity duration-500 ${isSectionHovered ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>

              {/* Foreground image box with border overlay */}
              <div className="absolute bottom-0 right-0 w-[75%] h-[80%] overflow-hidden transition-all duration-500">
                <Image
                  src={featuredPic2}
                  alt="Driver in car"
                  fill
                  className={`object-cover transition-all duration-500 ${isSectionHovered ? 'brightness-80' : 'brightness-100'}`}
                  priority
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 border-[6px] border-white/70 transition-opacity duration-500 ${isSectionHovered ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>

              {/* Decorative dots */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex flex-col space-y-3 z-20">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full shadow-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Title & Stats */}
          <div ref={rightContentRef} className="w-full flex-1 md:w-1/2 space-y-3 lg:space-y-6">
            <div className="flex items-center space-x-2 mb-2 sm:mb-4">
              <div className="text-primary text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.2em]">
                RIDE WITH CONFIDENCE
              </div>
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>

            <h2 className="text-4xl sm:text-[50px] md:text-[40px] xl:text-6xl text-foreground uppercase leading-8 sm:leading-11.5 md:leading-9 lg:leading-11 xl:leading-14 tracking-tight">
              YOUR TRUSTED RIDE, ANYTIME ANYWHERE
            </h2>

            <p className="sm:mt-2 text-muted-foreground text-base sm:text-lg md:text-base lg:text-lg xl:text-xl leading-4.5 sm:leading-5 md:leading-4.5 lg:leading-5 xl:leading-6">
              RideX connects you to reliable rides across your city. From quick pickups to long drives, we make every trip smooth, affordable, and safe—so you can travel without limits and reach your destination with ease.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-4 sm:mt-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="relative bg-muted p-8 md:py-0 md:px-8 lg:p-8 rounded-xl transition-all duration-700 hover:shadow-2xl cursor-pointer group h-[180px] md:h-[120px] lg:h-[180px] flex items-center justify-center overflow-hidden"
                  onMouseEnter={() => setHoveredCard(stat.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {hoveredCard === stat.id && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <Image
                        src={stat.hoverImage}
                        alt="Hover background"
                        fill
                        className="object-cover w-full h-full transition-transform duration-700 ease-out brightness-75"
                      />
                    </div>
                  )}

                  <div className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-primary rounded-tl-xl" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-r-4 border-b-4 border-primary rounded-br-xl" />

                  <div className="relative z-10 text-center transition-all duration-500">
                    <div className="text-primary text-xl sm:text-4xl md:text-xl lg:text-4xl font-extrabold mb-2 sm:mb-1 lg:mb-2">
                      {counts[stat.id].toLocaleString()}
                    </div>
                    <div className="group-hover:text-white font-semibold text-lg sm:text-2xl md:text-sm lg:text-lg leading-4.5 md:leading-4">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
