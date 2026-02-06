import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Activity, Footprints, Bike, Waves } from "lucide-react";
import { getUserStats } from "./actions";

// Mock Data for specific dashboard elements
const recentActivities = [
  { id: 1, type: "run", distance: 5.2, unit: "km", time: "Today, 8:00 AM", icon: Footprints },
  { id: 2, type: "cycle", distance: 24.5, unit: "km", time: "Yesterday, 6:30 PM", icon: Bike },
  { id: 3, type: "swim", distance: 1200, unit: "m", time: "Feb 4, 7:00 AM", icon: Waves },
];

export default async function Dashboard() {
  const stats = await getUserStats("current_user"); // Hardcoded ID for demo

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-bold text-lg">Lvl {stats.level} Athlete</span>
            <span className="text-xs text-muted-foreground">{stats.xp} / {stats.nextLevelXp} XP</span>
          </div>
          <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="h-2 bg-secondary" />
        </div>
        <div className="flex flex-col items-center">
          <Flame className={`w-8 h-8 ${stats.streakActive ? "text-orange-500 fill-orange-500 animate-pulse" : "text-muted-foreground"}`} />
          <span className="text-xs font-bold">{stats.streak} Day Streak</span>
        </div>
      </div>

      {/* Main Card: Today's Summary */}
      <Card className="bg-gradient-to-br from-card to-secondary/50 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Today's Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">5.2</div>
              <div className="text-xs text-muted-foreground">Run (km)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-xs text-muted-foreground">Cycle (km)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">0</div>
              <div className="text-xs text-muted-foreground">Swim (m)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Badge Teaser */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-full">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Next Badge: Marathoner</h4>
            <p className="text-xs text-muted-foreground">You are 2km away from unlocking this!</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-secondary`}>
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="font-medium capitalize">{activity.type}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
                <div className="font-bold text-right">
                  {activity.distance}
                  <span className="text-xs text-muted-foreground ml-1">{activity.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
