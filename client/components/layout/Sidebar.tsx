// components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, FileText, Settings, BarChart3, Calendar, LogOut, Warehouse, ShoppingCart, AlertTriangle, type LucideIcon, ChevronRight, Phone, SmartphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { User } from "@/types/auth";
import { signOut } from "next-auth/react";

// Types
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "default" | "destructive" | "secondary";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation Configuration - Easy to customize
const navigationConfig: NavSection[] = [
  {
    title: "ראשי",
    items: [
      { label: "לוח בקרה", href: "/", icon: LayoutDashboard },
      { label: "סטטיסטיקות", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "מלאי",
    items: [
      { label: "פריטים", href: "/inventory", icon: Package },
      { label: "סצים", href: "/tel100", icon: SmartphoneIcon },
      // { label: "מחסנים", href: "/dashboard/warehouses", icon: Warehouse },
      // { label: "הזמנות", href: "/dashboard/orders", icon: ShoppingCart, badge: "5", badgeVariant: "destructive" },
      // { label: "התראות", href: "/dashboard/alerts", icon: AlertTriangle, badge: "3", badgeVariant: "destructive" },
    ],
  },
  {
    title: "ניהול",
    items: [
      { label: "משתמשים", href: "/dashboard/users", icon: Users },
      { label: "דוחות", href: "/dashboard/reports", icon: FileText },
      { label: "לוח שנה", href: "/dashboard/calendar", icon: Calendar },
    ],
  },
  {
    title: "מערכת",
    items: [{ label: "הגדרות", href: "/settings", icon: Settings }],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

// Navigation Item Component
function NavItemComponent({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn("group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
      <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
      <span className="flex-1 truncate">{item.label}</span>

      {item.badge && (
        <Badge variant={isActive ? "secondary" : item.badgeVariant || "secondary"} className={cn("h-5 min-w-5 px-1.5 text-[10px] font-semibold", isActive && "bg-primary-foreground/20 text-primary-foreground")}>
          {item.badge}
        </Badge>
      )}

      {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
    </Link>
  );
}

// Sidebar Content - Shared between desktop and mobile
function SidebarContent({ onItemClick, dataUser, logout }: { onItemClick?: () => void; dataUser: User; logout: () => void }) {
  const pathname = usePathname();
  const { first_name, last_name, email, role } = dataUser;

  return (
    <div className="flex h-full flex-col">
      {/* Logo Header */}
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
          <Warehouse className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-foreground">ניהול מחסן</span>
          <span className="text-[10px] text-muted-foreground font-medium">גרסה 1.0.0</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4" dir="rtl">
        <nav className="flex flex-col gap-6 px-3 ">
          {navigationConfig.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 px-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">{section.title}</h4>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <NavItemComponent key={item.href} item={item} isActive={pathname === item.href} onClick={onItemClick} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src="/avatar.jpg" alt="תמונת פרופיל" />
            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-primary font-semibold">{first_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-foreground">
              {first_name} {last_name}
            </span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" aria-label="יציאה מהמערכת">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen = false, onClose, className }: SidebarProps) {
  const { isLoggedIn, id, first_name, last_name, email, role, username, logout } = useUserStore();

  const dataUser: User = {
    id,
    first_name,
    last_name,
    email,
    role,
    username,
  };

  // Only render if user is logged in
  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    logout();
    signOut();
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <aside className={cn("hidden lg:flex", "fixed right-0 top-0 z-30", "h-screen w-70", "flex-col border-l", "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80", className)}>
        <SidebarContent dataUser={dataUser} logout={handleLogout} />
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-70 p-0 border-l">
          <SidebarContent onItemClick={onClose} dataUser={dataUser} logout={handleLogout} />
        </SheetContent>
      </Sheet>
    </>
  );
}

// Export navigation config for external use
export { navigationConfig };
export type { NavItem, NavSection };
