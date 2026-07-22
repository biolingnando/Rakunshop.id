'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PaymentBank {
  bankName: string
  accountNumber: string
}

export default function MemberCheckout() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [selectedBank, setSelectedBank] = useState('BCA')
  const [loading, setLoading] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)

  const banks: Record<string, PaymentBank> = {
    BCA: {
      bankName: 'BCA',
      accountNumber: '1234567890 a/n PT RAKUNSHOP',
    },
    BNI: {
      bankName: 'BNI',
      accountNumber: '9876543210 a/n PT RAKUNSHOP',
    },
    Mandiri: {
      bankName: 'Mandiri',
      accountNumber: '5555666677 a/n PT RAKUNSHOP',
    },
  }

  const handleSubmitOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          bankName: selectedBank,
        }),
      })

      if (response.ok) {
        setOrderCreated(true)
        setTimeout(() => {
          router.push('/member/orders')
        }, 2000)
      } else {
        alert('Gagal membuat pesanan')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Proses Pembayaran</h1>

      {orderCreated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
          <div className="font-bold mb-2">Pesanan Berhasil Dibuat!</div>
          <p className="text-sm">Silakan lanjutkan ke halaman pesanan untuk detail lebih lanjut...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  name="payment"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Transfer Bank</div>
                  <div className="text-sm text-muted-foreground">
                    Transfer langsung ke rekening kami
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-muted opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="e_wallet"
                  disabled
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">E-Wallet (Dana, GCash)</div>
                  <div className="text-sm text-muted-foreground">
                    Segera hadir
                  </div>
                </div>
              </label>
            </div>
          </div>

          {paymentMethod === 'bank_transfer' && (
            <div className="border rounded-lg p-6 bg-blue-50">
              <h2 className="text-xl font-bold mb-4">Pilih Bank</h2>
              <div className="space-y-3">
                {Object.keys(banks).map((bank) => (
                  <label
                    key={bank}
                    className="flex items-center p-4 border border-blue-200 rounded cursor-pointer hover:bg-blue-100"
                  >
                    <input
                      type="radio"
                      name="bank"
                      value={bank}
                      checked={selectedBank === bank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{bank}</div>
                      <div className="text-sm text-muted-foreground">
                        {banks[bank].accountNumber}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Instruksi Pembayaran</h2>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Lakukan transfer sesuai nominal di bawah ini</li>
              <li>Upload bukti transfer pada halaman pesanan</li>
              <li>Tunggu verifikasi dari admin (biasanya &lt;1 jam)</li>
              <li>Terima akses download produk digital Anda</li>
            </ol>
          </div>
        </div>

        <div className="border rounded-lg p-6 h-fit sticky top-8">
          <h3 className="font-bold text-lg mb-4">Ringkasan Pembayaran</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Belanja</span>
              <span className="font-semibold">Rp 0</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Bayar</span>
                <span className="font-bold text-accent">Rp 0</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground px-4 py-3 rounded font-semibold hover:opacity-90 disabled:opacity-50 mb-2"
          >
            {loading ? 'Memproses...' : 'Buat Pesanan'}
          </button>

          <Link
            href="/member/cart"
            className="block text-center text-primary hover:underline text-sm"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  )
}
