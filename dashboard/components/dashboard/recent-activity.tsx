import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const activities = [
  {
    id: 1,
    user: "שרה לוי",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    action: "ביצעה הזמנה חדשה",
    amount: "₪890",
    status: "הושלם",
    statusVariant: "default" as const,
  },
  {
    id: 2,
    user: "דוד כהן",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    action: "ביטל הזמנה",
    amount: "₪450",
    status: "בוטל",
    statusVariant: "destructive" as const,
  },
  {
    id: 3,
    user: "רחל אברהם",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    action: "ביצעה הזמנה חדשה",
    amount: "₪1,240",
    status: "ממתין",
    statusVariant: "secondary" as const,
  },
  {
    id: 4,
    user: "יוסף מזרחי",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joseph",
    action: "ביצע הזמנה חדשה",
    amount: "₪670",
    status: "הושלם",
    statusVariant: "default" as const,
  },
]

export function RecentActivity() {
  return (
    <Card className="transition-all duration-200 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">פעילות אחרונה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={activity.avatar} />
                <AvatarFallback>{activity.user.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.user}</p>
                <p className="text-xs text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-end">
                <p className="text-sm font-bold">{activity.amount}</p>
                <Badge variant={activity.statusVariant} className="mt-1">
                  {activity.status}
                </Badge>
              </div>
            </div>
            {index < activities.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
