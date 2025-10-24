"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CircularProgress({ progress }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const progressCircleRef = useRef(null);
  const progressTextRef = useRef(null);

  const getProgressColor = () => {
    if (progress === 100) return "#22c55e"; // green
    if (progress >= 70) return "#ef4444"; // red
    if (progress >= 40) return "#eab308"; // yellow
    if (progress >= 20) return "#3b82f6"; // blue
    return "#9ca3af"; // gray
  };

  const getGlowColor = () => {
    if (progress === 100) return "shadow-green-500/50";
    if (progress >= 70) return "shadow-red-500/50";
    if (progress >= 40) return "shadow-yellow-500/50";
    if (progress >= 20) return "shadow-blue-500/50";
    return "shadow-gray-500/50";
  };

  // Animate progress changes
  useEffect(() => {
    if (progressCircleRef.current) {
      gsap.to(progressCircleRef.current, {
        strokeDashoffset: offset,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    
    if (progressTextRef.current) {
      gsap.fromTo(progressTextRef.current,
        { scale: 1 },
        { 
          scale: progress === 100 ? 1.2 : 1,
          duration: 0.3,
          ease: "power2.out"
        }
      );
    }
  }, [progress, offset]);

  return (
    <div className={`relative w-12 h-12 transition-all duration-300 ${
      progress === 100 ? 'scale-125' : 'scale-100'
    } shadow-lg ${getGlowColor()} rounded-full`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#1f2937"
          strokeWidth="4"
          fill="none"
        />
        <circle
          ref={progressCircleRef}
          cx="24"
          cy="24"
          r={radius}
          stroke={getProgressColor()}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          ref={progressTextRef}
          className={`text-xs font-bold text-white`}
        >
          {Math.round(progress)}
        </span>
      </div>
    </div>
  );
}