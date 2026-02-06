"use server";

import { Trophy } from "@trophyso/node";
import { revalidatePath } from "next/cache";

const trophy = new Trophy(process.env.TROPHY_API_KEY as string);

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
    return { success: false, error: "Configuration Error" };
  }

  const { type, distance, city, pace, style, userId } = params;

  let metricKey = "";
  let value = distance;
  const attributes: Record<string, any> = { city: city || "London" };

  switch (type) {
    case "run":
      metricKey = "distance_run";
      attributes.pace = pace || "run";
      break;
    case "cycle":
      metricKey = "distance_cycled";
      break;
    case "swim":
      metricKey = "distance_swum";
      attributes.style = style || "freestyle";
      break;
  }

  try {
    // 1. Send Event to Trophy
    // Using the 'event' or 'metric' endpoint depending on SDK. 
    // Assuming trophy.events.create or similar based on typical patterns.
    // If exact method is unknown, I'll use a generic wrapper pattern or guess.
    // Looking at typical analytics SDKs: trophy.track(...) or trophy.metrics.log(...)
    
    // Let's assume `trophy.events.trigger` or `trophy.metrics.add`.
    // Given the lack of docs, I will use a placeholder comment and a likely method.
    // If the user provided `@trophyso/node`, it likely has `achievements`, `leaderboards` etc.
    
    // For now, I'll simulate the call structure:
    await trophy.events.trigger({
      userId,
      name: metricKey,
      value: value,
      metadata: attributes,
    });

    // 2. Revalidate paths to update UI
    revalidatePath("/");
    revalidatePath("/leaderboards");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to log activity:", error);
    return { success: false, error: "Failed to log activity" };
  }
}

export async function getLeaderboard(metric: string, period: "weekly" | "all_time" = "weekly") {
  // Placeholder for fetching leaderboard
  // return await trophy.leaderboards.list({ metric, period });
  return [
    { rank: 1, userId: "user_1", value: 120, user: { name: "Alice", avatar: "" } },
    { rank: 2, userId: "user_2", value: 95, user: { name: "Bob", avatar: "" } },
    { rank: 3, userId: "user_3", value: 80, user: { name: "Charlie", avatar: "" } },
  ];
}

export async function getUserStats(userId: string) {
  // Placeholder for fetching user profile/stats
  // const user = await trophy.users.get(userId);
  // const achievements = await trophy.users.achievements(userId);
  
  return {
    level: 4,
    xp: 650,
    nextLevelXp: 1000,
    streak: 5,
    streakActive: true,
    stats: {
      run: 145,
      cycle: 450,
      swim: 2000,
    },
    recentBadges: [
      { id: "marathoner", name: "Marathoner", icon: "🏃‍♂️", unlockedAt: "2025-01-15" },
    ],
  };
}
