'use client'

import { useEffect, useState } from 'react'

interface Member {
  id: string
  email: string
  name: string
  createdAt: string
  totalOrders: number
  totalSpent: string
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/members')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Data Member</h1>

      <div className="bg-white border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Total Member</div>
            <div className="text-2xl font-bold">{members.length}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Transaksi</div>
            <div className="text-2xl font-bold">
              {members.reduce((sum, m) => sum + m.totalOrders, 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Diterima</div>
            <div className="text-2xl font-bold text-secondary">
              Rp{' '}
              {members
                .reduce((sum, m) => sum + parseInt(m.totalSpent || '0'), 0)
                .toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted">
          <p className="text-muted-foreground">Belum ada member</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Nama</th>
                <th className="border p-3 text-left">Pesanan</th>
                <th className="border p-3 text-left">Total Belanja</th>
                <th className="border p-3 text-left">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-muted">
                  <td className="border p-3 font-medium">{member.email}</td>
                  <td className="border p-3">{member.name}</td>
                  <td className="border p-3 text-center">{member.totalOrders}</td>
                  <td className="border p-3 font-semibold">
                    Rp {parseInt(member.totalSpent || '0').toLocaleString('id-ID')}
                  </td>
                  <td className="border p-3 text-sm">
                    {new Date(member.createdAt).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
