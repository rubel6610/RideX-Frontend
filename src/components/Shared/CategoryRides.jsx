'use client'; // ⭐️ KEEP THIS LINE for useEffect, useRef, and Swiper/GSAP functionality ⭐️

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Car, Bike, TramFront } from 'lucide-react';

import carImage from '../../Assets/car.webp';
import bikeImage from '../../Assets/bike.webp';
import cngImage from '../../Assets/cng.webp';

import Swiper from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

Swiper.use([Autoplay, EffectFade]);
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const rideData = [
  {
    img: carImage,
    vehicleName: 'CAR',
    description: 'Travel in style and comfort with our premium car fleet. Perfect for city tours, airport transfers, and business meetings.',
  },
  {
    img: bikeImage,
    vehicleName: 'BIKE',
    description: 'Navigate through city traffic with ease. Our bike service offers a fast, affordable, and convenient way to reach your destination.',
  },
  {
    img: cngImage,
    vehicleName: 'CNG',
    description: 'The local choice for short to medium distances. Our CNG auto-rickshaws provide an authentic and economical travel experience.',
  },
];

const vehicleSelectors = [
  { title: 'CAR', Icon: Car },
  { title: 'BIKE', Icon: Bike },
  { title: 'CNG', Icon: TramFront },
];

const CategoryRides = () => {
  const swiperInstanceRef = useRef(null);
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateContent = useCallback((index) => {
    const activeRide = rideData[index];
    const categoryEl = document.getElementById('ride-category');
    const descriptionEl = document.getElementById('ride-description');
    if (!categoryEl || !descriptionEl || !activeRide) return;

    gsap.timeline()
      .to([categoryEl, descriptionEl], {
        opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          categoryEl.textContent = activeRide.vehicleName;
          descriptionEl.textContent = activeRide.description;
        },
      })
      .to([categoryEl, descriptionEl], {
        opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
      });
  }, []);

  const handleVehicleSelect = (index) => {
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.slideToLoop(index);
    }
  };

  useEffect(() => {
    // Initialize Swiper
    swiperInstanceRef.current = new Swiper('.image-swiper', {
      modules: [Autoplay, EffectFade],
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      speed: 1000,
      on: {
        slideChange: function () {
          setActiveIndex(this.realIndex);
          updateContent(this.realIndex);
        },
      },
    });

    // Initialize GSAP Scroll Animations (only once)
    const ctx = gsap.context(() => {
      const contentGrid = sectionRef.current.querySelector('.content-grid');
      const headline = sectionRef.current.querySelector('.main-headline');
      const fullText = "We Make Sure That Your Every Trip Is Comfortable";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true, 
        },
      });

      tl.from(imageContainerRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
      })
        .from(contentGrid, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
        }, "-=0.9")
        .to(headline, {
          text: fullText,
          duration: 2,
          ease: 'none',
        }, "-=0.75");
    }, sectionRef);

    return () => {
      swiperInstanceRef.current?.destroy();
      ctx.revert();
    };
  }, [updateContent]);

  return (
    <section ref={sectionRef} className="pb-24 sm:pb-28 md:pb-40 lg:pb-46 xl:pb-56 bg-background overflow-hidden" id="category-rides-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
          {/* LEFT: Image Swiper */}
          <div
            ref={imageContainerRef}
            className="group relative w-full h-80 sm:h-[520px] md:h-[430px] lg:h-[440px] xl:h-[470px] overflow-hidden"
          >
            <div className="swiper-container image-swiper h-full">
              <div className="swiper-wrapper">
                {rideData.map((ride, index) => (
                  <div key={index} className="swiper-slide">
                    <Image
                      src={ride.img}
                      alt={ride.vehicleName}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none" />

            <div className="absolute -inset-1 rounded-lg border-8 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none" />
          </div>

          {/* RIGHT: Content */}
          <div className="flex flex-col justify-center content-grid">
            <div className="flex items-center space-x-2 mb-2 sm:mb-4">
              <div className="text-primary text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.2em]">
               AWESOME EXPERIENCE
              </div>
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>

            <div className="mb-2 min-h-fit">
              <p id="ride-category" className="font-extrabold text-4xl uppercase tracking-[0.2em] text-primary">
                {rideData[0].vehicleName}
              </p>
            </div>

            <h2 className="text-4xl sm:text-[50px] md:text-[28px] lg:text-[40px] xl:text-5xl text-foreground uppercase leading-8 sm:leading-11.5 md:leading-7.5 lg:leading-10 xl:leading-11 tracking-tight main-headline min-h-fit">
              &nbsp;
            </h2>

            <div className="w-14 sm:w-24 md:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 md:h-[3px] lg:h-1 mt-2 sm:mt-3 md:mt-2 lg:mt-3 bg-primary"></div>

            <p id="ride-description" className="text-base sm:text-lg md:text-lg lg:text-[19px] xl:text-[22px] leading-4.5 sm:leading-5.5 md:leading-[19px] lg:leading-5 xl:leading-6 text-muted-foreground my-4 min-h-fit">
              {rideData[0].description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              {vehicleSelectors.map((vehicle, index) => {
                const { Icon, title } = vehicle;
                const isActive = activeIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => handleVehicleSelect(index)}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg bg-card min-h-[120px] shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-primary/80 hover:scale-105 ${isActive ? 'border-primary scale-105 shadow-lg' : 'border-border'}`}
                  >
                    <Icon className={`h-8 w-8 sm:h-10 sm:w-10 mb-2 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-[10px] sm:text-xs font-semibold transition-colors ${isActive ? 'text-primary' : 'text-card-foreground'}`}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryRides;
