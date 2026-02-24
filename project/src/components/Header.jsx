import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../images/fulllogo.jpg";
import { Button } from "./ui/Button"; // Use new Button
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100"
    >
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto rounded-lg shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="hidden md:block text-xl font-heading font-bold text-slate-800 tracking-tight">
            Expiry<span className="text-primary">Eye</span>
          </span>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              to="/alerts"
              className="text-slate-600 hover:text-orange-500 transition-colors bg-slate-100 p-2 rounded-full"
            >
              <i className="fa-solid fa-triangle-exclamation fa-lg"></i>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm font-medium text-slate-600">
                Hi, <span className="text-slate-900">{user?.username || "User"}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
