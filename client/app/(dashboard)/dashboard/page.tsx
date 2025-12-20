// app/(dashboard)/dashboard/page.tsx

"use client";

import { Package, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, ShoppingCart, Warehouse, Clock, MoreHorizontal, ArrowUpLeft, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";

// Stats data
const stats = [
  {
    title: "סה״כ פריטים",
    value: "1,247",
    change: "+12",
    changeLabel: "מהחודש הקודם",
    trend: "up" as const,
    icon: Package,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "בתוקף",
    value: "1,189",
    change: "+8",
    changeLabel: "מהחודש הקודם",
    trend: "up" as const,
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "קרובים לפג תוקף",
    value: "58",
    change: "+3",
    changeLabel: "מהשבוע הקודם",
    trend: "down" as const,
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    title: "פג תוקף",
    value: "12",
    change: "-5",
    changeLabel: "מהחודש הקודם",
    trend: "up" as const,
    icon: Clock,
    iconColor: "text-red-600",
    iconBg: "bg-red-100 dark:bg-red-900/30",
  },
];

// Recent activities
const recentActivities = [
  {
    id: 1,
    user: "יוסי כהן",
    action: "הוסיף מוצר חדש",
    item: "חלב תנובה 3%",
    time: "לפני 5 דקות",
    avatar: "יכ",
    color: "bg-blue-500",
  },
  {
    id: 2,
    user: "שרה לוי",
    action: "עדכנה כמות",
    item: "לחם אחיד",
    time: "לפני 12 דקות",
    avatar: "של",
    color: "bg-green-500",
  },
  {
    id: 3,
    user: "דני אברהם",
    action: "סימן כפג תוקף",
    item: "גבינה צהובה",
    time: "לפני 25 דקות",
    avatar: "דא",
    color: "bg-amber-500",
  },
  {
    id: 4,
    user: "רחל גולן",
    action: "הוציאה מהמחסן",
    item: "ביצים L",
    time: "לפני שעה",
    avatar: "רג",
    color: "bg-purple-500",
  },
];

// Low stock items
const lowStockItems = [
  { name: "חלב תנובה 3%", current: 12, minimum: 50, category: "מוצרי חלב" },
  { name: "לחם אחיד פרוס", current: 5, minimum: 30, category: "מאפים" },
  { name: "ביצים L (תבנית)", current: 8, minimum: 20, category: "ביצים" },
  { name: "חמאה תנובה 200 גר׳", current: 15, minimum: 40, category: "מוצרי חלב" },
];

const quickActions = [
  { icon: Package, label: "הוסף מוצר", color: "bg-blue-500" },
  { icon: ShoppingCart, label: "הזמנה חדשה", color: "bg-green-500" },
  { icon: Warehouse, label: "ניהול מחסנים", color: "bg-purple-500" },
  { icon: AlertTriangle, label: "דוח תוקף", color: "bg-amber-500" },
];

export default function DashboardPage() {
  const { isLoggedIn, id, first_name, last_name, email, role, username, logout } = useUserStore();

  // Only render if user is logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">שלום, {first_name}! 👋</h1>
          <p className="text-muted-foreground mt-1">הנה סיכום המצב במחסן שלך להיום</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 ml-2" />
            הזמנה חדשה
          </Button>
          <Button>
            <Package className="h-4 w-4 ml-2" />
            הוסף מוצר
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";

          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                  <Icon className={cn("h-4 w-4", stat.iconColor)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.title !== "פג תוקף" && stat.title !== "קרובים לפג תוקף" ? (
                    isPositive ? (
                      <ArrowUpLeft className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-red-500" />
                    )
                  ) : isPositive ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpLeft className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn("text-sm font-medium", stat.title === "פג תוקף" || stat.title === "קרובים לפג תוקף" ? (isPositive ? "text-green-500" : "text-red-500") : isPositive ? "text-green-500" : "text-red-500")}>{stat.change}</span>
                  <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">פעילות אחרונה</CardTitle>
              <CardDescription>הפעולות האחרונות במערכת</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn("text-white text-xs font-medium", activity.color)}>{activity.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{activity.user}</p>
                      <span className="text-xs text-muted-foreground">{activity.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              צפייה בכל הפעילות
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="border-amber-200 dark:border-amber-800/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg">מלאי נמוך</CardTitle>
                <CardDescription>פריטים שדורשים הזמנה</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {lowStockItems.length} פריטים
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-sm font-semibold text-amber-600">
                        {item.current} / {item.minimum}
                      </div>
                      <div className="text-[10px] text-muted-foreground">נוכחי / מינימום</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      הזמן
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">צפייה בכל ההתראות</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פעולות מהירות</CardTitle>
          <CardDescription>גישה מהירה לפעולות נפוצות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button key={index} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted">
                  <div className={cn("p-2 rounded-lg text-white", action.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
