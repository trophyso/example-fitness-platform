import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Activity, Footprints, Bike, Waves } from "lucide-react";
import { getUserStats } from "./actions";

// Recent activities would come from a real activity log in production
const recentActivities = [
  { id: 1, type: "run", distance: 5.2, unit: "km", time: "Today, 8:00 AM", icon: Footprints },
  { id: 2, type: "cycle", distance: 24.5, unit: "km", time: "Yesterday, 6:30 PM", icon: Bike },
  { id: 3, type: "swim", distance: 1200, unit: "m", time: "Feb 4, 7:00 AM", icon: Waves },
];

export default async function Dashboard() {
  const stats = await getUserStats("current_user");

  // Calculate streak info
  const streakLength = stats?.streak?.length ?? 0;
  const streakActive = streakLength > 0;

  // Calculate points/XP info
  const totalPoints = stats?.points?.total ?? 0;
  const maxPoints = stats?.points?.maxPoints ?? 1000;
  const progressPercent = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

  // Get metric totals for today's activity display
  const getMetricTotal = (key: string) => {
    const metric = stats?.metrics?.find((m) => m.key === key);
    return metric?.current ?? 0;
  };

  // Find next incomplete achievement
  const nextAchievement = stats?.achievements?.find((a) => !a.achievedAt);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-bold text-lg">
              {stats?.points?.name ?? "XP"}
            </span>
            <span className="text-xs text-muted-foreground">
              {totalPoints.toLocaleString()} {maxPoints ? `/ ${maxPoints.toLocaleString()}` : ""} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-secondary" />
        </div>
        <div className="flex flex-col items-center">
          <Flame
            className={`w-8 h-8 ${streakActive
              ? "text-orange-500 fill-orange-500 animate-pulse"
              : "text-muted-foreground"
              }`}
          />
          <span className="text-xs font-bold">{streakLength} Days</span>
        </div>
      </div>

      {/* Main Card: Activity Summary */}
      <Card className="bg-gradient-to-br from-card to-secondary/50 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {getMetricTotal("distance_run").toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Run (km)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {getMetricTotal("distance_cycled").toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Cycle (km)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {getMetricTotal("distance_swum").toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Swim (m)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Badge Teaser */}
      {nextAchievement && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                Next Badge: {nextAchievement.name}
              </h4>
              {nextAchievement.description && (
                <p className="text-xs text-muted-foreground">
                  {nextAchievement.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-secondary`}>
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="font-medium capitalize">{activity.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-right">
                  {activity.distance}
                  <span className="text-xs text-muted-foreground ml-1">
                    {activity.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
