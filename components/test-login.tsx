"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TestLogin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const signInAsAdmin = async () => {
    setLoading(true)
    setMessage("")
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@scamguard.com",
        password: "Admin123!",
      })

      if (error) {
        console.error("Admin login error:", error)
        setMessage("Admin login failed: " + error.message)
      } else {
        console.log("Admin logged in successfully")
        setMessage("Admin login successful! Redirecting...")
        setTimeout(() => (window.location.href = "/admin"), 1000)
      }
    } catch (err) {
      console.error("Login error:", err)
      setMessage("Login error occurred")
    } finally {
      setLoading(false)
    }
  }

  const signInAsUser = async () => {
    setLoading(true)
    setMessage("")
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "user@scamguard.com",
        password: "User123!",
      })

      if (error) {
        console.error("User login error:", error)
        setMessage("User login failed: " + error.message)
      } else {
        console.log("User logged in successfully")
        setMessage("User login successful! Redirecting...")
        setTimeout(() => (window.location.href = "/dashboard"), 1000)
      }
    } catch (err) {
      console.error("Login error:", err)
      setMessage("Login error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createTestUsers = async () => {
    setLoading(true)
    setMessage("")
    try {
      // Create admin user
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: "admin@scamguard.com",
        password: "Admin123!",
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (adminError && !adminError.message.includes("already registered")) {
        console.error("Admin creation error:", adminError)
        setMessage("Admin creation failed: " + adminError.message)
        return
      }

      // Create regular user
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: "user@scamguard.com",
        password: "User123!",
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (userError && !userError.message.includes("already registered")) {
        console.error("User creation error:", userError)
        setMessage("User creation failed: " + userError.message)
        return
      }

      if (adminData.user) {
        await supabase.from("profiles").upsert({
          id: adminData.user.id,
          email: "admin@scamguard.com",
          role: "admin",
        })
      }

      if (userData.user) {
        await supabase.from("profiles").upsert({
          id: userData.user.id,
          email: "user@scamguard.com",
          role: "user",
        })
      }

      setMessage("Test users created successfully! You can now login with the credentials below.")
      console.log("Admin user:", adminData)
      console.log("Regular user:", userData)
    } catch (err) {
      console.error("Creation error:", err)
      setMessage("Error creating test users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Login</CardTitle>
        <CardDescription>Quick login for testing ScamGuard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.includes("successful") || message.includes("created successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <Button onClick={createTestUsers} disabled={loading} variant="outline" className="w-full bg-transparent">
          {loading ? "Creating..." : "Create Test Users"}
        </Button>

        <div className="space-y-2">
          <Button onClick={signInAsAdmin} disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Login as Admin"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            admin@scamguard.com / Admin123!
            <br />
            <span className="text-xs">ID: 11111111-1111-1111-1111-111111111111</span>
          </p>
        </div>

        <div className="space-y-2">
          <Button onClick={signInAsUser} disabled={loading} variant="secondary" className="w-full">
            {loading ? "Signing in..." : "Login as User"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            user@scamguard.com / User123!
            <br />
            <span className="text-xs">ID: 22222222-2222-2222-2222-222222222222</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
