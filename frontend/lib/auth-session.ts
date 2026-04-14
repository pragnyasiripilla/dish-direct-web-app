export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}

const TOKEN_KEY = "dishdirect_token"
const USER_KEY = "dishdirect_user"

export function saveSession(token: string, user: SessionUser) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}
