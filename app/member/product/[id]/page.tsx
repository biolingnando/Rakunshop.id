'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  price: string
  category: string
  image: string
  description: string
  downloadUrl: string
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  const handleAddToCart = async () => {
    setCartLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(productId),
          quantity,
        }),
      })

      if (response.ok) {
        alert('Produk ditambahkan ke keranjang!')
        router.push('/member/cart')
      } else {
        alert('Gagal menambahkan ke keranjang')
      }
    } finally {
      setCartLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Produk tidak ditemukan</p>
        <Link href="/member/products" className="text-primary hover:underline">
          Kembali ke Produk
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/member/products" className="text-primary hover:underline">
        ← Kembali
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg border"
            />
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="text-sm text-secondary font-semibold mb-2">
              {product.category.toUpperCase()}
            </div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
          </div>

          <p className="text-lg text-muted-foreground">{product.description}</p>

          <div className="border-t border-b py-6">
            <div className="text-4xl font-bold text-accent mb-2">
              Rp {parseInt(product.price).toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-muted-foreground">Harga satu kali bayar, akses selamanya</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jumlah</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border rounded px-3 py-2 hover:bg-muted"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border rounded px-4 py-2 w-20 text-center"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="border rounded px-3 py-2 hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded text-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {cartLoading ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </button>

            <button
              onClick={() => router.push('/member/checkout')}
              className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded text-lg font-semibold hover:opacity-90"
            >
              Beli Sekarang
            </button>
          </div>

          <div className="bg-muted p-4 rounded space-y-2">
            <div className="font-semibold">Apa yang Anda dapatkan:</div>
            <ul className="text-sm space-y-1">
              <li>✓ Akses penuh ke produk digital</li>
              <li>✓ Download seumur hidup</li>
              <li>✓ Update gratis selamanya</li>
              <li>✓ Support email prioritas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
