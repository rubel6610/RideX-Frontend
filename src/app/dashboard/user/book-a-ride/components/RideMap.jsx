"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import { useMapEvents, useMap } from "react-leaflet";
import "leaflet-routing-machine";


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

// Road-following polyline component using OSRM routing
const RoadFollowingPolyline = ({ pickupCoords, dropCoords }) => {
  const map = useMap();
  const [polyline, setPolyline] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate coordinates
  const isValidCoords = (coords) => {
    return Array.isArray(coords) && 
           coords.length === 2 && 
           typeof coords[0] === 'number' && 
           typeof coords[1] === 'number' &&
           !isNaN(coords[0]) && 
           !isNaN(coords[1]) &&
           coords[0] >= -90 && coords[0] <= 90 &&
           coords[1] >= -180 && coords[1] <= 180;
  };

  useEffect(() => {
    // Validate inputs
    if (!map || !isValidCoords(pickupCoords) || !isValidCoords(dropCoords)) {
      return;
    }

    // Wait for map to be fully initialized with better checks
    const isMapReady = () => {
      try {
        if (!map) return false;
        if (!map.getContainer) return false;
        
        const container = map.getContainer();
        if (!container) return false;
        if (!container.parentNode) return false;
        if (typeof container.parentNode.appendChild !== 'function') return false;
        if (!map._loaded) return false;
        
        // Additional check for DOM readiness
        if (!document.body.contains(container)) return false;
        
        return true;
      } catch (error) {
        console.warn('Map readiness check failed:', error);
        return false;
      }
    };

    if (!isMapReady()) {
      const timeoutId = setTimeout(() => {
        if (isMapReady()) {
          setPolyline(prev => prev); // Trigger re-render
        }
      }, 200); // Increased delay
      return () => clearTimeout(timeoutId);
    }

    // Clean up existing polyline
    if (polyline && map.hasLayer && map.hasLayer(polyline)) {
      try {
        map.removeLayer(polyline);
        setPolyline(null);
      } catch (error) {
        console.warn('Error removing existing polyline:', error);
      }
    }

    // Fetch route from OSRM for street following
    const fetchRoute = async () => {
      if (isLoading) return; // Prevent multiple simultaneous requests
      
      setIsLoading(true);
      
      try {
        const startLng = pickupCoords[1];
        const startLat = pickupCoords[0];
        const endLng = dropCoords[1];
        const endLat = dropCoords[0];
        
        // Try OSRM routing service
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 3000); // 3 second timeout (reduced from 5)
        
        let response;
        try {
          response = await fetch(osrmUrl, {
            signal: controller.signal,
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });
          clearTimeout(timeoutId);
          cons
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.warn('OSRM request was aborted due to timeout');
            // Don't throw error, just log and continue to GraphHopper
            console.log('Continuing to GraphHopper fallback...');
            return;
          } else {
            console.warn('OSRM fetch error:', fetchError.message);
            // Don't throw error, just log and continue to GraphHopper
            console.log('Continuing to GraphHopper fallback...');
            return;
          }
        }

        if (response.ok) {
          const data = await response.json();
          console.log('OSRM Response data:', data);

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            console.log('Route found with', route.geometry.coordinates.length, 'points');

            if (route.geometry && route.geometry.coordinates && route.geometry.coordinates.length > 2) {
              // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
              const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
              console.log('Converted coordinates:', coordinates.length, 'points');

              // Validate coordinates before creating polyline
              if (coordinates && coordinates.length > 0 && Array.isArray(coordinates[0])) {
                // Additional coordinate validation
                const validCoords = coordinates.filter(coord => 
                  Array.isArray(coord) && 
                  coord.length === 2 && 
                  typeof coord[0] === 'number' && 
                  typeof coord[1] === 'number' &&
                  !isNaN(coord[0]) && 
                  !isNaN(coord[1])
                );
                
                console.log('Valid coordinates count:', validCoords.length, 'out of', coordinates.length);
                
                if (validCoords.length > 1) {
                  try {
                    // Check if Leaflet is available
                    if (typeof L === 'undefined' || !L.polyline) {
                      console.error('Leaflet library not available or polyline method missing');
                      return;
                    }
                    
                    console.log('Creating polyline with', validCoords.length, 'valid coordinates');
                    
                    // Create polyline with road-following coordinates
                    const newPolyline = L.polyline(
                      validCoords,
                      {
                        color: "#3b82f6",
                        weight: 6,
                        opacity: 0.8,
                        lineCap: "round",
                        lineJoin: "round",
                        className: "route-polyline"
                      }
                    );

                    console.log('Polyline object created:', !!newPolyline, newPolyline);

                    if (newPolyline && typeof newPolyline.addTo === 'function' && map) {
                      try {
                        // Double-check map readiness before adding polyline
                        if (isMapReady()) {
                          // Additional safety check with try-catch around addTo
                          try {
                            newPolyline.addTo(map);
                            setPolyline(newPolyline);
                            console.log('Street-following polyline created successfully');
                            return;
                          } catch (addToError) {
                            console.warn('addTo failed, retrying after delay:', addToError);
                            // Retry after a short delay
                            setTimeout(() => {
                              if (isMapReady()) {
                                try {
                                  newPolyline.addTo(map);
                                  setPolyline(newPolyline);
                                  console.log('Street-following polyline created on retry');
                                } catch (retryError) {
                                  console.warn('Retry failed:', retryError);
                                  // Don't throw, just log and continue
                                }
                              }
                            }, 1000); // Increased delay
                          }
                        } else {
                          console.warn('Map not ready for polyline addition');
                        }
                      } catch (addError) {
                        console.error('Error adding polyline to map:', addError);
                        // Don't throw error, just log it
                      }
                    } else {
                      console.error('Failed to create polyline or map is not available', {
                        polyline: !!newPolyline,
                        addToMethod: typeof newPolyline?.addTo,
                        map: !!map,
                        mapContainer: !!map?.getContainer()
                      });
                    }
                  } catch (polylineError) {
                    console.error('Error creating polyline:', polylineError);
                  }
                } else {
                  console.error('Not enough valid coordinates:', validCoords.length);
                }
              } else {
                console.error('Invalid coordinates format:', coordinates);
              }
            }
          }
        } else {
          console.warn('OSRM request failed with status:', response.status);
          
          // Try GraphHopper as fallback
          try {
            console.log('Trying GraphHopper as fallback...');
            const graphhopperUrl = `https://graphhopper.com/api/1/route?point=${startLat},${startLng}&point=${endLat},${endLng}&vehicle=car&key=demo&instructions=false&calc_points=true&points_encoded=false`;
            
            const ghController = new AbortController();
            const ghTimeoutId = setTimeout(() => {
              console.log('GraphHopper request timeout, aborting...');
              ghController.abort();
            }, 3000); // 3 second timeout for GraphHopper
            
            let ghResponse;
            try {
              ghResponse = await fetch(graphhopperUrl, {
                method: 'GET',
                mode: 'cors',
                signal: ghController.signal,
                headers: {
                  'Accept': 'application/json',
                }
              });
              clearTimeout(ghTimeoutId);
            } catch (ghFetchError) {
              clearTimeout(ghTimeoutId);
              if (ghFetchError.name === 'AbortError') {
                console.warn('GraphHopper request was aborted due to timeout');
                // Don't throw error, just log and continue
                console.log('Both OSRM and GraphHopper failed - no polyline will be shown');
                return;
              } else {
                console.warn('GraphHopper fetch error:', ghFetchError.message);
                // Don't throw error, just log and continue
                console.log('Both OSRM and GraphHopper failed - no polyline will be shown');
                return;
              }
            }
            
            if (ghResponse.ok) {
              const ghData = await ghResponse.json();
              console.log('GraphHopper response:', ghData);
              
              if (ghData.paths && ghData.paths.length > 0) {
                const path = ghData.paths[0];
                if (path.points && path.points.coordinates && path.points.coordinates.length > 2) {
                  const coordinates = path.points.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
                  
                  // Validate coordinates before creating polyline
                  if (coordinates && coordinates.length > 0 && Array.isArray(coordinates[0])) {
                    try {
                      const newPolyline = L.polyline(
                        coordinates,
                        {
                          color: "#3b82f6",
                          weight: 6,
                          opacity: 0.8,
                          lineCap: "round",
                          lineJoin: "round",
                          className: "route-polyline"
                        }
                      );

                      if (newPolyline && map) {
                        try {
                          // Use the same map readiness check
                          if (isMapReady()) {
                            try {
                              newPolyline.addTo(map);
                              setPolyline(newPolyline);
                              console.log('GraphHopper route created successfully');
                              return;
                            } catch (addToError) {
                              console.warn('GraphHopper addTo failed, retrying after delay:', addToError);
                              // Retry after a short delay
                              setTimeout(() => {
                                if (isMapReady()) {
                                  try {
                                    newPolyline.addTo(map);
                                    setPolyline(newPolyline);
                                    console.log('GraphHopper polyline created on retry');
                                  } catch (retryError) {
                                    console.warn('GraphHopper retry failed:', retryError);
                                    // Don't throw, just log and continue
                                  }
                                }
                              }, 1000); // Increased delay
                            }
                          } else {
                            console.warn('Map not ready for GraphHopper polyline addition');
                          }
                        } catch (addError) {
                          console.error('Error adding GraphHopper polyline to map:', addError);
                          // Don't throw error, just log it
                        }
                      } else {
                        console.error('Failed to create GraphHopper polyline or map is not available');
                      }
                    } catch (polylineError) {
                      console.error('Error creating GraphHopper polyline:', polylineError);
                    }
                  } else {
                    console.error('Invalid GraphHopper coordinates format:', coordinates);
                  }
                }
              }
            }
          } catch (ghError) {
            console.warn('GraphHopper also failed:', ghError);
          }
        }

        // If we reach here, routing services failed - no polyline will be shown
        console.log('Routing services failed - no polyline displayed');
        return;

      } catch (error) {
        console.error('Error fetching route:', error);
        
        // Check if it's a timeout error and provide specific message
        if (error.message && error.message.includes('timeout')) {
          console.warn('Routing service timeout - no polyline will be displayed');
        }
        
        // No fallback polyline will be created - only road-following polylines are shown
        console.log('No polyline displayed due to routing service error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();

    return () => {
      if (polyline && map && map.hasLayer && map.hasLayer(polyline)) {
        try {
          map.removeLayer(polyline);
        } catch (error) {
          console.warn('Error removing polyline during cleanup:', error);
        }
      }
    };
  }, [map, pickupCoords, dropCoords]);

  return null;
};

const RideMap = ({
  pickup,
  drop,
  currentLocation,
  isCurrentLocationActive,
  onLocationSelect,
  onCurrentLocationClick,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [center, setCenter] = useState([23.8103, 90.4125]);
  const [zoom, setZoom] = useState(12);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Additional cleanup to prevent memory leaks
      try {
        if (typeof window !== 'undefined' && window.L && window.L.Routing) {
          // Clear any global routing state if needed
        }
      } catch (error) {
        console.warn('Error in component cleanup:', error);
      }
    };
  }, []);

  const parseCoordinates = (location) => {
    if (!location || typeof location !== 'string') return null;
    
    try {
      if (location.includes(",")) {
        const coords = location.split(",").map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && 
            !isNaN(coords[0]) && !isNaN(coords[1]) &&
            coords[0] >= -90 && coords[0] <= 90 &&
            coords[1] >= -180 && coords[1] <= 180) {
          return coords;
        }
      }
    } catch (error) {
      console.warn('Error parsing coordinates:', error);
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
      // When only pickup is set, check if it's the current location
      // If it is the current location, zoom out more (lower zoom level)
      // Otherwise, use the standard zoom level
      const newZoom = isCurrentLocationActive ? 12 : 16; // Zoom out more to level 12 when it's current location
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    } else if (parsedDropCoords) {
      const newCenter = [parsedDropCoords[0], parsedDropCoords[1]];
      // When only dropoff is set, use zoom level 16 to match the closest distance case
      const newZoom = 16;
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    } else {
      // When no locations are set, use zoom level 16 to match manual input behavior
      const newCenter = [23.8103, 90.4125];
      const newZoom = 16;
      if (center[0] !== newCenter[0] || center[1] !== newCenter[1] || zoom !== newZoom) {
        setCenter(newCenter);
        setZoom(newZoom);
      }
    }
  }, [parsedPickupCoords, parsedDropCoords, center, zoom, isCurrentLocationActive]);

  const handleMapClick = async (latlng) => {
    if (!latlng || typeof latlng.lat !== 'number' || typeof latlng.lng !== 'number') {
      console.warn('Invalid latlng object:', latlng);
      return;
    }

    try {
      const { lat, lng } = latlng;
      const locationString = `${lat},${lng}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const locationData = {
        name: locationName,
        coordinates: locationString,
        lat,
        lng,
      };
      
      if (onLocationSelect) {
        onLocationSelect(locationData, "pickup");
      }
    } catch (error) {
      console.warn('Error fetching location name:', error);
      const fallbackLocation = {
        name: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
        coordinates: `${latlng.lat},${latlng.lng}`,
        lat: latlng.lat,
        lng: latlng.lng,
      };
      
      if (onLocationSelect) {
        onLocationSelect(fallbackLocation, "pickup");
      }
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
  // Error boundary
  if (error || mapError) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-500">Map Error</p>
          <p className="text-xs text-gray-500 mt-1">Please refresh the page</p>
          <button 
            onClick={() => {
              setError(null);
              setMapError(null);
              window.location.reload();
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  try {
  return (
    <div className="w-full h-full relative">
      {/* Add CSS to hide instruction panel but keep route line */}
      <style jsx>{`
        .leaflet-routing-container {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
        .leaflet-routing-alt {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
        .leaflet-control-container .leaflet-routing-container {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
        /* Keep route line visible */
        .leaflet-routing-line {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 1000 !important;
        }
        /* Ensure polyline is always visible */
        .leaflet-interactive {
          stroke: #3b82f6 !important;
          stroke-width: 6px !important;
          stroke-opacity: 0.8 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
        }
        /* Specific styling for route polyline */
        .route-polyline {
          stroke: #3b82f6 !important;
          stroke-width: 6px !important;
          stroke-opacity: 0.8 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          z-index: 1000 !important;
          fill: none !important;
        }
        /* Ensure all polylines are visible */
        .leaflet-pane svg path {
          stroke: #3b82f6 !important;
          stroke-width: 6px !important;
          stroke-opacity: 0.8 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
        }
        /* Make sure route lines are always on top */
        .leaflet-overlay-pane svg {
          z-index: 1000 !important;
        }
        .leaflet-overlay-pane svg path {
          z-index: 1000 !important;
        }
        .leaflet-popup-content-wrapper {
          z-index: 1000 !important;
        }
        .leaflet-popup-tip {
          z-index: 1000 !important;
        }
        /* Ensure markers are visible */
        .leaflet-marker-icon {
          z-index: 1001 !important;
        }
      `}</style>
      
      <MapContainer
        key={`map-${center[0]}-${center[1]}-${zoom}`}
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

        {/* Road-following Polyline - Uses OSRM routing service */}
        {parsedPickupCoords && parsedDropCoords && (
          <RoadFollowingPolyline pickupCoords={parsedPickupCoords} dropCoords={parsedDropCoords} />
        )}

        {/* Pickup Marker - Always show if we have pickup coordinates */}
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
      </MapContainer>

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
  } catch (renderError) {
    console.error('Error rendering map:', renderError);
    setMapError(renderError);
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-500">Map Rendering Error</p>
          <p className="text-xs text-gray-500 mt-1">Please refresh the page</p>
          <button 
            onClick={() => {
              setError(null);
              setMapError(null);
              window.location.reload();
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
};

export default RideMap;