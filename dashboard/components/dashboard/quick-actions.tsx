import { Plus, Upload, Download, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  {
    id: 1,
    title: "הזמנה חדשה",
    icon: Plus,
    gradient: "bg-gradient-to-l from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "ייבוא נתונים",
    icon: Upload,
    gradient: "bg-gradient-to-l from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    title: "ייצוא דוח",
    icon: Download,
    gradient: "bg-gradient-to-l from-orange-500 to-pink-600",
  },
  {
    id: 4,
    title: "רענן נתונים",
    icon: RefreshCw,
    gradient: "bg-gradient-to-l from-cyan-500 to-blue-600",
  },
]

export function QuickActions() {
  return (
    <Card className="transition-all duration-200 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">פעולות מהירות</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto flex flex-col items-center gap-3 py-6 hover:shadow-lg transition-all duration-200"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${action.gradient}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
