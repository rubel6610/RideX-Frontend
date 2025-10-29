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

  // Update display names when pickup/drop values change (e.g., from URL params or map selection)
  // But only if not already initialized by user input
  useEffect(() => {
    // Only update if user hasn't manually edited the field
    if (pickup && !isPickupInitialized) {
      // If pickup is coordinates, we might want to reverse geocode it
      if (pickup.includes(",")) {
        // It's coordinates, we could reverse geocode but for now just use as is
        setPickupDisplayName(pickup);
      } else {
        // It's a name, use it directly
        setPickupDisplayName(pickup);
      }
      setIsPickupInitialized(true);
    }
  }, [pickup, isPickupInitialized]);

  useEffect(() => {
    // Only update if user hasn't manually edited the field
    if (drop && !isDropInitialized) {
      // If drop is coordinates, we might want to reverse geocode it
      if (drop.includes(",")) {
        // It's coordinates, we could reverse geocode but for now just use as is
        setDropDisplayName(drop);
      } else {
        // It's a name, use it directly
        setDropDisplayName(drop);
      }
      setIsDropInitialized(true);
    }
  }, [drop, isDropInitialized]);

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
                onFocus={() => setIsUserInputActive(true)} // Track focus
                className="w-full flex-1 border-0 rounded-none text-base font-normal focus-visible:ring-0 focus:ring-0 focus:border-0 focus:outline-none focus:shadow-none placeholder:text-muted-foreground bg-transparent text-foreground"
                placeholder="Enter pickup location"
              />
              {isPickupSearching &&
                <div className="flex items-center justify-center w-6 h-6 mr-2">
                    <Search className="text-muted-foreground h-5 w-5 animate-spin" />
                </div>
              }
            </div>

            {/* Pickup Suggestions Dropdown */}
            {showPickupSuggestions && pickupSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(suggestion, 'pickup')}
                    className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full flex-shrink-0">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {suggestion.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
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
            <div className="flex items-center bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow text-foreground">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-l-lg">
                <MapPin className="w-5 h-5 text-green-800" />
              </div>
              <Input
                type="text"
                value={dropDisplayName}
                onChange={(e) => handleInputChange(e.target.value, 'drop')}
                onFocus={() => setIsUserInputActive(true)} // Track focus
                className="flex-1 border-0 rounded-none text-base font-normal focus-visible:ring-0 focus:ring-0 focus:border-0 focus:outline-none focus:shadow-none placeholder:text-muted-foreground bg-transparent text-foreground"
                placeholder="Where to go?"
              />
              {isDropSearching &&
                <div className="flex items-center justify-center w-6 h-6 mr-2">
                  <Search className="text-muted-foreground h-5 w-5 animate-spin" />
                </div>
              }
            </div>

            {/* Drop Suggestions Dropdown */}
            {showDropSuggestions && dropSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
                {dropSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(suggestion, 'drop')}
                    className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full flex-shrink-0">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {suggestion.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
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