"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Footprints, Bike, Waves, Globe, MapPin, Medal, Users } from "lucide-react";
import { getLeaderboard } from "@/app/actions";
import { LEADERBOARD_KEYS } from "@/lib/constants";
import { getUserCity } from "@/lib/city";
import { TrophyApi } from "@trophyso/node";

type LeaderboardScope = "global" | "city";

const rankStyles = {
  1: {
    bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30",
    border: "border-amber-200 dark:border-amber-800/50",
    rank: "bg-gradient-to-br from-amber-400 to-yellow-500 text-white",
    icon: "text-amber-500",
  },
  2: {
    bg: "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-gray-950/30",
    border: "border-slate-200 dark:border-slate-700/50",
    rank: "bg-gradient-to-br from-slate-400 to-gray-400 text-white",
    icon: "text-slate-400",
  },
  3: {
    bg: "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30",
    border: "border-orange-200 dark:border-orange-800/50",
    rank: "bg-gradient-to-br from-orange-400 to-amber-500 text-white",
    icon: "text-orange-500",
  },
};

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
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-soft animate-pulse"
          >
            <div className="w-9 h-9 bg-muted rounded-xl" />
            <div className="h-11 w-11 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
            <div className="h-5 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">No rankings yet. Be the first to log an activity!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((entry, index) => {
        const displayName =
          entry.userName || `User ${entry.userId.slice(0, 8)}`;
        const initials = displayName.slice(0, 2).toUpperCase();
        const isTopThree = index < 3;
        const style = rankStyles[(index + 1) as 1 | 2 | 3];

        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-3 p-3 rounded-2xl shadow-soft transition-all hover:shadow-soft-lg ${
              isTopThree
                ? `${style.bg} ${style.border} border`
                : "bg-card border border-border/40"
            }`}
          >
            <div
              className={`flex-none w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                isTopThree
                  ? style.rank
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {entry.rank}
            </div>
            <Avatar className={`h-11 w-11 border-2 ${isTopThree ? "border-white shadow-soft" : "border-background"}`}>
              <AvatarFallback className={`text-sm font-semibold ${isTopThree ? "bg-white/80" : ""}`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{displayName}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="font-bold">{entry.value.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground ml-1">{unit}</span>
              </div>
              {isTopThree && (
                <Medal className={`w-5 h-5 ${style.icon}`} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardsPage() {
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [activeTab, setActiveTab] = useState<"run" | "cycle" | "swim">("run");
  const [data, setData] = useState<TrophyApi.LeaderboardRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get city on client side (computed once on mount)
  const city = useMemo(() => {
    if (typeof window === "undefined") return "";
    return getUserCity();
  }, []);

  // Fetch leaderboard data when scope, tab, or city changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let leaderboardKey: string;
      let cityParam: string | undefined;

      if (scope === "city" && city) {
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

  const activityLabels = {
    run: "Running",
    cycle: "Cycling", 
    swim: "Swimming",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Leaderboards</h1>
          <p className="text-sm text-muted-foreground">Weekly rankings</p>
        </div>
      </div>

      {/* Scope Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
        <button
          onClick={() => setScope("global")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            scope === "global"
              ? "bg-white dark:bg-card shadow-soft text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="w-4 h-4" />
          Global
        </button>
        <button
          onClick={() => setScope("city")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            scope === "city"
              ? "bg-white dark:bg-card shadow-soft text-foreground"
              : "text-muted-foreground hover:text-foreground"
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
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50 p-1">
          <TabsTrigger value="run" className="gap-2 text-sm">
            <Footprints className="w-4 h-4" /> Run
          </TabsTrigger>
          <TabsTrigger value="cycle" className="gap-2 text-sm">
            <Bike className="w-4 h-4" /> Cycle
          </TabsTrigger>
          <TabsTrigger value="swim" className="gap-2 text-sm">
            <Waves className="w-4 h-4" /> Swim
          </TabsTrigger>
        </TabsList>

        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Weekly {activityLabels[activeTab]}
            {scope === "city" && city && (
              <span className="text-muted-foreground font-normal"> in {city}</span>
            )}
          </h2>
        </div>

        <TabsContent value="run" className="mt-0">
          <LeaderboardList data={data} unit={getUnit()} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="cycle" className="mt-0">
          <LeaderboardList data={data} unit={getUnit()} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="swim" className="mt-0">
          <LeaderboardList data={data} unit={getUnit()} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
