import { FiSearch, FiPlus } from "react-icons/fi";
import { Button } from "react-bootstrap";
import logo from "../images/profile.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signup");
  };

  const Addnewproduct = async () => {
    await navigate("/addproducts");
  };

  return (
    <div className="w-full flex justify-between items-center bg-gray-800 text-white px-6 py-3 border-b border-green-800 shadow-md">
      {/* 🔍 Search Section */}
      <div className="relative w-64">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* ➕ Right Section */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition"
          onClick={Addnewproduct}
        >
          <FiPlus className="mr-2" /> Add New Product
        </button>

        <span className="text-white font-medium">
          ℍ𝕚 , {user?.username || "User"}
        </span>

        <Button
          variant="link"
          onClick={handleLogout}
          className="text-white hover:text-green-400 transition"
          style={{ textDecoration: "none" }}
        >
        𝕃𝕠𝕘𝕠𝕦𝕥
        </Button>

        {/* 👤 Profile Image */}
        <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-green-500">
          <img
            src={logo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
