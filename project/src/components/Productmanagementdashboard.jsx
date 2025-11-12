import ProductManagement from '../pages/Programmanagement'
import Sidebar from "../pages/Sidebar"
export default function Productmanagementdashboard() {
  return (
    <div className="flex h-screen bg-gray-900 text-white ">
      <Sidebar/>
      <ProductManagement/>
    </div>
  )
}
