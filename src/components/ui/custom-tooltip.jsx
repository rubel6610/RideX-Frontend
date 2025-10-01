"use client";
import React, { useState } from "react";

/**
 * Custom Tooltip Component
 * props:
 *  content (string | ReactNode) = টুলটিপে যা দেখাবে
 *  position (top|bottom|left|right) = কোন দিকে দেখাবে
 *  bgColor (string) = টুলটিপের ব্যাকগ্রাউন্ড রঙ (default black)
 *  textColor (string) = টেক্সটের রঙ (default white)
 *  width (string) = width tailwind class বা CSS (default auto)
 *  className (string) = এক্সট্রা ক্লাস
 */
export default function CustomTooltip({
  children,
  content,
  position = "top",
  bgColor = "bg-black",
  textColor = "text-white",
  width = "auto",
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 px-2 py-1 text-sm rounded shadow ${bgColor} ${textColor} ${className}
            ${position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : ""}
            ${position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : ""}
            ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2" : ""}
            ${position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2" : ""}`
          }
          style={{ width }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

