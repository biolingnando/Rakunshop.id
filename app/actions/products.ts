'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products, orders, cart } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getProducts() {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}

export async function getAdminProducts() {
  const userId = await getUserId()
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(desc(products.createdAt))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}

export async function createProduct(data: {
  name: string
  description: string
  price: string
  category: string
  downloadUrl: string
  image: string
}) {
  const userId = await getUserId()
  try {
    const result = await db
      .insert(products)
      .values({
        userId,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        downloadUrl: data.downloadUrl,
        image: data.image,
        isActive: true,
      })
      .returning()
    revalidatePath('/admin/products')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

export async function updateProduct(
  id: number,
  data: {
    name?: string
    description?: string
    price?: string
    category?: string
    downloadUrl?: string
    image?: string
    isActive?: boolean
  }
) {
  const userId = await getUserId()
  try {
    const result = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), eq(products.userId, userId)))
      .returning()
    revalidatePath('/admin/products')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: number) {
  const userId = await getUserId()
  try {
    await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.userId, userId)))
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}
