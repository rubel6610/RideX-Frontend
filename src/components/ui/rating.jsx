"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const Rating = ({ value = 0, onValueChange, max = 5, size = "md", readonly = false }) => {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  const handleClick = (rating) => {
    if (!readonly && onValueChange) {
      onValueChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, index) => {
        const rating = index + 1;
        const isFilled = rating <= (hover || value);

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !readonly && setHover(rating)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            className={cn(
              "transition-all duration-200",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-500 text-yellow-500"
                  : "fill-none text-gray-300",
                "transition-colors duration-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export { Rating };

