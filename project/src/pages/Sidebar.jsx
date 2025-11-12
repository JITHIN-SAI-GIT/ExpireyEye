import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiPackage, FiBarChart2, FiSettings } from "react-icons/fi";
import logo from "../images/logo.jpg";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col min-h-screen border-r-2 border-green-800">
      <div className="text-2xl font-bold mb-10 flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 overflow-hidden rounded-full border-2 border-green-500"
        />
        &nbsp;&nbsp;
        <span className="text-white">𝔼𝕩𝕡𝕚𝕣𝕪 𝔼𝕪𝕖</span>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul>
          <li className="mb-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <RxDashboard className="mr-3" /> Dashboard
            </NavLink>
          </li>

          <li className="mb-4">
            <NavLink
              to="/productmanagement"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <FiPackage className="mr-3" /> Product Management
            </NavLink>
          </li>

          <li className="mb-4">
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <FiBarChart2 className="mr-3" /> Analytics & Reports
            </NavLink>
          </li>

          <li className="mb-4">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <FiSettings className="mr-3" /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
