"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Red icon for marker
const redIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapPopup = ({ title, onClose, onSelect, defaultCurrent = false }) => {
  const mapRef = useRef();
  const [searchInput, setSearchInput] = useState("");
  // Default to Dhaka if not explicitly set to current location
  const [markerPos, setMarkerPos] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [currentLocationName, setCurrentLocationName] = useState(""); // To store the resolved location name

  // Helper: reverse geocode and update location name
  const updateLocationName = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        const locName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setCurrentLocationName(locName);
        onSelect(locName); // Pass the location name up to the parent
      } else {
        const text = await res.text();
        throw new Error("Invalid response from location service: " + text);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      const locName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentLocationName(locName);
      onSelect(locName); // Fallback to coordinates
    }
  };

  // Auto detect current location on mount if defaultCurrent is true
  useEffect(() => {
    if (defaultCurrent && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMarkerPos({ lat, lng });
          // Update map view and location name after setting marker position
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 14);
          }
          updateLocationName(lat, lng);
        },
        (error) => {
          console.error("Error getting current location:", error);
          // If geolocation fails, still try to resolve the default markerPos (Dhaka)
          updateLocationName(markerPos.lat, markerPos.lng);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // If not defaultCurrent, or geolocation not supported, still resolve the initial markerPos (Dhaka)
      updateLocationName(markerPos.lat, markerPos.lng);
    }
  }, [defaultCurrent]); // Only run on mount or when defaultCurrent changes

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
        updateLocationName(lat, lng);
      },
    });
    return null;
  };

  // Handle search input
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchInput
        )}&format=json&limit=1`
      );
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const latNum = parseFloat(lat);
          const lonNum = parseFloat(lon);
          setMarkerPos({ lat: latNum, lng: lonNum });
          if (mapRef.current) {
            mapRef.current.setView([latNum, lonNum], 14);
          }
          setCurrentLocationName(display_name);
          onSelect(display_name); // Update parent with searched location
        } else {
          alert("Location not found. Please try a different search.");
        }
      } else {
        const text = await res.text();
        throw new Error("Invalid response from location service: " + text);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Failed to search location. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 dark:bg-background/90">
      <div className="bg-background rounded-lg shadow-lg w-[90%] md:w-[600px] h-[550px] flex flex-col relative border border-border">
        {/* Header */}
        <div className="p-3 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button
            className="px-3 py-1 rounded bg-destructive text-destructive-foreground text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          className="p-3 border-b border-border flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Search location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded transition-colors duration-200"
          >
            Search
          </button>
        </form>

        {/* Display selected location name */}
        <div className="p-2 bg-muted text-sm text-center border-b border-border text-foreground">
          Selected: <span className="font-medium">{currentLocationName}</span>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[markerPos.lat, markerPos.lng]} // Map centers on current marker position
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef} // Use ref directly, no need for whenCreated
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              draggable
              icon={redIcon}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setMarkerPos({ lat, lng });
                  updateLocationName(lat, lng);
                },
              }}
            />
            <MapClickHandler />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPopup;