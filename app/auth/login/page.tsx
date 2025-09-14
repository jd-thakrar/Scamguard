"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!data.user) {
        throw new Error("No user data returned")
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          // If profile doesn't exist or RLS error, redirect to dashboard anyway
          router.push("/dashboard")
          return
        }

        // Redirect based on role
        if (profile?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } catch (profileError) {
        // If profile query fails, still allow login and redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
    setError(null)

    // Trigger login after setting values
    setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">ScamGuard</h1>
            </div>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Test Credentials:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>
                <strong>Admin:</strong> admin@scamguard.com / Admin123!
              </p>
              <p>
                <strong>User:</strong> user@scamguard.com / User123!
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("admin@scamguard.com", "Admin123!")}
              className="flex-1"
            >
              Quick Admin Login
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("user@scamguard.com", "User123!")}
              className="flex-1"
            >
              Quick User Login
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your ScamGuard dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4 text-primary hover:text-primary/80"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
