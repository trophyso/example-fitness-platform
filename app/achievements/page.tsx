import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserStats, getUserIdFromCookies } from "@/app/actions";
import { Award, Lock, CheckCircle2, Sparkles } from "lucide-react";

export default async function AchievementsPage() {
  const userId = await getUserIdFromCookies();
  const stats = await getUserStats(userId ?? "");

  // Split achievements into earned and locked
  const earnedAchievements =
    stats?.achievements?.filter((a) => a.achievedAt) ?? [];
  const lockedAchievements =
    stats?.achievements?.filter((a) => !a.achievedAt) ?? [];

  const AchievementCard = ({
    achievement,
    isEarned,
  }: {
    achievement: (typeof earnedAchievements)[0];
    isEarned: boolean;
  }) => (
    <Card
      className={`group transition-all duration-300 border-0 shadow-soft hover:shadow-soft-lg ${
        isEarned
          ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
          : "bg-secondary/50"
      }`}
    >
      <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
        <div
          className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${
            isEarned
              ? "bg-gradient-to-br from-primary/20 to-primary/10"
              : "bg-muted"
          }`}
        >
          {achievement.badgeUrl ? (
            <img
              src={achievement.badgeUrl}
              alt={achievement.name}
              className={`w-10 h-10 ${!isEarned && "grayscale opacity-40"}`}
            />
          ) : isEarned ? (
            <Award className="w-8 h-8 text-primary" />
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
          {isEarned && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <div className={`font-semibold text-sm ${!isEarned && "text-muted-foreground"}`}>
            {achievement.name}
          </div>
          {isEarned && achievement.achievedAt ? (
            <div className="text-[11px] text-primary font-medium">
              {new Date(achievement.achievedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          ) : (
            achievement.description && (
              <div className="text-[11px] text-muted-foreground line-clamp-2">
                {achievement.description}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Achievements</h1>
            <p className="text-sm text-muted-foreground">
              {earnedAchievements.length} of{" "}
              {earnedAchievements.length + lockedAchievements.length} unlocked
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-secondary/50 p-1">
          <TabsTrigger value="all" className="text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="earned" className="text-sm">
            Earned
          </TabsTrigger>
          <TabsTrigger value="locked" className="text-sm">
            Locked
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="all"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {earnedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isEarned={true}
            />
          ))}
          {lockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isEarned={false}
            />
          ))}
          {earnedAchievements.length === 0 &&
            lockedAchievements.length === 0 && (
              <EmptyState message="No achievements available yet. Keep working out to earn badges!" />
            )}
        </TabsContent>

        <TabsContent
          value="earned"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {earnedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isEarned={true}
            />
          ))}
          {earnedAchievements.length === 0 && (
            <EmptyState message="No achievements earned yet. Complete challenges to unlock your first badge!" />
          )}
        </TabsContent>

        <TabsContent
          value="locked"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {lockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isEarned={false}
            />
          ))}
          {lockedAchievements.length === 0 && (
            <EmptyState message="All achievements unlocked! You're a true champion!" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
