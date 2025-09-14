# FraudGuard Pro 🛡️

A comprehensive AI-powered fraud detection web application that analyzes SMS messages, emails, and call transcripts to identify potential scams and fraudulent communications.

## 🚀 Live Demo

**[Try FraudGuard Pro Live]([https://your-app-name.vercel.app](https://v0-scam-guard-sigma.vercel.app/))** ← Click to access the live application

> **Note**: After deploying to Vercel, replace the URL above with your actual deployment URL.

## Features

### 🔍 Multi-Channel Analysis
- **SMS Analysis**: Detect phishing attempts, lottery scams, and suspicious text messages
- **Email Protection**: Identify phishing emails, business email compromise, and fraudulent communications

### 🤖 AI-Powered Detection
- Advanced AI analysis using Groq's language models
- Real-time fraud risk assessment with confidence scoring
- Detailed reasoning and explanation for each analysis
- Pattern recognition across multiple communication types

### 📊 Analytics Dashboard
- Real-time fraud detection statistics
- Risk level distribution charts
- Communication type analysis
- Historical trend tracking
- Threat category breakdown

### 🔗 Similar Scam Database
- Comprehensive database of known scam patterns
- Similarity matching with existing fraud cases
- Pattern recognition across different scam types
- Educational examples for awareness

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS v4
- **AI Integration**: Groq API with AI SDK
- **Charts**: Recharts
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- Groq API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd fraudguard-pro
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# Add to your Vercel project or .env.local
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Analyzing Messages

1. **Select Communication Type**: Choose between SMS, Email, or Call Transcript
2. **Input Content**: Paste or type the suspicious message content
3. **Get Analysis**: Click "Analyze Message" to receive:
   - Fraud risk assessment (Low/Medium/High/Critical)
   - Confidence score (0-100%)
   - Detailed AI reasoning
   - Similar known scams
   - Safety recommendations

### Viewing Analytics

Switch to the Analytics Dashboard tab to view:
- Total messages analyzed
- Risk level distribution
- Communication type breakdown
- Recent analysis trends

## API Endpoints

### POST `/api/analyze-message`
Analyzes a message for fraud indicators.

**Request Body:**
\`\`\`json
{
  "message": "Your message content here",
  "type": "sms" | "email" | "call"
}
\`\`\`

**Response:**
\`\`\`json
{
  "riskLevel": "high",
  "confidence": 85,
  "reasoning": "Detailed analysis explanation",
  "recommendations": ["Safety recommendation 1", "Safety recommendation 2"]
}
\`\`\`

### GET `/api/similar-scams?message=<message>`
Finds similar known scam patterns.

### GET `/api/analytics`
Retrieves fraud detection analytics data.

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fraudguard-pro&env=GROQ_API_KEY&envDescription=Groq%20API%20key%20for%20AI%20model%20access&envLink=https://console.groq.com/keys)

### Manual Deployment Steps

1. **Deploy from v0**: 
   - Click the "Publish" button in the top right of your v0 workspace
   - Your app will be automatically deployed to Vercel with a live URL

2. **Deploy from GitHub**:
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Add your `GROQ_API_KEY` environment variable in Vercel dashboard
   - Deploy automatically

3. **Get Your Live URL**:
   - After deployment, Vercel will provide a live URL like: `https://your-app-name.vercel.app`
   - Update the live demo link above with your actual URL
   - Share your live fraud detection app with others!

### Environment Variables

- `GROQ_API_KEY`: Your Groq API key for AI model access (get it from [Groq Console](https://console.groq.com/keys))

## Security Features

- **No Data Storage**: Messages are analyzed in real-time without persistent storage
- **Privacy First**: No personal information is logged or stored
- **Secure API**: All API endpoints use proper error handling and validation
- **Rate Limiting**: Built-in protection against abuse

## Supported Scam Types

### SMS Scams
- Phishing attempts
- Lottery/prize scams
- Banking fraud
- Package delivery scams
- Tax/government impersonation

### Email Scams
- Phishing emails
- Business email compromise
- Romance scams
- Investment fraud
- Tech support scams

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## Acknowledgments

- Groq for providing powerful AI models
- shadcn/ui for beautiful UI components
- Vercel for hosting and deployment platform

## 🌐 Sharing Your App

Once deployed, you can:
- Share the live URL with colleagues and friends
- Embed it in other websites or documentation
- Use it for demonstrations and presentations
- Access it from any device with internet connection

---

**⚠️ Disclaimer**: This tool is designed to assist in identifying potential fraud but should not be the sole method for determining if a communication is fraudulent. Always use your judgment and consult with relevant authorities when dealing with suspected fraud.
