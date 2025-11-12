
function KpiCard({ title, value, icon, color }) {
  const colorVariants = {
    blue: 'from-blue-500 to-blue-700',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorVariants[color]} p-6 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-200">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-black bg-opacity-20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default KpiCard;