// Map of timezone to closest major city
const TIMEZONE_TO_CITY: Record<string, string> = {
  // Americas
  "America/New_York": "New York",
  "America/Chicago": "Chicago",
  "America/Denver": "Denver",
  "America/Los_Angeles": "Los Angeles",
  "America/Phoenix": "Phoenix",
  "America/Toronto": "Toronto",
  "America/Vancouver": "Vancouver",
  "America/Mexico_City": "Mexico City",
  "America/Sao_Paulo": "São Paulo",
  "America/Buenos_Aires": "Buenos Aires",
  "America/Santiago": "Santiago",
  "America/Bogota": "Bogotá",
  "America/Lima": "Lima",

  // Europe
  "Europe/London": "London",
  "Europe/Paris": "Paris",
  "Europe/Berlin": "Berlin",
  "Europe/Madrid": "Madrid",
  "Europe/Rome": "Rome",
  "Europe/Amsterdam": "Amsterdam",
  "Europe/Brussels": "Brussels",
  "Europe/Vienna": "Vienna",
  "Europe/Stockholm": "Stockholm",
  "Europe/Oslo": "Oslo",
  "Europe/Copenhagen": "Copenhagen",
  "Europe/Helsinki": "Helsinki",
  "Europe/Warsaw": "Warsaw",
  "Europe/Prague": "Prague",
  "Europe/Budapest": "Budapest",
  "Europe/Zurich": "Zurich",
  "Europe/Dublin": "Dublin",
  "Europe/Lisbon": "Lisbon",
  "Europe/Athens": "Athens",
  "Europe/Istanbul": "Istanbul",
  "Europe/Moscow": "Moscow",

  // Asia
  "Asia/Tokyo": "Tokyo",
  "Asia/Shanghai": "Shanghai",
  "Asia/Hong_Kong": "Hong Kong",
  "Asia/Singapore": "Singapore",
  "Asia/Seoul": "Seoul",
  "Asia/Taipei": "Taipei",
  "Asia/Bangkok": "Bangkok",
  "Asia/Jakarta": "Jakarta",
  "Asia/Manila": "Manila",
  "Asia/Kuala_Lumpur": "Kuala Lumpur",
  "Asia/Ho_Chi_Minh": "Ho Chi Minh City",
  "Asia/Mumbai": "Mumbai",
  "Asia/Kolkata": "Mumbai",
  "Asia/Delhi": "Delhi",
  "Asia/Bangalore": "Bangalore",
  "Asia/Dubai": "Dubai",
  "Asia/Riyadh": "Riyadh",
  "Asia/Tel_Aviv": "Tel Aviv",
  "Asia/Jerusalem": "Jerusalem",

  // Oceania
  "Australia/Sydney": "Sydney",
  "Australia/Melbourne": "Melbourne",
  "Australia/Brisbane": "Brisbane",
  "Australia/Perth": "Perth",
  "Pacific/Auckland": "Auckland",

  // Africa
  "Africa/Cairo": "Cairo",
  "Africa/Johannesburg": "Johannesburg",
  "Africa/Lagos": "Lagos",
  "Africa/Nairobi": "Nairobi",
  "Africa/Casablanca": "Casablanca",
};

const STORAGE_KEY = "trophy-fitness-city";

export function getDefaultCityFromTimezone(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_TO_CITY[timezone] || "London";
  } catch {
    return "London";
  }
}

export function getStoredCity(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredCity(city: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, city);
}

export function getUserCity(): string {
  const stored = getStoredCity();
  if (stored) return stored;
  return getDefaultCityFromTimezone();
}
