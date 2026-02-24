import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import AIProductScanner from "./AIProductScanner";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion } from "framer-motion";
import { FiX, FiUpload, FiCheck, FiCpu } from "react-icons/fi";

const AddNewProduct = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    expiryDate: "",
    username: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScanSuccess = ({ name, category, price, expiryDate }) => {
    setFormData((prev) => ({
      ...prev,
      name: name || prev.name,
      category: category || prev.category,
      price: price || prev.price,
      expiryDate: expiryDate || prev.expiryDate
    }));
    setIsScanning(false);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/add`,
        formData,
        {
          withCredentials: true,
          validateStatus: () => true
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("✅ Product added successfully!");

        // Trigger generic update callback
        if (typeof onProductAdded === "function") {
          onProductAdded();
        }

        // Handling Modal vs Route behavior
        if (onClose) {
          onClose(); // Close the modal (Dashboard stays mounted)
        } else {
          navigate("/dashboard"); // Redirect to dashboard (Route mode)
        }
      } else {
        console.warn("Non-success response:", response);
        alert(`❌ Failed to add product. (${response.status})`);
      }
    } catch (error) {
      console.error("Add product error:", error);
      alert("❌ Failed to add product (network/server error).");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-white/20 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-slate-800">Add New Product</CardTitle>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <FiX size={24} />
            </button>
          </CardHeader>
          <CardContent className="pt-2">
            {isScanning ? (
              <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <FiCpu className="text-primary" /> AI Scanner
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsScanning(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8">
                    Cancel
                  </Button>
                </div>
                <AIProductScanner onScanSuccess={handleScanSuccess} />
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsScanning(true)}
                className="w-full mb-6 border-dashed border-2 h-14 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 text-slate-600 gap-2 group"
              >
                <FiCpu className="text-primary group-hover:scale-110 transition-transform" />
                <span>Auto-Fill details via AI Scan</span>
              </Button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Product Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Fresh Milk"
              />

              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Dairy"
              />

              <div className="flex gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  containerClassName="flex-1"
                />

                <Input
                  label="Quantity"
                  type="number"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  containerClassName="flex-1"
                />
              </div>

              <Input
                label="Expiry Date"
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
              />

              <div className="flex gap-3 mt-6 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 shadow-lg shadow-primary/20"
                  leftIcon={isSubmitting ? null : <FiCheck />}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddNewProduct;
