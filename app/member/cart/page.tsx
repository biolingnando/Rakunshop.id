'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: number
  productId: number
  quantity: number
  product?: {
    name: string
    price: string
    image: string
  }
}

export default function MemberCart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        // For now, just use the data as is. In a real app, you'd enrich this with product info
        setCartItems(data.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (cartId: number) => {
    if (confirm('Hapus item dari keranjang?')) {
      const response = await fetch(`/api/cart?id=${cartId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        loadCart()
      }
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong!')
      return
    }
    router.push('/member/checkout')
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Keranjang Belanja</h1>
        <Link href="/member/products" className="text-primary hover:underline">
          Lanjut Belanja →
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted">
          <p className="text-muted-foreground mb-4">Keranjang Anda kosong</p>
          <Link
            href="/member/products"
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 inline-block"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="font-semibold">Produk #{item.productId}</div>
                  <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-destructive hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-6 h-fit sticky top-8">
            <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Item</span>
                <span className="font-semibold">{cartItems.length}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-accent">Rp 0</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Termasuk semua pajak
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded font-semibold hover:opacity-90 mb-2"
            >
              Lanjut ke Pembayaran
            </button>
            <Link
              href="/member/products"
              className="block text-center text-primary hover:underline text-sm"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
