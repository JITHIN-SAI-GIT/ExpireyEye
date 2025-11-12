// src/components/AnalyticsDashboard.js

import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDollarSign, FaChartLine, FaShoppingCart, FaTrash } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// --- Reusable KPI Card Component ---
const KpiCard = ({ title, value, icon, color, bgColor }) => (
  <div className={`bg-slate-800 p-6 rounded-lg shadow-lg flex items-center justify-between border-l-4 ${color}`}>
    <div>
      <p className="text-sm text-gray-400 uppercase">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className={`text-4xl ${bgColor} p-3 rounded-full`}>
      {icon}
    </div>
  </div>
);

// --- Main Dashboard Component ---
const AnalyticsDashboard = () => {
  // --- Chart Data (Replace with API data) ---
  const revenueLineData = {
    labels: ['Sun', 'Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Revenue',
      data: [1200, 1900, 3000, 5000, 4200, 7800],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const salesByCategoryDoughnutData = {
    labels: ['Frozen Foods', 'Pantry', 'Personal Care', 'Meat'],
    datasets: [{
      data: [300, 50, 100, 120],
      backgroundColor: ['#3B82F6', '#10B981', '#F97316', '#EF4444'],
      hoverBackgroundColor: ['#2563EB', '#059669', '#EA580C', '#DC2626'],
      borderWidth: 0,
    }],
  };
  
  const topProductsBarData = {
    labels: ['French Fries', 'Pork Chops', 'Shampoo'],
    datasets: [{
      label: 'Revenue',
      data: [1800, 1590, 890],
      backgroundColor: ['#3B82F6', '#3B82F6', '#3B82F6'],
      borderRadius: 4,
    }],
  };

  // --- Chart Options ---
  const chartOptions = {
    plugins: { legend: { labels: { color: 'white' } } },
    scales: { 
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    maintainAspectRatio: false,
  };
  
  const doughnutOptions = {
    plugins: { legend: { position: 'right', labels: { color: 'white' } } },
    cutout: '70%',
    maintainAspectRatio: false,
  };


  // --- Table Data (Replace with API data) ---
  const mostProfitableProducts = [
    { name: 'Pork Chops', category: 'Meat', profit: '$720' },
    { name: 'Detergent', category: 'Household', profit: '$650' },
    { name: 'Shampoo', category: 'Personal Care', profit: '$430' },
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Store & Sales Overview</h1>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Revenue" value="$15,230" icon={<FaDollarSign />} color="border-blue-500" bgColor="text-blue-500" />
        <KpiCard title="Total Profit" value="$6,890" icon={<FaChartLine />} color="border-green-500" bgColor="text-green-500" />
        <KpiCard title="Total Items Sold" value="958 units" icon={<FaShoppingCart />} color="border-orange-500" bgColor="text-orange-500" />
        <KpiCard title="Cost of Waste" value="$415" icon={<FaTrash />} color="border-red-500" bgColor="text-red-500" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Revenue Over Time */}
        <div className="lg:col-span-3 bg-slate-800 p-6 rounded-lg shadow-lg h-80">
          <h2 className="text-xl font-semibold mb-4">Revenue Over Time - This Month</h2>
          <Line data={revenueLineData} options={chartOptions} />
        </div>

        {/* Sales by Category */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg h-80">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <Doughnut data={salesByCategoryDoughnutData} options={doughnutOptions} />
        </div>
      </div>
      
      {/* Tables/Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Top Selling Products */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-80">
           <h2 className="text-xl font-semibold mb-4">Top 5 Selling Products (by Revenue)</h2>
           <Bar data={topProductsBarData} options={{...chartOptions, indexAxis: 'y'}} />
        </div>

        {/* Most Profitable Products */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
           <h2 className="text-xl font-semibold mb-4">Most Profitable Products</h2>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-700">
                   <th className="py-2">Product Name</th>
                   <th className="py-2">Category</th>
                   <th className="py-2">Profit Generated</th>
                 </tr>
               </thead>
               <tbody>
                 {mostProfitableProducts.map((product, index) => (
                   <tr key={index} className="border-b border-slate-700 hover:bg-slate-700">
                     <td className="py-3">{product.name}</td>
                     <td className="py-3 text-gray-400">{product.category}</td>
                     <td className="py-3 font-medium text-green-400">{product.profit}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;