import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "./Navbar";
import KpiCard from "./KpiCard";
import Chats from "./Chats";
import UrgentItemsTable from "./Urgentitems";
import AddProductModal from "../components/Addnewproduct";

import { FiBox, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

function MainContent() {
  const [products, setProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [expiredProducts, setExpiredProducts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all products, expiring products, and expired products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allRes = await axios.get("http://localhost:3000/products");
        setProducts(allRes.data);

        const expiringRes = await axios.get("http://localhost:3000/products/expiring");
        setExpiringProducts(expiringRes.data);

        const expiredRes = await axios.get("http://localhost:3000/products/expired");
        setExpiredProducts(expiredRes.data);
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
  <div className="flex-1 overflow-y-auto h-screen">
    {/* Sticky Navbar */}
  <div className="sticky top-0 z-50 w-full bg-gray-800 shadow-md border-b border-green-800">
    <Navbar onAddNewProduct={() => setIsModalOpen(true)} />
  </div>

    {/* Main content below the navbar */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      <KpiCard
        title="Total Products"
        value={products.length}
        icon={<FiBox size={24} />}
        color="blue"
      />
      <KpiCard
        title="Expiring Soon"
        value={expiringProducts.length}
        icon={<FiAlertTriangle size={24} />}
        color="orange"
      />
      <KpiCard
        title="Expired Today"
        value={expiredProducts.length}
        icon={<FiCheckCircle size={24} />}
        color="red"
      />
    </div>

    <Chats product={products} />
    <UrgentItemsTable items={products} />

    {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
  </div>
);
}

export default MainContent;
