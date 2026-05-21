import type { User } from "../types";
import { mockUsers } from "../../mocks/data";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const STORAGE_KEY = "protask_current_user";

export async function login(email: string, password: string): Promise<User> {
  await delay(600);
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password,
  );
  if (!user) throw new Error("Credenciales inválidas");
  const { password: _, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  return safeUser as User;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> {
  await delay(600);
  const exists = mockUsers.find((u) => u.email === data.email);
  if (exists) throw new Error("El correo ya está registrado");
  const newUser: User = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    avatar: "",
  };
  mockUsers.push(newUser);
  const { password: _, ...safeUser } = newUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  return safeUser as User;
}

export async function logout(): Promise<void> {
  await delay(200);
  localStorage.removeItem(STORAGE_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(100);
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
