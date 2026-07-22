'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order {
  id: number
  productId: number
  status: string
  totalPrice: string
  createdAt: string
  downloadAccessUrl: string
}

export default function MemberOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/member/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pesanan Saya</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted">
          <p className="text-muted-foreground mb-4">Belum ada pesanan</p>
          <Link
            href="/member/products"
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 inline-block"
          >
            Mulai Berbelanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-lg">Pesanan #{order.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status === 'paid' ? 'Dibayar' : 'Pending'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Pembayaran
                  </div>
                  <div className="font-bold text-lg">
                    Rp {parseInt(order.totalPrice).toLocaleString('id-ID')}
                  </div>
                </div>
                {order.status === 'paid' && order.downloadAccessUrl ? (
                  <a
                    href={order.downloadAccessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:opacity-90"
                  >
                    Download
                  </a>
                ) : (
                  <Link
                    href={`/member/orders/${order.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90"
                  >
                    Detail
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
