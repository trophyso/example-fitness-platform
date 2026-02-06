"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import {
  getUserCity,
  setStoredCity,
  getDefaultCityFromTimezone,
} from "@/lib/city";

export function CitySetting() {
  const [city, setCity] = useState("");
  const [savedCity, setSavedCity] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentCity = getUserCity();
    setCity(currentCity);
    setSavedCity(currentCity);
  }, []);

  const handleSave = () => {
    if (city.trim()) {
      setStoredCity(city.trim());
      setSavedCity(city.trim());
      toast.success("City updated", {
        description: `Your city is now set to ${city.trim()}`,
      });
    }
  };

  const handleReset = () => {
    const defaultCity = getDefaultCityFromTimezone();
    setCity(defaultCity);
    setStoredCity(defaultCity);
    setSavedCity(defaultCity);
    toast.success("City reset", {
      description: `Your city has been reset to ${defaultCity}`,
    });
  };

  const hasChanges = city !== savedCity;

  if (!isClient) {
    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Your City
        </Label>
        <div className="h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Your City
      </Label>
      <p className="text-xs text-muted-foreground">
        Your city is used for local leaderboards and community features.
      </p>
      <div className="flex gap-2">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
          className="flex-1"
        />
        <Button
          onClick={handleSave}
          disabled={!hasChanges || !city.trim()}
          size="icon"
          variant={hasChanges ? "default" : "secondary"}
        >
          <Check className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground"
        onClick={handleReset}
      >
        Reset to detected city
      </Button>
    </div>
  );
}
