import type { Notification } from '@/types'
import { mockNotifications } from '@/mocks/data'

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

let notifications = [...mockNotifications]

export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay()
  return [...notifications.filter((n) => n.userId === userId)]
}

export async function getUnreadCount(userId: string): Promise<number> {
  await delay(100)
  return notifications.filter((n) => n.userId === userId && !n.read).length
}

export async function markAsRead(id: string): Promise<void> {
  await delay(100)
  const index = notifications.findIndex((n) => n.id === id)
  if (index !== -1) notifications[index] = { ...notifications[index], read: true }
}

export async function markAllAsRead(userId: string): Promise<void> {
  await delay(100)
  notifications = notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n))
}

export async function deleteNotification(id: string): Promise<void> {
  await delay(100)
  notifications = notifications.filter((n) => n.id !== id)
}

export async function addNotification(data: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
  await delay(200)
  const notif: Notification = {
    ...data,
    id: `notif_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  notifications.push(notif)
  return notif
}
