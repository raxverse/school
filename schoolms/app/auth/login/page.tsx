'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          // Check for rate limit error
          if (signUpError.message.includes('rate limit') || signUpError.message.includes('too many')) {
            throw new Error('Too many sign-up attempts. Please wait 1 hour or use a different email address.')
          }
          throw signUpError
        }

        setEmail('')
        setPassword('')
        setError(null)
        alert('Sign up successful! Please check your email to confirm.')
      } else {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        // Redirect to dashboard
        router.push('/')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8DC] to-[#FFE4B5]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl border-2 border-[#D2B48C] p-8">
          <h1 className="text-3xl font-bold text-center text-[#800000] mb-2">
            School Dashboard
          </h1>
          <p className="text-center text-[#600000] mb-6">
            {isSignUp ? 'Create a new account' : 'Sign in to your account'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#600000] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#D2B48C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#600000] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#D2B48C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#800000] hover:bg-[#600000] disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#600000] text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                  setEmail('')
                  setPassword('')
                }}
                className="ml-2 text-[#800000] font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-[#600000]">
          <p>Demo credentials (if available):</p>
          <p className="text-xs mt-2">Create an account to get started</p>
        </div>
      </div>
    </div>
  )
}
