"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, MoveVertical, Search } from "lucide-react";
import { toast } from "sonner";

const LocationInputs = ({ pickup, setPickup, drop, setDrop, onLocationChange }) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
      } else {
        setDropSuggestions([]);
        setShowDropSuggestions(false);
      }
      return;
    }

    setIsSearching(true);
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
      toast.error('Location search failed');
    } finally {
      setIsSearching(false);
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
        {/* Pickup Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5 z-10" />
          <Input
            type="text"
            value={pickupDisplayName}
            onChange={(e) => handleInputChange(e.target.value, 'pickup')}
            onFocus={() => pickupSuggestions.length > 0 && setShowPickupSuggestions(true)}
            className="pl-10 pr-3 py-3 bg-accent/10 border border-primary/20 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
            placeholder="Pickup location"
          />
          {isSearching && (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          )}
          
          {/* Pickup Suggestions Dropdown */}
          {showPickupSuggestions && pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {pickupSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(suggestion, 'pickup')}
                  className="px-4 py-3 hover:bg-accent/10 cursor-pointer border-b border-border/10 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
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

        {/* Vertical Connector */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <MoveVertical className="h-6 w-6 text-muted-foreground/40" />
          </div>
        </div>

        {/* Drop Location */}
        <div className="relative">
          <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5 z-10" />
          <Input
            type="text"
            value={dropDisplayName}
            onChange={(e) => handleInputChange(e.target.value, 'drop')}
            onFocus={() => dropSuggestions.length > 0 && setShowDropSuggestions(true)}
            className="pl-10 pr-3 py-3 bg-accent/10 border border-primary/20 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
            placeholder="Where to go?"
          />
          {isSearching && (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          )}
          
          {/* Drop Suggestions Dropdown */}
          {showDropSuggestions && dropSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {dropSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(suggestion, 'drop')}
                  className="px-4 py-3 hover:bg-accent/10 cursor-pointer border-b border-border/10 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
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
  );
};

export default LocationInputs;
