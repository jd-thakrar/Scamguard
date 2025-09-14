"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Calendar, TrendingUp, Users, AlertTriangle } from "lucide-react"

// Sample data for charts (replace with real data from props)
const timelineData = [
  { date: "2024-01", analyses: 45, scams: 8, users: 12 },
  { date: "2024-02", analyses: 67, scams: 12, users: 18 },
  { date: "2024-03", analyses: 89, scams: 15, users: 25 },
  { date: "2024-04", analyses: 123, scams: 22, users: 34 },
  { date: "2024-05", analyses: 156, scams: 28, users: 42 },
  { date: "2024-06", analyses: 198, scams: 35, users: 56 },
]

const analysisTypeData = [
  { type: "Email", count: 324, scams: 45, color: "#3b82f6" },
  { type: "SMS", count: 198, scams: 28, color: "#10b981" },
]

const scamCategoryData = [
  { name: "Phishing", value: 35, color: "#ef4444" },
  { name: "Financial Fraud", value: 28, color: "#f97316" },
  { name: "Identity Theft", value: 15, color: "#eab308" },
  { name: "Romance Scam", value: 12, color: "#ec4899" },
  { name: "Other", value: 10, color: "#6b7280" },
]

const userActivityData = [
  { hour: "00", active: 5 },
  { hour: "04", active: 8 },
  { hour: "08", active: 45 },
  { hour: "12", active: 67 },
  { hour: "16", active: 89 },
  { hour: "20", active: 34 },
]

interface AnalyticsChartsProps {
  totalAnalyses?: number
  totalScams?: number
  totalUsers?: number
}

export default function AnalyticsCharts({
  totalAnalyses = 522,
  totalScams = 73,
  totalUsers = 56,
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-8">
      {/* Analysis Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Analysis Timeline
          </CardTitle>
          <CardDescription>Monthly analysis activity and scam detection trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              analyses: {
                label: "Total Analyses",
                color: "hsl(var(--chart-1))",
              },
              scams: {
                label: "Scams Detected",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="analyses" stroke="var(--color-analyses)" strokeWidth={2} />
                <Line type="monotone" dataKey="scams" stroke="var(--color-scams)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analysis Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Analysis by Type
            </CardTitle>
            <CardDescription>Email vs SMS analysis breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Total",
                  color: "hsl(var(--chart-1))",
                },
                scams: {
                  label: "Scams",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--color-count)" />
                  <Bar dataKey="scams" fill="var(--color-scams)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Scam Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Scam Categories
            </CardTitle>
            <CardDescription>Distribution of detected scam types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scamCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {scamCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Activity Pattern
          </CardTitle>
          <CardDescription>Analysis activity by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              active: {
                label: "Active Users",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="active" fill="var(--color-active)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Detection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {totalAnalyses > 0 ? ((totalScams / totalAnalyses) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Scam detection rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-2">1.2s</div>
            <p className="text-sm text-muted-foreground">Average analysis time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">
              {totalUsers > 0 ? (totalAnalyses / totalUsers).toFixed(1) : 0}
            </div>
            <p className="text-sm text-muted-foreground">Avg analyses per user</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
