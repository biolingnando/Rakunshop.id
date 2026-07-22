# RAKUNSHOP.ID - Complete Documentation Index

Panduan lengkap untuk understanding, running, deploying, dan maintaining RAKUNSHOP.ID.

## 📚 Documentation Files

### Getting Started
1. **[README.md](./README.md)** - Overview & feature list
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Quick start dan installation
3. **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)** - Production deployment

### Development
4. **[FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md)** - Feature status & roadmap
5. **[Architecture Guide](#architecture-guide)** (below) - System design

## 🎯 Quick Navigation

### I want to...

**Get it running locally**
→ Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Deploy to production**
→ Follow [DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)

**Understand the code**
→ Read [Architecture Guide](#architecture-guide) below

**Add new features**
→ Check [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) & code patterns

**Fix issues**
→ See "Troubleshooting" in [DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)

**Scale to many users**
→ Read "Scaling Considerations" in [DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)

## 🏗️ Architecture Guide

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    RAKUNSHOP.ID                         │
│            E-Commerce Platform for Digital Products    │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Member Area    │         │   Admin Area     │
│  (Buyers)        │         │  (Sellers)       │
│                  │         │                  │
│ - Browse Products │         │ - Add Products  │
│ - Shopping Cart   │         │ - Manage Orders │
│ - Checkout       │         │ - Analytics     │
│ - Order History  │         │ - Member Stats  │
└────────┬─────────┘         └────────┬────────┘
         │                            │
         └────────────┬───────────────┘
                      │
         ┌────────────▼────────────┐
         │   Next.js 16 Backend    │
         │   - API Routes          │
         │   - Server Actions      │
         │   - Better Auth         │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   PostgreSQL Database   │
         │   (Neon)               │
         │   - Users              │
         │   - Products           │
         │   - Orders             │
         │   - Payments           │
         └────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Next.js 16 | UI Components & SSR |
| **Styling** | Tailwind CSS v4 | Responsive Design |
| **Backend** | Next.js API Routes | REST API |
| **Auth** | Better Auth | User Authentication |
| **ORM** | Drizzle ORM | Database Access |
| **Database** | PostgreSQL (Neon) | Data Storage |
| **Deployment** | Vercel | Hosting & Scaling |

### Data Flow

```
Member/Admin
    ↓
Browser (Next.js Client)
    ↓
API Routes / Server Actions
    ↓
Better Auth (Session Management)
    ↓
Drizzle ORM (Type-safe queries)
    ↓
PostgreSQL Database (Neon)
```

## 📁 Project Structure

```
rakunshop-id/
│
├── app/                        # Next.js App Router
│   ├── page.tsx               # Root page (redirects)
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles + theme
│   │
│   ├── api/                   # API Routes
│   │   ├── auth/[...all]/     # Better Auth handler
│   │   ├── products/          # Product endpoints
│   │   ├── cart/              # Cart endpoints
│   │   ├── orders/            # Order endpoints
│   │   └── admin/             # Admin endpoints
│   │
│   ├── member/                # Member Area
│   │   ├── layout.tsx         # Member layout + nav
│   │   ├── dashboard/         # Home for members
│   │   ├── products/          # Product list
│   │   ├── product/[id]/      # Product details
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Payment flow
│   │   └── orders/            # Order history
│   │
│   ├── admin/                 # Admin Area
│   │   ├── layout.tsx         # Admin layout + nav
│   │   ├── page.tsx           # Dashboard
│   │   ├── products/          # Manage products
│   │   ├── orders/            # Manage orders
│   │   ├── members/           # Member list
│   │   └── analytics/         # Reports
│   │
│   └── sign-in/               # Auth Pages
│       └── sign-up/
│
├── lib/                       # Utilities & Config
│   ├── auth.ts               # Better Auth setup
│   ├── auth-client.ts        # Client auth hooks
│   └── db/
│       ├── index.ts          # Drizzle client
│       └── schema.ts         # Database schema
│
├── components/                # Reusable Components
│   └── auth-form.tsx         # Sign in/up form
│
├── scripts/                   # Utility Scripts
│   └── seed-data.js          # Sample data
│
├── public/                    # Static Assets
│
├── Documentation Files
│   ├── README.md             # Overview
│   ├── SETUP_GUIDE.md        # Getting started
│   ├── DEPLOYMENT_NOTES.md   # Production guide
│   ├── FEATURES_CHECKLIST.md # Feature status
│   └── INDEX.md              # This file
│
└── Configuration Files
    ├── package.json          # Dependencies
    ├── tsconfig.json         # TypeScript
    ├── next.config.ts        # Next.js config
    ├── tailwind.config.ts    # Tailwind config
    ├── postcss.config.js     # PostCSS config
    ├── .env.example          # Env template
    └── .npmrc                # NPM config
```

## 🔄 User Workflows

### Member Workflow

```
Sign Up / Sign In
    ↓
Browse Products (Dashboard → Products)
    ↓
View Product Details (Click product)
    ↓
Add to Cart (Add to Cart button)
    ↓
View Cart (Cart page)
    ↓
Checkout (Proceed to Payment)
    ↓
Select Payment Method (Bank Transfer)
    ↓
Complete Payment (Transfer money)
    ↓
Order Created (Pending status)
    ↓
Admin Verifies Payment
    ↓
Order Confirmed (Paid status)
    ↓
Download Product (Download button appears)
    ↓
Access Forever
```

### Admin Workflow

```
Sign In
    ↓
View Dashboard (Overview stats)
    ↓
Add New Product (Products → Add)
    ↓
View Orders (Orders page)
    ↓
Verify Payment (Check transfer proof)
    ↓
Confirm Order (Mark as paid)
    ↓
View Analytics (Revenue, top products)
    ↓
Manage Members (Member list & stats)
```

## 🔑 Key Components & Concepts

### Authentication (Better Auth)
- Email + Password auth
- Session management
- Cookie-based sessions
- Type-safe auth hooks

### Database (Drizzle ORM)
- Type-safe queries
- Schema-first design
- Query builder
- No migrations needed (we use SQL directly)

### API Structure
- REST endpoints
- Server Actions for mutations
- Error handling
- User scoping for security

### Styling (Tailwind CSS v4)
- Design tokens in CSS variables
- Responsive classes
- Component patterns
- Dark mode ready (not implemented yet)

## 📊 Database Schema

### Tables

| Table | Purpose | Key Columns |
|-------|---------|------------|
| **user** | User accounts | id, email, name, createdAt |
| **session** | Active sessions | id, userId, token, expiresAt |
| **products** | Digital products | id, userId, name, price, downloadUrl |
| **orders** | Customer orders | id, userId, productId, status, totalPrice |
| **cart** | Shopping items | id, userId, productId, quantity |
| **payments** | Payment records | id, orderId, userId, status, amount |
| **analyticsLog** | Event tracking | id, userId, event, data, createdAt |

## 🔐 Security Model

### Authentication
- Better Auth handles password hashing
- Session tokens stored securely
- CSRF protection built-in

### Authorization
- Admin check: email contains "admin" (simplistic - improve for production)
- User scoping: every query filters by userId
- No sensitive data exposed to client

### Data Protection
- SQL injection prevention (Drizzle ORM)
- Environment variables for secrets
- HTTPS enforced (via Vercel)

## 🚀 Deployment Architecture

### Local Development
```
npm run dev → http://localhost:3000
```

### Production (Vercel)
```
git push → Vercel → Vercel Edge Network
                  → Next.js Runtime
                  → PostgreSQL (Neon)
```

### Environment Variables
- Managed per environment
- Set in Vercel Project Settings
- Not committed to git
- Used via `process.env`

## 📈 Performance Considerations

### Current Optimizations
- Server Components for data fetching
- Server Actions for mutations
- Database query optimization
- Efficient ORM layer

### Bottlenecks (Low Priority)
- No caching layer
- No CDN for images
- No compression

## 🛠️ Common Tasks

### Add a New API Endpoint
1. Create file in `app/api/*/route.ts`
2. Export GET, POST, DELETE handlers
3. Use `auth` for authentication
4. Return `NextResponse.json()`

### Add a New Page
1. Create folder in `app/*/`
2. Create `page.tsx`
3. Add to navigation
4. Use layout from parent

### Modify Database Schema
1. Update `lib/db/schema.ts`
2. Create table via SQL (if new table)
3. Update server actions
4. Test with new code

### Deploy Changes
```bash
git add .
git commit -m "Feature: description"
git push origin main
# Vercel deploys automatically
```

## 📞 Getting Help

### Issues with Setup
→ Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting

### Issues with Deployment
→ Check [DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)

### Code Questions
→ Check relevant component or API route

### Feature Requests
→ Add to [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md)

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com/docs
- **Better Auth**: https://better-auth.com
- **Drizzle ORM**: https://orm.drizzle.team
- **PostgreSQL**: https://www.postgresql.org/docs

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-07-22 | Initial release - Core features |
| 1.1.0 | Planned | Email notifications |
| 1.2.0 | Planned | Stripe integration |
| 2.0.0 | Planned | Multi-vendor support |

## 🎯 Success Metrics

### Technical
- ✅ Type-safe code (TypeScript)
- ✅ Database security (Drizzle + userId scoping)
- ✅ Fast load times (Server Components)
- ✅ Easy deployment (Vercel)

### Business
- ✅ Admin can add products in 2 minutes
- ✅ Member can buy product in 3 clicks
- ✅ Payment verified within 1 hour
- ✅ Download works forever

## 🚀 Next Steps

1. **Get it running**: Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **Add products**: Use admin dashboard
3. **Test checkout**: Create test member account
4. **Deploy**: Follow [DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)
5. **Go live**: Launch and monitor!

---

**RAKUNSHOP.ID v1.0.0**
Platform e-commerce digital products terpercaya Indonesia.

**Questions?** Check the relevant docs above or review the code!

> 💡 **Tip**: Bookmark this page for quick reference during development!
