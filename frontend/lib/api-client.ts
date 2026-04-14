const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
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
