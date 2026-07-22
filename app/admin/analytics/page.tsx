'use client'

import { useEffect, useState } from 'react'

export default function AdminAnalytics() {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topProducts: [] as Array<{ id: number; name: string; sales: number }>,
  })

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((result) => setData(result.data || data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics & Laporan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-secondary">
            Rp {data.totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Dari semua penjualan</div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Pesanan</div>
          <div className="text-3xl font-bold">{data.totalOrders}</div>
          <div className="text-xs text-muted-foreground mt-2">Pesanan selesai</div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Rata-rata Pesanan</div>
          <div className="text-3xl font-bold text-accent">
            Rp {data.avgOrderValue.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Per pesanan</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Produk Terlaris</h2>
        {data.topProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data penjualan
          </div>
        ) : (
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.id} className="flex justify-between items-center pb-4 border-b">
                <div>
                  <div className="font-medium">#{index + 1} {product.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{product.sales} penjualan</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
