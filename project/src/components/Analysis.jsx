import AnalyticsDashboard from "../pages/AnalyticsDashboard"
import Sidebar from "../pages/Sidebar"
export default function Analysis() {
  return (
    <div className="flex h-screen bg-gray-900 text-white ">
      <Sidebar/>
      <AnalyticsDashboard/>
    </div>
  )
}
