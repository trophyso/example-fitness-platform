// Leaderboard keys for each activity type
export const LEADERBOARD_KEYS = {
  run: "weekly-distance-run",
  runCities: "weekly-distance-run-cities",
  cycle: "weekly-distance-cycled",
  cycleCities: "weekly-distance-cycled-cities",
  swim: "weekly-distance-swum",
  swimCities: "weekly-distance-swum-cities",
} as const;

export type ActivityType = "run" | "cycle" | "swim";

// XP Levels and thresholds
export const LEVELS = [
  { level: 1, xpThreshold: 0, name: "Rookie" },
  { level: 2, xpThreshold: 100, name: "Active" },
  { level: 3, xpThreshold: 500, name: "Mover" },
  { level: 4, xpThreshold: 2500, name: "Athlete" },
  { level: 5, xpThreshold: 10000, name: "Pro" },
] as const;

export type Level = (typeof LEVELS)[number];

/**
 * Get the user's current level info based on their XP
 */
export function getLevelInfo(xp: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  progressToNextLevel: number; // 0-100 percentage
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
} {
  // Find the highest level the user has reached
  let currentLevelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpThreshold) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null;

  // Calculate progress within the current level bracket
  const xpInCurrentLevel = xp - currentLevel.xpThreshold;
  const xpRequiredForNextLevel = nextLevel
    ? nextLevel.xpThreshold - currentLevel.xpThreshold
    : 0;

  const progressToNextLevel = nextLevel
    ? (xpInCurrentLevel / xpRequiredForNextLevel) * 100
    : 100; // Max level reached

  return {
    currentLevel,
    nextLevel,
    progressToNextLevel: Math.min(progressToNextLevel, 100),
    xpInCurrentLevel,
    xpRequiredForNextLevel,
  };
}
