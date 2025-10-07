"use client";
import React from "react";
import { Car, RefreshCcw } from "lucide-react";

const NoRide = ({
  message = "No rides available right now.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-20 p-5 max-w-sm mx-auto">
      <div className="relative w-full bg-[var(--color-card)] backdrop-blur-md rounded-2xl border border-[var(--color-border)] shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-[1.02]">
        {/* Icon */}
        <div className="rounded-full p-3 bg-[var(--color-input)] dark:bg-[var(--color-accent)] shadow-md animate-bounce-slow">
          <Car className="w-20 h-20 text-[var(--color-primary)]" />
        </div>

        {/* Message */}
        <p className="mt-3 text-center text-sm sm:text-base font-semibold text-[var(--color-foreground)]">
          {message}
        </p>

        {/* Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium shadow-sm hover:opacity-90 active:scale-95 transition-transform flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4 animate-spin-slow text-white" />
            Refresh
          </button>

          <div className="text-xs text-[var(--color-muted-foreground)]">
            or check other areas
          </div>
        </div>

        {/* Decorative little cut corner */}
        <div className="pointer-events-none absolute -right-3 -bottom-3 w-10 h-10 bg-[var(--color-card)] rounded-tl-lg border border-[var(--color-border)] transform rotate-12" />
      </div>

      <div className="text-xs text-center text-[var(--color-muted-foreground)]">
        We'll notify you when drivers become available near you.
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.6s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default NoRide;
