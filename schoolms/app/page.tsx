export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#800000]">Dashboard</h2>
      <p className="text-[#600000]">Welcome to the School Management System dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#FFF8DC] p-3 rounded-lg shadow-md border border-[#D2B48C]">
          <h3 className="font-semibold text-[#800000] mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-[#600000]">150</p>
        </div>
        <div className="bg-[#FFF8DC] p-3 rounded-lg shadow-md border border-[#D2B48C]">
          <h3 className="font-semibold text-[#800000] mb-2">Total Teachers</h3>
          <p className="text-3xl font-bold text-[#600000]">20</p>
        </div>
        <div className="bg-[#FFF8DC] p-3 rounded-lg shadow-md border border-[#D2B48C]">
          <h3 className="font-semibold text-[#800000] mb-2">Classes</h3>
          <p className="text-3xl font-bold text-[#600000]">10</p>
        </div>
      </div>
    </div>
  );
}
