// components/layout/Topbar.tsx

"use client";

import { Bell, Search, Settings, Menu, LogOut, User, CreditCard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
}

export function Topbar({ title = "לוח בקרה", subtitle, onMenuClick, showMenuButton = true, className }: TopbarProps) {
  const { isLoggedIn, id, first_name, last_name, email, role, username, logout } = useUserStore();
  const { theme, setTheme } = useTheme();

  // Only render if user is logged in
  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    logout();
    signOut();
  };

  return (
    <header className={cn("sticky top-0 z-40 w-full", "border-b border-border/50", "bg-background/80 backdrop-blur-xl", "supports-backdrop-filter:bg-background/60", className)}>
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Right Side - Title & Mobile Menu */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden hover:bg-muted" aria-label="פתח תפריט">
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        </div>

        {/* Center - Search */}
        {/* <div className="hidden flex-1 max-w-lg md:flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input type="search" placeholder="חיפוש במערכת..." className="w-full pr-10 h-10 bg-muted/40 border-transparent hover:bg-muted/60 focus:bg-background focus:border-border transition-colors" />
          </div>
        </div> */}

        {/* Left Side - Actions & User */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search */}
          {/* <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
            <Search className="h-5 w-5" />
          </Button> */}

          {/* DarkMode */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted">
            <Bell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-muted">
            <Settings className="h-5 w-5" />
          </Button>

          <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />

          {/* User Menu */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 px-2 hover:bg-muted h-auto py-1.5">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src="/avatar.jpg" alt="תמונת פרופיל" />
                  <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-semibold">{first_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {first_name} {last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">{role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                {/* <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {first_name} {last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div> */}
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium">תפריט</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { label: "הפרופיל שלי", icon: User, href: "/profile" },
                { label: "הגדרות", icon: Settings, href: "/settings" },
              ].map((item) => (
                <DropdownMenuItem key={item.label} className="gap-2 cursor-pointer">
                  <Link href={item.href} className="flex items-center w-full">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>יציאה מהמערכת</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
