import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';

export default function KpiCard({ title, value, icon, color = "blue", trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card hover className="border-0 shadow-soft h-full">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1 tracking-tight">{value}</h3>
          {trend && (
            <p className={cn("text-xs font-medium mt-1 flex items-center", trend > 0 ? "text-green-600" : "text-red-600")}>
              {trend > 0 ? "+" : ""}{trend}% from last month
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colors[color])}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}