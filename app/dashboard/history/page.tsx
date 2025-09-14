import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, ArrowLeft, Search, Mail, MessageSquare, Calendar, Filter } from "lucide-react"
import Link from "next/link"

export default async function AnalysisHistory() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch all user's analyses
  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, content, analysis_type, is_scam, confidence_score, created_at, detected_keywords")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Analysis History</h1>
                <p className="text-xs text-muted-foreground">View all your fraud detection results</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              All Analyses ({analyses?.length || 0})
            </CardTitle>
            <CardDescription>Search and filter your analysis history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by content..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis List */}
        <div className="space-y-4">
          {analyses?.map((analysis) => (
            <Card key={analysis.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {analysis.analysis_type === "email" ? (
                      <Mail className="h-5 w-5 text-blue-500" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <Badge variant={analysis.is_scam ? "destructive" : "default"}>
                        {analysis.is_scam ? "Scam Detected" : "Safe"}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {analysis.analysis_type.toUpperCase()} • {Math.round(analysis.confidence_score * 100)}%
                        confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(analysis.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <p className="text-sm leading-relaxed">{analysis.content}</p>
                </div>

                {analysis.detected_keywords && analysis.detected_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {analysis.detected_keywords.map((keyword: any, index: number) => (
                      <Badge
                        key={index}
                        variant={keyword.type === "scam" ? "destructive" : "default"}
                        className={`text-xs ${keyword.type === "legitimate" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}
                      >
                        {keyword.word}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {(!analyses || analyses.length === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-4">Start protecting yourself by analyzing your first message</p>
                <Link href="/analyzer">
                  <Button>Analyze Message</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
