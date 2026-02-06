import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Footprints, Bike, Waves } from "lucide-react";
import { getLeaderboard } from "@/app/actions";
import { LEADERBOARD_KEYS } from "@/lib/constants";

async function LeaderboardList({
  leaderboardKey,
  unit,
}: {
  leaderboardKey: string;
  unit: string;
}) {
  const data = await getLeaderboard(leaderboardKey);

  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No rankings yet. Be the first to log an activity!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((entry, index) => {
        const displayName =
          entry.userName || `User ${entry.userId.slice(0, 8)}`;
        const initials = displayName.slice(0, 2).toUpperCase();

        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-4 rounded-xl border ${
              index < 3
                ? "bg-gradient-to-r from-card to-secondary/20 border-primary/20"
                : "bg-card border-border/50"
            }`}
          >
            <div className="flex-none w-8 font-bold text-center text-lg text-muted-foreground">
              {entry.rank}
            </div>
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{displayName}</div>
            </div>
            <div className="font-bold text-lg">
              {entry.value.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </div>
            {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
            {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
            {index === 2 && <Trophy className="w-5 h-5 text-amber-600" />}
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" /> Leaderboards
        </h1>
      </div>

      <Tabs defaultValue="run" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="run" className="gap-2">
            <Footprints className="w-4 h-4" /> Run
          </TabsTrigger>
          <TabsTrigger value="cycle" className="gap-2">
            <Bike className="w-4 h-4" /> Cycle
          </TabsTrigger>
          <TabsTrigger value="swim" className="gap-2">
            <Waves className="w-4 h-4" /> Swim
          </TabsTrigger>
        </TabsList>

        <TabsContent value="run">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Weekly Distance Run</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LeaderboardList leaderboardKey={LEADERBOARD_KEYS.run} unit="km" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Weekly Distance Cycled</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LeaderboardList
                leaderboardKey={LEADERBOARD_KEYS.cycle}
                unit="km"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swim">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Weekly Distance Swum</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LeaderboardList
                leaderboardKey={LEADERBOARD_KEYS.swim}
                unit="m"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
