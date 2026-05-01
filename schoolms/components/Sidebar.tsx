'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/#users', label: 'Users', icon: '👥' },
    { href: '/#settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-48 bg-[#FFF8DC] p-3 min-h-screen border-r border-[#D2B48C]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#800000]">Navigation</h2>
      </div>
      <nav>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block p-2 rounded-lg transition-colors font-medium ${
                  pathname === link.href
                    ? 'bg-[#800000] text-[#FFF8DC]'
                    : 'text-[#800000] hover:bg-[#F5DEB3] hover:text-[#600000]'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}