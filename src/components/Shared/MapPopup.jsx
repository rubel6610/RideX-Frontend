"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Red icon for marker
const redIcon = new L.Icon({
  iconUrl: "https://i.ibb.co.com/C5LtG4gz/logo-sm.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [31, 45],
  iconAnchor: [12, 41],
});

const MapPopup = ({ title, onClose, onSelect, defaultCurrent = false }) => {
  const mapRef = useRef();
  const [searchInput, setSearchInput] = useState("");
  const [markerPos, setMarkerPos] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [currentLocationName, setCurrentLocationName] = useState("");

  // Helper: reverse geocode and update location name
  const resolveLocationName = async (lat, lng, shouldSelect = false) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const locName =
        data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentLocationName(locName);

      if (shouldSelect) {
        onSelect(locName); // send to parent, but don't close popup
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      const locName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentLocationName(locName);
      if (shouldSelect) {
        onSelect(locName);
      }
    }
  };

  // Auto detect current location on mount
  useEffect(() => {
    if (defaultCurrent && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMarkerPos({ lat, lng });
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 14);
          }
          resolveLocationName(lat, lng, false);
        },
        () => {
          resolveLocationName(markerPos.lat, markerPos.lng, false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      resolveLocationName(markerPos.lat, markerPos.lng, false);
    }
  }, [defaultCurrent]);

  // Map click handler
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
        resolveLocationName(lat, lng, true);
      },
    });
    return null;
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchInput
        )}&format=json&limit=1`
      );
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
        onSelect(display_name); // only send location, no auto close
      } else {
        alert("Location not found. Please try a different search.");
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

        {/* Selected name */}
        <div className="p-2 bg-muted text-sm text-center border-b border-border text-foreground">
          Selected: <span className="font-medium">{currentLocationName}</span>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[markerPos.lat, markerPos.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              draggable
              icon={redIcon}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setMarkerPos({ lat, lng });
                  resolveLocationName(lat, lng, true);
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
