'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAdminProducts, deleteProduct } from '@/app/actions/products'

interface Product {
  id: number
  name: string
  price: string
  category: string
  isActive: boolean
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const result = await getAdminProducts()
    if (result.success) {
      setProducts(result.data as Product[])
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      const result = await deleteProduct(id)
      if (result.success) {
        loadProducts()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kelola Produk</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90"
        >
          + Tambah Produk
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted">
          <p className="text-muted-foreground mb-4">Belum ada produk</p>
          <Link
            href="/admin/products/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 inline-block"
          >
            Buat Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left">Nama</th>
                <th className="border p-3 text-left">Kategori</th>
                <th className="border p-3 text-left">Harga</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted">
                  <td className="border p-3 font-medium">{product.name}</td>
                  <td className="border p-3 text-sm text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="border p-3 font-semibold">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:underline text-sm"
                    >
                      Hapus
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
