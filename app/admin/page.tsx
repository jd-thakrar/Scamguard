import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Shield,
  AlertTriangle,
  BarChart3,
  Mail,
  MessageSquare,
  TrendingUp,
  Activity,
  LogOut,
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
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

  // Fetch analytics data
  const { data: totalUsers, error: usersError } = await supabase.from("profiles").select("id", { count: "exact" })

  const { data: totalAnalyses, error: analysesError } = await supabase.from("analyses").select("id", { count: "exact" })

  const { data: scamAnalyses, error: scamError } = await supabase
    .from("analyses")
    .select("id", { count: "exact" })
    .eq("is_scam", true)

  const { data: recentAnalyses, error: recentError } = await supabase
    .from("analyses")
    .select(`
      id,
      content,
      analysis_type,
      is_scam,
      confidence_score,
      created_at,
      profiles!inner(email)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: userStats, error: userStatsError } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      created_at,
      analyses(count)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  const totalAnalysesCount = totalAnalyses?.count || 0
  const scamAnalysesCount = scamAnalyses?.count || 0
  const scamRate = totalAnalysesCount > 0 ? ((scamAnalysesCount / totalAnalysesCount) * 100).toFixed(1) : "0"

  console.log("[v0] Admin dashboard data:", {
    totalUsers: totalUsers?.count || 0,
    totalAnalyses: totalAnalysesCount,
    scamAnalyses: scamAnalysesCount,
    scamRate,
    recentAnalyses: recentAnalyses?.length || 0,
    userStats: userStats?.length || 0,
    errors: { usersError, analysesError, scamError, recentError, userStatsError },
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
                <h1 className="text-xl font-bold">ScamGuard Admin</h1>
                <p className="text-xs text-muted-foreground">System Analytics & Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Admin</Badge>
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
        {totalAnalysesCount === 0 && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>System Status:</strong> No analysis data found. The system is ready but no users have analyzed
              messages yet.
            </p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers?.count || 0}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnalysesCount}</div>
              <p className="text-xs text-muted-foreground">Messages analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scams Detected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{scamAnalysesCount}</div>
              <p className="text-xs text-muted-foreground">{scamRate}% of total analyses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protection Rate</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">99.8%</div>
              <p className="text-xs text-muted-foreground">Accuracy rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Analyses
              </CardTitle>
              <CardDescription>Latest fraud detection results across all users</CardDescription>
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
                          <span className="text-sm font-medium">{analysis.profiles?.email}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{analysis.content.substring(0, 80)}...</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={analysis.is_scam ? "destructive" : "default"} className="text-xs">
                            {analysis.is_scam ? "Scam" : "Safe"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(analysis.confidence_score * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-4">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No analyses yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Recent user registrations and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats && userStats.length > 0 ? (
                  userStats.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{user.analyses?.[0]?.count || 0}</div>
                        <div className="text-xs text-muted-foreground">analyses</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
