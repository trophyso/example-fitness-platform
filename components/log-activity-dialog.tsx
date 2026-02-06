"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footprints, Bike, Waves, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/app/actions";
import { ActivityType } from "@/lib/constants";
import { getUserCity } from "@/lib/city";
import { useUser } from "@/components/user-provider";

export function LogActivityDialog({ children }: { children: React.ReactNode }) {
  const { userId } = useUser();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<ActivityType>("run");

  // Form States
  const [distance, setDistance] = useState("");
  const [pace, setPace] = useState("run");
  const [style, setStyle] = useState("freestyle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not initialized");
      return;
    }

    const distNum = parseFloat(distance);
    if (!distNum || distNum <= 0) {
      toast.error("Please enter a valid distance");
      return;
    }

    const city = getUserCity();

    startTransition(async () => {
      const result = await logActivity({
        userId,
        type: activeTab,
        distance: distNum,
        city,
        pace: activeTab === "run" ? (pace as "walk" | "run") : undefined,
        style:
          activeTab === "swim" ? (style as "freestyle" | "breaststroke") : undefined,
      });

      if (result.success) {
        toast.success("Workout Saved!", {
          description: `Logged ${distNum} ${activeTab === "swim" ? "m" : "km"} ${activeTab}.`,
        });
        setOpen(false);
        setDistance("");
      } else {
        toast.error("Failed to save workout");
      }
    });
  };

  const activityColors = {
    run: "text-blue-500",
    cycle: "text-emerald-500",
    swim: "text-cyan-500",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-lg">Log Activity</DialogTitle>
            <DialogDescription className="text-sm">
              Record your workout to earn XP and climb the leaderboard.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActivityType)}
          className="w-full"
        >
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1">
              <TabsTrigger value="run" className="gap-2 text-sm data-[state=active]:shadow-soft">
                <Footprints className="w-4 h-4" /> Run
              </TabsTrigger>
              <TabsTrigger value="cycle" className="gap-2 text-sm data-[state=active]:shadow-soft">
                <Bike className="w-4 h-4" /> Cycle
              </TabsTrigger>
              <TabsTrigger value="swim" className="gap-2 text-sm data-[state=active]:shadow-soft">
                <Waves className="w-4 h-4" /> Swim
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="distance" className="text-sm font-medium">
                Distance
              </Label>
              <div className="relative">
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                  className="pr-12 h-12 text-lg font-medium"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  {activeTab === "swim" ? "m" : "km"}
                </div>
              </div>
            </div>

            {activeTab === "run" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Pace</Label>
                <Select value={pace} onValueChange={setPace}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="run">Running</SelectItem>
                    <SelectItem value="walk">Walking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "swim" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freestyle">Freestyle</SelectItem>
                    <SelectItem value="breaststroke">Breaststroke</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium shadow-soft" 
              disabled={isPending || !distance}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Save Workout
                </>
              )}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
