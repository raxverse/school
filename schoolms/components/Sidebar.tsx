export default function Sidebar() {
  return (
    <aside className="w-48 bg-[#FFF8DC] p-3 min-h-screen border-r border-[#D2B48C]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#800000]">Navigation</h2>
      </div>
      <nav>
        <ul className="space-y-1">
          <li>
            <a href="#" className="block p-2 rounded-lg text-[#800000] hover:bg-[#F5DEB3] hover:text-[#600000] transition-colors font-medium">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded-lg text-[#800000] hover:bg-[#F5DEB3] hover:text-[#600000] transition-colors font-medium">Users</a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded-lg text-[#800000] hover:bg-[#F5DEB3] hover:text-[#600000] transition-colors font-medium">Settings</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}