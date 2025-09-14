import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const FRAUD_EXAMPLES = {
  email: [
    "URGENT: Your account will be suspended in 24 hours. Click here to verify your identity immediately.",
    "Congratulations! You've won $50,000 in our lottery. Send your bank details to claim your prize.",
    "Your payment is overdue. Click this link to avoid legal action and additional fees.",
  ],
  sms: [
    "URGENT: Your bank account is blocked. Call +1234567890 immediately with your PIN to reactivate.",
    "You've won Rs.50,000! Send your OTP to 12345 to claim your prize money now.",
    "Your KYC is incomplete. Update now: bit.ly/fake-link or face account closure.",
  ],
}

const RECOMMENDATIONS = {
  scam: [
    "Do NOT click any links or download attachments from this message",
    "Never share personal information like passwords, OTPs, or bank details",
    "Contact the organization directly through official channels to verify",
    "Report this message to your email provider or telecom operator",
    "Block the sender to prevent future messages",
  ],
  safe: [
    "This message appears legitimate, but always verify sender identity",
    "Be cautious with any requests for personal or financial information",
    "When in doubt, contact the sender through official channels",
    "Keep your security software updated",
  ],
}

// Mock function to simulate Python backend integration
// In production, this would call your Python models
async function callPythonBackend(type: string, content: string, sender: string) {
  // This is where you'd integrate with your Python backend
  // For now, we'll simulate the response structure with improved logic

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const scamKeywords = [
    "urgent",
    "immediately",
    "click here",
    "verify now",
    "suspended",
    "expire",
    "winner",
    "congratulations",
    "lottery",
    "prize",
    "blocked",
    "update now",
    "claim",
    "legal action",
    "overdue",
    "penalty",
    "fine",
    "arrest",
    "court",
    "send otp",
    "share pin",
    "call immediately",
    "act now",
    "limited time",
    "free gift",
    "cash prize",
  ]

  const legitimateBankingKeywords = [
    "debited",
    "credited",
    "available balance",
    "transaction",
    "official helpline",
    "customer care",
    "branch",
    "ifsc",
    "statement",
    "mini statement",
    "account number",
    "reference number",
    "transaction id",
  ]

  const legitimateBankPatterns = [
    /\b(hdfc|sbi|icici|axis|kotak|pnb|bob|canara|union|indian)\s+bank\b/i,
    /\bINR\s+[\d,]+\.?\d*\b/i, // Indian Rupee format
    /\bavailable balance:\s*INR/i,
    /\btransaction.*(?:successful|completed|processed)\b/i,
    /\bofficial helpline\s+\d{4}-\d{3}-\d{4}\b/i,
    /\baccount\s+XXXX\d{4}\b/i, // Masked account numbers
    /\bon\s+\d{1,2}-[A-Za-z]{3}-\d{4}\s+at\s+\d{2}:\d{2}/i, // Date-time format
  ]

  const contentLower = content.toLowerCase()

  const detectedScamKeywords = scamKeywords.filter((keyword) => contentLower.includes(keyword.toLowerCase()))

  const detectedLegitKeywords = legitimateBankingKeywords.filter((keyword) =>
    contentLower.includes(keyword.toLowerCase()),
  )

  const hasLegitBankingPatterns = legitimateBankPatterns.some((pattern) => pattern.test(content))

  const hasScamKeywords = detectedScamKeywords.length > 0
  const hasPhoneNumbers = /\+?[\d\s-()]{7,}/.test(content)
  const hasUrls = /https?:\/\/[^\s]+/.test(content)
  const hasSuspiciousUrls = /bit\.ly|tinyurl|t\.co|short\.link/i.test(content)
  const hasAmounts = /\$\d+|\d+\s*(?:rupees?|rs\.?|dollars?|INR)/i.test(content)

  let isScam = false
  let confidence = 0.5

  if (hasLegitBankingPatterns && detectedLegitKeywords.length > 0) {
    // Likely legitimate banking message
    isScam = false
    confidence = 0.2 + detectedLegitKeywords.length * 0.1
  } else if (hasScamKeywords && (hasSuspiciousUrls || detectedScamKeywords.length > 2)) {
    // High probability scam
    isScam = true
    confidence = 0.8 + detectedScamKeywords.length * 0.05
  } else if (hasScamKeywords || (hasPhoneNumbers && hasUrls)) {
    // Medium probability scam
    isScam = true
    confidence = 0.6 + detectedScamKeywords.length * 0.1
  }

  const allDetectedKeywords = [
    ...detectedScamKeywords.map((k) => ({ word: k, type: "scam" })),
    ...detectedLegitKeywords.map((k) => ({ word: k, type: "legitimate" })),
  ]

  const similarExamples = isScam
    ? FRAUD_EXAMPLES[type as keyof typeof FRAUD_EXAMPLES]
        .filter((example) =>
          detectedScamKeywords.some((keyword) => example.toLowerCase().includes(keyword.toLowerCase())),
        )
        .slice(0, 3)
    : []

  const recommendations = isScam ? RECOMMENDATIONS.scam : RECOMMENDATIONS.safe

  return {
    result: type === "email" ? (isScam ? "Spam" : "Not Spam") : isScam ? "Scam" : "Not Scam",
    confidence: Math.min(confidence, 0.95),
    isScam,
    details: {
      urgency: hasScamKeywords ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
      fear: /arrest|jail|legal|court|penalty|fine/.test(contentLower) ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
      authority: /police|government|official|department/.test(contentLower)
        ? Math.random() * 0.5 + 0.5
        : Math.random() * 0.3,
      financial: hasAmounts ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
    },
    entities: {
      phoneNumbers: content.match(/\+?[\d\s-()]{7,}/g) || [],
      amounts: content.match(/\$\d+|\d+\s*(?:rupees?|rs\.?|dollars?|INR)/gi) || [],
      dates: content.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/g) || [],
      emails: content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [],
      urls: content.match(/https?:\/\/[^\s]+/g) || [],
    },
    detectedKeywords: allDetectedKeywords,
    similarExamples: similarExamples,
    recommendations: recommendations.slice(0, isScam ? 5 : 4),
    legitimacyIndicators: {
      hasOfficialBankFormat: hasLegitBankingPatterns,
      hasMaskedAccountNumber: /XXXX\d{4}/.test(content),
      hasOfficialHelpline: /official helpline/.test(contentLower),
      hasProperDateTime: /\d{1,2}-[A-Za-z]{3}-\d{4}\s+at\s+\d{2}:\d{2}/.test(content),
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, content, sender } = await request.json()

    if (!type || !content || !sender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format for email analysis
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(sender)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }
    }

    // Validate phone number for SMS analysis
    if (type === "sms") {
      const phoneRegex = /^[+]?[\d\s-]{7,}$/
      if (!phoneRegex.test(sender)) {
        return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
      }
    }

    const result = await callPythonBackend(type, content, sender)

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Save the analysis result to the database
      const { error: insertError } = await supabase.from("analyses").insert({
        user_id: user.id,
        content: content,
        analysis_type: type,
        is_scam: result.isScam,
        confidence_score: result.confidence,
        detected_keywords: result.detectedKeywords,
        entities: result.entities,
        risk_indicators: result.details,
      })

      if (insertError) {
        console.error("Error saving analysis:", insertError)
        // Don't fail the request if we can't save to DB
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
