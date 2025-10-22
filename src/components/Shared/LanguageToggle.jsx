"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown, Globe } from "lucide-react";

const LanguageToggle = () => {
  const [showLang, setShowLang] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const langRef = useRef(null);
  const panelRef = useRef(null);

  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("ridex_language");
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem("ridex_language", lang);
    setShowLang(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLang(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Animate dropdown
  useEffect(() => {
    if (showLang && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -6, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [showLang]);

  return (
    <div className="relative" ref={langRef}>
      {/* Language Button */}
      <button
        onClick={() => setShowLang((s) => !s)}
        className="flex items-center justify-between py-2 text-foreground uppercase font-medium transition-all duration-300 cursor-pointer"
      >
        <Globe className="w-5 h-5 sm:w-6.5 sm:h-6.5"/>
        <span className="ml-0.5 sm:ml-1 sm:mr-0.5 text-lg">{selectedLang === "EN" ? "En" : "Ba"}</span>
        <ChevronDown
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            showLang ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {showLang && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-[18px] sm:mt-6.5 w-40 bg-popover text-popover-foreground shadow-lg rounded-md overflow-hidden border border-border z-[9999]"
        >
          {["EN", "BN"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary flex justify-between items-center transition-all duration-200"
            >
              <span>{lang === "EN" ? "English" : "Bangla"}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
