import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables for RAKUNSHOP.ID ------------------------------------------
import { serial, decimal, integer } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(), // Admin/seller who created the product
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(), // e.g., 'ebook', 'template', 'course', 'software'
  downloadUrl: text('downloadUrl'), // URL untuk download product digital
  image: text('image'), // Product image/thumbnail
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(), // Member/buyer
  productId: integer('productId').notNull(),
  quantity: integer('quantity').notNull().default(1),
  totalPrice: decimal('totalPrice', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, paid, cancelled, refunded
  paymentMethod: text('paymentMethod'), // 'bank_transfer', 'e_wallet', 'manual'
  proofOfPayment: text('proofOfPayment'), // URL to payment proof image
  downloadAccessUrl: text('downloadAccessUrl'), // Temporary download link
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: integer('productId').notNull(),
  quantity: integer('quantity').notNull().default(1),
  addedAt: timestamp('addedAt').notNull().defaultNow(),
})

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('orderId').notNull(),
  userId: text('userId').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, completed, failed
  paymentMethod: text('paymentMethod').notNull(), // bank_transfer, e_wallet, manual
  bankName: text('bankName'), // e.g., 'BCA', 'BNI', 'Mandiri'
  accountNumber: text('accountNumber'), // Admin's bank account for transfer
  referenceNumber: text('referenceNumber'), // Payment reference/invoice number
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const analyticsLog = pgTable('analyticsLog', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(), // Admin
  event: text('event').notNull(), // 'product_created', 'order_received', 'payment_completed', etc
  data: text('data'), // JSON data for the event
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
