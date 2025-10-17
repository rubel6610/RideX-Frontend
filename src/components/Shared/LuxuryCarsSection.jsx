'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import carImage from '../../Assets/car-transparent.png';
import bikeImage from '../../Assets/bike-transparent.png';
import cngImage from '../../Assets/cng-transparent.png';

gsap.registerPlugin(ScrollTrigger);

const LuxuryCarsSection = () => {
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightImageRef = useRef(null);
  const featuresRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselSlides = [
    { id: 1, src: carImage, alt: "RideX Car 1" },
    { id: 2, src: bikeImage, alt: "RideX Car 2" },
    { id: 3, src: cngImage, alt: "RideX Car 3" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftContentRef.current, { x: -100, opacity: 0 }, {
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

      gsap.fromTo(rightImageRef.current, { x: 100, opacity: 0, scale: 0.8 }, {
        x: 0,
        opacity: 1,
        scale: 1,
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

      gsap.fromTo(featuresRef.current, { y: 50, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
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
    <section ref={sectionRef} className="pb-24 sm:pb-28 md:pb-40 lg:pb-46 xl:pb-56 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 md:gap-6 lg:gap-16 items-center">

          <div ref={leftContentRef} className="space-y-3 lg:space-y-6">
            <div className="flex items-center space-x-2 mb-2 sm:mb-4">
              <div className="text-primary text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.2em]">
                RIDEX RIDES
              </div>
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>

            <h2 className="text-4xl sm:text-[50px] md:text-[28px] lg:text-[40px] xl:text-6xl text-foreground uppercase leading-8 sm:leading-11.5 md:leading-7.5 lg:leading-10 xl:leading-14 tracking-tight">
              ENJOY EVERY RIDE WITH SAFETY AND COMFORT
            </h2>

            <p className="sm:mt-2 text-muted-foreground text-base sm:text-lg md:text-base lg:text-lg xl:text-xl leading-4.5 sm:leading-5 md:leading-4 lg:leading-5 xl:leading-6">
              Book your next ride in seconds with Ridex. We connect you to nearby drivers for quick, safe, and reliable trips anytime you need to go.
            </p>

            <div className="w-full h-px bg-muted-foreground/30 mt-4"></div>

            <div className="space-y-4">
              <div
                ref={(el) => (featuresRef.current[0] = el)}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                    Fast Booking
                  </h3>
                  <p className="text-sm sm:text-base md:text-sm lg:text-base text-muted-foreground leading-4 sm:leading-4.5">
                    Get matched with a nearby driver instantly and start your trip without waiting in long queues or facing delays.
                  </p>
                </div>
              </div>

              <div
                ref={(el) => (featuresRef.current[1] = el)}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                    Trusted Quality
                  </h3>
                  <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-muted-foreground leading-4 sm:leading-4.5">
                    Clean vehicles, professional drivers, and a platform designed to give you a smooth and safe ride every time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div ref={rightImageRef} className="relative">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[510px] rounded-[30px] overflow-hidden bg-primary">
              {carouselSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={1000}
                    height={1000}
                    className="scale-140 w-[100%] -mt-16 h-full object-contain mx-auto block"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-[-30px] relative z-10 space-x-3">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-white' : 'bg-black/50 hover:bg-black/70'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryCarsSection;
