import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Charts({ product = [] }) {
  const today = new Date();

  // 🗓️ Build array for this week's days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = days.map(day => ({ name: day, expiring: 0 }));

  // 🍽️ Count category totals
  const categoryTotals = {};

  product.forEach(p => {
    const exp = new Date(p.expiryDate);
    const dayIndex = exp.getDay();

    // If expiry is within this week
    const diffDays = (exp - today) / (1000 * 60 * 60 * 24);
    if (diffDays >= 0 && diffDays <= 7) {
      weeklyData[dayIndex].expiring += 1;
    }

    // Count category
    if (p.category) {
      categoryTotals[p.category] = (categoryTotals[p.category] || 0) + 1;
    }
  });

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* 📊 Bar Chart Card */}
      <div className="bg-gray-800 p-4 rounded-lg text-white">
        <h3 className="font-bold mb-4">Products Expiring This Week</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip wrapperClassName="bg-gray-700 rounded-lg" />
            <Bar dataKey="expiring" fill="#34D399" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🍩 Donut Chart Card */}
      <div className="bg-gray-800 p-4 rounded-lg text-white">
        <h3 className="font-bold mb-4">Product Category Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip wrapperClassName="bg-gray-700 rounded-lg" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
