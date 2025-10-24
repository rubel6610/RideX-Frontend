'use client';

import { useEffect, useRef } from 'react';

export default function CursorFollower() {
  const dotRef = useRef(null);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) {
      return; // Disable on touch devices
    }

    let animationFrameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      const lerpFactor = 0.18;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = 0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Outer ring */}
        <span className="block h-6 w-6 rounded-full border-2 border-primary/90 pointer-events-none"></span>
        {/* Inner dot */}
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full dark:bg-white/80 bg-black/60 pointer-events-none"></span>
      </div>
    </div>
  );
}
