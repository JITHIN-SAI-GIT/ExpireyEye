import { FiSearch, FiPlus, FiBell, FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import profileImg from "../images/profile.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

export default function Navbar({ onAddNewProduct, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/signup");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-xl px-8 py-4 border-b border-slate-200 sticky top-0 z-30 shadow-sm transition-all">
      {/* 🔍 Search Section */}
      <div className="relative w-96 hidden md:block group">
        <Input
          type="text"
          placeholder="Search products, orders..."
          icon={<FiSearch size={18} className="text-slate-400 group-hover:text-primary transition-colors" />}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all pl-10 h-10 shadow-sm group-hover:bg-white"
        />
      </div>

      {/* ➕ Right Section */}
      <div className="flex items-center gap-5">
        <Button
          variant="primary"
          onClick={onAddNewProduct}
          leftIcon={<FiPlus size={18} />}
          className="hidden sm:flex shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-600 hover:to-emerald-700 border-0 h-10 px-5"
        >
          Add Product
        </Button>

        {/* 🔔 Notifications */}
        <div className="relative">
          <button className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary transition-all duration-300">
            <FiBell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
        </div>

        {/* 👤 Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pl-3 pr-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-primary transition-colors">{user?.username || "Admin"}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Store Owner</p>
            </div>
            <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-slate-100 group-hover:border-primary transition-all shadow-sm">
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <FiChevronDown className={cn("text-slate-400 transition-transform duration-300", isProfileOpen && "rotate-180 text-primary")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50 origin-top-right ring-1 ring-slate-900/5"
              >
                <div className="px-5 py-3 border-b border-slate-50 mb-1 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.email || "admin@expireyeye.com"}</p>
                </div>

                <div className="p-1">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    <FiUser size={16} /> My Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    <FiSettings size={16} /> Settings
                  </Link>
                </div>

                <div className="border-t border-slate-50 my-1 mx-2"></div>

                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
