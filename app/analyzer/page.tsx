"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  ShieldAlert,
  Info,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface AnalysisResult {
  result: string
  confidence?: number
  details?: {
    urgency: number
    fear: number
    authority: number
    financial: number
  }
  entities?: {
    phoneNumbers: string[]
    amounts: string[]
    dates: string[]
    emails: string[]
    urls: string[]
  }
  detectedKeywords?: Array<{ word: string; type: "scam" | "legitimate" }>
  similarExamples?: string[]
  recommendations?: string[]
  legitimacyIndicators?: {
    hasOfficialBankFormat: boolean
    hasMaskedAccountNumber: boolean
    hasOfficialHelpline: boolean
    hasProperDateTime: boolean
  }
}

export default function AnalyzerPage() {
  const [emailContent, setEmailContent] = useState("")
  const [emailSender, setEmailSender] = useState("")
  const [smsContent, setSmsContent] = useState("")
  const [smsSender, setSmsSender] = useState("")
  const [emailResult, setEmailResult] = useState<AnalysisResult | null>(null)
  const [smsResult, setSmsResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const highlightKeywords = (text: string, keywords: Array<{ word: string; type: "scam" | "legitimate" }>) => {
    if (!keywords || keywords.length === 0) return text

    let highlightedText = text
    keywords.forEach(({ word, type }) => {
      const regex = new RegExp(`(${word})`, "gi")
      const colorClass =
        type === "scam"
          ? "bg-red-100 text-red-800 border border-red-300"
          : "bg-green-100 text-green-800 border border-green-300"

      highlightedText = highlightedText.replace(regex, `<span class="${colorClass} px-1 rounded font-medium">$1</span>`)
    })

    return highlightedText
  }

  const analyzeEmail = async () => {
    if (!emailContent.trim() || !emailSender.trim()) {
      setError("Please enter both email content and sender address")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email",
          content: emailContent,
          sender: emailSender,
        }),
      })

      const result = await response.json()
      setEmailResult(result)
    } catch (err) {
      setError("Failed to analyze email. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeSMS = async () => {
    if (!smsContent.trim() || !smsSender.trim()) {
      setError("Please enter both SMS content and sender number")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sms",
          content: smsContent,
          sender: smsSender,
        }),
      })

      const result = await response.json()
      setSmsResult(result)
    } catch (err) {
      setError("Failed to analyze SMS. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const ResultCard = ({
    result,
    type,
    originalContent,
  }: { result: AnalysisResult; type: "email" | "sms"; originalContent: string }) => {
    const isScam = result.result.toLowerCase().includes("scam") || result.result.toLowerCase().includes("spam")

    return (
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isScam ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
              Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={isScam ? "destructive" : "default"} className="text-sm">
                {result.result}
              </Badge>
              {result.confidence && (
                <span className="text-sm text-muted-foreground">
                  Confidence: {Math.round(result.confidence * 100)}%
                </span>
              )}
            </div>

            {result.legitimacyIndicators && !isScam && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Legitimacy Indicators
                </h4>
                <div className="space-y-1 text-sm text-green-700">
                  {result.legitimacyIndicators.hasOfficialBankFormat && (
                    <div>✓ Official bank message format detected</div>
                  )}
                  {result.legitimacyIndicators.hasMaskedAccountNumber && <div>✓ Properly masked account number</div>}
                  {result.legitimacyIndicators.hasOfficialHelpline && <div>✓ Official helpline number provided</div>}
                  {result.legitimacyIndicators.hasProperDateTime && <div>✓ Standard date-time format used</div>}
                </div>
              </div>
            )}

            {result.details && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Risk Indicators</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Urgency:</span>
                      <span className={result.details.urgency > 0.5 ? "text-destructive" : "text-muted-foreground"}>
                        {Math.round(result.details.urgency * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fear tactics:</span>
                      <span className={result.details.fear > 0.5 ? "text-destructive" : "text-muted-foreground"}>
                        {Math.round(result.details.fear * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authority claims:</span>
                      <span className={result.details.authority > 0.5 ? "text-destructive" : "text-muted-foreground"}>
                        {Math.round(result.details.authority * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financial requests:</span>
                      <span className={result.details.financial > 0.5 ? "text-destructive" : "text-muted-foreground"}>
                        {Math.round(result.details.financial * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {result.entities && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Extracted Information</h4>
                    <div className="space-y-1 text-sm">
                      {result.entities.phoneNumbers.length > 0 && (
                        <div>
                          <span className="font-medium">Phone numbers:</span>
                          <div className="text-muted-foreground">{result.entities.phoneNumbers.join(", ")}</div>
                        </div>
                      )}
                      {result.entities.amounts.length > 0 && (
                        <div>
                          <span className="font-medium">Amounts:</span>
                          <div className="text-muted-foreground">{result.entities.amounts.join(", ")}</div>
                        </div>
                      )}
                      {result.entities.urls.length > 0 && (
                        <div>
                          <span className="font-medium">URLs:</span>
                          <div className="text-muted-foreground break-all">{result.entities.urls.join(", ")}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {result.detectedKeywords && result.detectedKeywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Detected Keywords
              </CardTitle>
              <CardDescription>
                Red keywords indicate suspicious content, green keywords indicate legitimate banking terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {result.detectedKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant={keyword.type === "scam" ? "destructive" : "default"}
                      className={`text-xs ${keyword.type === "legitimate" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}
                    >
                      {keyword.word}
                    </Badge>
                  ))}
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Message with highlighted keywords:</p>
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywords(originalContent, result.detectedKeywords),
                    }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span>Suspicious keywords</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Legitimate banking terms</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {result.similarExamples && result.similarExamples.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                Similar Fraud Examples
              </CardTitle>
              <CardDescription>
                Here are similar {type === "email" ? "spam emails" : "scam messages"} we've detected before
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.similarExamples.map((example, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 italic">"{example}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {result.recommendations && result.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                What Should You Do?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-balance">ScamGuard Analyzer</h1>
              <p className="text-muted-foreground">AI-powered fraud detection system</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Analysis
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Spam Detection</CardTitle>
                <CardDescription>
                  Analyze emails for spam and phishing attempts using advanced AI models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email-sender" className="text-sm font-medium">
                    Sender Email Address
                  </label>
                  <Input
                    id="email-sender"
                    type="email"
                    placeholder="sender@example.com"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email-content" className="text-sm font-medium">
                    Email Content
                  </label>
                  <Textarea
                    id="email-content"
                    placeholder="Paste the email content here..."
                    className="min-h-32"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>
                <Button onClick={analyzeEmail} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Email"
                  )}
                </Button>
              </CardContent>
            </Card>

            {emailResult && <ResultCard result={emailResult} type="email" originalContent={emailContent} />}
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Scam Detection</CardTitle>
                <CardDescription>Detect fraudulent SMS messages and protect against scam attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="sms-sender" className="text-sm font-medium">
                    Sender Phone Number
                  </label>
                  <Input
                    id="sms-sender"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={smsSender}
                    onChange={(e) => setSmsSender(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="sms-content" className="text-sm font-medium">
                    SMS Content
                  </label>
                  <Textarea
                    id="sms-content"
                    placeholder="Paste the SMS message here..."
                    className="min-h-32"
                    value={smsContent}
                    onChange={(e) => setSmsContent(e.target.value)}
                  />
                </div>
                <Button onClick={analyzeSMS} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze SMS"
                  )}
                </Button>
              </CardContent>
            </Card>

            {smsResult && <ResultCard result={smsResult} type="sms" originalContent={smsContent} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
