"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, CircleDot, Search } from "lucide-react";

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
      if (onLocationChange) {
        onLocationChange(location, 'pickup');
      }
    } else {
      // Store coordinates internally but display name to user
      setDrop(location.coordinates);
      setDropDisplayName(location.name);
      setShowDropSuggestions(false);
      if (onLocationChange) {
        onLocationChange(location, 'drop');
      }
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (value, type) => {
    if (type === 'pickup') {
      setPickupDisplayName(value); // Show what user is typing
      // Don't update pickup coordinates while typing
      // Clear previous timeout
      if (window.pickupTimeout) clearTimeout(window.pickupTimeout);

      // Set new timeout for search
      window.pickupTimeout = setTimeout(() => {
        searchLocations(value, 'pickup');
      }, 500);
    } else {
      setDropDisplayName(value); // Show what user is typing
      // Don't update drop coordinates while typing
      // Clear previous timeout
      if (window.dropTimeout) clearTimeout(window.dropTimeout);

      // Set new timeout for search
      window.dropTimeout = setTimeout(() => {
        searchLocations(value, 'drop');
      }, 500);
    }
  };

  // Update display names when pickup/drop values change (e.g., from URL params)
  useEffect(() => {
    // If pickup value changes and we don't have a display name yet, try to set it
    if (pickup && !pickupDisplayName) {
      // If pickup is coordinates, we might want to reverse geocode it
      if (pickup.includes(",")) {
        // It's coordinates, we could reverse geocode but for now just use as is
        setPickupDisplayName(pickup);
      } else {
        // It's a name, use it directly
        setPickupDisplayName(pickup);
      }
    }
  }, [pickup, pickupDisplayName]);

  useEffect(() => {
    // If drop value changes and we don't have a display name yet, try to set it
    if (drop && !dropDisplayName) {
      // If drop is coordinates, we might want to reverse geocode it
      if (drop.includes(",")) {
        // It's coordinates, we could reverse geocode but for now just use as is
        setDropDisplayName(drop);
      } else {
        // It's a name, use it directly
        setDropDisplayName(drop);
      }
    }
  }, [drop, dropDisplayName]);

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