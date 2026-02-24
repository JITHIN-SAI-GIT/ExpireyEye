import Sidebar from "../pages/Sidebar"
import Mainpage from '../pages/Mainpage'
export default function Dashboard() {

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <Mainpage />
    </div>
  )
}
