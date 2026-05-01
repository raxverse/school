'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client'
import { useState } from 'react'

export default function Header() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      alert('Error logging out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-[#800000] text-[#FFF8DC] p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-xl font-bold">Project: School Management System</h1>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-[#600000] hover:bg-[#400000] disabled:bg-gray-500 text-[#FFF8DC] px-4 py-2 rounded font-semibold transition-colors"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </header>
  );
}