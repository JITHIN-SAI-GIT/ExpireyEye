import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Video, 
  ScanSearch, 
  Settings,
  Leaf
} from "lucide-react";
import logo from "../images/logo.jpg";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export default function Sidebar() {
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/productmanagement", name: "Inventory", icon: <Package size={20} /> },
    { path: "/sales", name: "Sales & POS", icon: <ShoppingCart size={20} /> },
    { path: "/reports", name: "Analytics", icon: <TrendingUp size={20} /> },
    { path: "/sales-reports", name: "Reports", icon: <FileText size={20} /> },
    { path: "/marketing", name: "Marketing", icon: <Video size={20} /> },
    { path: "/detector", name: "AI Detector", icon: <ScanSearch size={20} /> },
    { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-white/90 backdrop-blur-xl border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-soft z-40"
    >
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:bg-primary/50 transition-all duration-500" />
          <img
            src={logo}
            alt="Logo"
            className="relative w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <Leaf size={12} className="text-primary" />
          </div>
        </div>
        <div>
          <h1 className="font-heading font-black text-xl text-slate-800 tracking-tight">
            Expiry<span className="text-primary">Eye</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Fresh Manager</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <motion.ul variants={containerVariants} initial="hidden" animate="show" className="space-y-1.5">
          {menuItems.map((item) => (
            <motion.li key={item.path} variants={itemVariants}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-bold text-sm",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:scale-[1.02]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "transition-colors duration-300",
                        isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
             <Leaf className="text-emerald-600" size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 tracking-wide">System Online</h4>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All sensors active
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
