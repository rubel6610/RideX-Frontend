"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapPin,
  Save,
  XCircle,
  Search as SearchIcon,
  LocateFixed, Mouse, MouseOff
} from "lucide-react";

// Custom marker icon
const redIcon = new L.Icon({
  iconUrl: "https://i.ibb.co.com/C5LtG4gz/logo-sm.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [31, 45],
  iconAnchor: [12, 41],
});

// View update component
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    const currentZoom = map.getZoom();
    map.setView(center, currentZoom);
  }, [center, map]);
  return null;
}

// Map click handler with scroll toggle
const MapClickHandler = ({ setMarkerPos, wheelZoomEnabled }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      if (wheelZoomEnabled) map.scrollWheelZoom.enable();
      else map.scrollWheelZoom.disable();
    }
  }, [wheelZoomEnabled, map]);

  useMapEvents({
    click: (e) => {
      setMarkerPos({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
};

const MapPopup = ({ title, onClose, onSelect, defaultCurrent = false }) => {
  const mapRef = useRef();
  const defaultPos = { lat: 23.8103, lng: 90.4125 };

  const [searchInput, setSearchInput] = useState("");
  const [markerPos, setMarkerPos] = useState(defaultPos);
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [lastSavedLocation, setLastSavedLocation] = useState("");
  const [wheelZoomEnabled, setWheelZoomEnabled] = useState(false);

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

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMarkerPos({ lat: latitude, lng: longitude });
        },
        () => alert("Cannot get current location"),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/40 backdrop-blur-xs">
      <div className="bg-primary rounded-lg shadow-lg w-[85%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] h-[460px] sm:h-[500px] flex flex-col relative border border-border p-2">
        <div className="flex-1 relative">
          <MapContainer
            center={[markerPos.lat, markerPos.lng]}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            <MapClickHandler
              setMarkerPos={setMarkerPos}
              wheelZoomEnabled={wheelZoomEnabled}
            />
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
            <ZoomControl position="bottomright" />
          </MapContainer>

          {/* Search bar */}
          <div className="absolute top-2.5 left-3 right-3 h-12 p-1 flex justify-between gap-2 z-[1000] bg-white rounded-full shadow-md w-[calc(100%-24px)] md:w-[60%] border border-border">
            <input
              type="text"
              placeholder="Search location..."
              className="w-[80%] text-black ml-3 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              type="button"
              className="bg-primary h-10 w-10 rounded-full flex flex-col items-center justify-center text-background"
              onClick={handleSearch}
            >
              <SearchIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Save + Cancel Buttons */}
          <div className="absolute top-17 md:top-3 right-3 flex flex-col md:flex-row gap-[1px] md:gap-1 z-[1000]">
            <button type="button"
              className="bg-primary h-10 w-10 sm:h-11 sm:w-11 rounded-full flex flex-col items-center justify-center text-background" onClick={handleSave}>
              <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            <button type="button"
              className="bg-primary h-10 w-10 sm:h-11 sm:w-11 rounded-full flex flex-col items-center justify-center text-background" onClick={handleCancel}>
              <XCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 flex flex-col z-[1000]">
            <button
              className="w-8.5 h-8.5 bg-white hover:bg-gray-50 text-black flex justify-center items-center cursor-pointer border-2 border-[#c2bfba] border-b-0 rounded-t-[5px]"
              onClick={goToCurrentLocation}
            >
              <LocateFixed className="w-4 h-4" />
            </button>
            <button
              className="w-8.5 h-8.5 bg-white hover:bg-gray-50 text-black flex justify-center items-center cursor-pointer border-2 border-[#c2bfba] border-t-1 rounded-b-[5px]"
              onClick={() => setWheelZoomEnabled(prev => !prev)}
            >
              {wheelZoomEnabled ? (
                <Mouse className="w-4 h-4" />
              ) : (
                <MouseOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Location display */}
          <div className="absolute top-13 left-1 z-[1000] p-3 text-xs flex items-center gap-[1px] w-[70%]">
            <MapPin className="w-4 h-4 md:w-5 md:h-4 text-black" />
            <p className="text-sm text-black truncate font-bold">
              <strong>Selected: </strong> {currentLocationName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPopup;
