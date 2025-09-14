import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  // Redirect based on role
  if (profile?.role === "admin") {
    redirect("/admin")
  } else {
    redirect("/dashboard")
  }
}
