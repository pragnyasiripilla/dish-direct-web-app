"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Phone, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiRequest } from "@/lib/api-client"
import { saveSession } from "@/lib/auth-session"

const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
]

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
    role: "user",
    otp: "",
    agreeToTerms: false,
  })

  const sendOTP = async (email: string) => {
    try {
      setError(null)
      setSuccessMessage(null)
      const data = await apiRequest<{ success: boolean }>(
        "/auth/send-otp",
        { method: "POST", body: JSON.stringify({ email }) },
      )
      if (data.success) {
        setSuccessMessage("OTP sent successfully. Check your email.")
      }
      return data.success
    } catch (error) {
      setError("Failed to send OTP. Please try again.")
      return false
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
  
    try {
      if (!otpSent) {
        const sent = await sendOTP(formData.email)
        if (sent) {
          setOtpSent(true)
        }
        setIsLoading(false)
        return
      }

      const data = await apiRequest<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            otp: formData.otp,
            role: formData.role,
          }),
        },
      )
      saveSession(data.token, data.user)
      window.location.href = "/dashboard"
    } catch (error) {
      if (!otpSent) {
        setError("Failed to send OTP. Please try again.")
      } else {
        setError(error instanceof Error ? error.message : "Something went wrong. Try again.")
      }
    }
  
    setIsLoading(false)
  }

  const handleGoogleSignUp = async () => {
    try {
      const data = await apiRequest<{ url: string }>("/auth/google/url")
      window.location.href = data.url
    } catch (error) {
      setError(error instanceof Error ? error.message : "Google sign-up failed")
    }
  }

  return (
    <Card className="glassmorphism border-white/20 w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Join DishDirect</CardTitle>
        <CardDescription className="text-white/70">Start your journey of sharing meals and hope</CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert className="mb-4 bg-green-500/10 border-green-500 text-green-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 bg-red-500/10 text-red-400 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setError(null)
                }}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                required
                minLength={2}
              />
            </div>
          </div>

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
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setError(null)
                }}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <div className="flex gap-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
              >
                <SelectTrigger className="w-24 bg-slate-800/80 border-white/30 text-white focus:border-primary focus:bg-slate-800/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    setError(null)
                  }}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                  required
                  minLength={10}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">
              Account Type
            </Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-slate-800/80 border-white/30 text-white focus:border-primary focus:bg-slate-800/90">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="user" className="text-white hover:bg-white/20 focus:bg-white/20">
                  Individual Donor
                </SelectItem>
                <SelectItem value="restaurant" className="text-white hover:bg-white/20 focus:bg-white/20">
                  Restaurant Owner
                </SelectItem>
                <SelectItem value="beneficiary" className="text-white hover:bg-white/20 focus:bg-white/20">
                  Beneficiary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  setError(null)
                }}
                className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                required
                minLength={6}
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
              onChange={(e) => {
                setFormData({ ...formData, otp: e.target.value })
                setError(null)
              }}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
              maxLength={6}
              required
            />
            <p className="text-sm text-white/70">
              Code sent to {formData.email}. OTP expires in 15 minutes.
            </p>
          </div>
        )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="terms" className="text-sm text-white/70">
              I agree to the{" "}
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                Privacy Policy
              </Button>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground ripple-effect"
            disabled={isLoading || !formData.agreeToTerms}
          >
            {isLoading ? "Processing..." : otpSent ? "Verify & Create Account" : "Create Account"}
          </Button>
        </form>

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
            onClick={handleGoogleSignUp}
            variant="outline"
            className="w-full mt-4 bg-slate-800/80 border-white/30 text-white hover:bg-slate-800/90"
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
