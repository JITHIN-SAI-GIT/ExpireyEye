import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

/* 🔹 Mock data (used if product is missing or invalid) */
const MOCK_PRODUCTS = [
  { name: "Milk", category: "Dairy", expiryDate: "2025-12-19" },
  { name: "Cheese", category: "Dairy", expiryDate: "2025-12-20" },
  { name: "Bread", category: "Bakery", expiryDate: "2025-12-21" },
  { name: "Apple", category: "Fruits", expiryDate: "2025-12-22" },
  { name: "Chicken", category: "Meat", expiryDate: "2025-12-23" },
  { name: "Yogurt", category: "Dairy", expiryDate: "2025-12-24" },
  { name: "Orange", category: "Fruits", expiryDate: "2025-12-25" },
];

function Charts({ product }) {
  /* ✅ HARD SAFETY: always work with an array */
  const products = Array.isArray(product) && product.length > 0
    ? product
    : MOCK_PRODUCTS;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* 🗓️ Days of the week */
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = days.map((day) => ({ name: day, expiring: 0 }));

  /* 🍽️ Category totals */
  const categoryTotals = {};

  products.forEach((p) => {
    if (!p?.expiryDate) return;

    const exp = new Date(p.expiryDate);
    exp.setHours(0, 0, 0, 0);

    const diffDays =
      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    /* Products expiring within next 7 days */
    if (diffDays >= 0 && diffDays <= 7) {
      const dayIndex = exp.getDay();
      weeklyData[dayIndex].expiring += 1;
    }

    /* Category count */
    if (p.category) {
      categoryTotals[p.category] =
        (categoryTotals[p.category] || 0) + 1;
    }
  });

  const categoryData = Object.entries(categoryTotals).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* 📊 Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Products Expiring This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar
                dataKey="expiring"
                fill="#22c55e" // primary green
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🍩 Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Product Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Charts;
