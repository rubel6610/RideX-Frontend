import fetch from "node-fetch";

// Static BDT per km rates
const RATE_TABLE = {
  bike: 12,
  cng: 20,
  car: 35,
};

// Address -> Coordinates using Nominatim
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  const res = await fetch(url, { headers: { "User-Agent": "ride-app" } });
  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error(`Coordinates not found for: ${address}`);
  }

  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// Haversine distance
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

// Main function
export async function calculateFare(from, to, type = "bike") {
  if (!RATE_TABLE[type]) throw new Error(`Invalid vehicle type: ${type}`);

  const fromCoords = await geocodeAddress(from);
  const toCoords = await geocodeAddress(to);

  const distanceKm = haversine(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
  const perKm = RATE_TABLE[type];
  const cost = Number((distanceKm * perKm).toFixed(2));

  // rideData object
  const rideData = {
    from: fromCoords,
    to: toCoords,
    distanceKm: Number(distanceKm.toFixed(2)),
    cost,
    vehicle: type.charAt(0).toUpperCase() + type.slice(1)
  };

  return rideData; // ✅ direct JS object
}