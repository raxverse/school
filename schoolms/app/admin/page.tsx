'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import DashboardShell from '@/components/DashboardShell'
import AdminPanel from '@/components/AdminPanel'

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRole="admin">
      <DashboardShell
        title="Admin Dashboard"
        subtitle="Manage users, roles, and system settings"
        role="admin"
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Teachers</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
        </div>

        {/* Admin Panel */}
        <AdminPanel />
      </DashboardShell>
    </RoleGuard>
  )
}
