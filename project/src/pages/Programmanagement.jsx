import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Fullimage from "../images/fulllogo.jpg";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const ProductManagement = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id)); // Note: Check if backend returns _id or id
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { label: "Unknown", variant: "secondary" };
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: `Expired`, variant: "destructive" };
    if (diffDays <= 7) return { label: `Expiring Soon (${diffDays}d)`, variant: "warning" };
    if (diffDays <= 30) return { label: `Safe (${diffDays}d)`, variant: "secondary" };
    return { label: `Fresh (${diffDays}d)`, variant: "success" };
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    let matchesDate = true;
    if (dateFilter) {
      if (!p.createdAt) matchesDate = false; // Filter out old products without date if filter is active
      else {
        const productDate = new Date(p.createdAt).toISOString().split('T')[0];
        matchesDate = productDate === dateFilter;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const categories = ["all", "Household", "Frozen Foods", "Meat", "Dairy", "Fruits", "Bakery"];

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-800">Product Management</h1>
            <p className="text-slate-500 mt-1">Manage your inventory, track expiry, and update stock.</p>
          </div>
          <Button onClick={() => navigate("/addproducts")} leftIcon={<FiPlus />}>
            Add New Product
          </Button>
        </div>

        {/* Filters & Search */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Input
                placeholder="Search products by name..."
                icon={<FiSearch className="group-focus-within:text-primary transition-colors" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 h-11 transition-all"
              />
            </div>

            {/* Filter Group */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-auto overflow-hidden">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute left-3 top-1 z-10 pointer-events-none">
                  Added Date
                </label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-44 bg-slate-50/50 border-slate-200 h-11 pt-4 text-xs"
                />
              </div>

              <div className="relative w-full sm:w-auto group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute left-3 top-1 z-10 pointer-events-none group-focus-within:text-primary">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-11 w-full sm:w-48 pt-4 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Inventory' : cat}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-4 pointer-events-none text-slate-400">
                  <FiFilter size={14} />
                </div>
              </div>

              {searchTerm || categoryFilter !== 'all' || dateFilter ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setDateFilter("");
                  }}
                  className="text-slate-400 hover:text-primary h-11 px-4"
                >
                  Reset
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        {/* Product Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry Status</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const status = getExpiryStatus(product.expiryDate);
                    return (
                      <TableRow key={product._id || product.id} className="group">
                        <TableCell className="font-medium text-slate-800">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal text-slate-500">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "font-medium",
                            product.quantity < 5 ? "text-red-500" : "text-slate-600"
                          )}>
                            {product.quantity} units
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product._id || product.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                      No products found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductManagement;
