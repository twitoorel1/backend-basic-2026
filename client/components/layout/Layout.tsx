// components/layout/Layout.tsx

"use client";

import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Navbar, type NavItem } from "./Navbar";
import { cn } from "@/lib/utils";

// Content width options
type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

interface LayoutProps {
  children: ReactNode;
  /** Page title shown in Topbar */
  pageTitle?: string;
  /** Subtitle shown in Topbar */
  pageSubtitle?: string;
  /** Show horizontal Navbar */
  showNavbar?: boolean;
  /** Custom Navbar items */
  navbarItems?: NavItem[];
  /** Max width of main content - default "6xl" */
  maxWidth?: MaxWidth;
  /** Wrap content in a Card */
  useCard?: boolean;
  /** Show footer */
  showFooter?: boolean;
  /** Additional className for content wrapper */
  className?: string;
  /** Additional className for the card (if useCard is true) */
  cardClassName?: string;
}

export function Layout({ children, pageTitle = "לוח בקרה", pageSubtitle, showNavbar = false, navbarItems, maxWidth = "6xl", useCard = false, showFooter = true, className, cardClassName }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-linear-to-b from-muted/30 to-muted/10">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - Offset for sidebar on desktop */}
      <div className="lg:mr-70 min-h-screen flex flex-col">
        {/* Topbar */}
        <Topbar title={pageTitle} subtitle={pageSubtitle} showMenuButton onMenuClick={() => setSidebarOpen(true)} />

        {/* Optional Navbar */}
        {showNavbar && <Navbar items={navbarItems} />}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], className)}>
            {useCard ? (
              <div className={cn("rounded-2xl border bg-background/80 backdrop-blur-sm shadow-sm", "transition-shadow hover:shadow-md", cardClassName)}>
                <div className="p-6 md:p-8">{children}</div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>

        {/* Footer */}
        {showFooter && (
          <footer className="border-t bg-background/50 backdrop-blur-sm py-4 px-4 sm:px-6">
            <div className={cn("mx-auto flex flex-col sm:flex-row items-center justify-between gap-2", "text-sm text-muted-foreground", maxWidthClasses[maxWidth])}>
              <span>© {new Date().getFullYear()} ניהול מחסן. כל הזכויות שמורות.</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-foreground transition-colors">
                  תנאי שימוש
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  מדיניות פרטיות
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  צור קשר
                </a>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

// Simple variant without card
export function LayoutSimple(props: Omit<LayoutProps, "useCard">) {
  return <Layout {...props} useCard={false} />;
}

// Card variant with card wrapper
export function LayoutCard(props: Omit<LayoutProps, "useCard">) {
  return <Layout {...props} useCard={true} />;
}

// Full width variant
export function LayoutFull(props: Omit<LayoutProps, "maxWidth" | "useCard">) {
  return <Layout {...props} maxWidth="full" useCard={false} />;
}
