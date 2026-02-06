import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserStats, getUserIdFromCookies } from "@/app/actions";
import { Footprints, Bike, Waves, Settings } from "lucide-react";
import { CitySetting } from "@/components/city-setting";

export default async function ProfilePage() {
  const userId = await getUserIdFromCookies();
  const stats = await getUserStats(userId ?? "");

  // Calculate points/XP info
  const totalPoints = stats?.points?.total ?? 0;
  const maxPoints = stats?.points?.maxPoints ?? 1000;
  const progressPercent = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  const pointsToNext = maxPoints - totalPoints;

  // Get metric totals
  const getMetricTotal = (key: string) => {
    const metric = stats?.metrics?.find((m) => m.key === key);
    return metric?.current ?? 0;
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl">ME</AvatarFallback>
          </Avatar>
          {stats?.points && (
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold border-2 border-background">
              {totalPoints.toLocaleString()} XP
            </div>
          )}
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Athlete Profile</h1>
          <p className="text-muted-foreground text-sm">
            {stats?.streak?.length ?? 0} day streak
          </p>
        </div>

        {/* XP Bar */}
        {stats?.points && (
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>{totalPoints.toLocaleString()} XP</span>
              {maxPoints && <span>{maxPoints.toLocaleString()} XP</span>}
            </div>
            <Progress value={progressPercent} className="h-3" />
            {maxPoints && pointsToNext > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                {pointsToNext.toLocaleString()} XP to go
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Footprints className="w-6 h-6 text-blue-500" />
            <div>
              <div className="text-xl font-bold">
                {getMetricTotal("distance_run").toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Run (km)</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Bike className="w-6 h-6 text-green-500" />
            <div>
              <div className="text-xl font-bold">
                {getMetricTotal("distance_cycled").toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Cycle (km)</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Waves className="w-6 h-6 text-cyan-500" />
            <div>
              <div className="text-xl font-bold">
                {getMetricTotal("distance_swum").toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Swim (m)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" /> Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CitySetting />
        </CardContent>
      </Card>
    </div>
  );
}
