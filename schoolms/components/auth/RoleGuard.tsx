'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, type UserProfile } from '@/hooks/useAuth'

interface RoleGuardProps {
  allowedRole: UserProfile['role']
  children: React.ReactNode
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth/login')
      return
    }
    if (profile && profile.role !== allowedRole) {
      const rolePath = profile.role === 'admin' ? '/admin' : profile.role === 'teacher' ? '/teacher' : '/student'
      router.replace(rolePath)
    }
  }, [user, profile, loading, allowedRole, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]" />
      </div>
    )
  }

  if (!user || !profile || profile.role !== allowedRole) {
    return null
  }

  return <>{children}</>
}
