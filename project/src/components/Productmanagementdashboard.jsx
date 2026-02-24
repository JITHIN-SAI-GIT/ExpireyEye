import ProductManagement from '../pages/Programmanagement'
import Sidebar from "../pages/Sidebar"

export default function Productmanagementdashboard() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar />
      <ProductManagement />
    </div>
  )
}
