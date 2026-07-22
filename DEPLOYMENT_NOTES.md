# RAKUNSHOP.ID - Deployment & Configuration Notes

Catatan penting untuk deployment dan konfigurasi aplikasi RAKUNSHOP.ID.

## 🚀 Quick Start to Production

### Step 1: Git Push
```bash
git add .
git commit -m "RAKUNSHOP.ID v1.0.0 - Complete e-commerce platform"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"

### Step 3: Environment Setup
In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=<your-secret-key-generated>
```

### Step 4: Deploy
- Vercel auto-deploys when you push to main
- Deployment completes in 1-2 minutes
- Visit your production URL

## 🔧 Configuration Issues & Solutions

### Issue: Tailwind CSS PostCSS Error
**Error Message:**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin...
```

**Solution:**
This is resolved by using Tailwind v4 properly:
1. ✅ Install `@tailwindcss/postcss` (already in package.json)
2. ✅ Use `@tailwindcss/postcss` in postcss.config.js (already configured)
3. ✅ Import `@tailwind` directives in globals.css (already configured)

If still getting error locally:
```bash
npm install @tailwindcss/postcss --legacy-peer-deps
npm run dev
```

### Issue: Database Connection Failed
**Solution:**
1. Verify DATABASE_URL format: `postgresql://user:password@host/database`
2. Ensure Neon project is active
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`
4. For Vercel: Set env vars in Project Settings

### Issue: Auth Sessions Not Persisting
**Solution:**
1. Verify `BETTER_AUTH_SECRET` is set and ≥32 characters
2. Regenerate if needed: `openssl rand -base64 32`
3. Ensure cookie settings in dev: `sameSite: "none", secure: true`
4. Clear browser cookies and sign in again

## 📦 Dependencies Notes

### Core Stack
- **Next.js 16** - Framework
- **React 19** - UI library
- **Better Auth** - Authentication
- **Drizzle ORM** - Database layer
- **PostgreSQL** - Database (Neon)
- **Tailwind CSS v4** - Styling

### Key Versions
- `next@16.0.0` - Latest stable
- `better-auth@1.6.23` - Session management
- `tailwindcss@4.0.0` - CSS framework (uses new PostCSS plugin)
- `drizzle-orm@0.45.2` - Type-safe ORM

### Dev Dependencies
- `eslint@9.0.0` - Linting (v9 for Next.js 16 compatibility)
- `typescript@5.0.0` - Type checking
- `@types/pg@8.20.0` - PostgreSQL types

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Sign in (Better Auth)
- `POST /api/auth/callback/email` - Email auth (if enabled)
- `GET /api/auth/session` - Get current session

### Member APIs
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `DELETE /api/cart?id=X` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/member/orders` - Get member orders

### Admin APIs
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `GET /api/admin/members` - Member list
- `GET /api/admin/analytics` - Analytics

## 🔒 Security Checklist

Before going to production:

- [ ] Change admin password from default
- [ ] Update bank account numbers in `/app/member/checkout/page.tsx`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set strong BETTER_AUTH_SECRET (32+ characters)
- [ ] Enable database backups in Neon
- [ ] Setup error tracking (optional but recommended)
- [ ] Review DATABASE_URL is not exposed in code
- [ ] Setup rate limiting (if using paid APIs)
- [ ] Enable CSRF protection (built-in with Better Auth)

## 📊 Database Initialization

Database tables are auto-created by Better Auth on first run. If you need to:

### Reset Database
1. Delete all tables in Neon console
2. Re-start dev server: `npm run dev`
3. Tables will recreate automatically

### Add Sample Data
```bash
node scripts/seed-data.js
```

Update the script with correct admin user ID first!

## 🎯 Performance Optimization

### Already Optimized
- ✅ Server Components for data fetching
- ✅ Server Actions for mutations
- ✅ Image optimization placeholder
- ✅ Drizzle ORM query optimization
- ✅ PostgreSQL indexing on user_id

### Optional Improvements
- [ ] Add image CDN (Cloudinary, Imgix)
- [ ] Setup caching headers
- [ ] Enable database query caching
- [ ] Add response compression
- [ ] Setup monitoring (Sentry, Datadog)
- [ ] Add analytics (Plausible, Mixpanel)

## 🚀 Scaling Considerations

### Current Limits
- Single database (Neon free tier: sufficient for MVP)
- No caching layer
- No CDN for static assets
- No session cache

### Scale to 10K+ Users
1. Add Redis cache layer (Upstash)
2. Setup CDN (Vercel Edge Network)
3. Increase Neon compute power
4. Add database read replicas
5. Setup monitoring & alerting

## 📝 Maintenance

### Weekly
- Check error logs (if using Sentry)
- Monitor database size in Neon
- Check payment queue for pending orders

### Monthly
- Review analytics
- Optimize slow queries
- Check for security updates: `npm audit`

### Quarterly
- Update dependencies: `npm update`
- Review and optimize database
- Analyze customer feedback

## 🆘 Troubleshooting Checklist

### Application won't start
```bash
# 1. Check dependencies
npm install --legacy-peer-deps

# 2. Check environment variables
cat .env.local

# 3. Check database connection
psql $DATABASE_URL -c "SELECT 1"

# 4. Check logs
npm run dev 2>&1 | grep -i error
```

### Sign-in not working
```bash
# 1. Verify session table exists
psql $DATABASE_URL -c "SELECT * FROM session LIMIT 1"

# 2. Check BETTER_AUTH_SECRET
echo $BETTER_AUTH_SECRET | wc -c  # Should be ≥32

# 3. Clear cookies and try again
```

### Orders not creating
```bash
# 1. Check database connection
psql $DATABASE_URL

# 2. Verify cart and orders tables exist
\dt orders
\dt cart

# 3. Check server logs for errors
```

## 📞 Support & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Better Auth**: https://better-auth.com
- **Drizzle ORM**: https://orm.drizzle.team
- **PostgreSQL**: https://www.postgresql.org/docs
- **Neon**: https://neon.tech/docs

## 🎉 Launch Checklist

- [ ] All tests passing
- [ ] Database initialized and tested
- [ ] Environment variables configured
- [ ] Security review completed
- [ ] Admin account created
- [ ] Sample products added
- [ ] Payment methods configured
- [ ] Email notifications setup (optional)
- [ ] Analytics installed (optional)
- [ ] Error tracking configured (optional)
- [ ] Backup strategy in place
- [ ] Monitoring enabled
- [ ] Go live! 🚀

---

**Last Updated**: July 22, 2025
**Version**: 1.0.0

> **Tip**: Save this file for reference during deployment and scaling!
