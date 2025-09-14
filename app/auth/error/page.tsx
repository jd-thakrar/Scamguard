import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">ScamGuard</h1>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <div className="rounded-lg bg-destructive/10 p-4">
                  <p className="text-sm text-destructive font-medium">Error: {params.error}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  An unspecified authentication error occurred.
                </p>
              )}

              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full">Try Again</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
