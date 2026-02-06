"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, User, PlusCircle, Award } from "lucide-react";
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
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-card fixed left-0 top-0 z-30">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-black">
            TrophyFitness
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <LogActivityDialog>
            <Button className="w-full gap-2" size="lg">
              <PlusCircle className="w-5 h-5" />
              Log Activity
            </Button>
          </LogActivityDialog>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card z-30 pb-safe">
        <div className="flex justify-around items-center p-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg min-w-[64px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
           {/* Mobile FAB */}
           <LogActivityDialog>
             <Button size="icon" className="rounded-full h-12 w-12 -mt-8 shadow-lg bg-primary text-primary-foreground border-4 border-background">
               <PlusCircle className="w-6 h-6" />
             </Button>
           </LogActivityDialog>
        </div>
      </div>
    </>
  );
}
