'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DashboardShellProps {
  title: string
  subtitle: string
  role: string
  children: React.ReactNode
}

export default function DashboardShell({ title, subtitle, role, children }: DashboardShellProps) {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOut()
    router.push('/auth/login')
  }

  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    teacher: 'bg-blue-100 text-blue-800 border-blue-200',
    student: 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#800000]">{title}</h2>
          <p className="text-[#600000] mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleBadgeColor[role] || ''}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <span className="text-sm text-gray-600">{profile?.full_name || profile?.id?.slice(0, 8)}</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="bg-[#600000] hover:bg-[#400000] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loggingOut ? '...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
