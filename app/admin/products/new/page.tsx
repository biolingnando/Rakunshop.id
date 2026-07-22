'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/app/actions/products'
import Link from 'next/link'

export default function NewProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'ebook',
    downloadUrl: '',
    image: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createProduct(formData)
      if (result.success) {
        router.push('/admin/products')
      } else {
        alert(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/products" className="text-primary hover:underline">
          ← Kembali
        </Link>
        <h1 className="text-3xl font-bold mt-2">Tambah Produk Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nama Produk *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Contoh: Panduan Photoshop Lengkap"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Deskripsi *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border rounded px-3 py-2"
            placeholder="Jelaskan detail produk Anda..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Harga (Rp) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="ebook">E-Book</option>
              <option value="template">Template</option>
              <option value="course">Course</option>
              <option value="software">Software</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL Download *</label>
          <input
            type="url"
            name="downloadUrl"
            value={formData.downloadUrl}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="https://drive.google.com/file/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL Gambar Produk</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
          <Link
            href="/admin/products"
            className="flex-1 bg-muted text-foreground px-4 py-2 rounded hover:opacity-90 text-center"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}
