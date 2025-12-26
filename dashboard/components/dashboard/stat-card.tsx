import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  gradient: string
}

export function StatCard({ title, value, change, trend, icon: Icon, gradient }: StatCardProps) {
  const isPositive = trend === "up"
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <h3 className="text-3xl font-bold mb-3">{value}</h3>
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className={cn(
                "gap-1",
                isPositive 
                  ? "bg-gradient-to-l from-emerald-500 to-emerald-600" 
                  : "bg-gradient-to-l from-red-500 to-red-600"
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {change}
            </Badge>
          </div>
          <div 
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-lg",
              gradient
            )}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
