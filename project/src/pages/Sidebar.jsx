import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiPackage, FiBarChart2, FiSettings, FiLogOut } from "react-icons/fi";
import { FaShoppingCart, FaFileInvoiceDollar } from "react-icons/fa";
import logo from "../images/logo.jpg";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export default function Sidebar() {
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <RxDashboard size={20} /> },
    { path: "/productmanagement", name: "Products", icon: <FiPackage size={20} /> },
    { path: "/sales", name: "Sales / POS", icon: <FaShoppingCart size={20} /> },
    { path: "/reports", name: "Analytics", icon: <FiBarChart2 size={20} /> },
    { path: "/sales-reports", name: "Reports", icon: <FaFileInvoiceDollar size={20} /> },
    { path: "/marketing", name: "Marketing", icon: <FiPackage size={20} /> }, // Using FiPackage temporarily or import FiVideo
    { path: "/detector", name: "Detector", icon: <RxDashboard size={20} /> },
    { path: "/settings", name: "Settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-soft z-40"
    >
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
          <img
            src={logo}
            alt="Logo"
            className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
          />
        </div>
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-800 tracking-tight">
            Expiry<span className="text-primary">Eye</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">STORE MANAGER</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Status</h4>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
        </div>
      </div>
    </motion.div>
  );
}
