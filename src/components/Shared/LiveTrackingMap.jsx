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

const LiveTrackingMap = ({ rideId, riderInfo, vehicleType = "Bike", pickupLocation, dropLocation }) => {
  const [riderLocation, setRiderLocation] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);

  // Debug logging
  console.log('LiveTrackingMap Props:', {
    rideId,
    riderInfo,
    vehicleType,
    pickupLocation,
    dropLocation
  });

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

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate ETA based on distance and vehicle type
  const calculateETA = (distance) => {
    if (!distance) return null;
    
    let averageSpeed; // km/h
      switch (vehicleType) {
        case "Bike":
        averageSpeed = 25; // Average bike speed in city
        break;
        case "Car":
        averageSpeed = 20; // Average car speed in city traffic
        break;
        case "Cng":
        averageSpeed = 18; // Average CNG speed
        break;
        default:
        averageSpeed = 22;
    }
    
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  // Fetch rider location every 5 seconds
  useEffect(() => {
    if (!rideId || !isClient) return;

    const fetchRiderLocation = async () => {
      try {
        // Check if API URL is configured
        const apiUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
        if (!apiUrl) {
          console.warn("NEXT_PUBLIC_SERVER_BASE_URL is not configured, using demo location");
          useDemoLocation();
          return;
        }

        const res = await fetch(
          `${apiUrl}/api/rider/location/${rideId}`
        );
        
        // Check if response is ok
        if (!res.ok) {
          console.warn(`API response not ok: ${res.status} ${res.statusText}`);
          // Use demo location as fallback
          useDemoLocation();
          return;
        }
        
        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn("Response is not JSON, got:", contentType);
          // Use demo location as fallback
          useDemoLocation();
          return;
        }
        
        const data = await res.json();
        if (data.location && data.location.coordinates) {
          // MongoDB stores as [lng, lat], Leaflet needs [lat, lng]
          const newLocation = {
            lat: data.location.coordinates[1],
            lng: data.location.coordinates[0],
          };
          setRiderLocation(newLocation);

          // Calculate distance and ETA if pickup location is available
          if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
            const dist = calculateDistance(
              newLocation.lat, 
              newLocation.lng, 
              pickupLocation.lat, 
              pickupLocation.lng
            );
            setDistance(dist);
            setEta(calculateETA(dist));
          }
        } else {
          // No location data, use demo location
          useDemoLocation();
        }
      } catch (err) {
        console.error("Error fetching rider location:", err);
        // If it's a JSON parsing error, show more details
        if (err instanceof SyntaxError) {
          console.error("JSON parsing failed - server might be returning HTML instead of JSON");
        }
        // Use demo location as fallback
        useDemoLocation();
      }
    };

    // Demo location fallback function
    const useDemoLocation = () => {
      console.log('Using demo location - current riderLocation:', riderLocation);
      console.log('Pickup location for demo:', pickupLocation);
      
      if (!riderLocation) {
        // Use pickup location with slight offset for demo
        const demoLocation = pickupLocation ? {
          lat: pickupLocation.lat + (Math.random() - 0.5) * 0.01,
          lng: pickupLocation.lng + (Math.random() - 0.5) * 0.01
        } : {
          lat: 23.8103 + (Math.random() - 0.5) * 0.01,
          lng: 90.4125 + (Math.random() - 0.5) * 0.01
        };
        
        console.log('Generated demo location:', demoLocation);
        setRiderLocation(demoLocation);
        
        // Calculate distance and ETA if pickup location is available
        if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
          const dist = calculateDistance(
            demoLocation.lat, 
            demoLocation.lng, 
            pickupLocation.lat, 
            pickupLocation.lng
          );
          console.log('Calculated distance:', dist, 'km');
          setDistance(dist);
          setEta(calculateETA(dist));
        }
      } else {
        console.log('Rider location already exists, not setting demo location');
      }
    };

    // প্রথমবার call করা
    fetchRiderLocation();

    // প্রতি 5 সেকেন্ডে একবার call হবে
    const interval = setInterval(fetchRiderLocation, 5000);

    // cleanup
    return () => clearInterval(interval);
  }, [rideId, isClient, pickupLocation, vehicleType]);


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

  // Smart map center calculation to show all markers
  const calculateMapCenter = () => {
    const locations = [];
    
    if (riderLocation) {
      locations.push([riderLocation.lat, riderLocation.lng]);
    }
    if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
      locations.push([pickupLocation.lat, pickupLocation.lng]);
    }
    if (dropLocation && dropLocation.lat && dropLocation.lng) {
      locations.push([dropLocation.lat, dropLocation.lng]);
    }
    
    if (locations.length === 0) {
      return [23.8103, 90.4125]; // Default Dhaka
    } else if (locations.length === 1) {
      return locations[0];
    } else {
      // Calculate center of all locations
      const avgLat = locations.reduce((sum, loc) => sum + loc[0], 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc[1], 0) / locations.length;
      return [avgLat, avgLng];
    }
  };

  const mapCenter = calculateMapCenter();
  
  console.log('Map center calculation:', {
    riderLocation,
    pickupLocation,
    dropLocation,
    mapCenter,
    locationsCount: [riderLocation, pickupLocation, dropLocation].filter(Boolean).length
  });

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Rider Marker */}
        {riderLocation && (
          <Marker position={[riderLocation.lat, riderLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-bold text-sm">{riderInfo?.fullName || "Rider"}</p>
                <p className="text-xs text-gray-600">
                  {riderInfo?.vehicleType || vehicleType} - {riderInfo?.vehicleRegisterNumber || "N/A"}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {vehicleType === "Bike" ? "🏍️" : vehicleType === "Car" ? "🚗" : "🚕"} On the way
                </p>
                {distance && (
                  <p className="text-xs text-blue-600 mt-1">
                    📍 {distance.toFixed(1)} km away
                  </p>
                )}
                {eta && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⏱️ ETA: {eta}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  📍 {riderLocation.lat.toFixed(6)}, {riderLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pickup Location Marker */}
        {pickupLocation && pickupLocation.lat && pickupLocation.lng && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-bold text-sm text-red-600">📍 Pickup Location</p>
                <p className="text-xs text-gray-600">Your pickup point</p>
                <p className="text-xs text-gray-500 mt-1">
                  📍 {pickupLocation.lat.toFixed(6)}, {pickupLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Drop Location Marker */}
        {dropLocation && dropLocation.lat && dropLocation.lng && (
          <Marker position={[dropLocation.lat, dropLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-bold text-sm text-blue-600">🎯 Drop Location</p>
                <p className="text-xs text-gray-600">Your destination</p>
                <p className="text-xs text-gray-500 mt-1">
                  📍 {dropLocation.lat.toFixed(6)}, {dropLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;

