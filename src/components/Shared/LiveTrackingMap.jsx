"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
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
          console.warn("NEXT_PUBLIC_SERVER_BASE_URL is not configured, using Bogura fallback");
          setRiderLocation({ lat: 24.8504, lng: 89.3711 });
          return;
        }

        const res = await fetch(
          `${apiUrl}/api/rider/location/${rideId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-cache'
          }
        );
        
        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn("Response is not JSON, using Bogura fallback");
          setRiderLocation({ lat: 24.8504, lng: 89.3711 });
          return;
        }
        
        const data = await res.json();
        
        if (data && data.location && data.location.coordinates && Array.isArray(data.location.coordinates)) {
          // MongoDB stores as [lng, lat], Leaflet needs [lat, lng]
          const newLocation = {
            lat: parseFloat(data.location.coordinates[1]),
            lng: parseFloat(data.location.coordinates[0]),
          };
          
          // Validate coordinates
          if (!isNaN(newLocation.lat) && !isNaN(newLocation.lng) && 
              newLocation.lat >= -90 && newLocation.lat <= 90 &&
              newLocation.lng >= -180 && newLocation.lng <= 180) {
            
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
          }
        }
      } catch (err) {
        console.error("Error fetching rider location:", err);
        setRiderLocation({ lat: 24.8504, lng: 89.3711 });
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
    
    // Only add valid locations
    if (riderLocation && riderLocation.lat && riderLocation.lng) {
      locations.push([riderLocation.lat, riderLocation.lng]);
    }
    if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
      locations.push([pickupLocation.lat, pickupLocation.lng]);
    }
    if (dropLocation && dropLocation.lat && dropLocation.lng) {
      locations.push([dropLocation.lat, dropLocation.lng]);
    }
    
    if (locations.length === 0) {
      // Default to Bogura if no locations
      return [24.8504, 89.3711]; // Bogura coordinates
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
  

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden border border-border shadow-lg">
      {/* Add CSS for polyline styling */}
      <style jsx>{`
        .rider-pickup-polyline {
          stroke: #3b82f6 !important;
          stroke-width: 6px !important;
          stroke-opacity: 1 !important;
          stroke-dasharray: 15, 15 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          z-index: 1000 !important;
        }
        .pickup-drop-polyline {
          stroke: #10b981 !important;
          stroke-width: 6px !important;
          stroke-opacity: 1 !important;
          stroke-dasharray: 10, 10 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          z-index: 1000 !important;
        }
      `}</style>
      
      <MapContainer
        key={`${riderLocation?.lat}-${riderLocation?.lng}-${pickupLocation?.lat}-${pickupLocation?.lng}`}
        center={mapCenter}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Rider Marker - Blue with vehicle icon */}
        {riderLocation && riderLocation.lat && riderLocation.lng && (
          <Marker 
            key={`rider-${riderLocation.lat}-${riderLocation.lng}`}
            position={[riderLocation.lat, riderLocation.lng]}
          >
            <Popup>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    {vehicleType === "Bike" ? "🏍️" : vehicleType === "Car" ? "🚗" : "🚕"}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800">{riderInfo?.fullName || "Rider"}</p>
                    <p className="text-xs text-blue-600">On the way</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Vehicle:</span> {riderInfo?.vehicleType || vehicleType}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Registration:</span> {riderInfo?.vehicleRegisterNumber || "N/A"}
                  </p>
                  {distance && (
                    <p className="text-xs text-green-600">
                      <span className="font-medium">Distance:</span> {distance.toFixed(1)} km away
                    </p>
                  )}
                  {eta && (
                    <p className="text-xs text-orange-600">
                      <span className="font-medium">ETA:</span> {eta}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                    📍 {riderLocation.lat.toFixed(6)}, {riderLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pickup Location Marker - Red with user icon */}
        {pickupLocation && pickupLocation.lat && pickupLocation.lng && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
            <Popup>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-sm text-red-800">Pickup Location</p>
                    <p className="text-xs text-red-600">Your pickup point</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Status:</span> Waiting for rider
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Type:</span> User Location
                  </p>
                  <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                    📍 {pickupLocation.lat.toFixed(6)}, {pickupLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Drop Location Marker - Green with destination icon */}
        {dropLocation && dropLocation.lat && dropLocation.lng && (
          <Marker position={[dropLocation.lat, dropLocation.lng]}>
            <Popup>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  <div>
                    <p className="font-bold text-sm text-green-800">Drop Location</p>
                    <p className="text-xs text-green-600">Your destination</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Status:</span> Final destination
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Type:</span> Drop Point
                  </p>
                  <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                    📍 {dropLocation.lat.toFixed(6)}, {dropLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Polyline from Rider to Pickup Location with Distance Info */}
        {riderLocation && riderLocation.lat && riderLocation.lng && 
         pickupLocation && pickupLocation.lat && pickupLocation.lng && (
          <>
            <Polyline
              key={`rider-pickup-${riderLocation.lat}-${riderLocation.lng}-${pickupLocation.lat}-${pickupLocation.lng}`}
              positions={[
                [riderLocation.lat, riderLocation.lng],
                [pickupLocation.lat, pickupLocation.lng]
              ]}
              pathOptions={{
                color: '#3b82f6',
                weight: 6,
                opacity: 1.0,
                dashArray: '15, 15',
                lineCap: 'round',
                lineJoin: 'round',
                className: 'rider-pickup-polyline'
              }}
            />
            
            {/* Distance Info Marker at Midpoint */}
            <Marker 
              position={[
                (riderLocation.lat + pickupLocation.lat) / 2,
                (riderLocation.lng + pickupLocation.lng) / 2
              ]}
            >
              <Popup>
                <div className="p-2 text-center">
                  <p className="font-bold text-sm text-blue-600">📍 Distance to Pickup</p>
                  <p className="text-lg font-bold text-blue-600">
                    {distance ? `${distance.toFixed(1)} km` : 'Calculating...'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {eta ? `ETA: ${eta}` : 'Calculating ETA...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rider → Pickup Point
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Polyline from Pickup to Drop Location with Distance Info */}
        {pickupLocation && pickupLocation.lat && pickupLocation.lng && 
         dropLocation && dropLocation.lat && dropLocation.lng && (
          <>
            <Polyline
              key={`pickup-drop-${pickupLocation.lat}-${pickupLocation.lng}-${dropLocation.lat}-${dropLocation.lng}`}
              positions={[
                [pickupLocation.lat, pickupLocation.lng],
                [dropLocation.lat, dropLocation.lng]
              ]}
              pathOptions={{
                color: '#10b981',
                weight: 6,
                opacity: 1.0,
                dashArray: '10, 10',
                lineCap: 'round',
                lineJoin: 'round',
                className: 'pickup-drop-polyline'
              }}
            />
            
            {/* Distance Info Marker at Midpoint */}
            <Marker 
              position={[
                (pickupLocation.lat + dropLocation.lat) / 2,
                (pickupLocation.lng + dropLocation.lng) / 2
              ]}
            >
              <Popup>
                <div className="p-2 text-center">
                  <p className="font-bold text-sm text-green-600">🎯 Route Distance</p>
                  <p className="text-lg font-bold text-green-600">
                    {(() => {
                      const routeDistance = calculateDistance(
                        pickupLocation.lat, 
                        pickupLocation.lng, 
                        dropLocation.lat, 
                        dropLocation.lng
                      );
                      return `${routeDistance.toFixed(1)} km`;
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pickup → Drop Point
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;

