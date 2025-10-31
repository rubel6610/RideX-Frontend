"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, CircleDot, Search } from "lucide-react";

const LocationInputs = ({ pickup, setPickup, drop, setDrop, onLocationChange, onUserInputActivity }) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [isPickupSearching, setIsPickupSearching] = useState(false);
  const [isDropSearching, setIsDropSearching] = useState(false);
  const [pickupDisplayName, setPickupDisplayName] = useState("");
  const [dropDisplayName, setDropDisplayName] = useState("");
  const [isUserInputActive, setIsUserInputActive] = useState(false);
  const [isPickupInitialized, setIsPickupInitialized] = useState(false);
  const [isDropInitialized, setIsDropInitialized] = useState(false);

  // Notify parent component about user input activity
  useEffect(() => {
    if (onUserInputActivity) {
      onUserInputActivity(isUserInputActive);
    }
  }, [isUserInputActive, onUserInputActivity]);

  // Geocoding function to convert location name to coordinates
  const geocodeLocation = async (locationName) => {
    if (!locationName.trim()) return null;

    try {
      // Use backend proxy instead of direct Nominatim API call to avoid CORS issues
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1&countrycodes=bd`,
        {
          headers: {
            'User-Agent': 'RideX-App/1.0',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      console.error('Geocoding error:', error.message || error);
      return null;
    }
  };

  // Debounced search function with rate limiting and error handling
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
      // Add delay to respect Nominatim rate limiting (1 request per second)
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=bd`,
        {
          headers: {
            'User-Agent': 'RideX-App/1.0',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const suggestions = data.map(item => ({
        name: item.display_name,
        coordinates: `${item.lat},${item.lon}`,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));

      if (type === 'pickup') {
        setPickupSuggestions(suggestions);
        setShowPickupSuggestions(suggestions.length > 0);
      } else {
        setDropSuggestions(suggestions);
        setShowDropSuggestions(suggestions.length > 0);
      }
    } catch (error) {
      console.error('Location search error:', error.message || error);
      
      // Show user-friendly message
      if (type === 'pickup') {
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
      } else {
        setDropSuggestions([]);
        setShowDropSuggestions(false);
      }
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
      setIsPickupInitialized(true); // Mark as initialized
      onLocationChange?.(location, 'pickup');
    } else {
      // Store coordinates internally but display name to user
      setDrop(location.coordinates);
      setDropDisplayName(location.name);
      setShowDropSuggestions(false);
      setIsDropInitialized(true); // Mark as initialized
      onLocationChange?.(location, 'drop');
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (value, type) => {
    if (type === 'pickup') {
      setPickupDisplayName(value); // Show what user is typing
      setIsPickupInitialized(true); // Mark as user-edited
      
      // If user clears the input, also clear the pickup coordinates
      if (!value.trim()) {
        setPickup("");
        setShowPickupSuggestions(false);
      }
      
      // Clear previous timeout
      if (window.pickupTimeout) clearTimeout(window.pickupTimeout);

      // Set new timeout for search
      window.pickupTimeout = setTimeout(() => {
        searchLocations(value, 'pickup');
      }, 500);
    } else {
      setDropDisplayName(value); // Show what user is typing
      setIsDropInitialized(true); // Mark as user-edited
      
      // If user clears the input, also clear the drop coordinates
      if (!value.trim()) {
        setDrop("");
        setShowDropSuggestions(false);
      }
      
      // Clear previous timeout
      if (window.dropTimeout) clearTimeout(window.dropTimeout);

      // Set new timeout for search
      window.dropTimeout = setTimeout(() => {
        searchLocations(value, 'drop');
      }, 500);
    }
  };

  // No default location - user must manually enter or select locations

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Location Details</h3>
      </div>

      <div className="space-y-3">
        {/* Location Inputs Row */}
        <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row
                space-y-2 sm:space-y-0 sm:space-x-3
                md:space-y-2 md:space-x-0 xl:space-x-3">

          {/* Pickup Location */}
          <div className="relative flex-1 w-full">
            <div className="flex flex-row items-center bg-background border border-border rounded-lg shadow-sm hover:shadow-md text-foreground">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-l-lg">
                <CircleDot className="w-5 h-5 text-destructive" />
              </div>
              <Input
                type="text"
                value={pickupDisplayName}
                onChange={(e) => handleInputChange(e.target.value, 'pickup')}
                className="w-full flex-1 border-0 rounded-none text-base font-normal focus-visible:ring-0 focus:ring-0 focus:border-0 focus:outline-none focus:shadow-none placeholder:text-muted-foreground bg-transparent text-foreground"
                placeholder="Enter pickup location"
              />

              {/* Pickup Suggestions Dropdown */}
              {showPickupSuggestions && pickupSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-12 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {pickupSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                      onClick={() => handleLocationSelect(suggestion, 'pickup')}
                    >
                      <div className="font-medium text-foreground">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.lat.toFixed(6)}, {suggestion.lng.toFixed(6)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pickup Loading Indicator */}
              {isPickupSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
              onClick={() => {
                // Swap pickup and drop values
                const tempPickup = pickup;
                const tempPickupName = pickupDisplayName;
                setPickup(drop);
                setPickupDisplayName(dropDisplayName);
                setDrop(tempPickup);
                setDropDisplayName(tempPickupName);
              }}
              title="Swap locations"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Drop Location */}
          <div className="relative flex-1 w-full">
            <div className="flex flex-row items-center bg-background border border-border rounded-lg shadow-sm hover:shadow-md text-foreground">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-l-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <Input
                type="text"
                value={dropDisplayName}
                onChange={(e) => handleInputChange(e.target.value, 'drop')}
                className="w-full flex-1 border-0 rounded-none text-base font-normal focus-visible:ring-0 focus:ring-0 focus:border-0 focus:outline-none focus:shadow-none placeholder:text-muted-foreground bg-transparent text-foreground"
                placeholder="Enter drop location"
              />

              {/* Drop Suggestions Dropdown */}
              {showDropSuggestions && dropSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-12 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {dropSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                      onClick={() => handleLocationSelect(suggestion, 'drop')}
                    >
                      <div className="font-medium text-foreground">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.lat.toFixed(6)}, {suggestion.lng.toFixed(6)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Drop Loading Indicator */}
              {isDropSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInputs;