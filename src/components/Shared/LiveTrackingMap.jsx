"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Bike, Car, BusFront } from "lucide-react";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveTrackingMap = ({ rideId, riderInfo, vehicleType = "Bike" }) => {
  // Demo location - Dhaka, Bangladesh
  const [riderLocation, setRiderLocation] = useState({
    lat: 23.8103,
    lng: 90.4125
  });
  const [isClient, setIsClient] = useState(false);

  // Get vehicle icon
  const getVehicleIcon = () => {
    switch (vehicleType) {
      case "Bike":
        return <Bike className="w-8 h-8 text-primary" />;
      case "Car":
        return <Car className="w-8 h-8 text-primary" />;
      case "Cng":
        return <BusFront className="w-8 h-8 text-primary" />;
      default:
        return <Bike className="w-8 h-8 text-primary" />;
    }
  };

  // Check if running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch rider location every 5 seconds (commented for demo)
  // useEffect(() => {
  //   if (!rideId || !isClient) return;

  //   const fetchRiderLocation = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/location/${rideId}`
  //       );
  //       const data = await res.json();
  //       if (data.location && data.location.coordinates) {
  //         // MongoDB stores as [lng, lat], Leaflet needs [lat, lng]
  //         setRiderLocation({
  //           lat: data.location.coordinates[1],
  //           lng: data.location.coordinates[0],
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching rider location:", err);
  //     }
  //   };

  //   // প্রথমবার call করা
  //   fetchRiderLocation();

  //   // প্রতি 5 সেকেন্ডে একবার call হবে
  //   const interval = setInterval(fetchRiderLocation, 5000);

  //   // cleanup
  //   return () => clearInterval(interval);
  // }, [rideId, isClient]);

  // Create custom icon for rider based on vehicle type
  const createCustomIcon = () => {
    // Different SVG icons for different vehicle types
    const getVehicleSVG = () => {
      switch (vehicleType) {
        case "Bike":
          return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              <path d="m12 17.5 1.5-5.5 2-3h-5"/>
              <path d="M12 12l-2 3"/>
            </svg>
          `;
        case "Car":
          return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="12" x="3" y="8" rx="2"/>
              <path d="M10 8V5c0-1.1.9-2 2-2h2"/>
              <circle cx="7" cy="15.5" r="1.5"/>
              <circle cx="17" cy="15.5" r="1.5"/>
            </svg>
          `;
        case "Cng":
          return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"/>
              <path d="M15 6v6"/>
              <path d="M2 12h19.6"/>
              <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
              <circle cx="7" cy="18" r="2"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          `;
        default:
          return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              <path d="m12 17.5 1.5-5.5 2-3h-5"/>
              <path d="M12 12l-2 3"/>
            </svg>
          `;
      }
    };

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 4px white; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">
          ${getVehicleSVG()}
        </div>
        <style>
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .8;
            }
          }
        </style>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
    });
  };

  if (!isClient) {
    return (
      <div className="w-full h-[400px] z-40 rounded-xl bg-card border border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-3 animate-pulse">
            {getVehicleIcon()}
          </div>
          <p className="text-sm text-muted-foreground">
            Loading map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={[riderLocation.lat, riderLocation.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[riderLocation.lat, riderLocation.lng]}
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="p-2">
              <p className="font-bold text-sm">{riderInfo?.fullName || "Rider"}</p>
              <p className="text-xs text-gray-600">
                {riderInfo?.vehicleType || "Bike"} - {riderInfo?.vehicleRegisterNumber || "N/A"}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {vehicleType === "Bike" ? "🏍️" : vehicleType === "Car" ? "🚗" : "🚕"} On the way
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;

