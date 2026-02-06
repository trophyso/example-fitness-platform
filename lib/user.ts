const USER_ID_KEY = "trophy-fitness-user-id";
const USER_NAME_KEY = "trophy-fitness-user-name";

// Random name generation
const ADJECTIVES = [
  "Swift", "Mighty", "Blazing", "Iron", "Golden", "Silver", "Thunder",
  "Lightning", "Cosmic", "Epic", "Fierce", "Bold", "Brave", "Wild",
  "Rapid", "Power", "Super", "Ultra", "Mega", "Turbo", "Hyper", "Alpha",
  "Prime", "Elite", "Pro", "Zen", "Cool", "Rad", "Ace", "Star"
];

const NOUNS = [
  "Runner", "Cyclist", "Swimmer", "Athlete", "Champion", "Racer", "Sprinter",
  "Tiger", "Eagle", "Falcon", "Phoenix", "Dragon", "Wolf", "Bear", "Lion",
  "Shark", "Panther", "Hawk", "Cheetah", "Gazelle", "Dolphin", "Otter",
  "Ninja", "Warrior", "Legend", "Hero", "Titan", "Force", "Storm", "Flash"
];

function generateRandomName(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}${noun}${number}`;
}

// Client-side: get or create user ID and name in localStorage and sync to cookie
export function getUserId(): string {
  if (typeof window === "undefined") {
    throw new Error("getUserId can only be called on the client");
  }

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);

    // Also generate a name for new users
    const userName = generateRandomName();
    localStorage.setItem(USER_NAME_KEY, userName);
  }

  // Sync to cookie for server-side access
  document.cookie = `${USER_ID_KEY}=${userId}; path=/; max-age=31536000; SameSite=Lax`;

  return userId;
}

// Client-side: get user name
export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_NAME_KEY);
}

// Client-side: set user name
export function setUserName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_NAME_KEY, name);
}

// Client-side: get stored user ID without creating
export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}
