// fareCalculator.js
import fetch from "node-fetch";

// Static BDT per km rates
const RATE_TABLE = {
  bike: 12,
  cng: 20,
  car: 35,
};

// Average speed (km/h) for each vehicle type
const SPEED_TABLE = {
  bike: 40,  // Bike average speed in city
  cng: 30,   // CNG average speed
  car: 50,   // Car average speed
};

// Fetch promo discount from database
async function getPromoDiscount(promoCode) {
  if (!promoCode) return 0;
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:5000'}/api/promotions/validate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode })
      }
    );
    const data = await response.json();
    
    if (data.valid && data.discount) {
      return data.discount / 100; // Convert percentage to decimal
    }
  } catch (error) {
    console.error('Error fetching promo discount:', error);
  }
  
  return 0;
}

// Address -> Coordinates using Nominatim
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  const res = await fetch(url, { headers: { "User-Agent": "ride-app" } });
  const data = await res?.json();

  if (!data || data?.length === 0) {
    throw new Error(`Coordinates not found for: ${address}`);
  }

  return { lat: parseFloat(data[0]?.lat), lon: parseFloat(data[0]?.lon) };
}

// Haversine distance (backup calculation if OSRM fails)
function toRad(deg) {
  return (deg * Math.PI) / 180;
}
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

// Get route info (distance + duration) from OSRM
async function getRouteInfo(fromCoords, toCoords, type) {
  let profile = "driving"; // default car
  if (type === "bike") profile = "cycling";
  if (type === "cng") profile = "driving"; // CNG = driving

  const url = `https://router.project-osrm.org/route/v1/${profile}/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.routes && data.routes.length > 0) {
      return {
        distanceKm: data.routes[0].distance / 1000, // meters -> km
        durationMin: data.routes[0].duration / 60, // sec -> min
      };
    }
  } catch (error) {
    console.error("OSRM error:", error.message);
  }

  // fallback if OSRM fails
  return {
    distanceKm: haversine(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon),
    durationMin: null,
  };
}

// Main function
export async function calculateFare(from, to, type = "bike", promo = "") {
  if (!RATE_TABLE[type]) throw new Error(`Invalid vehicle type: ${type}`);

  const fromCoords = await geocodeAddress(from);
  const toCoords = await geocodeAddress(to);

  // Get route info (distance + time)
  const routeInfo = await getRouteInfo(fromCoords, toCoords, type);
  const distanceKm = routeInfo.distanceKm;
  
  // Calculate arrival time based on distance and vehicle speed
  const avgSpeed = SPEED_TABLE[type] || 40; // km/h
  const calculatedDurationMin = (distanceKm / avgSpeed) * 60; // Convert hours to minutes
  
  // Use OSRM duration if available, otherwise use calculated duration
  const durationMin = routeInfo.durationMin
    ? Number(routeInfo.durationMin.toFixed(0))
    : Math.ceil(calculatedDurationMin);

  // Calculate arrival time in hours and minutes format (00h:30m)
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;
  const formattedArrival = `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m`;

  // Calculate fare
  const perKm = RATE_TABLE[type];
  let cost = Number((distanceKm * perKm).toFixed(2));

  // Get promo discount from database
  let discount = 0;
  if (promo) {
    discount = await getPromoDiscount(promo);
    if (discount > 0) {
      cost = Number((cost * (1 - discount)).toFixed(2));
    }
  }

  // rideData object
  const rideData = {
    from: fromCoords,
    to: toCoords,
    distanceKm: Number(distanceKm.toFixed(2)),
    durationMin,
    eta: `${durationMin} min`,
    arrivalTime: formattedArrival,
    cost,
    vehicle: type.charAt(0).toUpperCase() + type.slice(1),
    promoApplied: promo && PROMO_CODES[promo] ? promo : null,
    discountPercent: discount ? discount * 100 : 0,
  };

  return rideData;
}
