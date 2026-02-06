import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserStats } from "@/app/actions";
import { Footprints, Bike, Waves, Award } from "lucide-react";

export default async function ProfilePage() {
  const stats = await getUserStats("current_user");

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

  // Split achievements into earned and locked
  const earnedAchievements =
    stats?.achievements?.filter((a) => a.achievedAt) ?? [];
  const lockedAchievements =
    stats?.achievements?.filter((a) => !a.achievedAt) ?? [];

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

      {/* Badges & Achievements */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5" /> Achievements
        </h2>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">
              Earned ({earnedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({lockedAchievements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Earned Achievements */}
            {earnedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="group hover:scale-105 transition-transform duration-200 bg-primary/10 border-primary/30"
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  {achievement.badgeUrl ? (
                    <img
                      src={achievement.badgeUrl}
                      alt={achievement.name}
                      className="w-12 h-12 filter drop-shadow-lg group-hover:animate-bounce"
                    />
                  ) : (
                    <div className="text-4xl filter drop-shadow-lg group-hover:animate-bounce">
                      🏆
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm">{achievement.name}</div>
                    {achievement.achievedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Unlocked{" "}
                        {new Date(achievement.achievedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Locked Achievements */}
            {lockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="opacity-50 grayscale border-dashed"
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className="text-4xl">🔒</div>
                  <div>
                    <div className="font-bold text-sm">{achievement.name}</div>
                    {achievement.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty state */}
            {earnedAchievements.length === 0 &&
              lockedAchievements.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No achievements available yet. Keep working out to earn badges!
                </div>
              )}
          </TabsContent>

          <TabsContent
            value="earned"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {earnedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="group hover:scale-105 transition-transform duration-200 bg-primary/10 border-primary/30"
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  {achievement.badgeUrl ? (
                    <img
                      src={achievement.badgeUrl}
                      alt={achievement.name}
                      className="w-12 h-12 filter drop-shadow-lg group-hover:animate-bounce"
                    />
                  ) : (
                    <div className="text-4xl filter drop-shadow-lg group-hover:animate-bounce">
                      🏆
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm">{achievement.name}</div>
                    {achievement.achievedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Unlocked{" "}
                        {new Date(achievement.achievedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {earnedAchievements.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No achievements earned yet. Keep working out!
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="locked"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {lockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="opacity-50 grayscale border-dashed"
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className="text-4xl">🔒</div>
                  <div>
                    <div className="font-bold text-sm">{achievement.name}</div>
                    {achievement.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {lockedAchievements.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                All achievements unlocked! Congratulations! 🎉
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
