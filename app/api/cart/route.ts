import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cart, products } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, session.user.id))

    return NextResponse.json({ success: true, data: cartItems })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    const existingItem = await db
      .select()
      .from(cart)
      .where(
        and(eq(cart.userId, session.user.id), eq(cart.productId, productId))
      )
      .limit(1)

    if (existingItem.length > 0) {
      await db
        .update(cart)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cart.id, existingItem[0].id))
    } else {
      await db.insert(cart).values({
        userId: session.user.id,
        productId,
        quantity,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('id')

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID required' }, { status: 400 })
    }

    await db
      .delete(cart)
      .where(and(eq(cart.id, parseInt(cartId)), eq(cart.userId, session.user.id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete from cart' },
      { status: 500 }
    )
  }
}
