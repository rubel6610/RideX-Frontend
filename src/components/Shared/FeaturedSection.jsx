'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import featuredPic1 from '../../Assets/featured-pic1.jpg'
import featuredPic2 from '../../Assets/featured-pic2.jpg'
import featuredPic from '../../Assets/featured-pic.webp'
import { Car, MapPin, Users, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeaturedSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const leftImagesRef = useRef(null);
  const rightContentRef = useRef(null);
  const cardsRef = useRef([]);

  const stats = [
    { id: 1, number: "1200", label: "Vehicle Fleet", icon: Car, hoverImage: featuredPic },
    { id: 2, number: "5M+", label: "Kilometer Of Drive", icon: MapPin, hoverImage: featuredPic },
    { id: 3, number: "50K+", label: "Pickup & Drop", icon: Users, hoverImage: featuredPic },
    { id: 4, number: "20K+", label: "Booking Reserved", icon: Calendar, hoverImage: featuredPic }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftImagesRef.current, { x: -100, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.fromTo(rightContentRef.current, { x: 100, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.fromTo(cardsRef.current, { y: 50, opacity: 0, scale: 0.8 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="pb-12 sm:py-16 md:py-20 lg:py-22 xl:py-26 bg-background overflow-hidden pt-20 sm:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-4 lg:gap-10 justify-center items-center">
          {/* Left Side - Updated Responsive Dual Images */}
          <div
            ref={leftImagesRef}
            className="relative w-full h-[400px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px] flex items-center justify-center"
          >
            {/* Background Image (bottom layer) */}
            <div className="absolute w-[60%] max-w-[320px] md:w-[70%] md:max-w-[600px] lg:w-[400px] xl:w-[460px] sm:max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transform translate-x-[-40px] translate-y-[40px] rotate-[-4deg]">
              <Image
                src={featuredPic1}
                alt="Luxury car background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Foreground Image (top layer, slightly higher & right-shifted) */}
            <div className="absolute w-[60%] max-w-[320px] md:w-[70%] md:max-w-[600px] lg:w-[400px] xl:w-[460px] sm:max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transform translate-x-[40px] translate-y-[-40px] rotate-[3deg] z-10">
              <Image
                src={featuredPic2}
                alt="Driver in car"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative dots */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex flex-col space-y-3 z-20">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full shadow-lg"></div>
              ))}
            </div>
          </div>

          {/* Right Side - Updated Titles & Description */}
          <div ref={rightContentRef} className="space-y-6 md:space-y-4 lg:space-y-6 xl:space-y-10">
            <div className="text-primary text-sm font-bold uppercase tracking-[0.2em]">
              RIDE WITH CONFIDENCE
            </div>
            <h2 className="text-4xl md:text-3xl lg:text-5xl xl:text-6xl text-foreground uppercase leading-8.5 md:leading-7 lg:leading-11 xl:leading-14 tracking-tight">
              YOUR TRUSTED RIDE, ANYTIME ANYWHERE
            </h2>
            <p className="text-muted-foreground text-base sm:text-sm lg:text-lg max-w-xl leading-5 md:leading-4 lg:leading-5">
              RideX connects you to reliable rides across your city. From quick pickups to long drives, we make every trip smooth, affordable, and safe—so you can travel without limits and reach your destination with ease.
            </p>

            <div className="grid grid-cols-2 gap-8 md:gap-4 lg:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="relative bg-muted p-8 md:py-0 md:px-8 lg:p-8 rounded-xl transition-all duration-500 hover:shadow-2xl cursor-pointer group h-[180px] md:h-[120px] lg:h-[180px] flex items-center justify-center"
                  onMouseEnter={() => setHoveredCard(stat.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-primary rounded-tl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-r-4 border-b-4 border-primary rounded-br-xl"></div>

                  {hoveredCard === stat.id && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <Image
                        src={stat.hoverImage}
                        alt="Hover background"
                        fill
                        className="object-cover transition-all duration-500"
                      />
                    </div>
                  )}

                  <div className="relative group z-10 text-center">
                    {stat.id === 1 ? (
                      <>
                        <div className="flex justify-center mb-2 lg:mb-4">
                          <div className="w-16 h-16 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <stat.icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="font-black text-primary lg:mb-2 text-4xl md:text-xl lg:text-4xl">
                          {stat.number}
                        </div>
                        <div className="text-primary-foreground group-hover:text-white font-semibold text-xl md:text-sm lg:text-lg">
                          {stat.label}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl md:text-xl lg:text-4xl text-foreground group-hover:text-white mb-2">
                          {stat.number}
                        </div>
                        <div className="text-foreground group-hover:text-white font-semibold text-lg md:text-sm lg:text-lg leading-4">
                          {stat.label}
                        </div>
                      </>
                    )}
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
