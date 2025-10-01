import React, { useState } from 'react';
import { mockProducts } from '../data/mockData';
import { AlertTriangle, Clock, Package, CheckCircle, X } from 'lucide-react';

const Alerts = () => {
  const [alertFilter, setAlertFilter] = useState('all');

  const expiredProducts = mockProducts.filter(p => p.isExpired);
  const expiringSoon = mockProducts.filter(p => p.isExpiringSoon);
  const lowStockProducts = mockProducts.filter(p => p.stock < 10);

  const allAlerts = [
    ...expiredProducts.map(p => ({
      id: `expired-${p.id}`,
      type: 'expired',
      product: p,
      message: `${p.name} has expired on ${p.expiryDate}`,
      severity: 'high',
      date: p.expiryDate
    })),
    ...expiringSoon.map(p => ({
      id: `expiring-${p.id}`,
      type: 'expiring',
      product: p,
      message: `${p.name} expires on ${p.expiryDate}`,
      severity: 'medium',
      date: p.expiryDate
    })),
    ...lowStockProducts.map(p => ({
      id: `low-stock-${p.id}`,
      type: 'low-stock',
      product: p,
      message: `${p.name} is running low (${p.stock} units left)`,
      severity: 'low',
      date: new Date().toISOString().split('T')[0]
    }))
  ];

  const filteredAlerts = allAlerts.filter(alert => {
    if (alertFilter === 'all') return true;
    return alert.type === alertFilter;
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'expired':
        return <X className="h-5 w-5 text-red-500" />;
      case 'expiring':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low-stock':
        return <Package className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity) => {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[severity]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)} Priority
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Alerts</h1>
            <p className="text-gray-600">Monitor critical issues that need your attention</p>
          </div>
          <div className="flex space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              {expiredProducts.length} Expired
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {expiringSoon.length} Expiring Soon
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {lowStockProducts.length} Low Stock
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { id: 'all', label: 'All Alerts', count: allAlerts.length },
            { id: 'expired', label: 'Expired', count: expiredProducts.length },
            { id: 'expiring', label: 'Expiring Soon', count: expiringSoon.length },
            { id: 'low-stock', label: 'Low Stock', count: lowStockProducts.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAlertFilter(tab.id)}
              className={`pb-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                alertFilter === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border-l-4 rounded-lg shadow-md p-6 ${getAlertColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.product.name}
                      </h3>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-gray-700 mb-3">{alert.message}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium text-gray-900">{alert.product.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <p className="font-medium text-gray-900">{alert.product.stock} units</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <p className="font-medium text-gray-900">${alert.product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Supplier:</span>
                        <p className="font-medium text-gray-900">{alert.product.supplier}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                    Resolve
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-500">
              {alertFilter === 'all' 
                ? 'All systems are running smoothly!' 
                : `No ${alertFilter.replace('-', ' ')} alerts at this time.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;