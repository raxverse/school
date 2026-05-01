'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/client'

interface Profile {
  id: string
  full_name: string
  phone: string
  role: 'admin' | 'teacher' | 'student'
  created_at: string
}

export default function AdminPanel() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId)
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole } as never)
        .eq('id', userId)

      if (updateError) throw updateError
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole as Profile['role'] } : u)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    teacher: 'bg-blue-100 text-blue-800 border-blue-200',
    student: 'bg-green-100 text-green-800 border-green-200',
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#800000]">User Management</h3>
        <p className="text-sm text-gray-500 mt-1">View all users and manage their roles</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'Unnamed'}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {user.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.phone || '--'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeColor[user.role]}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {updatingId === user.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#800000]" />
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-400">
        {users.length} user{users.length !== 1 ? 's' : ''} total
      </div>
    </div>
  )
}
