"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Footprints, Bike, Waves, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logActivity, ActivityType } from "@/app/actions";

export function LogActivityDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<ActivityType>("run");

  // Form States
  const [distance, setDistance] = useState("");
  const [city, setCity] = useState("London");
  const [pace, setPace] = useState("run");
  const [style, setStyle] = useState("freestyle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(distance);
    if (!distNum || distNum <= 0) {
      toast.error("Please enter a valid distance");
      return;
    }

    startTransition(async () => {
      const result = await logActivity({
        userId: "current_user",
        type: activeTab,
        distance: distNum,
        city,
        pace: activeTab === "run" ? (pace as "walk" | "run") : undefined,
        style: activeTab === "swim" ? (style as "freestyle" | "breaststroke") : undefined,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActivityType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="run" className="gap-2"><Footprints className="w-4 h-4"/> Run</TabsTrigger>
            <TabsTrigger value="cycle" className="gap-2"><Bike className="w-4 h-4"/> Cycle</TabsTrigger>
            <TabsTrigger value="swim" className="gap-2"><Waves className="w-4 h-4"/> Swim</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance ({activeTab === "swim" ? "meters" : "km"})</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {activeTab === "run" && (
              <div className="space-y-2">
                <Label>Pace</Label>
                <Select value={pace} onValueChange={setPace}>
                  <SelectTrigger>
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
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freestyle">Freestyle</SelectItem>
                    <SelectItem value="breaststroke">Breaststroke</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Workout
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
