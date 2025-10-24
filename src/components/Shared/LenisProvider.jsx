'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

const LenisProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // higher = slower scroll
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Optional: Add scroll event listener for debugging
    // lenis.on('scroll', (e) => {
    //   console.log(e);
    // });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
