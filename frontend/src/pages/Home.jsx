export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold text-white">League Overview</h1>
      <p className="text-gray-400">
        Welcome to the Westcubes Premier Football League admin dashboard.
      </p>

      {/* State-of-the-art stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card p-6 rounded-xl border border-gray-800 shadow-md">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Total Teams
          </h3>
          <p className="text-3xl font-bold mt-2 text-white">0</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800 shadow-md">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Matches Played
          </h3>
          <p className="text-3xl font-bold mt-2 text-white">0</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800 shadow-md">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Top Scorer
          </h3>
          <p className="text-3xl font-bold mt-2 text-white">-</p>
        </div>
      </div>
    </div>
  );
}
