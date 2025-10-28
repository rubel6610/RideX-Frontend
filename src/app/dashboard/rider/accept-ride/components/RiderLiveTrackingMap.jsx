"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RiderLiveTrackingMap = ({ 
  rideId, 
  riderInfo, 
  vehicleType, 
  pickupLocation, 
  dropLocation, 
  onEtaUpdate 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Calculate ETA based on distance and vehicle type
  const calculateETA = (distance) => {
    if (!distance || distance <= 0) return null;
    
    let avgSpeed; // Average speed in km/h
    switch (vehicleType?.toLowerCase()) {
      case 'bike':
        avgSpeed = 60; // Bike average speed
        break;
      case 'car':
        avgSpeed = 80; // Car average speed
        break;
      case 'bus':
        avgSpeed = 70; // Bus average speed
        break;
      default:
        avgSpeed = 60; // Default speed
    }
    
    const timeInHours = distance / avgSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Set rider location from props
  useEffect(() => {
    if (riderInfo?.location?.coordinates) {
      const [lng, lat] = riderInfo.location.coordinates;
      setRiderLocation({ lat, lng });
    }
  }, [riderInfo]);

  // Calculate distance and ETA when both locations are available
  useEffect(() => {
    if (riderLocation && pickupLocation) {
      const calculatedDistance = calculateDistance(
        riderLocation.lat,
        riderLocation.lng,
        pickupLocation.lat,
        pickupLocation.lng
      );
      const calculatedEta = calculateETA(calculatedDistance);
      
      setDistance(calculatedDistance);
      setEta(calculatedEta);
      
      // Notify parent component
      if (onEtaUpdate) {
        onEtaUpdate(calculatedEta);
      }
    }
  }, [riderLocation, pickupLocation, vehicleType, onEtaUpdate]);

  // Calculate map center
  const calculateMapCenter = () => {
    const locations = [];
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
      return [24.8504, 89.3711]; // Default to Bogura
    } else if (locations.length === 1) {
      return locations[0];
    } else {
      // Calculate center point
      const latSum = locations.reduce((sum, [lat]) => sum + lat, 0);
      const lngSum = locations.reduce((sum, [, lng]) => sum + lng, 0);
      return [latSum / locations.length, lngSum / locations.length];
    }
  };

  // MapBoundsUpdater component to fit all markers
  const MapBoundsUpdater = ({ riderLocation, pickupLocation, dropLocation }) => {
    const map = useMap();

    useEffect(() => {
      const locations = [];
      if (riderLocation && riderLocation.lat && riderLocation.lng) {
        locations.push([riderLocation.lat, riderLocation.lng]);
      }
      if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
        locations.push([pickupLocation.lat, pickupLocation.lng]);
      }
      if (dropLocation && dropLocation.lat && dropLocation.lng) {
        locations.push([dropLocation.lat, dropLocation.lng]);
      }

      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations);
        // Fit bounds with padding and a maximum zoom level to prevent over-zooming
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 }); 
      } else {
        // If no locations, set a default view (e.g., Bogura, zoomed out)
        map.setView([24.8504, 89.3711], 8); 
      }
    }, [map, riderLocation, pickupLocation, dropLocation]);

    return null; // This component doesn't render anything itself
  };

  // RoutePolyline component for real road paths
  const RoutePolyline = ({ startLocation, endLocation, color, weight, opacity, dashArray }) => {
    const [routeCoordinates, setRouteCoordinates] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchRoute = async () => {
        if (!startLocation || !endLocation) return;
        
        setIsLoading(true);
        
        // Use straight line directly for stability
        // OSRM API calls are disabled to prevent network errors
        
        // Set straight line coordinates immediately
        setRouteCoordinates([
          [startLocation.lat, startLocation.lng],
          [endLocation.lat, endLocation.lng]
        ]);
        
        setIsLoading(false);
      };

      fetchRoute();
    }, [startLocation, endLocation]);

    if (!routeCoordinates) {
      return null;
    }

    return (
      <Polyline
        positions={routeCoordinates}
        pathOptions={{
          color,
          weight,
          opacity,
          dashArray,
          lineCap: 'round',
          lineJoin: 'round',
          className: 'rider-route-polyline'
        }}
      />
    );
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapCenter = calculateMapCenter();
  

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        key={`${riderLocation?.lat}-${riderLocation?.lng}-${pickupLocation?.lat}-${pickupLocation?.lng}`}
        center={mapCenter} // Initial center, will be overridden by MapBoundsUpdater
        zoom={8} // Initial zoom, will be overridden by MapBoundsUpdater
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Add the MapBoundsUpdater component inside MapContainer */}
        <MapBoundsUpdater riderLocation={riderLocation} pickupLocation={pickupLocation} dropLocation={dropLocation} />

        {/* Rider Location Marker */}
        {riderLocation && (
          <>
            <Marker position={[riderLocation.lat, riderLocation.lng]}>
              <Popup>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      🚗
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-800">Your Location</p>
                      <p className="text-xs text-blue-600">Rider position</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Status:</span> On the way
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Vehicle:</span> {vehicleType || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                      📍 {riderLocation.lat.toFixed(6)}, {riderLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Pickup Location Marker */}
        {pickupLocation && (
          <>
            <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
              <Popup>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      👤
                    </div>
                    <div>
                      <p className="font-bold text-sm text-green-800">Pickup Location</p>
                      <p className="text-xs text-green-600">Passenger waiting</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Status:</span> Waiting for pickup
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Type:</span> Passenger Location
                    </p>
                    <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                      📍 {pickupLocation.lat.toFixed(6)}, {pickupLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Drop Location Marker */}
        {dropLocation && (
          <>
            <Marker position={[dropLocation.lat, dropLocation.lng]}>
              <Popup>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <div>
                      <p className="font-bold text-sm text-red-800">Drop Location</p>
                      <p className="text-xs text-red-600">Final destination</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Status:</span> Destination
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Type:</span> Drop-off Point
                    </p>
                    <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                      📍 {dropLocation.lat.toFixed(6)}, {dropLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Route Polyline from Rider to Pickup Location */}
        {riderLocation && pickupLocation && (
          <>
            <RoutePolyline 
              startLocation={riderLocation}
              endLocation={pickupLocation}
              color="#3b82f6"
              weight={6}
              opacity={0.8}
              dashArray="15, 10"
            />
          </>
        )}

        {/* Route Polyline from Pickup to Drop Location (if both available) */}
        {pickupLocation && dropLocation && (
          <>
            <RoutePolyline 
              startLocation={pickupLocation}
              endLocation={dropLocation}
              color="#ef4444"
              weight={4}
              opacity={0.6}
              dashArray="10, 5"
            />
          </>
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-3 border border-gray-300 z-50">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Drop</span>
          </div>
        </div>
      </div>

      {/* Distance and ETA Info */}
      {distance && eta && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-3 border border-gray-300 z-50">
          <div className="text-center">
            <p className="font-bold text-sm text-blue-600">
              📍 Distance to Pickup
            </p>
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
        </div>
      )}
    </div>
  );
};

export default RiderLiveTrackingMap;
