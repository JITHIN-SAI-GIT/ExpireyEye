import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Fullimage from "../images/fulllogo.jpg";

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted successfully ✅");
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product ❌");
    }
  };

  const Addnewproduct = async () => {
    await navigate("/addproducts");
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { label: "Unknown", color: "bg-gray-600" };
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        label: `Expired (${Math.abs(diffDays)}d ago)`,
        color: "bg-red-600 text-white",
      };
    if (diffDays <= 7)
      return {
        label: `Expiring Soon (${diffDays}d)`,
        color: "bg-orange-500 text-white",
      };
    if (diffDays <= 30)
      return {
        label: `Safe (${diffDays}d left)`,
        color: "bg-yellow-500 text-black",
      };
    return {
      label: `Fresh (${diffDays}d left)`,
      color: "bg-green-600 text-white",
    };
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 text-gray-200 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
          ℙ𝕣𝕠𝕕𝕦𝕔𝕥 𝕄𝕒𝕟𝕒𝕘𝕖𝕞𝕖𝕟𝕥
          <img src={Fullimage} alt="Logo" className="w-40 h-20 object-contain rounded-md"/>
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-gray-100 border-2 border-green-800 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 text-gray-100 border-2 border-green-800 rounded-lg px-3 py-2 w-44"
          >
            <option value="all">All Categories</option>
            <option value="Household">Household</option>
            <option value="Frozen Foods">Frozen Foods</option>
            <option value="Meat">Meat</option>
            <option value="Dairy">Dairy</option>
          </select>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
            onClick={Addnewproduct}
          >
            <FiPlus className="mr-2" /> Add New Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-gray-900 border-2 border-green-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-100">Product List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-200">
            <thead className="border-b border-gray-700 bg-gray-800 text-gray-300">
              <tr className="text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expiry Status</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const expiry = getExpiryStatus(product.expiryDate);
                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <td className="py-3 px-4">{product._id}</td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${expiry.color}`}
                      >
                        {expiry.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">{product.quantity}</td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <p className="text-center py-6 text-gray-400">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
