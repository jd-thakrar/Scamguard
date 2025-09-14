import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"
import AnalyticsCharts from "@/components/analytics-charts"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Check if user is authenticated and is admin
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: emailAnalyses, error: emailError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("analysis_type", "email")

  const { data: smsAnalyses, error: smsError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("analysis_type", "sms")

  const { data: emailScams, error: emailScamError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("analysis_type", "email")
    .eq("is_scam", true)

  const { data: smsScams, error: smsScamError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("analysis_type", "sms")
    .eq("is_scam", true)

  const { data: totalAnalyses, error: totalError } = await supabase.from("analyses").select("id", { count: "exact" })

  const { data: totalScams, error: totalScamError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("is_scam", true)

  const { data: totalUsers, error: usersError } = await supabase.from("profiles").select("id", { count: "exact" })

  // Calculate rates with safe fallbacks
  const emailCount = emailAnalyses?.count || 0
  const smsCount = smsAnalyses?.count || 0
  const emailScamCount = emailScams?.count || 0
  const smsScamCount = smsScams?.count || 0
  const totalAnalysesCount = totalAnalyses?.count || 0
  const totalScamCount = totalScams?.count || 0
  const totalUserCount = totalUsers?.count || 0

  const emailScamRate = emailCount > 0 ? ((emailScamCount / emailCount) * 100).toFixed(1) : "0"
  const smsScamRate = smsCount > 0 ? ((smsScamCount / smsCount) * 100).toFixed(1) : "0"

  console.log("[v0] Analytics data:", {
    emailCount,
    smsCount,
    emailScamCount,
    smsScamCount,
    totalAnalysesCount,
    totalScamCount,
    totalUserCount,
    errors: { emailError, smsError, emailScamError, smsScamError, totalError, totalScamError, usersError },
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Analytics Dashboard</h1>
                <p className="text-xs text-muted-foreground">Detailed system analytics and insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Analysis Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Email Analysis
              </CardTitle>
              <CardDescription>Email spam and phishing detection statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Analyzed</span>
                  <span className="text-2xl font-bold">{emailCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scams Detected</span>
                  <span className="text-2xl font-bold text-destructive">{emailScamCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scam Rate</span>
                  <span className="text-lg font-semibold text-destructive">{emailScamRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                SMS Analysis
              </CardTitle>
              <CardDescription>SMS scam detection statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Analyzed</span>
                  <span className="text-2xl font-bold">{smsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scams Detected</span>
                  <span className="text-2xl font-bold text-destructive">{smsScamCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scam Rate</span>
                  <span className="text-lg font-semibold text-destructive">{smsScamRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AnalyticsCharts totalAnalyses={totalAnalysesCount} totalScams={totalScamCount} totalUsers={totalUserCount} />
      </main>
    </div>
  )
}
