import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserStats, getUserIdFromCookies } from "@/app/actions";
import { Footprints, Bike, Waves, Settings, Flame, Zap } from "lucide-react";
import { CitySetting } from "@/components/city-setting";
import { getLevelInfo } from "@/lib/constants";

export default async function ProfilePage() {
  const userId = await getUserIdFromCookies();
  const stats = await getUserStats(userId ?? "");

  // Calculate points/XP and level info
  const totalXP = stats?.points?.total ?? 0;
  const levelInfo = getLevelInfo(totalXP);
  const streakLength = stats?.streak?.length ?? 0;

  // Get metric totals
  const getMetricTotal = (key: string) => {
    const metric = stats?.metrics?.find((m) => m.key === key);
    return metric?.current ?? 0;
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="absolute inset-0 h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl" />
        <div className="relative pt-8 pb-4 flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-soft-lg ring-4 ring-primary/10">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-soft border-2 border-background">
              <span className="text-xs font-bold text-primary-foreground">{levelInfo.currentLevel.level}</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">Athlete Profile</h1>
          <div className="flex items-center gap-1 text-primary font-medium text-sm">
            <Zap className="w-4 h-4" />
            {levelInfo.currentLevel.name}
          </div>
        </div>
      </div>

      {/* XP Progress Card */}
      <Card className="shadow-soft border-0">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Experience Points</div>
              <div className="text-2xl font-bold">{totalXP.toLocaleString()} <span className="text-base font-normal text-muted-foreground">XP</span></div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/30">
              <Flame className={`w-5 h-5 ${streakLength > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground"}`} />
              <div className="text-right">
                <div className="font-bold text-orange-600 dark:text-orange-400">{streakLength}</div>
                <div className="text-[10px] text-muted-foreground uppercase">days</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={levelInfo.progressToNextLevel} className="h-2.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {levelInfo.currentLevel.level}</span>
              {levelInfo.nextLevel ? (
                <span>{levelInfo.xpRequiredForNextLevel - levelInfo.xpInCurrentLevel} XP to Level {levelInfo.nextLevel.level}</span>
              ) : (
                <span>Max level reached!</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">Lifetime Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-soft border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-card">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-1">
                <Footprints className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {getMetricTotal("distance_run").toFixed(1)}
              </div>
              <div className="text-[11px] text-muted-foreground">km run</div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-card">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-1">
                <Bike className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {getMetricTotal("distance_cycled").toFixed(1)}
              </div>
              <div className="text-[11px] text-muted-foreground">km cycled</div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-0 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/40 dark:to-card">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center mb-1">
                <Waves className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                {getMetricTotal("distance_swum").toFixed(0)}
              </div>
              <div className="text-[11px] text-muted-foreground">m swum</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings */}
      <Card className="shadow-soft border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" /> Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CitySetting />
        </CardContent>
      </Card>
    </div>
  );
}
