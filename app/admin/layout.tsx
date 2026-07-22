'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Simple admin check - in production, use database roles
  const isAdmin = session.user.email?.includes('admin')

  if (!isAdmin) {
    redirect('/member/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold">
            RAKUNSHOP.ID - Admin
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/products" className="hover:underline">
              Produk
            </Link>
            <Link href="/admin/orders" className="hover:underline">
              Pesanan
            </Link>
            <Link href="/admin/members" className="hover:underline">
              Member
            </Link>
            <Link href="/admin/analytics" className="hover:underline">
              Analytics
            </Link>
            <span className="text-sm">{session.user.email}</span>
            <form action={async () => {
              'use server'
              await auth.api.signOut({ headers: await headers() })
              redirect('/sign-in')
            }}>
              <button
                type="submit"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:opacity-90"
              >
                Logout
              </button>
            </form>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-muted text-muted-foreground py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 RAKUNSHOP.ID - Admin Dashboard</p>
        </div>
      </footer>
    </div>
  )
}
