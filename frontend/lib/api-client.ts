const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable")
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.message || "Request failed")
  }
  return data as T
}

export { API_BASE }
