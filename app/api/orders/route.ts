import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, payments, cart } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))

    return NextResponse.json({ success: true, data: userOrders })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentMethod, bankName } = await request.json()

    // Get cart items
    const cartItems = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, session.user.id))

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create orders from cart items
    const createdOrders = []
    for (const item of cartItems) {
      const order = await db
        .insert(orders)
        .values({
          userId: session.user.id,
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: '0', // Would calculate from product price
          status: 'pending',
          paymentMethod,
        })
        .returning()

      createdOrders.push(order[0])

      // Create payment record
      await db.insert(payments).values({
        orderId: order[0].id,
        userId: session.user.id,
        amount: '0',
        status: 'pending',
        paymentMethod,
        bankName,
      })
    }

    // Clear cart
    await db.delete(cart).where(eq(cart.userId, session.user.id))

    return NextResponse.json({
      success: true,
      data: createdOrders,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
