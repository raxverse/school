'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Sidebar() {
  const pathname = usePathname()
  const { profile, loading } = useAuth()

  const role = profile?.role || 'student'

  const allLinks: Record<string, { href: string; label: string; icon: string }[]> = {
    admin: [
      { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { href: '/admin#users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ],
    teacher: [
      { href: '/teacher', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { href: '/teacher#classes', label: 'Classes', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    ],
    student: [
      { href: '/student', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { href: '/student#courses', label: 'Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    ],
  }

  const links = allLinks[role] || allLinks.student

  if (loading) {
    return (
      <aside className="w-56 bg-[#FFF8DC] p-4 min-h-screen border-r border-[#D2B48C]">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-[#F5DEB3] rounded w-24" />
          <div className="h-8 bg-[#F5DEB3] rounded" />
          <div className="h-8 bg-[#F5DEB3] rounded" />
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-56 bg-[#FFF8DC] p-4 min-h-screen border-r border-[#D2B48C] flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#800000]">Navigation</h2>
        <p className="text-xs text-[#600000] mt-0.5 capitalize">{role} panel</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors font-medium text-sm ${
                  pathname === link.href || pathname === link.href.split('#')[0]
                    ? 'bg-[#800000] text-white'
                    : 'text-[#800000] hover:bg-[#F5DEB3] hover:text-[#600000]'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-[#D2B48C]">
        <p className="text-xs text-[#600000]">School Management System</p>
      </div>
    </aside>
  )
}
