"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Chrome } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_BASE, apiRequest } from "@/lib/api-client"
import { saveSession } from "@/lib/auth-session"

export function SignInForm() {
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  })

  useEffect(() => {
    const oauthError = searchParams.get("error")
    if (oauthError) {
      setError("Google login failed. Please try again.")
    }
  }, [searchParams])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[ui] Email sign-in submitted")
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const data = await apiRequest<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
        "/auth/login-password",
        {
          method: "POST",
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        },
      )
      saveSession(data.token, data.user)
      window.location.href = "/dashboard"
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[ui] OTP sign-in submitted", { otpSent })
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      if (!otpSent) {
        await apiRequest("/auth/login-otp/request", {
          method: "POST",
          body: JSON.stringify({ email: formData.email }),
        })
        setOtpSent(true)
        setSuccess("OTP sent successfully. Check your email.")
      } else {
        const data = await apiRequest<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
          "/auth/login-otp/verify",
          {
            method: "POST",
            body: JSON.stringify({ email: formData.email, otp: formData.otp }),
          },
        )
        saveSession(data.token, data.user)
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "OTP sign-in failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    console.log("[ui] Google sign-in clicked")
    setError(null)
    try {
      if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_URL")
      window.location.href = `${API_BASE}/auth/google`
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "Google sign-in failed")
    }
  }

  return (
    <Card className="glassmorphism border-white/20 w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
        <CardDescription className="text-white/70">Sign in to continue your impact journey</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 bg-green-500/10 text-green-400 border-green-500">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 bg-red-500/10 text-red-400 border-red-500">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
            <TabsTrigger
              value="email"
              className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value="otp"
              className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              OTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-6">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/50 hover:text-white hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground ripple-effect"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="otp" className="space-y-4 mt-6">
            <form onSubmit={handleOTPSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="phone"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-white">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-white/70">Code sent to {formData.email}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground ripple-effect"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : otpSent ? "Verify Code" : "Send Code"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-white/50">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button variant="link" className="text-white/70 hover:text-primary p-0">
            Forgot your password?
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
