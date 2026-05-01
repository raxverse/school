'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  full_name: string
  phone: string
  role: 'admin' | 'teacher' | 'student'
  created_at: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return null
    }
    return data as UserProfile | null
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const profile = await fetchProfile(user.id)
        setState({ user, profile, loading: false, error: null })
      } else {
        setState({ user: null, profile: null, loading: false, error: null })
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            setState({ user: session.user, profile, loading: false, error: null })
          } else {
            setState({ user: null, profile: null, loading: false, error: null })
          }
        })()
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: phone || '' },
      },
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { user: null, error: error.message }
    }
    return { user: data.user, error: null }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { user: null, error: error.message }
    }
    return { user: data.user, error: null }
  }

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { user: null, error: error.message }
    }
    return { user: null, error: null }
  }

  const signInWithPhone = async (phone: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase.auth.signInWithOtp({ phone })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error: error.message }
    }
    return { error: null }
  }

  const verifyOtp = async (phone: string, token: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { user: null, error: error.message }
    }
    return { user: data.user, error: null }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setState(prev => ({ ...prev, error: error.message }))
    }
  }

  const getRolePath = useCallback((): string => {
    if (!state.profile) return '/auth/login'
    switch (state.profile.role) {
      case 'admin': return '/admin'
      case 'teacher': return '/teacher'
      case 'student': return '/student'
      default: return '/student'
    }
  }, [state.profile])

  return {
    ...state,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    signInWithPhone,
    verifyOtp,
    signOut,
    getRolePath,
  }
}
