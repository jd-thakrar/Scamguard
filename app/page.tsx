import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, MessageSquare, BarChart3, Users, CheckCircle, Star, ArrowRight, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">ScamGuard</h1>
                <p className="text-xs text-muted-foreground">AI-powered fraud detection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6" variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Protection
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Protect Yourself from
            <span className="text-primary block">Email & SMS Scams</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Advanced AI technology that analyzes emails and SMS messages in real-time to detect fraud, phishing
            attempts, and scam content before they can harm you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/analyzer">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ScamGuard?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI models provide comprehensive protection against modern fraud techniques
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Email Protection</CardTitle>
                <CardDescription>
                  Advanced spam and phishing detection using machine learning models trained on millions of emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Real-time analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Keyword highlighting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Confidence scoring
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle>SMS Security</CardTitle>
                <CardDescription>
                  Detect fraudulent text messages and protect against SMS-based scam attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Scam pattern recognition
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Entity extraction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Similar fraud examples
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track your protection history and view detailed analytics about detected threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Personal analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Threat trends
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Protection insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.8%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10M+</div>
              <div className="text-muted-foreground">Messages Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Users Protected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Real-time Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground">See what our users say about ScamGuard</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "ScamGuard saved me from a sophisticated phishing email that looked exactly like my bank. The AI
                  detected subtle patterns I would have missed."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sarah Johnson</div>
                    <div className="text-xs text-muted-foreground">Small Business Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "The SMS scam detection is incredible. It caught a fake delivery notification that was trying to steal
                  my personal information."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Michael Chen</div>
                    <div className="text-xs text-muted-foreground">IT Professional</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "Easy to use and incredibly accurate. The detailed analysis helps me understand why something is
                  suspicious. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Emily Rodriguez</div>
                    <div className="text-xs text-muted-foreground">Retired Teacher</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Protect Yourself?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of users who trust ScamGuard to keep them safe from email and SMS scams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/analyzer">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <div className="font-bold">ScamGuard</div>
                <div className="text-xs text-muted-foreground">AI-powered fraud detection</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 ScamGuard. All rights reserved. Protecting users from digital fraud.
          </div>
        </div>
      </footer>
    </div>
  )
}
