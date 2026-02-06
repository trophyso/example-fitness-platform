import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserStats, getUserIdFromCookies } from "@/app/actions";
import { Award } from "lucide-react";

export default async function AchievementsPage() {
  const userId = await getUserIdFromCookies();
  const stats = await getUserStats(userId ?? "");

  // Split achievements into earned and locked
  const earnedAchievements =
    stats?.achievements?.filter((a) => a.achievedAt) ?? [];
  const lockedAchievements =
    stats?.achievements?.filter((a) => !a.achievedAt) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" /> Achievements
        </h1>
        <div className="text-sm text-muted-foreground">
          {earnedAchievements.length} earned
        </div>
      </div>

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
  );
}
