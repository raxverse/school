'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import DashboardShell from '@/components/DashboardShell'

export default function StudentDashboard() {
  return (
    <RoleGuard allowedRole="student">
      <DashboardShell
        title="Student Dashboard"
        subtitle="View your courses, grades, and schedule"
        role="student"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Pending Assignments</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Average Grade</h3>
            <p className="text-3xl font-bold text-[#800000] mt-1">--</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#800000] mb-4">My Schedule</h3>
          <p className="text-gray-500 text-sm">No schedule entries to display.</p>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
