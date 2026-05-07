function StatsCard({ title, value, subtitle, color }) {

  return (

    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:scale-105 transition">

      <div className={`w-14 h-14 rounded-2xl mb-5 ${color}`}></div>

      <h3 className="text-gray-600 mb-2">
        {title}
      </h3>

      <p className="text-4xl font-bold">
        {value}
      </p>

      <p className="text-orange-500 mt-2 text-sm">
        {subtitle}
      </p>

    </div>

  );
}

export default StatsCard;