// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./contexts/AuthContext";
import AddProductModal from "./components/Addnewproduct";
import Productmanagementdashboard from "./components/Productmanagementdashboard";
import Analysis from "./components/Analysis";
import SalesPOS from "./pages/SalesPOS";
import Reports from "./pages/Reports";
import MarketingData from "./pages/MarketingData";
import ProductDetector from "./pages/ProductDetector";
import AIChat from "./components/AIChat";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in → send to login page
    return <Navigate to="/" replace />;
  }

  // Logged in → show requested page
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Show Header only when NOT authenticated */}
      {isAuthenticated ? null : <Header />}

      {isAuthenticated && <AIChat />}

      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/addproducts"
            element={
              <PrivateRoute>
                <AddProductModal />
              </PrivateRoute>
            }
          />
          <Route
            path="/productmanagement"
            element={
              <PrivateRoute>
                <Productmanagementdashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Analysis />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <SalesPOS />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/marketing"
            element={
              <PrivateRoute>
                <MarketingData />
              </PrivateRoute>
            }
          />

          <Route
            path="/detector"
            element={
              <PrivateRoute>
                <ProductDetector />
              </PrivateRoute>
            }
          />
          {/* Fallback: anything unknown → go to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
