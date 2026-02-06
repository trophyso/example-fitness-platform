"use server";

import { TrophyApiClient, TrophyApi } from "@trophyso/node";
import { revalidatePath } from "next/cache";
import { LogActivityParams, UserStats } from "@/lib/types";

// Initialize Trophy SDK
const trophy = new TrophyApiClient({
  apiKey: process.env.TROPHY_API_KEY as string,
});

export async function identifyUser(userId: string, name?: string, tz?: string) {
  if (!process.env.TROPHY_API_KEY) {
    return { success: false, error: "API key not configured" };
  }

  try {
    const user = await trophy.users.identify(userId, {
      name,
      tz,
    });
    return { success: true, user };
  } catch (error) {
    console.error("Failed to identify user:", error);
    return { success: false, error: "Failed to identify user" };
  }
}

export async function updateUserCity(userId: string, city: string) {
  if (!process.env.TROPHY_API_KEY) {
    return { success: false, error: "API key not configured" };
  }

  try {
    const user = await trophy.users.update(userId, {
      attributes: { city },
    });
    return { success: true, user };
  } catch (error) {
    console.error("Failed to update user city:", error);
    return { success: false, error: "Failed to update user city" };
  }
}

export async function logActivity(params: LogActivityParams) {
  if (!process.env.TROPHY_API_KEY) {
    console.warn("Missing TROPHY_API_KEY");
    return { success: false, error: "API key not configured" };
  }

  const { type, distance, city, pace, style, userId } = params;

  let metricKey = "";
  const eventAttributes: Record<string, string> = {};

  switch (type) {
    case "run":
      metricKey = "distance_run";
      if (pace) eventAttributes.pace = pace;
      break;
    case "cycle":
      metricKey = "distance_cycled";
      break;
    case "swim":
      metricKey = "distance_swum";
      if (style) eventAttributes.style = style;
      break;
  }

  // City is a user attribute, not an event attribute
  const userAttributes: Record<string, string> = {};
  if (city) userAttributes.city = city;

  try {
    const response = await trophy.metrics.event(metricKey, {
      user: {
        id: userId,
        attributes:
          Object.keys(userAttributes).length > 0 ? userAttributes : undefined,
      },
      value: distance,
      attributes:
        Object.keys(eventAttributes).length > 0 ? eventAttributes : undefined,
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

export async function getLeaderboard(
  leaderboardKey: string,
  city?: string,
): Promise<TrophyApi.LeaderboardRanking[]> {
  if (!process.env.TROPHY_API_KEY) return [];

  try {
    const response = await trophy.leaderboards.get(leaderboardKey, {
      userAttributes: city ? `city:${city}` : undefined,
    });
    return response.rankings || [];
  } catch (error) {
    console.error(`Failed to fetch leaderboard for ${leaderboardKey}:`, error);
    return [];
  }
}

// Server-side: get user ID from cookies
export async function getUserIdFromCookies(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get("trophy-fitness-user-id")?.value ?? null;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!process.env.TROPHY_API_KEY || !userId) {
    // Return mock data so the UI doesn't crash during development without API key
    return {
      streak: null,
      achievements: [],
      points: null,
      metrics: [],
    };
  }

  try {
    // Fetch all user data in parallel
    const [streak, achievements, metrics] = await Promise.all([
      trophy.users.streak(userId).catch(() => null),
      trophy.users
        .achievements(userId, { includeIncomplete: "true" })
        .catch(() => []),
      trophy.users.allMetrics(userId).catch(() => []),
    ]);

    // Try to get points (may not be configured)
    let pointsResponse: TrophyApi.GetUserPointsResponse | null = null;
    try {
      pointsResponse = await trophy.users.points(userId, "xp");
    } catch {
      // Points system might not be configured
    }

    return {
      streak,
      achievements,
      points: pointsResponse,
      metrics,
    };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return null;
  }
}
