import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import KpiCard from './Kpicard';
import Navbar from "./Navbar";
import Charts from "./Chats";
import AddProductModal from "../components/Addnewproduct";
import { FiBox, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

function MainContent() {
  const [products, setProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [urgentProducts, setUrgentProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all products, expiring products, and expired products
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allRes, urgentRes, expiringRes, expiredRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/products/urgent`),
        axios.get(`${API_BASE_URL}/products/expiring`),
        axios.get(`${API_BASE_URL}/products/expired`)
      ]);

      setProducts(allRes.data);
      setUrgentProducts(urgentRes.data);
      setExpiringProducts(expiringRes.data);
      setExpiredProducts(expiredRes.data);
    } catch (err) {
      console.error("Error fetching product data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isModalOpen]);

  const runMLEngine = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/ml/predict-discount`);
      alert(`🧠 ML Engine Run Successfully!\n\n📋 Scored: ${res.data.productsScored} items\n🏷️ Discounted: ${res.data.discountedItems} items`);
      fetchData(); // Refresh data immediately
    } catch (err) {
      console.error(err);
      alert("Failed to run ML Engine");
    }
  };

  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to resolve/delete this product?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      // Optimistic update
      setUrgentProducts(p => p.filter(i => i._id !== id));
      setExpiringProducts(p => p.filter(i => i._id !== id));
      alert("Product processed/removed.");
    } catch (err) {
      console.error(err);
    }
  };

  const applyDiscount = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/products/${id}/discount`, { discount: 50 });
      alert("✅ 50% Discount Applied! Prices updated in POS.");
      fetchData(); // Refresh list to show updated status
    } catch (err) {
      console.error(err);
      alert("Failed to apply discount");
    }
  };

  const wastePreventedCount = products.filter(p => p.ml_discount > 0).length;
  const potentialRecovery = products.reduce((acc, p) => p.ml_discount > 0 ? acc + (p.price * (1 - p.ml_discount / 100) * p.quantity) : acc, 0).toFixed(0);

  return (
    <div className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
      <Navbar onAddNewProduct={() => setIsModalOpen(true)} />

      <main className="container mx-auto px-6 py-8 space-y-8 max-w-7xl animate-fade-in">

        {/* 🧠 Admin Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-soft gap-4"
        >
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
              <span className="text-2xl">⚡</span> System Controls
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage AI scoring and inventory updates manually</p>
          </div>
          <Button
            variant="primary"
            onClick={runMLEngine}
            leftIcon={<FaMoneyBillWave />}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark shadow-lg shadow-primary/20"
          >
            Recalculate Discounts
          </Button>
        </motion.div>

        {/* 📈 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KpiCard
            title="Total Products"
            value={products.length}
            icon={<FiBox size={24} />}
            color="blue"
            trend={12}
          />
          <KpiCard
            title="Urgent Actions"
            value={urgentProducts.length}
            icon={<FiAlertTriangle size={24} />}
            color="red"
            trend={-5}
          />
          <KpiCard
            title="Expired Today"
            value={expiredProducts.length}
            icon={<FiCheckCircle size={24} />}
            color="orange"
          />
          <KpiCard
            title="Potential Recovery"
            value={`₹${potentialRecovery}`}
            icon={<FaMoneyBillWave size={24} />}
            color="green"
            trend={8}
          />
          <KpiCard
            title="Waste Prevented"
            value={`${wastePreventedCount} Items`}
            icon={<FiCheckCircle size={24} />}
            color="green"
          />
        </div>

        {/* 📊 Graphs Section */}
        <div className="grid grid-cols-1 gap-6">
          <Charts product={products} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ⚠️ Expiring This Week Section */}
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FiAlertTriangle className="text-orange-500" />
                Expiring This Week
              </CardTitle>
              <Badge variant="warning">{expiringProducts.length} Items</Badge>
            </CardHeader>
            <CardContent>
              {expiringProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FiCheckCircle size={48} className="mb-4 text-green-100" />
                  <p>No products expiring likely this week. Good job!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringProducts.map(p => {
                      const days = getDaysLeft(p.expiryDate);
                      return (
                        <TableRow key={p._id}>
                          <TableCell className="font-medium text-slate-700">
                            {p.name}
                            <div className="text-xs text-slate-400">{p.category}</div>
                          </TableCell>
                          <TableCell>{new Date(p.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={days <= 3 ? "destructive" : "warning"}>
                              {days} Days Left
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* 🚨 Urgent Items Section */}
          <Card className={cn("h-full border-red-100", urgentProducts.length > 0 && "shadow-red-500/10")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                <FiAlertTriangle />
                Urgent: 48h Left
              </CardTitle>
              <Badge variant="destructive">{urgentProducts.length} Critical</Badge>
            </CardHeader>
            <CardContent>
              {urgentProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FiCheckCircle size={48} className="mb-4 text-green-100" />
                  <p>No critical items. You are fully stocked!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urgentProducts.map(p => (
                      <TableRow key={p._id} className="hover:bg-red-50/50">
                        <TableCell className="font-bold text-slate-700">
                          {p.name}
                        </TableCell>
                        <TableCell className="text-red-500 font-medium">
                          {getDaysLeft(p.expiryDate)} Days
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary" // Changed from danger to distinguish actions
                            onClick={() => applyDiscount(p._id)}
                            leftIcon={<FaMoneyBillWave size={14} />}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Apply 50%
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteProduct(p._id)}
                            leftIcon={<FiTrash2 size={14} />}
                          >
                            Resolve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

      </main>

      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} onProductAdded={fetchData} />}
    </div>
  );
}

export default MainContent;
