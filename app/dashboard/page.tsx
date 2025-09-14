import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Mail,
  MessageSquare,
  TrendingUp,
  Activity,
  LogOut,
  Plus,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default async function UserDashboard() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  // If no profile exists, create one
  if (!profile && !profileError) {
    await supabase.from("profiles").insert([{ id: user.id, email: user.email || "", role: "user" }])
  }

  const { data: totalAnalyses, error: totalError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)

  const { data: scamAnalyses, error: scamError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("is_scam", true)

  const { data: emailAnalyses, error: emailError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("analysis_type", "email")

  const { data: smsAnalyses, error: smsError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("analysis_type", "sms")

  const { data: recentAnalyses, error: recentError } = await supabase
    .from("analyses")
    .select("id, content, analysis_type, is_scam, confidence_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const totalCount = totalAnalyses?.count || 0
  const scamCount = scamAnalyses?.count || 0
  const safeAnalyses = totalCount - scamCount
  const protectionRate = totalCount > 0 ? ((safeAnalyses / totalCount) * 100).toFixed(1) : "100"

  console.log("[v0] Dashboard data:", {
    totalCount,
    scamCount,
    emailCount: emailAnalyses?.count || 0,
    smsCount: smsAnalyses?.count || 0,
    recentCount: recentAnalyses?.length || 0,
    errors: { totalError, scamError, emailError, smsError, recentError },
  })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">ScamGuard Dashboard</h1>
                <p className="text-xs text-muted-foreground">Your personal fraud protection center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{profile?.email || user.email}</span>
              <form action={handleSignOut}>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Here's your fraud protection summary and recent analysis activity.</p>
          {totalCount === 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Get started:</strong> You haven't analyzed any messages yet. Click "Analyze New Message" below
                to begin protecting yourself from fraud.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/analyzer">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Analyze New Message</h3>
                  <p className="text-sm text-muted-foreground">Check email or SMS for fraud</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/history">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">View Analysis History</h3>
                  <p className="text-sm text-muted-foreground">See all your past analyses</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">Messages checked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scams Detected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{scamCount}</div>
              <p className="text-xs text-muted-foreground">Threats blocked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safe Messages</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{safeAnalyses}</div>
              <p className="text-xs text-muted-foreground">Legitimate content</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protection Rate</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{protectionRate}%</div>
              <p className="text-xs text-muted-foreground">Safety score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analysis Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analysis Breakdown
              </CardTitle>
              <CardDescription>Your message analysis by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Email Analysis</div>
                      <div className="text-sm text-muted-foreground">Spam and phishing detection</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{emailAnalyses?.count || 0}</div>
                    <div className="text-xs text-muted-foreground">messages</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">SMS Analysis</div>
                      <div className="text-sm text-muted-foreground">Text message scam detection</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{smsAnalyses?.count || 0}</div>
                    <div className="text-xs text-muted-foreground">messages</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest fraud detection results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses && recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {analysis.analysis_type === "email" ? (
                            <Mail className="h-4 w-4 text-blue-500" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-500" />
                          )}
                          <Badge variant={analysis.is_scam ? "destructive" : "default"} className="text-xs">
                            {analysis.is_scam ? "Scam" : "Safe"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{analysis.content.substring(0, 60)}...</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.round(analysis.confidence_score * 100)}% confidence
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-4">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No analyses yet</p>
                    <Link href="/analyzer">
                      <Button size="sm">Analyze Your First Message</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Protection Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Protection Tips
            </CardTitle>
            <CardDescription>Stay safe from fraud with these recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Email Safety</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Never click suspicious links</li>
                  <li>• Verify sender addresses carefully</li>
                  <li>• Be wary of urgent requests</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">SMS Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Don't share personal info via text</li>
                  <li>• Verify unknown numbers</li>
                  <li>• Report suspicious messages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
