"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Footprints, Bike, Waves, Globe, MapPin } from "lucide-react";
import { getLeaderboard } from "@/app/actions";
import { LEADERBOARD_KEYS } from "@/lib/constants";
import { getUserCity } from "@/lib/city";
import { TrophyApi } from "@trophyso/node";

type LeaderboardScope = "global" | "city";

function LeaderboardList({
  data,
  unit,
  isLoading,
}: {
  data: TrophyApi.LeaderboardRanking[];
  unit: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border bg-card border-border/50 animate-pulse"
          >
            <div className="w-8 h-6 bg-muted rounded" />
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

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
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [activeTab, setActiveTab] = useState<"run" | "cycle" | "swim">("run");
  const [city, setCity] = useState<string>("");
  const [data, setData] = useState<TrophyApi.LeaderboardRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get city on mount
  useEffect(() => {
    setCity(getUserCity());
  }, []);

  // Fetch leaderboard data when scope, tab, or city changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let leaderboardKey: string;
      let cityParam: string | undefined;

      if (scope === "city" && city) {
        // Use city leaderboards
        switch (activeTab) {
          case "run":
            leaderboardKey = LEADERBOARD_KEYS.runCities;
            break;
          case "cycle":
            leaderboardKey = LEADERBOARD_KEYS.cycleCities;
            break;
          case "swim":
            leaderboardKey = LEADERBOARD_KEYS.swimCities;
            break;
        }
        cityParam = city;
      } else {
        // Use global leaderboards
        switch (activeTab) {
          case "run":
            leaderboardKey = LEADERBOARD_KEYS.run;
            break;
          case "cycle":
            leaderboardKey = LEADERBOARD_KEYS.cycle;
            break;
          case "swim":
            leaderboardKey = LEADERBOARD_KEYS.swim;
            break;
        }
      }

      const result = await getLeaderboard(leaderboardKey, cityParam);
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, [scope, activeTab, city]);

  const getUnit = () => (activeTab === "swim" ? "m" : "km");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" /> Leaderboards
        </h1>
      </div>

      {/* Scope Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setScope("global")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            scope === "global"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <Globe className="w-4 h-4" />
          Global
        </button>
        <button
          onClick={() => setScope("city")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            scope === "city"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {city || "Your City"}
        </button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "run" | "cycle" | "swim")}
        className="w-full"
      >
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
              <CardTitle className="text-lg">
                Weekly Distance Run
                {scope === "city" && city && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    in {city}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LeaderboardList
                data={data}
                unit={getUnit()}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">
                Weekly Distance Cycled
                {scope === "city" && city && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    in {city}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LeaderboardList
                data={data}
                unit={getUnit()}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swim">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">
                Weekly Distance Swum
                {scope === "city" && city && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    in {city}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <LeaderboardList
                data={data}
                unit={getUnit()}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
