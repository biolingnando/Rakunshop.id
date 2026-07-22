# RAKUNSHOP.ID - Platform E-Commerce Digital Products

Platform e-commerce modern untuk menjual dan membeli produk digital (E-book, Template, Course, Software, dll) dengan sistem pembayaran lokal Indonesia yang aman dan terpercaya.

## 🎯 Fitur Utama

### Untuk Member (Pembeli)
- 🛒 Browse & Search Produk - Jelajahi koleksi produk digital berkualitas
- 🛍️ Shopping Cart - Tambah produk ke keranjang dan kelola pesanan
- 💳 Sistem Pembayaran - Transfer Bank (BCA, BNI, Mandiri)
- 📥 Download Digital - Akses seumur hidup ke produk yang dibeli
- 📋 Order History - Lihat riwayat pesanan dan status pembayaran
- 👤 Member Dashboard - Kelola profil dan transaksi

### Untuk Admin (Penjual)
- ✅ Manage Products - Tambah, edit, hapus produk dengan mudah
- 📊 Order Management - Kelola pesanan dan verifikasi pembayaran
- 👥 Member Management - Lihat data member dan statistik belanja
- 📈 Analytics Dashboard - Laporan penjualan, revenue, dan produk terlaris
- 💰 Revenue Tracking - Monitor total penjualan dan rata-rata order

## 🛠️ Teknologi Stack

- **Frontend**: Next.js 16 with React 19
- **Backend**: Next.js Server Actions & API Routes
- **Database**: PostgreSQL (Neon)
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS 4
- **ORM**: Drizzle ORM

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Neon (Database PostgreSQL)

### Environment Variables
Buat file `.env.local`:
```
DATABASE_URL=postgresql://username:password@host/database
BETTER_AUTH_SECRET=your-secret-key-32-chars-minimum
```

Generate BETTER_AUTH_SECRET:
```bash
openssl rand -base64 32
```

### Installation Steps

1. Clone repository
```bash
git clone <repository-url>
cd rakunshop-id
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 👥 User Roles

### Admin Account
- Email: admin@rakunshop.id (untuk login pertama)
- Akses: Dashboard admin, kelola produk, orders, members, analytics
- Route: `/admin`

### Member Account
- Membuat akun via sign-up
- Akses: Browse produk, shopping cart, checkout, order history
- Route: `/member`

## 📊 Database Schema

### Tables:
- **user** - Registered users (Better Auth)
- **session** - User sessions (Better Auth)
- **products** - Produk digital (admin upload)
- **orders** - Pesanan member
- **cart** - Shopping cart items
- **payments** - Payment records & verification
- **analyticsLog** - Event tracking

## 🔌 API Endpoints

### Public
- `GET /api/products` - List semua produk aktif

### Member (Auth Required)
- `GET /api/member/orders` - Get user's orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart?id=X` - Remove from cart
- `POST /api/orders` - Create order from cart

### Admin (Auth + Admin Check Required)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders
- `GET /api/admin/members` - Member list & stats
- `GET /api/admin/analytics` - Sales analytics

## 💳 Payment Methods

### Tersedia:
- ✅ Transfer Bank (BCA, BNI, Mandiri)

### Coming Soon:
- ⏳ E-Wallet (Dana, GCash)
- ⏳ Kartu Kredit

## 📁 File Structure

```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Home (redirect)
├── globals.css               # Global styles & theme
├── api/
│   ├── products/            # Product endpoints
│   ├── cart/                # Cart management
│   ├── orders/              # Order creation
│   └── admin/               # Admin analytics
├── sign-in/                 # Authentication pages
├── sign-up/
├── member/                  # Member area
│   ├── layout.tsx
│   ├── dashboard/
│   ├── products/
│   ├── product/[id]/
│   ├── cart/
│   ├── checkout/
│   └── orders/
└── admin/                   # Admin area
    ├── layout.tsx
    ├── page.tsx
    ├── products/
    ├── orders/
    ├── members/
    └── analytics/

lib/
├── auth.ts                  # Better Auth config
├── auth-client.ts          # Auth client
└── db/
    ├── index.ts            # Drizzle client
    └── schema.ts           # Database schema
```

## 🚀 Deployment

### Deploy ke Vercel
```bash
git push origin main
```

Vercel akan otomatis build dan deploy aplikasi.

### Environment Variables di Vercel
- Set `DATABASE_URL` di Vercel Project Settings
- Set `BETTER_AUTH_SECRET` di Vercel Project Settings

## 🐛 Troubleshooting

### "Unauthorized" error
- Check if `BETTER_AUTH_SECRET` is set
- Ensure user is authenticated

### "Database connection error"
- Verify `DATABASE_URL` is correct
- Check Neon credentials

## 📝 License
Proprietary - RAKUNSHOP.ID

## 📧 Support
Email: support@rakunshop.id

---

**Terima kasih telah menggunakan RAKUNSHOP.ID!** 🎉
