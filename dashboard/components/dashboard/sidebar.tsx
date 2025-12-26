"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingCart, Package, BarChart3, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "לוח בקרה",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "משתמשים",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "הזמנות",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "מוצרים",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "דוחות",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "הגדרות",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed end-0 top-0 h-screen w-70 bg-card border-s flex flex-col" style={{ width: '280px' }}>
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-l from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-l from-purple-600 to-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>יח</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">יוחנן כהן</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
