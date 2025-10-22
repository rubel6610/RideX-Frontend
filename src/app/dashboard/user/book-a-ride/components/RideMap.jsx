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

  useEffect(() => {
    if (!map || !pickupCoords || !dropCoords) {
      console.log('Missing requirements - map:', !!map, 'pickupCoords:', !!pickupCoords, 'dropCoords:', !!dropCoords);
      return;
    }

    // Clean up existing polyline
    if (polyline && map.hasLayer(polyline)) {
      map.removeLayer(polyline);
    }

    // Fetch route from OSRM for street following
    const fetchRoute = async () => {
      try {
        const startLng = pickupCoords[1];
        const startLat = pickupCoords[0];
        const endLng = dropCoords[1];
        const endLat = dropCoords[0];

        console.log('Fetching route from', startLat, startLng, 'to', endLat, endLng);
        
        // Test basic polyline creation first
        try {
          const testPolyline = L.polyline([[startLat, startLng], [endLat, endLng]], {
            color: "#ff0000",
            weight: 2
          });
          console.log('Test polyline created successfully:', !!testPolyline);
          if (testPolyline) {
            testPolyline.addTo(map);
            setTimeout(() => {
              if (map.hasLayer(testPolyline)) {
                map.removeLayer(testPolyline);
                console.log('Test polyline removed');
              }
            }, 1000);
          }
        } catch (testError) {
          console.error('Test polyline creation failed:', testError);
        }

        // Try OSRM routing service
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        console.log('OSRM URL:', osrmUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const response = await fetch(osrmUrl, {
          signal: controller.signal,
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }).catch(fetchError => {
          console.warn('Fetch error (likely CORS or network):', fetchError.message);
          throw fetchError;
        });
        
        clearTimeout(timeoutId);
        console.log('OSRM Response status:', response.status);

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
                      newPolyline.addTo(map);
                      setPolyline(newPolyline);
                      console.log('Street-following polyline created successfully');
                      return;
                    } else {
                      console.error('Failed to create polyline or map is not available', {
                        polyline: !!newPolyline,
                        addToMethod: typeof newPolyline?.addTo,
                        map: !!map
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
            
            const ghResponse = await fetch(graphhopperUrl, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Accept': 'application/json',
              }
            });
            
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
                        newPolyline.addTo(map);
                        setPolyline(newPolyline);
                        console.log('GraphHopper route created successfully');
                        return;
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

        // Fallback: Create a simple polyline first, then try complex one
        console.log('Creating simple fallback polyline');
        
        try {
          // First try a simple straight line
          const simplePolyline = L.polyline(
            [pickupCoords, dropCoords],
            {
              color: "#3b82f6",
              weight: 6,
              opacity: 0.8,
              lineCap: "round",
              lineJoin: "round",
              className: "route-polyline"
            }
          );

          if (simplePolyline && map) {
            simplePolyline.addTo(map);
            setPolyline(simplePolyline);
            console.log('Simple fallback polyline created successfully');
            return;
          } else {
            console.error('Failed to create simple polyline');
          }
        } catch (simpleError) {
          console.error('Error creating simple polyline:', simpleError);
        }
        
        // If simple polyline fails, try creating a realistic road-like path
        console.log('Creating realistic road-like fallback path');
        const intermediatePoints = [];
        const steps = 50; // Fewer points to reduce complexity
        
        // Calculate distance for more realistic routing
        const distance = Math.sqrt(
          Math.pow(dropCoords[0] - pickupCoords[0], 2) + 
          Math.pow(dropCoords[1] - pickupCoords[1], 2)
        );
        
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const lat = pickupCoords[0] + (dropCoords[0] - pickupCoords[0]) * ratio;
          const lng = pickupCoords[1] + (dropCoords[1] - pickupCoords[1]) * ratio;
          
          // Create a more realistic road path with multiple curves
          let curveOffset = 0;
          
          // Add multiple sine waves for more realistic road curves
          if (distance > 0.01) { // Only add curves for longer distances
            curveOffset += Math.sin(ratio * Math.PI * 2) * 0.0005; // Primary curve
            curveOffset += Math.sin(ratio * Math.PI * 4) * 0.0002; // Secondary curve
          }
          
          // Add perpendicular offset for more realistic road following
          const perpendicularOffset = Math.cos(ratio * Math.PI * 3) * 0.0003;
          
          intermediatePoints.push([
            lat + curveOffset, 
            lng + perpendicularOffset
          ]);
        }
        
        // Validate intermediate points before creating polyline
        if (intermediatePoints && intermediatePoints.length > 0 && Array.isArray(intermediatePoints[0])) {
          try {
            const fallbackPolyline = L.polyline(
              intermediatePoints,
              {
                color: "#3b82f6",
                weight: 6,
                opacity: 0.8,
                lineCap: "round",
                lineJoin: "round",
                className: "route-polyline"
              }
            );

            if (fallbackPolyline && map) {
              fallbackPolyline.addTo(map);
              setPolyline(fallbackPolyline);
              console.log('Realistic road-like fallback polyline created');
            } else {
              console.error('Failed to create fallback polyline or map is not available');
            }
          } catch (polylineError) {
            console.error('Error creating fallback polyline:', polylineError);
          }
        } else {
          console.error('Invalid intermediate points format:', intermediatePoints);
        }

      } catch (error) {
        console.error('Error fetching route:', error);
        
        // Final fallback to straight line
        try {
          const fallbackPolyline = L.polyline(
            [pickupCoords, dropCoords],
            {
              color: "#3b82f6",
              weight: 6,
              opacity: 0.8,
              lineCap: "round",
              lineJoin: "round",
              className: "route-polyline"
            }
          );

          if (fallbackPolyline && map) {
            fallbackPolyline.addTo(map);
            setPolyline(fallbackPolyline);
            console.log('Straight line fallback created');
          } else {
            console.error('Failed to create final fallback polyline or map is not available');
          }
        } catch (polylineError) {
          console.error('Error creating final fallback polyline:', polylineError);
        }
      }
    };

    fetchRoute();

    return () => {
      if (polyline && map.hasLayer(polyline)) {
        map.removeLayer(polyline);
      }
    };
  }, [map, pickupCoords, dropCoords]);

  return null;
};

// Road-following route component
const Routing = ({ pickupCoords, dropCoords }) => {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);
  const [fallbackPolyline, setFallbackPolyline] = useState(null);

  useEffect(() => {
    if (!map || !pickupCoords || !dropCoords) return;

    // Clean up existing controls and polylines
    const cleanup = () => {
      try {
        // Remove existing routing controls
        map.eachLayer((layer) => {
          if (layer instanceof L.Routing.Control) {
            try {
              map.removeControl(layer);
            } catch (e) {
              console.warn('Error removing routing control:', e);
            }
          }
        });

        // Remove existing polylines
        if (fallbackPolyline && map.hasLayer(fallbackPolyline)) {
          map.removeLayer(fallbackPolyline);
        }
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    };

    cleanup();

    // Create a simple polyline first as fallback
    const createSimplePolyline = () => {
      return L.polyline(
        [pickupCoords, dropCoords],
        {
          color: "#3b82f6",
          weight: 6,
          opacity: 0.8,
          lineCap: "round",
          lineJoin: "round"
        }
      ).addTo(map);
    };

    // Always create a simple polyline first
    const simplePolyline = createSimplePolyline();
    setFallbackPolyline(simplePolyline);

    // Try to create routing control for better route following
    try {
      // Check if L.Routing is available
      if (typeof L.Routing !== 'undefined') {
        let control;
        
        try {
          control = L.Routing.control({
            waypoints: [
              L.latLng(pickupCoords[0], pickupCoords[1]),
              L.latLng(dropCoords[0], dropCoords[1]),
            ],
            lineOptions: {
              styles: [
                { 
                  color: "#3b82f6", 
                  weight: 6, 
                  opacity: 0.8,
                  lineCap: "round",
                  lineJoin: "round"
                }
              ],
            },
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            show: false, // Don't show the instruction panel
            createMarker: () => null, // Hide default markers
            plan: L.Routing.plan([], {
              createMarker: () => null,
              addWaypoints: false,
              draggableWaypoints: false,
              routeWhileDragging: false
            }),
            router: L.Routing.osrmv1({
              serviceUrl: 'https://router.project-osrm.org/route/v1',
              timeout: 10000,
              profile: 'driving'
            })
          });

          // Add the control to map
          control.addTo(map);
          setRoutingControl(control);

          // Hide the instruction panel
          const hideInstructionPanel = () => {
            const instructionPanel = document.querySelector('.leaflet-routing-container');
            const altPanel = document.querySelector('.leaflet-routing-alt');
            
            if (instructionPanel) {
              instructionPanel.style.display = 'none';
              instructionPanel.style.visibility = 'hidden';
              instructionPanel.style.opacity = '0';
              instructionPanel.style.pointerEvents = 'none';
              instructionPanel.style.zIndex = '-1';
              instructionPanel.style.position = 'absolute';
              instructionPanel.style.left = '-9999px';
              instructionPanel.style.top = '-9999px';
            }
            
            if (altPanel) {
              altPanel.style.display = 'none';
              altPanel.style.visibility = 'hidden';
              altPanel.style.opacity = '0';
              altPanel.style.pointerEvents = 'none';
              altPanel.style.zIndex = '-1';
              altPanel.style.position = 'absolute';
              altPanel.style.left = '-9999px';
              altPanel.style.top = '-9999px';
            }
          };

          // Try to hide immediately and with observer
          hideInstructionPanel();
          
          const observer = new MutationObserver(() => {
            hideInstructionPanel();
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          // Cleanup observer after 2 seconds
          setTimeout(() => {
            observer.disconnect();
          }, 2000);

        } catch (routingError) {
          console.warn('Routing control creation failed:', routingError);
          // Keep the simple polyline as fallback
        }
      }
    } catch (error) {
      console.warn('Routing machine error:', error);
      // Keep the simple polyline as fallback
    }

    return () => {
      try {
        if (routingControl && map) {
          if (map.hasLayer && map.hasLayer(routingControl)) {
            map.removeControl(routingControl);
          }
        }
        if (fallbackPolyline && map) {
          if (map.hasLayer && map.hasLayer(fallbackPolyline)) {
            map.removeLayer(fallbackPolyline);
          }
        }
      } catch (error) {
        console.warn('Error in cleanup:', error);
      }
    };
  }, [map, pickupCoords, dropCoords]);

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
      // Default to pickup type since we removed the selector
      onLocationSelect(locationData, "pickup");
    } catch (error) {
      const fallbackLocation = {
        name: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
        coordinates: `${latlng.lat},${latlng.lng}`,
        lat: latlng.lat,
        lng: latlng.lng,
      };
      // Default to pickup type since we removed the selector
      onLocationSelect(fallbackLocation, "pickup");
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

  // Debug logging
  console.log('RideMap render - pickup:', pickup, 'drop:', drop);
  console.log('Parsed coords - pickup:', parsedPickupCoords, 'drop:', parsedDropCoords);

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
  } catch (error) {
    console.error('Error rendering map:', error);
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-500">Map Error</p>
          <p className="text-xs text-gray-500 mt-1">Please refresh the page</p>
        </div>
      </div>
    );
  }
};

export default RideMap;
