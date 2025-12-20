// app/(dashboard)/loading.tsx

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-muted" />
          <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-medium text-foreground">טוען...</p>
          <p className="text-sm text-muted-foreground">אנא המתן</p>
        </div>
      </div>
    </div>
  );
}
