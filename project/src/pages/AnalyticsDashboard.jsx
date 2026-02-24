import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaTrash, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { cn } from '../lib/utils';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// --- Reusable KPI Card Component ---
const KpiCard = ({ title, value, icon, color, subtext, className }) => (
  <Card className={cn("border-l-4", color, className)}>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
      <div className={cn("text-3xl p-3 rounded-full bg-slate-50", color.replace('border-', 'text-'))}>
        {icon}
      </div>
    </CardContent>
  </Card>
);

// --- Helper Functions ---
const getDaysUntilExpiry = (dateStr) => {
  if (!dateStr) return 999;
  const today = new Date();
  const expiry = new Date(dateStr);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// --- Main Dashboard Component ---
const AnalyticsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-slate-500">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  // --- Metrics Calculations ---
  let totalWasteValue = 0;
  let expiringSoonCount = 0;
  let freshCount = 0;
  let expiredCount = 0;
  const categoryWaste = {};
  const criticalItems = [];

  products.forEach(p => {
    const daysLeft = getDaysUntilExpiry(p.expiryDate);
    const value = parseFloat(p.price) * (p.quantity || 1);

    if (daysLeft < 0) {
      // Expired
      expiredCount++;
      totalWasteValue += value;
    } else if (daysLeft <= 7) {
      // Expiring Soon
      expiringSoonCount++;
      categoryWaste[p.category] = (categoryWaste[p.category] || 0) + value;
      criticalItems.push({ ...p, daysLeft, value });
    } else {
      // Fresh
      freshCount++;
    }
  });

  criticalItems.sort((a, b) => a.daysLeft - b.daysLeft); // Sort by urgency

  // --- Chart Data ---

  // 1. Expiry Status Distribution (Pie)
  const expiryStatusData = {
    labels: ['Expired (Lost)', 'Expiring Soon (Action Needed)', 'Fresh (Safe)'],
    datasets: [{
      data: [expiredCount, expiringSoonCount, freshCount],
      backgroundColor: ['#ef4444', '#f97316', '#22c55e'],
      borderWidth: 0,
    }],
  };

  // 2. Potential Waste by Category (Bar) - Value of items expiring in < 7 days
  const sortedWasteCats = Object.entries(categoryWaste).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const wasteLabels = sortedWasteCats.map(x => x[0]);
  const wasteValues = sortedWasteCats.map(x => x[1]);

  const wasteByCategoryData = {
    labels: wasteLabels.length ? wasteLabels : ['No Urgent Waste'],
    datasets: [{
      label: 'Potential Loss ($)',
      data: wasteValues.length ? wasteValues : [0],
      backgroundColor: '#f59e0b',
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { labels: { color: '#64748b' } }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: '#f1f5f9' },
        border: { display: false }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-slate-50/50 text-slate-900 min-h-screen p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-800">Expiry & Waste Analytics</h1>
          <p className="text-slate-500 mt-1">Insights into inventory freshness and potential losses.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Current Waste Cost"
            value={`₹${totalWasteValue.toFixed(2)}`}
            icon={<FaTrash />}
            color="border-red-500"
            subtext="Value of expired items"
          />
          <KpiCard
            title="Expiring This Week"
            value={`${expiringSoonCount} Items`}
            icon={<FaExclamationTriangle />}
            color="border-orange-500"
            subtext="Consumables needing action"
          />
          <KpiCard
            title="Fresh Inventory"
            value={`${freshCount} Items`}
            icon={<FaCheckCircle />}
            color="border-green-500"
            subtext="Safe for > 7 days"
          />
          <KpiCard
            title="Waste Prevention"
            value={products.length ? `${((freshCount / products.length) * 100).toFixed(0)}%` : 'N/A'}
            icon={<FaClock />}
            color="border-blue-500"
            subtext="Freshness Efficiency Score"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expiry Status */}
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Inventory Health</CardTitle>
            </CardHeader>
            <CardContent className="h-80 pb-6">
              <Pie data={expiryStatusData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#64748b' } } }, maintainAspectRatio: false }} />
            </CardContent>
          </Card>

          {/* Waste by Category */}
          <Card className="h-96">
            <CardHeader>
              <CardTitle>High Risk Categories (Expiring Soon)</CardTitle>
            </CardHeader>
            <CardContent className="h-80 pb-6">
              <Bar data={wasteByCategoryData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>

        {/* Critical Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <FaExclamationTriangle /> Critical Priority: Consume Immediately
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Expires In</th>
                    <th className="p-3">Value At Risk</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criticalItems.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">No critical items found. Good job!</td></tr>
                  ) : (
                    criticalItems.slice(0, 8).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium text-slate-700">{item.name}</td>
                        <td className="p-3 text-slate-500">{item.category}</td>
                        <td className="p-3 font-bold text-orange-500">{item.daysLeft} days</td>
                        <td className="p-3 text-slate-600">₹{item.value.toFixed(2)}</td>
                        <td className="p-3">
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">Urgent</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;