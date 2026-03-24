'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, User, Scale, LayoutDashboard, LogOut, Bell } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Buy', href: '/inventory' },
  { name: 'Hire', href: '/hire' },
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  useEffect(() => {
    if (session) {
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch('/api/notifications/unread-count')
          if (response.ok) {
            const data = await response.json()
            setUnreadCount(data.count)
          }
        } catch (error) {
          console.error('Failed to fetch unread count:', error)
        }
      }

      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 60000) // Refresh every minute
      return () => clearInterval(interval)
    }
  }, [session])

  return (
    <header className="bg-white border-b py-3 sticky top-0 z-[100]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/colored-logo.png" 
              alt="Grounded Cars Logo" 
              width={180} 
              height={60} 
              className="object-contain h-12 w-auto"
              priority
            />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-gray-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`${
                    isActive 
                      ? "text-blue-500 underline underline-offset-8 decoration-2 decoration-blue-500" 
                      : "hover:text-blue-500 transition-colors"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 text-[15px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight">
                <LayoutDashboard className="w-5 h-5" />
                Admin
              </Link>
            )}
            <Link href="/compare" className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-500 transition-colors">
              <Scale className="w-5 h-5" />
              Compare
            </Link>
            {session ? (
              <>
                <Link href="/profile/notifications" className="relative flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-500 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-500 transition-colors">
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-500 transition-colors">
                <User className="w-5 h-5" />
                Login
              </Link>
            )}
            <Link href="/listings/create" className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-[15px] font-black text-white hover:bg-blue-700 transition-all shadow-lg active:scale-95 uppercase tracking-wider">
              <Plus className="w-5 h-5 stroke-[3px]" />
              List Your Car
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
