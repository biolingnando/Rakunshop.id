# RAKUNSHOP.ID - Setup Guide

Panduan lengkap untuk setup dan menjalankan aplikasi RAKUNSHOP.ID secara lokal maupun production.

## ✅ Prasyarat

- Node.js 18+ ([Download](https://nodejs.org/))
- Akun Neon PostgreSQL ([Sign Up](https://neon.tech/))
- Git

## 🚀 Quick Start (5 menit)

### 1. Clone Repository
```bash
git clone <repository-url>
cd rakunshop-id
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` dan tambahkan:
```
# Database (dari Neon)
DATABASE_URL=postgresql://username:password@host/database

# Auth Secret (generate dengan: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-generated-secret-here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📝 Akun Test

### Admin Account (untuk login pertama)
- **Email**: admin@rakunshop.id
- **Password**: admin123
- **Akses**: Dashboard admin, manage produk, orders, members, analytics

### Test Member Account
- **Email**: member@rakunshop.id
- **Password**: member123
- **Akses**: Browse produk, shopping cart, checkout, order history

> Buat akun baru via Sign Up page untuk testing member experience

## 🗄️ Database Setup

Database tables sudah otomatis terbuat saat Better Auth berjalan pertama kali. Tables yang dibuat:

- `user` - User authentication
- `session` - Session management
- `account` - OAuth accounts
- `verification` - Email verification
- `products` - Digital products
- `orders` - Customer orders
- `cart` - Shopping cart items
- `payments` - Payment records
- `analyticsLog` - Event logging

## 🌐 Deployment ke Vercel

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Initial RAKUNSHOP.ID setup"
git push origin main
```

### Step 2: Import ke Vercel
1. Buka [https://vercel.com/new](https://vercel.com/new)
2. Pilih repository Anda
3. Klik "Deploy"

### Step 3: Set Environment Variables di Vercel
1. Buka Project Settings → Environment Variables
2. Tambahkan:
   - `DATABASE_URL` (dari Neon)
   - `BETTER_AUTH_SECRET` (generate baru: `openssl rand -base64 32`)

### Step 4: Deploy
Vercel akan otomatis deploy. Tunggu hingga "Ready" (biasanya 1-2 menit).

## 🔧 Troubleshooting

### Error: "DATABASE_URL not set"
```bash
# Verifikasi di .env.local
cat .env.local | grep DATABASE_URL

# Verifikasi di Vercel Settings
# Project Settings → Environment Variables
```

### Error: "BETTER_AUTH_SECRET not valid"
```bash
# Generate secret baru
openssl rand -base64 32

# Update di .env.local
BETTER_AUTH_SECRET=<generated-secret>
```

### Database Connection Error
1. Check Neon credentials
2. Verify DATABASE_URL format: `postgresql://user:password@host/database`
3. Test connection: `psql $DATABASE_URL`

### Port 3000 already in use
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Atau gunakan port berbeda
npm run dev -- -p 3001
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build            # Build project
npm run start            # Start production server

# Linting
npm run lint             # Check code quality

# Database
node scripts/seed-data.js   # Insert sample data
```

## 🎯 User Flows

### Member (Pembeli)
1. **Sign Up** - Buat akun baru
2. **Sign In** - Login dengan email/password
3. **Browse Products** - Lihat semua produk digital
4. **Add to Cart** - Tambah produk ke keranjang
5. **Checkout** - Lanjut ke pembayaran
6. **Payment** - Pilih bank dan transfer
7. **Order History** - Lihat order dan download

### Admin (Penjual)
1. **Sign In** - Login dengan akun admin
2. **Add Products** - Tambah produk digital
3. **Manage Products** - Edit/hapus produk
4. **View Orders** - Lihat pesanan member
5. **Verify Payment** - Verifikasi bukti transfer
6. **View Analytics** - Lihat laporan penjualan

## 💳 Payment Methods (Current)

### Tersedia:
- BCA Transfer
- BNI Transfer  
- Mandiri Transfer

### Admin Bank Account
Bank account untuk menerima transfer (update di `app/member/checkout/page.tsx`):
- **BCA**: 1234567890 a/n PT RAKUNSHOP
- **BNI**: 9876543210 a/n PT RAKUNSHOP
- **Mandiri**: 5555666677 a/n PT RAKUNSHOP

## 🔒 Security Notes

### Jangan lupa:
1. Change admin password dari password default
2. Update bank account numbers di checkout page
3. Set `NEXT_PUBLIC_*` hanya untuk data non-sensitif
4. Enable HTTPS di production
5. Regular security updates: `npm audit fix`

### Environment Variables Safe
- Diletakkan di `.env.local` (tidak ter-commit)
- Di Vercel, set di Project Settings
- Tidak pernah expose di client-side code

## 📚 Project Structure

```
rakunshop-id/
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── api/             # API routes
│   ├── member/          # Member pages
│   ├── admin/           # Admin pages
│   └── sign-in/         # Auth pages
├── lib/                 # Utilities
│   ├── auth.ts          # Better Auth config
│   ├── auth-client.ts   # Client auth
│   └── db/              # Database
├── components/          # Reusable components
├── public/              # Static files
├── scripts/             # Utility scripts
└── package.json         # Dependencies
```

## 🚀 Next Steps

1. **Add More Products** - Use Admin Dashboard
2. **Customize Branding** - Update logos/colors in `globals.css`
3. **Add Payment Gateway** - Integrate Stripe/Midtrans
4. **Email Notifications** - Add SendGrid/Resend
5. **Analytics Tracking** - Add Plausible/Mixpanel

## 📞 Support

- **Issues**: GitHub Issues
- **Email**: support@rakunshop.id
- **Docs**: Check README.md

## 📄 License

Proprietary - RAKUNSHOP.ID

---

**Berhasil setup? Selamat datang di RAKUNSHOP.ID! 🎉**

> Tip: Bookmark halaman ini untuk referensi cepat saat development
