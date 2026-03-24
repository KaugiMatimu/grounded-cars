'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, Check, Loader2 } from 'lucide-react'

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchNotifications()
    }
  }, [session])

  const markAsRead = async (id?: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id, read: true } : { read: true })
      })

      if (response.ok) {
        if (id) {
          setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
        } else {
          setNotifications(notifications.map(n => ({ ...n, read: true })))
        }
      }
    } catch (error) {
      console.error('Failed to update notification:', error)
    }
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 font-bold">Please login to view notifications</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">NOTIFICATIONS</h1>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={() => markAsRead()}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-wide">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-6 rounded-2xl border-2 transition-all ${
                notification.read 
                  ? "bg-white border-gray-100" 
                  : "bg-blue-50 border-blue-100 shadow-md scale-[1.01]"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-black tracking-tight ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-1 font-medium leading-relaxed ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                    {notification.message}
                  </p>
                  <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors active:scale-95"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
