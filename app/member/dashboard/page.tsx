'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: string
  category: string
  image: string
  description: string
}

export default function MemberDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di RAKUNSHOP.ID</h1>
        <p className="text-xl">
          Temukan koleksi produk digital berkualitas dari creators terbaik
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Produk Terbaru</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada produk tersedia
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {product.image && (
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-xs text-secondary font-semibold mb-1">
                    {product.category.toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-accent">
                      Rp {parseInt(product.price).toLocaleString('id-ID')}
                    </span>
                    <Link
                      href={`/member/product/${product.id}`}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90"
                    >
                      Lihat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
