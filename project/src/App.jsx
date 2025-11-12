import Dashboard from "./components/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./contexts/AuthContext";
import AddProductModal from "./components/Addnewproduct";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Productmanagementdashboard from "./components/Productmanagementdashboard"
import Analysis from "./components/Analysis";
export default function App() {
  const {isAuthenticated}= useAuth();
  return (
    // 1. Replace the React Fragment <> with a div that creates the main layout.
    // This div will be a vertical flex container filling the whole screen.
    <div className="flex flex-col h-screen bg-gray-900">
      {/* 2. Your Header will be the first item, taking its natural height. */}
      {isAuthenticated ? " " : <Header />}

      {/* 3. The <main> tag will be the second item.
             'flex-1' makes it expand to fill all remaining vertical space.
             'overflow-y-auto' adds a scrollbar if the content inside is too long.
      */}
      <main className="flex-1 overflow-y-auto"> 
        <Routes>
          {/* Note: I removed the duplicate /dashboard route for you */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addproducts" element={<AddProductModal />} />
          <Route path="/productmanagement" element={<Productmanagementdashboard />} />
          <Route path="/reports" element={<Analysis/>} />
        </Routes>
      </main>
    </div>
  );
}
