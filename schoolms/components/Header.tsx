'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function Header() {
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const role = profile?.role || 'student'

  return (
    <header className="bg-[#800000] text-white p-4 shadow-lg flex justify-between items-center">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 text-[#FFE4B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-12.74 0c.18-.9.378-1.79.59-2.67A48.39 48.39 0 0112 4.5c2.21 0 4.35.268 6.39.777.212.88.41 1.77.59 2.67M4.26 10.147a60.46 60.46 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347" />
        </svg>
        <h1 className="text-lg font-bold">School Management System</h1>
        <span className="hidden sm:inline-block px-2 py-0.5 bg-[#600000] rounded text-xs font-medium capitalize">
          {role}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#FFE4B5] hidden sm:block">
          {profile?.full_name || 'User'}
        </span>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="bg-[#600000] hover:bg-[#400000] disabled:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? '...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}
