'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/client'

interface TestRecord {
  id: number
  created_at: string
  name: string
  mobile: number
}

export default function TestManager() {
  const [records, setRecords] = useState<TestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', mobile: '' })
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    fetchRecords()
  }, [])

  const testConnection = async () => {
    try {
      const { error } = await supabase.from('test').select('count').limit(1)
      if (error) throw error
      alert('Supabase connection successful!')
    } catch (error) {
      console.error('Connection test failed:', error)
      alert('Supabase connection failed. Check console for details.')
    }
  }

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('test')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.mobile) return

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('test')
          .update({ name: formData.name, mobile: parseInt(formData.mobile.toString()) } as never)
          .eq('id', editingId)

        if (error) throw error
        setEditingId(null)
      } else {
        // Create
        const { error } = await supabase
          .from('test')
          .insert([{ name: formData.name, mobile: parseInt(formData.mobile.toString()) }] as never)

        if (error) throw error
      }

      setFormData({ name: '', mobile: '' })
      fetchRecords()
    } catch (error) {
      console.error('Error saving record:', error)
    }
  }

  const handleEdit = (record: TestRecord) => {
    setFormData({ name: record.name, mobile: record.mobile.toString() })
    setEditingId(record.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const { error } = await supabase
        .from('test')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', mobile: '' })
    setEditingId(null)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[#800000]">Test Table Manager</h3>

      <div className="bg-[#FFF8DC] p-4 rounded-lg shadow-md border border-[#D2B48C]">
        <button
          onClick={testConnection}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Test Supabase Connection
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#FFF8DC] p-4 rounded-lg shadow-md border border-[#D2B48C]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#600000] mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-[#D2B48C] rounded focus:outline-none focus:ring-2 focus:ring-[#800000]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#600000] mb-1">Mobile</label>
            <input
              type="number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full p-2 border border-[#D2B48C] rounded focus:outline-none focus:ring-2 focus:ring-[#800000]"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-[#800000] text-white px-4 py-2 rounded hover:bg-[#600000] transition-colors"
          >
            {editingId ? 'Update' : 'Add'} Record
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-[#FFF8DC] p-4 rounded-lg shadow-md border border-[#D2B48C]">
        <h4 className="text-lg font-semibold text-[#800000] mb-4">Records</h4>
        {records.length === 0 ? (
          <p className="text-[#600000]">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-[#D2B48C]">
                  <th className="text-left p-2 text-[#600000]">ID</th>
                  <th className="text-left p-2 text-[#600000]">Name</th>
                  <th className="text-left p-2 text-[#600000]">Mobile</th>
                  <th className="text-left p-2 text-[#600000]">Created At</th>
                  <th className="text-left p-2 text-[#600000]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-[#D2B48C]">
                    <td className="p-2 text-[#600000]">{record.id}</td>
                    <td className="p-2 text-[#600000]">{record.name}</td>
                    <td className="p-2 text-[#600000]">{record.mobile}</td>
                    <td className="p-2 text-[#600000]">{new Date(record.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}