'use client'

import { useEffect, useState } from 'react'

interface Order {
  id: number
  productId: number
  userId: string
  quantity: number
  totalPrice: string
  status: string
  paymentMethod: string
  createdAt: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status === filter
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kelola Pesanan</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:opacity-80'
          }`}
        >
          Semua ({orders.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${
            filter === 'pending'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:opacity-80'
          }`}
        >
          Pending ({orders.filter((o) => o.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded ${
            filter === 'paid'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:opacity-80'
          }`}
        >
          Dibayar ({orders.filter((o) => o.status === 'paid').length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted">
          <p className="text-muted-foreground">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Member</th>
                <th className="border p-3 text-left">Total</th>
                <th className="border p-3 text-left">Metode</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Tanggal</th>
                <th className="border p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted">
                  <td className="border p-3 font-semibold">#{order.id}</td>
                  <td className="border p-3 text-sm">{order.userId.substring(0, 8)}...</td>
                  <td className="border p-3 font-semibold">
                    Rp {parseInt(order.totalPrice).toLocaleString('id-ID')}
                  </td>
                  <td className="border p-3 text-sm">{order.paymentMethod}</td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status === 'paid' ? 'Dibayar' : 'Pending'}
                    </span>
                  </td>
                  <td className="border p-3 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="border p-3 text-center">
                    <button className="text-primary hover:underline text-sm">
                      Lihat
                    </button>
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
