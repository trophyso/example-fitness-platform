"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, User, Plus, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { LogActivityDialog } from "@/components/log-activity-dialog";

export function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
    { href: "/achievements", label: "Achievements", icon: Award },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r border-border/50 bg-sidebar fixed left-0 top-0 z-30">
        <div className="p-6 pb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              TrophyFitness
            </h1>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 pt-2">
          <LogActivityDialog>
            <Button className="w-full gap-2 h-11 shadow-soft" size="lg">
              <Plus className="w-5 h-5" />
              Log Workout
            </Button>
          </LogActivityDialog>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 backdrop-blur-lg z-30 pb-safe">
        <div className="flex justify-around items-center p-2 pt-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-2 rounded-xl min-w-[60px] transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
          {/* Mobile FAB */}
          <LogActivityDialog>
            <Button 
              size="icon" 
              className="rounded-full h-14 w-14 -mt-10 shadow-soft-lg bg-primary text-primary-foreground border-4 border-background"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </LogActivityDialog>
        </div>
      </div>
    </>
  );
}
