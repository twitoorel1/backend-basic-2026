import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="סך הכנסות"
          value="₪45,231"
          change="+20.1%"
          trend="up"
          icon={DollarSign}
          gradient="bg-gradient-to-l from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="משתמשים פעילים"
          value="2,350"
          change="+15.3%"
          trend="up"
          icon={Users}
          gradient="bg-gradient-to-l from-blue-500 to-purple-600"
        />
        <StatCard
          title="הזמנות"
          value="184"
          change="-5.2%"
          trend="down"
          icon={ShoppingCart}
          gradient="bg-gradient-to-l from-orange-500 to-pink-600"
        />
        <StatCard
          title="שיעור המרה"
          value="3.24%"
          change="+8.1%"
          trend="up"
          icon={TrendingUp}
          gradient="bg-gradient-to-l from-cyan-500 to-blue-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  )
}
