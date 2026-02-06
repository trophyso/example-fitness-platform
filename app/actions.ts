"use server";

import { TrophyApiClient } from "@trophyso/node";
import { revalidatePath } from "next/cache";

// Initialize Trophy SDK
// In a real app, ensure TROPHY_API_KEY is set in .env.local
const trophy = new TrophyApiClient({
  apiKey: process.env.TROPHY_API_KEY as string,
});

export type ActivityType = "run" | "cycle" | "swim";

interface LogActivityParams {
  type: ActivityType;
  distance: number; // in correct units (km or m)
  city?: string;
  pace?: "walk" | "run";
  style?: "freestyle" | "breaststroke";
  userId: string;
}

export async function logActivity(params: LogActivityParams) {
  if (!process.env.TROPHY_API_KEY) {
    console.warn("Missing TROPHY_API_KEY");
    // Return mock success for demo purposes if no key
    // return { success: true, mock: true };
  }

  const { type, distance, city, pace, style, userId } = params;

  let metricKey = "";
  // Ensure we use the correct metric keys from our Spec
  const attributes: Record<string, string> = {};

  if (city) attributes.city = city;

  switch (type) {
    case "run":
      metricKey = "distance_run";
      if (pace) attributes.pace = pace;
      break;
    case "cycle":
      metricKey = "distance_cycled";
      break;
    case "swim":
      metricKey = "distance_swum";
      if (style) attributes.style = style;
      break;
  }

  try {
    const response = await trophy.metrics.event(metricKey, {
      user: {
        id: userId,
        // In a real app, you might send email/name here if it's the first time
        // email: "user@example.com", 
      },
      value: distance,
      attributes: attributes,
    });

    // Revalidate all pages that show gamification data
    revalidatePath("/");
    revalidatePath("/leaderboards");
    revalidatePath("/profile");

    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to log activity:", error);
    return { success: false, error: "Failed to log activity" };
  }
}

export async function getLeaderboard(metricKey: string) {
  if (!process.env.TROPHY_API_KEY) return [];

  try {
    // Fetch global leaderboard for the metric
    const response = await trophy.leaderboards.get(metricKey);
    return response.rankings || [];
  } catch (error) {
    console.error(`Failed to fetch leaderboard for ${metricKey}:`, error);
    return [];
  }
}

export async function getUserStats(userId: string) {
  if (!process.env.TROPHY_API_KEY) {
    // Return mock data so the UI doesn't crash during development without API key
    return {
      streak: { length: 0, active: false },
      achievements: [],
      xp: 0,
      level: 1,
    };
  }

  try {
    // 1. Get Streak
    const streak = await trophy.users.streak(userId);
    
    // 2. Get Achievements
    const achievements = await trophy.users.achievements(userId);

    // 3. Get Points/Level (Using the default 'points' system key usually, or custom if defined)
    // Assuming a global 'xp' system or similar. For now, we'll try to get points.
    // If 'points' isn't set up, this might fail, so handle gracefully.
    let pointsResponse = null;
    try {
        pointsResponse = await trophy.users.points(userId, "xp"); // Assuming key is 'xp' per spec concept
    } catch (e) {
        // Points might not be configured yet
    }

    return {
      streak: streak,
      achievements: achievements,
      points: pointsResponse,
    };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return null;
  }
}
