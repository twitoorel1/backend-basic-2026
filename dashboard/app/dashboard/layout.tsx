import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="me-[280px]">
        <Header title="לוח בקרה" />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
