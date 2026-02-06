import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserStats } from "@/app/actions";
import { Trophy, Footprints, Bike, Waves, Flame, Award } from "lucide-react";

export default async function ProfilePage() {
  const stats = await getUserStats("current_user");

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-2xl">ME</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold border-2 border-background">
            Lvl {stats.level}
          </div>
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-muted-foreground text-sm">Member since 2026</p>
        </div>
        
        {/* XP Bar */}
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{stats.xp} XP</span>
            <span>{stats.nextLevelXp} XP</span>
          </div>
          <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="h-3" />
          <p className="text-center text-xs text-muted-foreground">
            {(stats.nextLevelXp - stats.xp)} XP to Level {stats.level + 1}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Footprints className="w-6 h-6 text-blue-500" />
            <div>
              <div className="text-xl font-bold">{stats.stats.run}</div>
              <div className="text-xs text-muted-foreground">Run (km)</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Bike className="w-6 h-6 text-green-500" />
            <div>
              <div className="text-xl font-bold">{stats.stats.cycle}</div>
              <div className="text-xs text-muted-foreground">Cycle (km)</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Waves className="w-6 h-6 text-cyan-500" />
            <div>
              <div className="text-xl font-bold">{stats.stats.swim}</div>
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
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {/* Mock Badges */}
             {stats.recentBadges.map((badge) => (
               <Card key={badge.id} className="group hover:scale-105 transition-transform duration-200 bg-primary/10 border-primary/30">
                 <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                   <div className="text-4xl filter drop-shadow-lg group-hover:animate-bounce">
                     {badge.icon}
                   </div>
                   <div>
                     <div className="font-bold text-sm">{badge.name}</div>
                     <div className="text-xs text-muted-foreground mt-1">Unlocked {badge.unlockedAt}</div>
                   </div>
                 </CardContent>
               </Card>
             ))}
             
             {/* Locked Badges */}
             {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="opacity-50 grayscale border-dashed">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <div className="text-4xl">🔒</div>
                    <div>
                      <div className="font-bold text-sm">Locked Badge</div>
                      <div className="text-xs text-muted-foreground mt-1">???</div>
                    </div>
                  </CardContent>
                </Card>
             ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
