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

export default function MemberProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(products.map((p) => p.category))]
  const filteredProducts =
    filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Semua Produk Digital</h1>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded transition ${
              filter === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:opacity-80'
            }`}
          >
            {cat === 'all'
              ? 'Semua'
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada produk di kategori ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/member/product/${product.id}`}
              className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {product.image && (
                <div className="h-48 bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="text-xs text-secondary font-semibold mb-1">
                  {product.category.toUpperCase()}
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-accent">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </span>
                  <span className="text-primary text-sm font-semibold">
                    Lihat →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
