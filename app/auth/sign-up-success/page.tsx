import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>We&apos;ve sent you a confirmation link to complete your registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email sent!</p>
                    <p className="text-xs text-muted-foreground">Click the link in your email to verify your account</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>After confirming your email, you&apos;ll be able to:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Analyze emails and SMS messages for fraud</li>
                  <li>• View your analysis history</li>
                  <li>• Access personalized protection insights</li>
                </ul>
              </div>

              <div className="pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Sign In
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
