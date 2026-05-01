'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import DashboardShell from '@/components/DashboardShell'

export default function TeacherDashboard() {
  return (
    <RoleGuard allowedRole="teacher">
      <DashboardShell
        title="Teacher Dashboard"
        subtitle="Manage your classes, assignments, and students"
        role="teacher"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">My Classes</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Assignments</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Students</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#800000] mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">No recent activity to display.</p>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
