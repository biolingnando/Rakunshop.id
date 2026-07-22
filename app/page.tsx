'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Check if user is admin or member
  const isAdmin = session.user.email?.includes('admin') // Simple check - you can improve this

  if (isAdmin) {
    redirect('/admin')
  }

  redirect('/member/dashboard')
}
