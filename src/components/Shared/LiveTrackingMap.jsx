"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Bike, Car, BusFront } from "lucide-react";
import L from "leaflet";

// RoutePolyline Component for Real Road Paths
const RoutePolyline = ({ startLocation, endLocation, color, weight, opacity, dashArray }) => {
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!startLocation || !endLocation) return;
      
      setIsLoading(true);
      
      // Use straight line directly for stability
      // OSRM API calls are disabled to prevent network errors
      console.log("🛣️ Using straight line route for stability");
      
      // Set straight line coordinates immediately
      setRouteCoordinates([
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng]
      ]);
      
      console.log("✅ Straight line route set");
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
        className: 'real-road-polyline'
      }}
    />
  );
};

// MapBoundsUpdater Component to automatically fit map bounds
const MapBoundsUpdater = ({ riderLocation, pickupLocation }) => {
  const map = useMap();

  useEffect(() => {
    const locations = [];
    
    if (riderLocation && riderLocation.lat && riderLocation.lng) {
      locations.push([riderLocation.lat, riderLocation.lng]);
    }
    
    if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
      locations.push([pickupLocation.lat, pickupLocation.lng]);
    }

    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations);
      // Fit bounds with padding and max zoom to prevent over-zooming
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
      console.log("🗺️ Map bounds updated to fit markers:", bounds);
    } else {
      // If no locations, set default view (Bogura, zoomed out)
      map.setView([24.8504, 89.3711], 8);
      console.log("🗺️ No markers to fit, setting default map view");
    }
  }, [map, riderLocation, pickupLocation]);

  return null; // This component doesn't render anything
};

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom vehicle icons
const createVehicleIcon = (vehicleType) => {
  console.log("🎨 Creating vehicle icon for type:", vehicleType);
  
  let iconHtml = '';
  let bgColor = '#3b82f6';
  
  switch (vehicleType) {
    case 'Bike':
      iconHtml = '🏍️';
      bgColor = '#ef4444'; // Red for bike
      break;
    case 'Car':
      iconHtml = '🚗';
      bgColor = '#3b82f6'; // Blue for car
      break;
    case 'Cng':
      iconHtml = '🚕';
      bgColor = '#f59e0b'; // Orange for CNG
      break;
    default:
      iconHtml = '🏍️';
      bgColor = '#3b82f6';
  }
  
  console.log("🎨 Icon created:", { iconHtml, bgColor });
  
  return L.divIcon({
    html: `
      <div style="
        background: ${bgColor};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        position: relative;
      ">
        ${iconHtml}
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid ${bgColor};
        "></div>
      </div>
    `,
    className: 'custom-vehicle-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const LiveTrackingMap = ({ rideId, riderInfo, vehicleType = "Car", pickupLocation, dropLocation, onEtaUpdate }) => {
  console.log("🗺️ LiveTrackingMap props:", { rideId, riderInfo, vehicleType, pickupLocation, dropLocation });
  
  const [riderLocation, setRiderLocation] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeStable, setRouteStable] = useState(false);


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

  // Get user's current location
  useEffect(() => {
    if (!isClient) return;

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log('📍 User location obtained:', userLoc);
          },
          (error) => {
            console.warn("Error getting user location:", error);
            console.log('📍 Using pickup location as fallback:', pickupLocation);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      } else {
        console.warn("Geolocation is not supported");
        // Pickup location is already available as prop
        console.log('📍 Using pickup location as fallback:', pickupLocation);
      }
    };

    getUserLocation();
  }, [isClient, pickupLocation]);


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

  // Generate curved route coordinates for better visual appeal
  const generateCurvedRoute = (startLat, startLng, endLat, endLng) => {
    const points = [];
    const numPoints = 15; // Number of intermediate points
    
    // Calculate distance to determine curve intensity
    const distance = calculateDistance(startLat, startLng, endLat, endLng);
    const curveIntensity = Math.min(distance * 0.0001, 0.002); // Adaptive curve based on distance
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      
      // Linear interpolation
      const lat = startLat + (endLat - startLat) * t;
      const lng = startLng + (endLng - startLng) * t;
      
      // Add natural curve using sine wave
      const curveOffset = Math.sin(t * Math.PI) * curveIntensity;
      const perpendicularOffset = Math.cos(t * Math.PI) * curveIntensity * 0.5;
      
      // Apply curve perpendicular to the main direction
      const angle = Math.atan2(endLng - startLng, endLat - startLat);
      const curvedLat = lat + curveOffset * Math.cos(angle + Math.PI/2);
      const curvedLng = lng + curveOffset * Math.sin(angle + Math.PI/2);
      
      points.push([curvedLat, curvedLng]);
    }
    
    return points;
  };

  // Generate waypoint-based route for more realistic path
  const generateWaypointRoute = (startLat, startLng, endLat, endLng) => {
    const points = [];
    
    // Create a clear curved path with multiple waypoints
    const midLat = (startLat + endLat) / 2;
    const midLng = (startLng + endLng) / 2;
    
    // Calculate curve offset based on distance
    const distance = calculateDistance(startLat, startLng, endLat, endLng);
    const curveOffset = Math.min(distance * 0.0005, 0.005); // Much stronger curve
    
    // Create waypoints with significant curve
    const waypoints = [
      [startLat, startLng], // Start
      [startLat + (midLat - startLat) * 0.2, startLng + (midLng - startLng) * 0.2 + curveOffset], // 20% with curve
      [startLat + (midLat - startLat) * 0.4, startLng + (midLng - startLng) * 0.4 + curveOffset * 1.5], // 40% with more curve
      [startLat + (midLat - startLat) * 0.6, startLng + (midLng - startLng) * 0.6 + curveOffset * 1.5], // 60% with more curve
      [startLat + (midLat - startLat) * 0.8, startLng + (midLng - startLng) * 0.8 + curveOffset], // 80% with curve
      [endLat, endLng] // End
    ];
    
    // Add more intermediate points for smoother curve
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Add current point
      points.push(current);
      
      // Add intermediate points between current and next
      for (let j = 1; j <= 3; j++) {
        const t = j / 4;
        const lat = current[0] + (next[0] - current[0]) * t;
        const lng = current[1] + (next[1] - current[1]) * t;
        points.push([lat, lng]);
      }
    }
    
    // Add final point
    points.push(waypoints[waypoints.length - 1]);
    
    console.log("🛣️ Generated curved route with", points.length, "points");
    console.log("🛣️ Route points:", points);
    return points;
  };

  // Get route coordinates with multiple fallback options
  const getRouteCoordinates = async (startLat, startLng, endLat, endLng) => {
    console.log("🛣️ Fetching road route from:", startLat, startLng, "to:", endLat, endLng);
    
    try {
      // Try OSRM first (free and reliable) with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("🛣️ OSRM response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("🛣️ OSRM data:", data);
        
        if (data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
          const route = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          console.log("✅ OSRM route generated with", route.length, "points");
          return route;
        }
      }
    } catch (error) {
      console.warn("OSRM failed:", error.message);
    }

    try {
      // Try OpenRouteService as fallback
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c8b8c8c8&start=${startLng},${startLat}&end=${endLng},${endLat}`,
        { 
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      console.log("🛣️ OpenRouteService response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("🛣️ OpenRouteService data:", data);
        
        if (data.features && data.features[0] && data.features[0].geometry && data.features[0].geometry.coordinates) {
          const route = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          console.log("✅ OpenRouteService route generated with", route.length, "points");
          return route;
        }
      }
    } catch (error) {
      console.warn("OpenRouteService failed:", error.message);
    }
    
    // Final fallback: straight line (better than curved)
    console.log("⚠️ Using straight line fallback");
    return [[startLat, startLng], [endLat, endLng]];
  };

  // Fetch rider location and ride status every 5 seconds
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

        // First, get ride status to get riderId
        const rideRes = await fetch(
          `${apiUrl}/api/ride/${rideId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-cache'
          }
        );
        
        if (!rideRes.ok) {
          console.warn("Failed to fetch ride status, using fallback location");
          setRiderLocation({ lat: 24.8504, lng: 89.3711 });
          return;
        }
        
        const rideData = await rideRes.json();
        
        if (rideData && rideData.riderId) {
          // Now get rider information to get location
          const riderRes = await fetch(
            `${apiUrl}/api/rider/${rideData.riderId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              cache: 'no-cache'
            }
          );
          
          if (riderRes.ok) {
            const riderData = await riderRes.json();
            
            if (riderData && riderData.location && riderData.location.coordinates && Array.isArray(riderData.location.coordinates)) {
              // MongoDB stores as [lng, lat], Leaflet needs [lat, lng]
              const newLocation = {
                lat: parseFloat(riderData.location.coordinates[1]),
                lng: parseFloat(riderData.location.coordinates[0]),
              };
              
              // Validate coordinates
              if (!isNaN(newLocation.lat) && !isNaN(newLocation.lng) && 
                  newLocation.lat >= -90 && newLocation.lat <= 90 &&
                  newLocation.lng >= -180 && newLocation.lng <= 180) {
                
                setRiderLocation(newLocation);

                // Calculate distance and ETA - rider to pickup location only
                const targetLocation = pickupLocation;
                if (targetLocation && targetLocation.lat && targetLocation.lng) {
                  const dist = calculateDistance(
                    newLocation.lat, 
                    newLocation.lng, 
                    targetLocation.lat, 
                    targetLocation.lng
                  );
                  setDistance(dist);
                  const etaText = calculateETA(dist);
                  setEta(etaText);
                  
                  console.log("⏱️ ETA Calculation - Rider to Pickup:", {
                    riderLocation: newLocation,
                    pickupLocation: targetLocation,
                    distance: dist.toFixed(2) + " km",
                    eta: etaText
                  });
                  
                  // Update parent component with live ETA
                  if (onEtaUpdate) {
                    onEtaUpdate(etaText);
                  }
                }
              }
            } else {
              // Fallback to Bogura if no valid location
              setRiderLocation({ lat: 24.8504, lng: 89.3711 });
            }
          } else {
            // Fallback to Bogura if rider fetch fails
            setRiderLocation({ lat: 24.8504, lng: 89.3711 });
          }
        } else {
          // Fallback to Bogura if no riderId
          setRiderLocation({ lat: 24.8504, lng: 89.3711 });
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

  // Fetch route coordinates when locations change
  useEffect(() => {
    const fetchRoute = async () => {
      if (!riderLocation || !riderLocation.lat || !riderLocation.lng) return;
      
      // Prioritize user location over pickup location
      const targetLocation = pickupLocation;
      if (!targetLocation || !targetLocation.lat || !targetLocation.lng) return;

      // Don't update route if it's already stable and locations haven't changed significantly
      if (routeStable && routeCoordinates.length > 2) {
        const currentDistance = calculateDistance(
          riderLocation.lat, riderLocation.lng,
          targetLocation.lat, targetLocation.lng
        );
        const routeDistance = calculateDistance(
          routeCoordinates[0][0], routeCoordinates[0][1],
          routeCoordinates[routeCoordinates.length - 1][0], routeCoordinates[routeCoordinates.length - 1][1]
        );
        
        // Only update if distance changed significantly (more than 100m)
        if (Math.abs(currentDistance - routeDistance) < 0.1) {
          console.log("🔄 Route is stable, skipping update");
          return;
        }
      }

      console.log("🔄 Generating route from:", riderLocation, "to:", targetLocation);

      try {
        // Get real road route and keep it stable
        const route = await getRouteCoordinates(
          riderLocation.lat,
          riderLocation.lng,
          targetLocation.lat,
          targetLocation.lng
        );
        
        // Only update if we got a valid route with multiple points
        if (route && route.length > 2) {
          console.log("✅ Real route generated with", route.length, "points");
          setRouteCoordinates(route);
          setRouteStable(true);
        } else {
          // Use stable curved route if API fails
          const stableRoute = generateWaypointRoute(
            riderLocation.lat,
            riderLocation.lng,
            targetLocation.lat,
            targetLocation.lng
          );
          console.log("🛣️ Using stable curved route with", stableRoute.length, "points");
          setRouteCoordinates(stableRoute);
          setRouteStable(true);
        }
      } catch (error) {
        console.error("Error generating route:", error);
        // Use stable curved route as fallback
        const stableRoute = generateWaypointRoute(
          riderLocation.lat,
          riderLocation.lng,
          targetLocation.lat,
          targetLocation.lng
        );
        console.log("🛣️ Using stable fallback route with", stableRoute.length, "points");
        setRouteCoordinates(stableRoute);
      }
    };

    // Add debounce to prevent too frequent updates
    const timeoutId = setTimeout(fetchRoute, 500);
    return () => clearTimeout(timeoutId);
  }, [riderLocation, pickupLocation]);


  if (!isClient) {
    return (
      <div className="w-full h-[400px] z-40 rounded-xl bg-card border border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-3 animate-pulse">
            {getVehicleIcon()}
          </div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Smart map center and bounds calculation to show all markers
  const calculateMapCenter = () => {
    const locations = [];
    
    // Add user/pickup location (combined)
    const userPickupLocation = pickupLocation;
    if (userPickupLocation && userPickupLocation.lat && userPickupLocation.lng) {
      locations.push([userPickupLocation.lat, userPickupLocation.lng]);
    }
    
    // Add rider location
    if (riderLocation && riderLocation.lat && riderLocation.lng) {
      locations.push([riderLocation.lat, riderLocation.lng]);
    }
    
    // Add drop location if available
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
  
  console.log("🗺️ Map settings:", { mapCenter });

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden border border-border shadow-lg">
      {/* Add CSS for polyline styling */}
      <style jsx>{`
        .rider-route-polyline {
          stroke: #3b82f6 !important;
          stroke-width: 8px !important;
          stroke-opacity: 1 !important;
          stroke-dasharray: 20, 10 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          z-index: 1000 !important;
          animation: dash 1.5s linear infinite;
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
        }
        .pickup-drop-polyline {
          stroke: #10b981 !important;
          stroke-width: 4px !important;
          stroke-opacity: 0.8 !important;
          stroke-dasharray: 8, 4 !important;
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
          stroke-width: 8px !important;
          stroke-opacity: 1 !important;
        }
        .custom-vehicle-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-vehicle-marker:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
      `}</style>
      
      <MapContainer
        key={`${riderLocation?.lat}-${riderLocation?.lng}-${pickupLocation?.lat}-${pickupLocation?.lng}`}
        center={mapCenter}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Add MapBoundsUpdater component inside MapContainer */}
        <MapBoundsUpdater riderLocation={riderLocation} pickupLocation={pickupLocation} />
        
        {/* Rider Marker - Custom vehicle icon */}
        {riderLocation && riderLocation.lat && riderLocation.lng && (
          <Marker 
            key={`rider-${riderLocation.lat}-${riderLocation.lng}`}
            position={[riderLocation.lat, riderLocation.lng]}
            icon={createVehicleIcon(vehicleType)}
          >
            <Popup>
              <div className={`p-3 border rounded-lg ${
                vehicleType === "Bike" ? "bg-red-50 border-red-200" :
                vehicleType === "Car" ? "bg-blue-50 border-blue-200" :
                "bg-orange-50 border-orange-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    vehicleType === "Bike" ? "bg-red-500" :
                    vehicleType === "Car" ? "bg-blue-500" :
                    "bg-orange-500"
                  }`}>
                    {vehicleType === "Bike" ? "🏍️" : vehicleType === "Car" ? "🚗" : "🚕"}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${
                      vehicleType === "Bike" ? "text-red-800" :
                      vehicleType === "Car" ? "text-blue-800" :
                      "text-orange-800"
                    }`}>
                      {riderInfo?.fullName || "Rider"}
                    </p>
                    <p className={`text-xs ${
                      vehicleType === "Bike" ? "text-red-600" :
                      vehicleType === "Car" ? "text-blue-600" :
                      "text-orange-600"
                    }`}>
                      On the way
                    </p>
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

        {/* Pickup Location Marker */}
        {pickupLocation && (
          <>
            {console.log("📍 Rendering pickup location marker:", pickupLocation)}
            <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
            <Popup>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-sm text-green-800">Pickup Location</p>
                    <p className="text-xs text-green-600">Your current position</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Status:</span> Waiting for rider
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Type:</span> Live GPS Position
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

        {/* Drop Location Marker - Orange with destination icon */}
        {dropLocation && dropLocation.lat && dropLocation.lng && (
          <Marker position={[dropLocation.lat, dropLocation.lng]}>
            <Popup>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  <div>
                    <p className="font-bold text-sm text-orange-800">Destination</p>
                    <p className="text-xs text-orange-600">Your final stop</p>
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

        {/* Route Polyline from Rider to Pickup Location */}
        {riderLocation && pickupLocation && (
          <>
            {console.log("🎯 Rendering polyline from rider to pickup:", riderLocation, pickupLocation)}
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

        {/* Route Polyline from Pickup to Drop Location */}
        {pickupLocation && pickupLocation.lat && pickupLocation.lng && 
         dropLocation && dropLocation.lat && dropLocation.lng && (
          <>
            <Polyline
              key={`pickup-drop-route-${pickupLocation.lat}-${pickupLocation.lng}-${dropLocation.lat}-${dropLocation.lng}`}
              positions={[
                [pickupLocation.lat, pickupLocation.lng],
                [dropLocation.lat, dropLocation.lng]
              ]}
              pathOptions={{
                color: '#10b981',
                weight: 4,
                opacity: 0.7,
                dashArray: '5, 5',
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
                  <p className="font-bold text-sm text-green-600">🎯 Trip Distance</p>
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

