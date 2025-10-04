"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, MoveVertical, Search, CircleDot } from "lucide-react";

const LocationInputs = ({ pickup, setPickup, drop, setDrop, onLocationChange }) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [isPickupSearching, setIsPickupSearching] = useState(false);
  const [isDropSearching, setIsDropSearching] = useState(false);
  const [pickupDisplayName, setPickupDisplayName] = useState("");
  const [dropDisplayName, setDropDisplayName] = useState("");

  // Geocoding function to convert location name to coordinates
  const geocodeLocation = async (locationName) => {
    if (!locationName.trim()) return null;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1&countrycodes=bd`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        return {
          name: display_name,
          coordinates: `${lat},${lon}`,
          lat: parseFloat(lat),
          lng: parseFloat(lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Debounced search function
  const searchLocations = async (query, type) => {
    if (!query.trim()) {
      if (type === 'pickup') {
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
        setIsPickupSearching(false);
      } else {
        setDropSuggestions([]);
        setShowDropSuggestions(false);
        setIsDropSearching(false);
      }
      return;
    }

    // Set appropriate loading state
    if (type === 'pickup') {
      setIsPickupSearching(true);
    } else {
      setIsDropSearching(true);
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=bd`
      );
      const data = await response.json();
      
      const suggestions = data.map(item => ({
        name: item.display_name,
        coordinates: `${item.lat},${item.lon}`,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));

      if (type === 'pickup') {
        setPickupSuggestions(suggestions);
        setShowPickupSuggestions(true);
      } else {
        setDropSuggestions(suggestions);
        setShowDropSuggestions(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      // Clear appropriate loading state
      if (type === 'pickup') {
        setIsPickupSearching(false);
      } else {
        setIsDropSearching(false);
      }
    }
  };

  // Handle location selection
  const handleLocationSelect = (location, type) => {
    if (type === 'pickup') {
      // Store coordinates internally but display name to user
      setPickup(location.coordinates);
      setPickupDisplayName(location.name);
      setShowPickupSuggestions(false);
      onLocationChange?.(location, 'pickup');
    } else {
      // Store coordinates internally but display name to user
      setDrop(location.coordinates);
      setDropDisplayName(location.name);
      setShowDropSuggestions(false);
      onLocationChange?.(location, 'drop');
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (value, type) => {
    if (type === 'pickup') {
      setPickup(value);
      setPickupDisplayName(value); // Show what user is typing
      // Clear previous timeout
      if (window.pickupTimeout) clearTimeout(window.pickupTimeout);
      
      // Set new timeout for search
      window.pickupTimeout = setTimeout(() => {
        searchLocations(value, 'pickup');
      }, 500);
    } else {
      setDrop(value);
      setDropDisplayName(value); // Show what user is typing
      // Clear previous timeout
      if (window.dropTimeout) clearTimeout(window.dropTimeout);
      
      // Set new timeout for search
      window.dropTimeout = setTimeout(() => {
        searchLocations(value, 'drop');
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Location Details</h3>
      </div>

      <div className="space-y-3">
        {/* Location Inputs Row */}
        <div className="flex gap-4">
          {/* Pickup Location */}
          <div className="relative flex-1">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-black">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-l-lg">
                <CircleDot className="w-5 h-5 text-green-500" />
              </div>
              <Input
                type="text"
                value={pickupDisplayName}
                onChange={(e) => handleInputChange(e.target.value, 'pickup')}
                className="flex-1  rounded-none text-base font-normal placeholder:text-gray-500 dark:placeholder:text-gray-500 bg-transparent"
                placeholder="Pickup location"
              />
              <div className="flex items-center justify-center w-12 h-12">
                {isPickupSearching && (
                  <Search className="text-gray-400 h-5 w-5 animate-spin" />
                )}
              </div>
            </div>
          
            {/* Pickup Suggestions Dropdown */}
            {showPickupSuggestions && pickupSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white  border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(suggestion, 'pickup')}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {suggestion.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {suggestion.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drop Location */}
          <div className="relative flex-1">
            <div className="flex items-center bg-white text-black border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-l-lg">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <Input
                type="text"
                value={dropDisplayName}
                onChange={(e) => handleInputChange(e.target.value, 'drop')}
                className="flex-1 border-0 rounded-none text-base font-normal focus:ring-0 focus:border-0 placeholder:text-gray-500 bg-transparent"
                placeholder="Where to go?"
              />
              <div className="flex items-center justify-center w-12 h-12">
                {isDropSearching && (
                  <Search className="text-gray-400 h-5 w-5 animate-spin" />
                )}
              </div>
            </div>
          
            {/* Drop Suggestions Dropdown */}
            {showDropSuggestions && dropSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
                {dropSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(suggestion, 'drop')}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                        <Navigation className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {suggestion.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {suggestion.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInputs;
