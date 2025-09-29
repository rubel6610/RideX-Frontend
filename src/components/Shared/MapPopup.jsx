"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Save, XCircle, Search as SearchIcon } from "lucide-react";

// Custom marker icon
const redIcon = new L.Icon({
  iconUrl: "https://i.ibb.co.com/C5LtG4gz/logo-sm.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [31, 45],
  iconAnchor: [12, 41],
});

// ভিউ আপডেট করার কম্পোনেন্ট
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    const currentZoom = map.getZoom();
    map.setView(center, currentZoom);
  }, [center, map]);
  return null;
}

const MapPopup = ({ title, onClose, onSelect, defaultCurrent = false }) => {
  const mapRef = useRef();
  const defaultPos = { lat: 23.8103, lng: 90.4125 };

  const [searchInput, setSearchInput] = useState("");
  const [markerPos, setMarkerPos] = useState(defaultPos);
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [lastSavedLocation, setLastSavedLocation] = useState("");

  // Reverse geocode
  const resolveLocationName = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const locName =
        data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentLocationName(locName);
    } catch {
      setCurrentLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  // প্রথম লোডে: localStorage or current location
  useEffect(() => {
    const saved = localStorage.getItem("savedMarker");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMarkerPos(parsed);
      resolveLocationName(parsed.lat, parsed.lng);
    } else if (defaultCurrent && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMarkerPos({ lat: latitude, lng: longitude });
          resolveLocationName(latitude, longitude);
        },
        () => {
          setMarkerPos(defaultPos);
          resolveLocationName(defaultPos.lat, defaultPos.lng);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setMarkerPos(defaultPos);
      resolveLocationName(defaultPos.lat, defaultPos.lng);
    }
  }, []);

  useEffect(() => {
    resolveLocationName(markerPos.lat, markerPos.lng);
  }, [markerPos]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
      },
    });
    return null;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchInput
      )}&format=json&limit=1`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setMarkerPos({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      alert("Location not found");
    }
  };

  const handleSave = () => {
    onSelect(currentLocationName);
    setLastSavedLocation(currentLocationName);
    localStorage.setItem("savedMarker", JSON.stringify(markerPos));
    onClose();
  };

  const handleCancel = () => {
    if (lastSavedLocation) onSelect(lastSavedLocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 dark:bg-background/90">
      <div className="bg-background rounded-lg shadow-lg w-[90%] md:w-[600px] h-[550px] flex flex-col relative border border-border">
        {/* Header */}
        <div className="p-3 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {title}
          </h3>
          <form onSubmit={handleSearch} className="flex gap-2 items-center w-1/2">
            <Input
              type="text"
              placeholder="Search location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" variant="primary" size="icon">
              <SearchIcon className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[markerPos.lat, markerPos.lng]}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            <MapClickHandler />
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              icon={redIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const newLatLng = e.target.getLatLng();
                  setMarkerPos({
                    lat: newLatLng.lat,
                    lng: newLatLng.lng,
                  });
                },
              }}
            />
            <ChangeView center={[markerPos.lat, markerPos.lng]} />
          </MapContainer>
        </div>

        {/* Location display */}
        <div className="p-3 text-sm border-t border-border flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <p className="text-foreground truncate">
            Selected: {currentLocationName}
          </p>
        </div>

        {/* Save + Cancel Buttons */}
        <div className="p-3 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <XCircle className="w-4 h-4" />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapPopup;
