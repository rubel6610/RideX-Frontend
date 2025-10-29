"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bike, Car, BusFront } from "lucide-react";
import { renderToString } from "react-dom/server";

// RoutePolyline Component for Real Road Paths
const RoutePolyline = ({ startLocation, endLocation, color, weight, opacity, dashArray }) => {
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!startLocation || !endLocation) return;
      
      setIsLoading(true);
      
      try {
        // Use OSRM API for real road paths with timeout handling
        const startLat = startLocation.lat;
        const startLng = startLocation.lng;
        const endLat = endLocation.lat;
        const endLng = endLocation.lng;
        
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        
        console.log("🛣️ Rider Map - Fetching real road route from OSRM:", url);
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`OSRM API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
          
          console.log("✅ Rider Map - Real road route generated with", coordinates.length, "points");
          setRouteCoordinates(coordinates);
        } else {
          throw new Error("No route found");
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log("⏰ Rider Map - Request timeout, using straight line fallback");
        } else {
          console.error("❌ Rider Map - Route fetching failed:", error.message);
        }
        // Fallback to straight line
        console.log("🔄 Rider Map - Using straight line fallback");
        setRouteCoordinates([
          [startLocation.lat, startLocation.lng],
          [endLocation.lat, endLocation.lng]
        ]);
      }
      
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

// MapBoundsUpdater Component to automatically fit map bounds
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
      // Fit bounds with padding and max zoom to prevent over-zooming
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
    } else {
      // If no locations, set default view (Dhaka, zoomed out)
      map.setView([23.8103, 90.4125], 8);
    }
  }, [map, riderLocation, pickupLocation, dropLocation]);

  return null; // This component doesn't render anything itself
};

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
  pickupLocation, 
  dropLocation, 
  onEtaUpdate,
  vehicleType 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);

  // Debug logging
  console.log('🗺️ RiderLiveTrackingMap props:', { 
    rideId, 
    riderInfo, 
    pickupLocation, 
    dropLocation,
    isClient,
    riderLocation
  });

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
    
    // Use default average speed for all vehicles
    const avgSpeed = 60; // Default average speed in km/h
    
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
  }, [riderLocation, pickupLocation, onEtaUpdate]);

  // Create vehicle icon based on vehicle type
  const vehicleIcon = React.useMemo(() => {
    if (!riderLocation) return null;
    
    const rideType = (vehicleType || 'bike').toLowerCase();
    let IconComponent;
    let iconColor = '#3b82f6'; // Default blue
    
    if (rideType === 'bike') {
      IconComponent = Bike;
      iconColor = '#3b82f6'; // Blue for bike
    } else if (rideType === 'car') {
      IconComponent = Car;
      iconColor = '#10b981'; // Green for car
    } else if (rideType === 'cng') {
      IconComponent = BusFront;
      iconColor = '#f59e0b'; // Amber for CNG
    } else {
      IconComponent = Bike; // Default to bike
      iconColor = '#3b82f6';
    }

    // Render icon to SVG string
    const iconSvg = renderToString(
      React.createElement(IconComponent, { size: 20, color: 'white', strokeWidth: 2.5 })
    );

    // Create custom vehicle icon
    return L.divIcon({
      className: 'custom-vehicle-icon',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background-color: ${iconColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          ">
            ${iconSvg}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  }, [riderLocation, vehicleType]);

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
      return [23.8103, 90.4125]; // Default to Dhaka if no locations
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
  // Debug logging for polyline rendering
  console.log("🎯 Rider Map - Rendering polyline from rider to pickup:", {
    riderLocation,
    pickupLocation,
    hasRider: !!riderLocation,
    hasPickup: !!pickupLocation
  });

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapCenter = calculateMapCenter();
  
  console.log('🗺️ Map rendering:', { 
    isClient, 
    mapCenter, 
    riderLocation, 
    pickupLocation, 
    dropLocation 
  });

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
      {/* Add CSS for polyline styling */}
      <style jsx>{`
        .rider-route-polyline {
          stroke: #3b82f6 !important;
          stroke-width: 6px !important;
          stroke-opacity: 0.8 !important;
          stroke-dasharray: 15, 10 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          z-index: 1000 !important;
          animation: dash 1.5s linear infinite;
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
        }
        .pickup-drop-polyline {
          stroke: #10b981 !important;
          stroke-width: 4px !important;
          stroke-opacity: 0.7 !important;
          stroke-dasharray: 5, 5 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          z-index: 999 !important;
          filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.3));
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .rider-route-polyline:hover {
          stroke-width: 6px !important;
          stroke-opacity: 1 !important;
        }
      `}</style>
      
      <MapContainer
        key={`${riderLocation?.lat}-${riderLocation?.lng}-${pickupLocation?.lat}-${pickupLocation?.lng}`}
        center={mapCenter} // Initial center, will be overridden by MapBoundsUpdater
        zoom={8} // Initial zoom, will be overridden by MapBoundsUpdater
        style={{ height: "384px", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Add the MapBoundsUpdater component inside MapContainer */}
        <MapBoundsUpdater riderLocation={riderLocation} pickupLocation={pickupLocation} dropLocation={dropLocation} />

        {/* Rider Location Marker with Vehicle Type Icon */}
        {riderLocation && vehicleIcon && (() => {
          const rideType = (vehicleType || 'bike').toLowerCase();
          let IconComponent;
          let iconColor = '#3b82f6';
          
          if (rideType === 'bike') {
            IconComponent = Bike;
            iconColor = '#3b82f6';
          } else if (rideType === 'car') {
            IconComponent = Car;
            iconColor = '#10b981';
          } else if (rideType === 'cng') {
            IconComponent = BusFront;
            iconColor = '#f59e0b';
          } else {
            IconComponent = Bike;
            iconColor = '#3b82f6';
          }

          return (
            <Marker position={[riderLocation.lat, riderLocation.lng]} icon={vehicleIcon}>
              <Popup>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: iconColor}}>
                      {React.createElement(IconComponent, { size: 20, color: 'white' })}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-800">Your Location</p>
                      <p className="text-xs text-blue-600">Rider position</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">{rideType}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Status:</span> On the way
                    </p>
                    <p className="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-200">
                      📍 {riderLocation.lat.toFixed(6)}, {riderLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })()}

        {/* Pickup Location Marker */}
        {pickupLocation && (() => {
          // Create custom red marker icon
          const redMarkerIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          return (
            <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={redMarkerIcon}>
              <Popup>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      👤
                    </div>
                    <div>
                      <p className="font-bold text-sm text-red-800">Pickup Location</p>
                      <p className="text-xs text-red-600">Passenger waiting</p>
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
          );
        })()}

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
              color="red"
              weight={4}
              opacity={0.8}
              dashArray="5, 5"
            />
          </>
        )}

        {/* Route Polyline from Pickup to Drop Location (if both available) */}
        {pickupLocation && dropLocation && (
          <>
            <RoutePolyline 
              startLocation={pickupLocation}
              endLocation={dropLocation}
              color="#10b981"
              weight={4}
              opacity={0.7}
              dashArray="5, 5"
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
