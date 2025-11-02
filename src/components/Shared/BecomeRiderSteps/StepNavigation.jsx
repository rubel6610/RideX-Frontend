import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import gsap from 'gsap';

// Step Navigation Component
// Handles navigation between form steps with validation and crazy animations
const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  isSubmitting,
  trigger
}) => {
  const navRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const submitBtnRef = useRef(null);
  const containerRef = useRef(null);

  // Crazy entrance animations
  useEffect(() => {
    if (containerRef.current) {
      // Container entrance with crazy effect
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50, scale: 0.9, rotationY: -30 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          rotationY: 0,
          duration: 1, 
          ease: "elastic.out(1, 0.5)"
        }
      );
    }

    // Animate individual buttons with crazy effects
    const buttons = [prevBtnRef.current, nextBtnRef.current, submitBtnRef.current];
    buttons.forEach((btn, index) => {
      if (btn) {
        gsap.fromTo(btn,
          { opacity: 0, y: 30, scale: 0.8, rotation: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.7)",
            delay: index * 0.15
          }
        );
      }
    });
  }, [currentStep]);

  const handleNext = async () => {
    // Trigger validation for current step before proceeding
    const isValid = await trigger();
    if (isValid) {
      // Crazy button press effect
      const nextBtn = nextBtnRef.current;
      if (nextBtn) {
        // Crazy scale and rotation effect
        gsap.to(nextBtn, {
          scale: 0.8,
          rotation: 10,
          duration: 0.15,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            // Add crazy ripple effect
            gsap.fromTo(nextBtn,
              { boxShadow: "0 0 0 0 rgba(20, 184, 166, 0.9)" },
              { 
                boxShadow: "0 0 0 30px rgba(20, 184, 166, 0)",
                duration: 0.8,
                ease: "power2.out",
                onComplete: onNext
              }
            );
          }
        });
      } else {
        onNext();
      }
    } else {
      // Crazy shake animation for validation error
      if (nextBtnRef.current) {
        gsap.to(nextBtnRef.current, {
          x: -10,
          rotation: 5,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "sine.inOut"
        });
      }
    }
  };

  const handlePrev = () => {
    // Crazy button press effect
    const prevBtn = prevBtnRef.current;
    if (prevBtn) {
      // Crazy scale and rotation effect
      gsap.to(prevBtn, {
        scale: 0.8,
        rotation: -10,
        duration: 0.15,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Add crazy ripple effect
          gsap.fromTo(prevBtn,
            { boxShadow: "0 0 0 0 rgba(156, 163, 175, 0.9)" },
            { 
              boxShadow: "0 0 0 30px rgba(156, 163, 175, 0)",
              duration: 0.8,
              ease: "power2.out",
              onComplete: onPrev
            }
          );
        }
      });
    } else {
      onPrev();
    }
  };

  return (
    <div ref={containerRef} className="flex justify-between mt-10 items-center relative overflow-hidden">
      <div ref={navRef} className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 w-full sm:items-center">
        {currentStep > 0 && (
          <Button
            ref={prevBtnRef}
            type="button"
            variant="outline"
            onClick={handlePrev}
            className="prev-btn py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400"
          >
            ← Previous
          </Button>
        )}
        
        <div className="sm:ml-auto flex gap-4">
          {currentStep < totalSteps - 1 ? (
            <Button
              ref={nextBtnRef}
              type="button"
              variant="primary"
              onClick={handleNext}
              className="next-btn py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl text-white"
            >
              Next →
            </Button>
          ) : (
            <Button
              ref={submitBtnRef}
              type="submit"
              variant="primary"
              className="w-full sm:w-fit py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></span>
                  Submitting...
                </span>
              ) : " Become a Rider!"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Crazy background effect */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default StepNavigation;