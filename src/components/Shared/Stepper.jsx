import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Stepper Component
// Visual progress indicator for multi-step forms with crazy animations
const Stepper = ({ steps, currentStep }) => {
  const stepperRef = useRef(null);
  const stepRefs = useRef([]);
  const progressLineRef = useRef(null);
  const progressLineBgRef = useRef(null);
  const containerRef = useRef(null);

  // Crazy initial load animations
  useEffect(() => {
    if (containerRef.current) {
      // Container entrance with crazy bounce
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: -100, rotationX: -90 },
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          duration: 1.5, 
          ease: "elastic.out(1, 0.3)",
        }
      );
    }

    // Animate each step indicator with crazy effects
    stepRefs.current.forEach((stepRef, index) => {
      if (stepRef) {
        const circle = stepRef.querySelector('.step-circle');
        const label = stepRef.querySelector('.step-label');
        
        if (circle && label) {
          // Circle entrance with crazy spin and bounce
          gsap.fromTo(circle,
            { opacity: 0, scale: 0, rotation: 180 },
            { 
              opacity: 1, 
              scale: 1, 
              rotation: 0,
              duration: 1, 
              ease: "elastic.out(1, 0.5)",
              delay: index * 0.2
            }
          );
          
          // Label entrance with crazy stagger
          gsap.fromTo(label,
            { opacity: 0, y: 20, skewX: 10 },
            { 
              opacity: 1, 
              y: 0, 
              skewX: 0,
              duration: 0.8, 
              ease: "back.out(1.7)",
              delay: index * 0.2 + 0.3
            }
          );
        }
      }
    });
  }, []);

  // Crazy step change animations
  useEffect(() => {
    // Animate step indicators with crazy transitions
    stepRefs.current.forEach((stepRef, index) => {
      if (stepRef) {
        const circle = stepRef.querySelector('.step-circle');
        const label = stepRef.querySelector('.step-label');
        
        if (index === currentStep) {
          // Animate the current step with crazy pulse and spin effects
          if (circle) {
            gsap.to(circle, {
              scale: 1.4,
              rotation: 360,
              duration: 0.6,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                // Continuous subtle crazy animation
                gsap.to(circle, {
                  scale: 1.15,
                  duration: 1.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut"
                });
              }
            });
          }
          
          // Crazy label animation
          if (label) {
            gsap.to(label, {
              color: "#0d9488",
              scale: 1.1,
              textShadow: "0 0 10px rgba(20, 184, 166, 0.7)",
              duration: 0.5,
              ease: "power2.out"
            });
          }
        } else if (index < currentStep) {
          // Animate completed steps with crazy completion effect
          if (circle) {
            gsap.to(circle, {
              backgroundColor: "#00b6a6",
              borderColor: "#00b6a6",
              scale: 1.2,
              duration: 0.6,
              ease: "elastic.out(1, 0.5)"
            });
            
            // Add crazy glow effect
            gsap.fromTo(circle,
              { boxShadow: "0 0 0 0 rgba(0, 182, 166, 0.9)" },
              { 
                boxShadow: "0 0 0 20px rgba(0, 182, 166, 0)",
                duration: 1.2,
                ease: "power2.out"
              }
            );
          }
          
          // Crazy label animation for completed steps
          if (label) {
            gsap.to(label, {
              color: "#1e293b",
              duration: 0.5,
              ease: "power2.out"
            });
          }
        } else {
          // Reset future steps with crazy reset effect
          if (circle) {
            gsap.to(circle, {
              backgroundColor: "#ffffff",
              borderColor: "#d1d5db",
              scale: 1,
              rotation: 0,
              duration: 0.4,
              ease: "power2.out"
            });
          }
          
          // Crazy label reset
          if (label) {
            gsap.to(label, {
              color: "#9ca3af",
              scale: 1,
              textShadow: "none",
              duration: 0.4,
              ease: "power2.out"
            });
          }
        }
      }
    });

    // Animate progress line with crazy dynamic effect
    if (progressLineRef.current) {
      gsap.to(progressLineRef.current, {
        width: `${(currentStep / (steps.length - 1)) * 100}%`,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        boxShadow: "0 0 20px rgba(20, 184, 166, 0.8)"
      });
      
      // Add crazy pulsing effect
      gsap.to(progressLineRef.current, {
        opacity: 0.9,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    // Crazy progress background line animation
    if (progressLineBgRef.current) {
      gsap.to(progressLineBgRef.current, {
        duration: 0.8,
        ease: "power2.out",
        backgroundColor: "#e5e7eb"
      });
    }
  }, [currentStep, steps.length]);

  return (
    <div ref={containerRef} className="w-full py-8 relative">
      <div ref={stepperRef} className="flex justify-between relative">
        {/* Progress line background */}
        <div 
          ref={progressLineBgRef}
          className="absolute top-5 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 z-0 rounded-full transition-all duration-500 ease-out"
        >
          <div 
            ref={progressLineRef}
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          >
            {/* Crazy animated glow effect */}
            <div className="absolute inset-0 bg-teal-300 rounded-full opacity-40 blur-md animate-pulse"></div>
          </div>
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={index} 
            ref={el => stepRefs.current[index] = el}
            className="flex flex-col items-center relative z-10"
          >
            <div className={`step-circle w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
              index <= currentStep 
                ? 'bg-teal-500 text-white border-teal-500 shadow-2xl' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-300 shadow-lg'
            }`}>
              {index < currentStep ? (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <span className="text-xl font-bold text-gray-700 dark:text-gray-200">{index + 1}</span>
              )}
            </div>
            <div className={`step-label mt-4 text-lg font-extrabold transition-all duration-300 ${
              index <= currentStep 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-300'
            }`}>
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;