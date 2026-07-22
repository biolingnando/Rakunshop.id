import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products, orders } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = session.user.email?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [productsData, ordersData] = await Promise.all([
      db.select().from(products).where(eq(products.userId, session.user.id)),
      db.select().from(orders).where(eq(orders.userId, session.user.id)),
    ])

    const pendingOrders = ordersData.filter((o) => o.status === 'pending').length
    const totalRevenue = ordersData
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0)

    return NextResponse.json({
      totalProducts: productsData.length,
      totalOrders: ordersData.length,
      totalRevenue,
      pendingOrders,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
