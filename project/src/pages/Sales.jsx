import React, { useState } from 'react';
import { mockSales } from '../data/mockData';
import { Calendar, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import MetricCard from '../components/MetricCard';

const Sales = () => {
  const [dateFilter, setDateFilter] = useState('7');

  const totalSales = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalItems = mockSales.reduce((sum, sale) => sum + sale.items, 0);
  const averageSale = totalSales / mockSales.length;
  const todaySales = mockSales.slice(0, 1).reduce((sum, sale) => sum + sale.amount, 0);

  const getDailyStats = () => {
    const dailyStats = {};
    
    mockSales.forEach(sale => {
      const date = sale.date;
      if (!dailyStats[date]) {
        dailyStats[date] = { amount: 0, items: 0, transactions: 0 };
      }
      dailyStats[date].amount += sale.amount;
      dailyStats[date].items += sale.items;
      dailyStats[date].transactions += 1;
    });

    return Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const dailyStats = getDailyStats();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Analytics</h1>
            <p className="text-gray-600">Track your store's sales performance and trends</p>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          change="+15% from last period"
          changeType="positive"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Today's Sales"
          value={`$${todaySales.toFixed(2)}`}
          change="+8% from yesterday"
          changeType="positive"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="Items Sold"
          value={totalItems.toString()}
          change="Across all transactions"
          changeType="neutral"
          icon={BarChart3}
          color="purple"
        />
        <MetricCard
          title="Average Sale"
          value={`$${averageSale.toFixed(2)}`}
          change="Per transaction"
          changeType="neutral"
          icon={Calendar}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Breakdown */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Daily Sales Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dailyStats.map((stat) => (
                <div key={stat.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{stat.date}</p>
                        <p className="text-sm text-gray-500">{stat.transactions} transactions</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${stat.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{stat.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockSales.slice(0, 8).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Transaction #{sale.id}</p>
                    <p className="text-sm text-gray-500">{sale.date} • {sale.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${sale.amount.toFixed(2)}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;