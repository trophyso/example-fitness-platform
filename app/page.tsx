import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Footprints, Bike, Waves, Zap, TrendingUp, Plus } from "lucide-react";
import { getUserStats, getUserIdFromCookies, getRecentActivities } from "./actions";
import { getLevelInfo } from "@/lib/constants";
import { LogActivityDialog } from "@/components/log-activity-dialog";

const activityConfig = {
  run: { icon: Footprints, color: "text-blue-500", label: "Run" },
  cycle: { icon: Bike, color: "text-emerald-500", label: "Cycle" },
  swim: { icon: Waves, color: "text-cyan-500", label: "Swim" },
};

function formatActivityDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export default async function Dashboard() {
  const userId = await getUserIdFromCookies();
  const [stats, recentActivities] = await Promise.all([
    getUserStats(userId ?? ""),
    getRecentActivities(userId ?? ""),
  ]);

  // Calculate streak info
  const streakLength = stats?.streak?.length ?? 0;
  const streakActive = streakLength > 0;

  // Calculate points/XP and level info
  const totalXP = stats?.points?.total ?? 0;
  const levelInfo = getLevelInfo(totalXP);

  // Get metric totals for today's activity display
  const getMetricTotal = (key: string) => {
    const metric = stats?.metrics?.find((m) => m.key === key);
    return metric?.current ?? 0;
  };

  // Find next incomplete achievement
  const nextAchievement = stats?.achievements?.find((a) => !a.achievedAt);

  return (
    <div className="space-y-8">
      {/* Level & Streak Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Level {levelInfo.currentLevel.level}</div>
              <div className="font-semibold text-lg leading-tight">{levelInfo.currentLevel.name}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Progress value={levelInfo.progressToNextLevel} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{totalXP.toLocaleString()} XP</span>
              {levelInfo.nextLevel && (
                <span>{levelInfo.xpRequiredForNextLevel - levelInfo.xpInCurrentLevel} XP to {levelInfo.nextLevel.name}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-100 dark:border-orange-900/30">
          <Flame
            className={`w-7 h-7 ${streakActive
              ? "text-orange-500 fill-orange-500"
              : "text-muted-foreground"
              }`}
          />
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{streakLength}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">day streak</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-soft border-0 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/40 dark:to-blue-950/20">
          <CardContent className="p-4 text-center">
            <Footprints className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {getMetricTotal("distance_run").toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">km run</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-0 bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-950/40 dark:to-emerald-950/20">
          <CardContent className="p-4 text-center">
            <Bike className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {getMetricTotal("distance_cycled").toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">km cycled</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-0 bg-gradient-to-br from-cyan-50 to-cyan-50/50 dark:from-cyan-950/40 dark:to-cyan-950/20">
          <CardContent className="p-4 text-center">
            <Waves className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {getMetricTotal("distance_swum").toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">m swum</div>
          </CardContent>
        </Card>
      </div>

      {/* Next Badge Teaser */}
      {nextAchievement && (
        <Card className="shadow-soft border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <CardContent className="p-5 flex items-center gap-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-primary uppercase tracking-wide mb-0.5">Next Badge</div>
              <h4 className="font-semibold truncate">
                {nextAchievement.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {nextAchievement.trigger === "streak" && nextAchievement.streakLength && (
                  <>Maintain a {nextAchievement.streakLength}-day streak</>
                )}
                {nextAchievement.trigger === "metric" && nextAchievement.metricValue && (
                  <>
                    Reach {nextAchievement.metricValue.toLocaleString()}{" "}
                    {nextAchievement.metricName ?? "points"}
                  </>
                )}
                {nextAchievement.trigger === "api" && nextAchievement.description}
                {!nextAchievement.trigger && nextAchievement.description}
              </p>
            </div>
            <LogActivityDialog>
              <Button size="lg" className="flex-shrink-0 gap-1.5 shadow-soft">
                <Plus className="w-4 h-4" />
                Log Workout
              </Button>
            </LogActivityDialog>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            Recent Activity
          </h3>
        </div>
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent activities. Log your first workout to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/40 shadow-soft hover:shadow-soft-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatActivityDate(activity.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      {activity.type === "swim" ? activity.value.toFixed(0) : activity.value.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {activity.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
