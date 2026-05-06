import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function KpiCard({ title, value, icon, color = "blue", trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
    orange: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
  };

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      className="h-full"
    >
      <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full overflow-hidden relative group">
        {/* Decorative background glow */}
        <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-40 blur-3xl group-hover:scale-150 transition-transform duration-700", colors[color].split(' ')[0])} />
        
        <CardContent className="p-6 flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-heading font-black text-slate-800 tracking-tight">{value}</h3>
            {trend && (
              <p className={cn("text-xs font-bold mt-2 flex items-center gap-1", trend > 0 ? "text-emerald-500" : "text-rose-500")}>
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={cn("p-4 rounded-2xl shadow-sm border border-white/60 backdrop-blur-sm", colors[color])}
          >
            {icon}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}