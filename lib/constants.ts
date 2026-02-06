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
