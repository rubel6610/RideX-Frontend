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
  const markerRef = useRef();
  const [searchInput, setSearchInput] = useState("");
  const [markerPos, setMarkerPos] = useState({
    lat: 23.8103,
    lng: 90.4125,
  }); // Dhaka default

  // Helper: reverse geocode
  const updateLocation = (lat, lng) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const locName = data.display_name || `${lat}, ${lng}`;
        onSelect(locName);
      });
  };

  // Auto detect current location
  useEffect(() => {
    if (defaultCurrent && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarkerPos({ lat, lng });
        updateLocation(lat, lng);
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 14);
        }
      });
    }
  }, [defaultCurrent]);

  // Handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
        updateLocation(lat, lng);
      },
    });
    return null;
  };

  // Handle search input
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
      const { lat, lon, display_name } = data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      setMarkerPos({ lat: latNum, lng: lonNum });
      if (mapRef.current) {
        mapRef.current.setView([latNum, lonNum], 14);
      }
      onSelect(display_name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[600px] h-[550px] flex flex-col relative">
        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          className="p-3 border-b flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Search location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
          >
            Search
          </button>
        </form>

        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[markerPos.lat, markerPos.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              draggable
              icon={redIcon}
              ref={markerRef}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setMarkerPos({ lat, lng });
                  updateLocation(lat, lng);
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