import AnalyticsDashboard from "../pages/AnalyticsDashboard"
import Sidebar from "../pages/Sidebar"
export default function Analysis() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
