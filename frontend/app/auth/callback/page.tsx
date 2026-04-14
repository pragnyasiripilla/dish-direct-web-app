"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { saveSession } from "@/lib/auth-session"

export default function AuthCallbackPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = params.get("token")
    const id = params.get("id")
    const email = params.get("email")
    const name = params.get("name")
    const role = params.get("role")

    console.log("PARAMS:", { token, id, email, name, role })

    if (token) {
      saveSession(token, {
        id: id || "",
        email: email || "",
        name: name || "",
        role: role || "user",
      })
      router.replace("/dashboard")
      return
    }

    router.replace("/auth/sign-in")
  }, [params, router])

  return <main className="min-h-screen bg-background text-white flex items-center justify-center">Signing you in...</main>
}
