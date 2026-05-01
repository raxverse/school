'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth/login')
      return
    }
    if (profile) {
      switch (profile.role) {
        case 'admin': router.replace('/admin'); break
        case 'teacher': router.replace('/teacher'); break
        default: router.replace('/student'); break
      }
    }
  }, [user, profile, loading, router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]" />
    </div>
  )
}
