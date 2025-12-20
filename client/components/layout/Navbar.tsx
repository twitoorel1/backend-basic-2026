// components/layout/Navbar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Types
interface NavItem {
  label: string;
  href: string;
  badge?: string | number;
  disabled?: boolean;
}

interface NavbarProps {
  items?: NavItem[];
  className?: string;
}

// Default navigation items
const defaultItems: NavItem[] = [
  { label: "סקירה כללית", href: "/dashboard" },
  { label: "פריטים", href: "/dashboard/products", badge: "247" },
  { label: "הזמנות", href: "/dashboard/orders", badge: "5" },
  { label: "דוחות", href: "/dashboard/reports" },
];

export function Navbar({ items = defaultItems, className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "border-b bg-background/50 backdrop-blur-sm",
        "sticky top-16 z-30", // Sticks below topbar
        className
      )}>
      <div className="flex h-12 items-center gap-1 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;

          return (
            <Link
              key={item.href}
              href={isDisabled ? "#" : item.href}
              onClick={(e) => isDisabled && e.preventDefault()}
              className={cn(
                "relative flex items-center gap-2",
                "whitespace-nowrap px-4 py-2",
                "text-sm font-medium",
                "rounded-lg transition-all duration-200",
                isActive ? "text-primary" : isDisabled ? "text-muted-foreground/50 cursor-not-allowed" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}>
              {item.label}

              {/* Badge */}
              {item.badge && (
                <span className={cn("inline-flex items-center justify-center", "rounded-full px-2 py-0.5", "text-[10px] font-semibold", "transition-colors", isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                  {item.badge}
                </span>
              )}

              {/* Active indicator line */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                  style={{
                    animation: "scaleX 0.2s ease-out",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Pills variant - Alternative style
export function NavbarPills({ items = defaultItems, className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1 p-1", "bg-muted/50 rounded-xl", "w-fit", className)}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const isDisabled = item.disabled;

        return (
          <Link
            key={item.href}
            href={isDisabled ? "#" : item.href}
            onClick={(e) => isDisabled && e.preventDefault()}
            className={cn(
              "flex items-center gap-2",
              "whitespace-nowrap px-4 py-2",
              "text-sm font-medium",
              "rounded-lg transition-all duration-200",
              isActive ? "bg-background text-foreground shadow-sm" : isDisabled ? "text-muted-foreground/50 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"
            )}>
            {item.label}

            {item.badge && <span className={cn("inline-flex items-center justify-center", "rounded-full px-2 py-0.5", "text-[10px] font-semibold", isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>{item.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

// Tabs variant - For settings pages etc.
export function NavbarTabs({ items = defaultItems, className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("border-b", className)}>
      <div className="flex gap-0">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;

          return (
            <Link
              key={item.href}
              href={isDisabled ? "#" : item.href}
              onClick={(e) => isDisabled && e.preventDefault()}
              className={cn(
                "relative flex items-center gap-2",
                "px-4 py-3",
                "text-sm font-medium",
                "transition-colors duration-200",
                "border-b-2 -mb-px",
                isActive ? "border-primary text-primary" : isDisabled ? "border-transparent text-muted-foreground/50 cursor-not-allowed" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}>
              {item.label}

              {item.badge && <span className={cn("inline-flex items-center justify-center", "rounded-full px-2 py-0.5", "text-[10px] font-semibold", isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>{item.badge}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Export types
export type { NavItem, NavbarProps };
