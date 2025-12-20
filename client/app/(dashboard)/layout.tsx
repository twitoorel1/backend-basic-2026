// app/(dashboard)/layout.tsx

"use client";

import { useState, ReactNode } from "react";
import { Sidebar, Topbar, Navbar } from "@/components/layout/Index";
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

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-linear-to-b from-muted/40 via-muted/20 to-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:mr-70 min-h-screen flex flex-col">
        {/* Topbar */}
        <Topbar title="ניהול מחסן" subtitle="מערכת ניהול מלאי" showMenuButton onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className={cn("mx-auto w-full", maxWidthClasses["7xl"])}>{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/60 backdrop-blur-sm py-4 px-4 sm:px-6">
          <div className={cn("mx-auto flex flex-col sm:flex-row items-center justify-between gap-2", "text-sm text-muted-foreground", maxWidthClasses["7xl"])}>
            <span>© {new Date().getFullYear()} ניהול מחסן. כל הזכויות שמורות.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                תנאי שימוש
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                פרטיות
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                עזרה
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
