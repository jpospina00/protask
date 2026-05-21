import type { User } from '@/types'
import { mockUsers } from '@/mocks/data'

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function getUsers(): Promise<User[]> {
  await delay()
  return [...mockUsers]
}

export async function getUserById(id: string): Promise<User | undefined> {
  await delay()
  return mockUsers.find((u) => u.id === id)
}
