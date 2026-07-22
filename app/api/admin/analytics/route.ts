import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, products } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'

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

    const allOrders = await db.select().from(orders)
    const allProducts = await db.select().from(products)

    const paidOrders = allOrders.filter((o) => o.status === 'paid')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0)
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

    // Calculate top products
    const productSales = new Map<number, number>()
    paidOrders.forEach((order) => {
      const current = productSales.get(order.productId) || 0
      productSales.set(order.productId, current + 1)
    })

    const topProducts = Array.from(productSales.entries())
      .map(([productId, sales]) => {
        const product = allProducts.find((p) => p.id === productId)
        return {
          id: productId,
          name: product?.name || 'Unknown Product',
          sales,
        }
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: paidOrders.length,
        avgOrderValue,
        topProducts,
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
