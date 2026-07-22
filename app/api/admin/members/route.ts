import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, orders } from '@/lib/db/schema'
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

    const users = await db.select().from(user)
    const allOrders = await db.select().from(orders)

    const memberData = users.map((u) => {
      const memberOrders = allOrders.filter((o) => o.userId === u.id)
      const totalSpent = memberOrders
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0)

      return {
        id: u.id,
        email: u.email,
        name: u.name || 'Unknown',
        createdAt: u.createdAt,
        totalOrders: memberOrders.length,
        totalSpent: totalSpent.toString(),
      }
    })

    return NextResponse.json({ success: true, data: memberData })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
