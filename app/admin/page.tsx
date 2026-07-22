'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Produk</div>
          <div className="text-3xl font-bold">{stats.totalProducts}</div>
          <Link href="/admin/products" className="text-primary text-sm mt-2">
            Kelola Produk →
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Pesanan Pending</div>
          <div className="text-3xl font-bold text-accent">{stats.pendingOrders}</div>
          <Link href="/admin/orders" className="text-primary text-sm mt-2">
            Lihat Pesanan →
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Pesanan</div>
          <div className="text-3xl font-bold">{stats.totalOrders}</div>
          <Link href="/admin/orders" className="text-primary text-sm mt-2">
            Lihat Detail →
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-secondary">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </div>
          <Link href="/admin/analytics" className="text-primary text-sm mt-2">
            Analytics →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products/new"
          className="bg-primary text-primary-foreground p-8 rounded-lg hover:opacity-90 transition"
        >
          <div className="text-xl font-bold">+ Tambah Produk Baru</div>
          <div className="text-sm mt-2 opacity-90">Mulai jual produk digital Anda</div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-secondary text-secondary-foreground p-8 rounded-lg hover:opacity-90 transition"
        >
          <div className="text-xl font-bold">Kelola Pesanan</div>
          <div className="text-sm mt-2 opacity-90">Proses pembayaran dan pengiriman</div>
        </Link>

        <Link
          href="/admin/members"
          className="bg-accent text-accent-foreground p-8 rounded-lg hover:opacity-90 transition"
        >
          <div className="text-xl font-bold">Data Member</div>
          <div className="text-sm mt-2 opacity-90">Kelola member dan analytics</div>
        </Link>
      </div>
    </div>
  )
}
