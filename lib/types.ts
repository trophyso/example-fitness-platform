import { TrophyApi } from "@trophyso/node";
import { ActivityType } from "./constants";

export interface LogActivityParams {
  type: ActivityType;
  distance: number;
  city?: string;
  pace?: "walk" | "run";
  style?: "freestyle" | "breaststroke";
  userId: string;
}

export interface UserStats {
  streak: TrophyApi.StreakResponse | null;
  achievements: TrophyApi.UserAchievementWithStatsResponse[];
  points: TrophyApi.GetUserPointsResponse | null;
  metrics: TrophyApi.MetricResponse[];
}
