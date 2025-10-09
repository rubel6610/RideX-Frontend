"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import { useMapEvents, useMap } from "react-leaflet";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), {
  ssr: false,
});
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), {
  ssr: false,
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map click handler
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
};

// Change map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

const RideMap = ({
  pickup,
  drop,
  pickupCoords,
  dropCoords,
  currentLocation,
  isCurrentLocationActive,
  onLocationSelect,
  onCurrentLocationClick,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [center, setCenter] = useState([23.8103, 90.4125]);
  const [zoom, setZoom] = useState(12);
  const [selectedType, setSelectedType] = useState("pickup");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const parseCoordinates = (location) => {
    if (!location) return null;
    if (location.includes(",") && !isNaN(parseFloat(location.split(",")[0]))) {
      const coords = location.split(",").map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) return coords;
    }
    return null;
  };

  const parsedPickupCoords = parseCoordinates(pickup);
  const parsedDropCoords = parseCoordinates(drop);

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const dLng = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (parsedPickupCoords && parsedDropCoords) {
      const lat = (parsedPickupCoords[0] + parsedDropCoords[0]) / 2;
      const lng = (parsedPickupCoords[1] + parsedDropCoords[1]) / 2;
      const newCenter = [lat, lng];
      const distance = calculateDistance(parsedPickupCoords, parsedDropCoords);
      let newZoom;
      if (distance > 50) newZoom = 8;
      else if (distance > 20) newZoom = 10;
      else if (distance > 10) newZoom = 12;
      else if (distance > 5) newZoom = 14;
      else newZoom = 16;
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    } else if (parsedPickupCoords) {
      const newCenter = [parsedPickupCoords[0], parsedPickupCoords[1]];
      const newZoom = 16;
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    } else if (parsedDropCoords) {
      const newCenter = [parsedDropCoords[0], parsedDropCoords[1]];
      const newZoom = 16;
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    } else {
      const newCenter = [23.8103, 90.4125];
      const newZoom = 12;
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    }
  }, [parsedPickupCoords, parsedDropCoords, center, zoom]);

  const handleMapClick = async (latlng) => {
    try {
      const { lat, lng } = latlng;
      const locationString = `${lat},${lng}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const locationData = {
        name: locationName,
        coordinates: locationString,
        lat,
        lng,
      };
      onLocationSelect(locationData, selectedType);
    } catch (error) {
      const fallbackLocation = {
        name: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
        coordinates: `${latlng.lat},${latlng.lng}`,
        lat: latlng.lat,
        lng: latlng.lng,
      };
      onLocationSelect(fallbackLocation, selectedType);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false} // disable default zoom control
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        className="z-10 rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Custom Zoom Control */}
        <ZoomControl position="bottomright" />

        <ChangeView center={center} zoom={zoom} />
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Pickup Marker */}
        {parsedPickupCoords && (
          <Marker position={parsedPickupCoords} icon={pickupIcon}>
            <Popup>
              <div className="text-center">
                <MapPin className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <p className="font-semibold text-sm">Pickup Location</p>
                <p className="text-xs text-gray-600">{pickup}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dropoff Marker */}
        {parsedDropCoords && (
          <Marker position={parsedDropCoords} icon={dropoffIcon}>
            <Popup>
              <div className="text-center">
                <Navigation className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="font-semibold text-sm">Drop Location</p>
                <p className="text-xs text-gray-600">{drop}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {parsedPickupCoords && parsedDropCoords && (
          <>
            <Polyline
              positions={[parsedPickupCoords, parsedDropCoords]}
              color="#3b82f6"
              weight={6}
              opacity={0.8}
              lineCap="round"
              lineJoin="round"
            />
            <Polyline
              positions={[parsedPickupCoords, parsedDropCoords]}
              color="#60a5fa"
              weight={12}
              opacity={0.3}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}
      </MapContainer>

      {/* Location Type Selector */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-3 border border-gray-300 z-50">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType("pickup")}
            className={`px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 ${selectedType === "pickup"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <MapPin className="w-4 h-4" />
            Pickup
          </button>
          <button
            onClick={() => setSelectedType("drop")}
            className={`px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 ${selectedType === "drop"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <Navigation className="w-4 h-4" />
            Drop
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-3 border border-gray-300 z-50 max-w-xs">
        <p className="text-xs text-gray-600 font-medium">
          Click on the map to set your{" "}
          <span className="font-semibold text-gray-800">{selectedType}</span> location
        </p>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-3 border border-gray-300 z-50">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Drop</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideMap;
