// hooks/useCurrentLocation.js
import { useState, useEffect } from 'react';
import L from 'leaflet';

export default function useCurrentLocation() {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    altitude: null,
    heading: null,
    speed: null,
    timestamp: null,
    marker: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    const success = (pos) => {
      const coords = pos.coords;

      // Leaflet marker
      const marker = L.marker([coords.latitude, coords.longitude]);

      setLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        heading: coords.heading,
        speed: coords.speed,
        timestamp: pos.timestamp,
        marker,
      });
    };

    const error = (err) => {
      console.error('Error getting location:', err);
    };

    const watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}
