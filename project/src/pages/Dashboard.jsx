import MetricCard from '../components/MetricCard';
import { mockProducts, mockSales } from '../data/mockData';
import { DollarSign, Package, AlertTriangle, TrendingUp, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css'; // ✅ Import custom CSS

const Dashboard = () => {
  const totalProducts = mockProducts.length;
  const expiredProducts = mockProducts.filter(p => p.isExpired).length;
  const expiringSoon = mockProducts.filter(p => p.isExpiringSoon).length;
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
  const todaySales = mockSales.slice(0, 1).reduce((sum, sale) => sum + sale.amount, 0);

  const recentSales = mockSales.slice(0, 5);
  const criticalProducts = mockProducts.filter(p => p.isExpired || p.isExpiringSoon);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Store Dashboard</h1>
        <p>Welcome back! Here's what's happening at your store.</p>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Products</h3>
          <p className="value">{totalProducts}</p>
        </div>

        <div className={`metric-card ${expiredProducts > 0 ? 'negative' : 'positive'}`}>
          <h3>Expired Items</h3>
          <p className="value">{expiredProducts}</p>
          <p className="change">{expiredProducts > 0 ? 'Needs attention' : 'All good'}</p>
        </div>

        <div className="metric-card neutral">
          <h3>Expiring Soon</h3>
          <p className="value">{expiringSoon}</p>
          <p className="change">Next 3 days</p>
        </div>

        <div className="metric-card positive">
          <h3>Today's Sales</h3>
          <p className="value">${todaySales.toFixed(2)}</p>
          <p className="change">+12% from yesterday</p>
        </div>

        <div className="metric-card positive">
          <h3>Total Sales</h3>
          <p className="value">${totalSales.toFixed(2)}</p>
          <p className="change">Last 7 days</p>
        </div>

        <div className="metric-card positive">
          <h3>Active Customers</h3>
          <p className="value">324</p>
          <p className="change">+5 new this week</p>
        </div>
      </div>

      {/* Recent Sales + Critical Products */}
      <div className="grid-container">
        {/* Recent Sales */}
        <div className="section-box">
          <h2>Recent Sales</h2>
          <div className="content">
            {recentSales.map((sale) => (
              <div key={sale.id} className="list-item">
                <div>
                  <p className="value">${sale.amount.toFixed(2)}</p>
                  <p className="small-text">{sale.items} items • {sale.date}</p>
                </div>
                <span className="status-badge green">Completed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Products */}
        <div className="section-box">
          <h2>Critical Products</h2>
          <div className="content">
            {criticalProducts.length > 0 ? (
              criticalProducts.map((product) => (
                <div key={product.id} className="list-item">
                  <div>
                    <p className="value">{product.name}</p>
                    <p className="small-text">Stock: {product.stock} • Expires: {product.expiryDate}</p>
                  </div>
                  <span
                    className={`status-badge ${product.isExpired ? 'red' : 'yellow'}`}
                  >
                    {product.isExpired ? 'Expired' : 'Expires Soon'}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <AlertTriangle size={48} />
                <p>No critical products at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
