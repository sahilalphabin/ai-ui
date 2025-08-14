"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Calendar, GitBranch, RefreshCw, TrendingUp, TrendingDown, RotateCcw, Play, Bug, Palette, AlertTriangle, MoreHorizontal, Search, ExternalLink, BarChart3, Clock, CheckCircle } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from "recharts"
import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FailureBranchTrends } from "@/components/failure-branch-trends"
import { SummaryCards } from "@/components/summary-cards"
import { MigrationGraph } from "@/components/migration-graph"
import { FailureAnalysis } from "@/components/failure-analysis"

// Generate large fake dataset: 80 test runs x ~25 test cases
export interface GeneratedTestCase {
  testName: string
  category: string
  percentage: number
  duration: string
  error: string
  author: string
  retryCount: string
}

export interface GeneratedRun {
  testRunId: string
  date: string
  branch: string
  testCases: GeneratedTestCase[]
}

function generateTestData(numRuns: number, numTests: number, seed = 42): GeneratedRun[] {
  // Deterministic PRNG to avoid hydration mismatches
  let state = seed >>> 0
  function rnd() {
    // LCG (Numerical Recipes)
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0xffffffff
  }
  const categoriesLocal = ["unknown", "bug", "ui-change", "flaky"]
  const branchesLocal = ["devA", "devB", "devC", "staging", "prod"]
  const authors = ["john.doe", "jane.smith", "mike.wilson", "sarah.jones", "amy.lee", "bob.kim"]
  const errors = [
    "Timeout waiting for element",
    "Assertion failed",
    "Network timeout",
    "Database error",
    "Unknown error occurred",
    "Layout changed",
  ]

  const testCaseNames: string[] = [
    "LoginTest.validateCredentials",
    "DashboardTest.renderWidgets",
    "UserProfileTest.updateAvatar",
    "CheckoutTest.processPayment",
    "SearchTest.filterResults",
    "OrdersTest.createOrder",
    "NotificationTest.sendEmail",
    "SettingsTest.savePreferences",
    "BillingTest.applyCoupon",
    "AuthTest.refreshToken",
    "ReportTest.exportCsv",
    "ImportTest.bulkUsers",
    "PaymentTest.refund",
    "ShippingTest.calculateRate",
    "CatalogTest.addProduct",
    "CartTest.updateQuantity",
    "ReviewTest.submit",
    "ProfileTest.changePassword",
    "AnalyticsTest.trackEvent",
    "FeatureFlagTest.toggle",
    "PermissionsTest.roleMatrix",
    "ABTest.variantAllocation",
    "LocalizationTest.translate",
    "AccessibilityTest.focusTrap",
    "FileUploadTest.largeFile",
  ].slice(0, numTests)

  // Maintain previous category per testcase for migration continuity
  const lastCategory: Record<string, string> = {}

  function formatDate(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const start = new Date(2025, 0, 1)
  const result: GeneratedRun[] = []
  for (let i = 1; i <= numRuns; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + Math.floor((i - 1) / 3)) // ~3 runs/day
    const run: GeneratedRun = {
      testRunId: `T${i}`,
      date: formatDate(date),
      branch: branchesLocal[i % branchesLocal.length],
      testCases: [],
    }

    testCaseNames.forEach((name, idx) => {
      // Probability this testcase appears in this run
      const appears = rnd() < 0.7
      if (!appears) return

      const prev = lastCategory[name] ?? categoriesLocal[Math.floor(rnd() * categoriesLocal.length)]
      // 70% stay in same category, 30% migrate
      const stay = rnd() < 0.7
      const cat = stay ? prev : categoriesLocal[Math.floor(rnd() * categoriesLocal.length)]
      lastCategory[name] = cat

      const percentage = Math.floor(10 + rnd() * 80) // 10..90
      const duration = `${(5 + rnd() * 45).toFixed(1)}s`
      const error = errors[Math.floor(rnd() * errors.length)]
      const author = authors[Math.floor(rnd() * authors.length)]
      const retriesUsed = Math.floor(rnd() * 4)
      const retryCount = `${retriesUsed}/3`

      run.testCases.push({
        testName: name,
        category: cat,
        percentage,
        duration,
        error,
        author,
        retryCount,
      })
    })

    result.push(run)
  }
  return result
}

// Fixed seed ensures the same SSR/CSR values to avoid hydration mismatches
const testData = generateTestData(20, 10, 1337)

interface SummaryCardData {
  count: number;
  topTestCases: { title: string; count: number }[];
}

interface InsightsData {
  summaryCards: {
    uichange: SummaryCardData;
    bug: SummaryCardData;
    flaky: SummaryCardData;
    unknown: SummaryCardData;
  };
}

interface AIInsightsProps {
  summaryCards: InsightsData['summaryCards'] | null;
}

const branches = ["All", "devA", "devB", "devC", "staging", "prod"]
const categories = ["unknown", "bug", "ui-change", "flaky"]

export function AIInsights({ summaryCards }: AIInsightsProps) {
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedTestCase, setSelectedTestCase] = useState("All")
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)
  const [hoveredDot, setHoveredDot] = useState<any>(null)

  // Get unique test case names
  const allTestCases = useMemo(() => {
    const testCaseSet = new Set<string>()
    // Using existing testData for migration graph, not summary cards
    testData.forEach(run => {
      run.testCases.forEach(test => {
        testCaseSet.add(test.testName)
      })
    })
    return ["All", ...Array.from(testCaseSet).sort()]
  }, [])

  // Filter data based on selected branch
  const filteredData = useMemo(() => {
    if (selectedBranch === "All") return testData
    return testData.filter(run => run.branch === selectedBranch)
  }, [selectedBranch])

  // Get test case data for the selected test case
  const selectedTestCaseData = useMemo(() => {
    if (selectedTestCase === "All") return null
    
    const testCaseRuns: any[] = []
    filteredData.forEach(run => {
      const testCase = run.testCases.find(t => t.testName === selectedTestCase)
      if (testCase) {
        testCaseRuns.push({
          ...testCase,
          testRunId: run.testRunId,
          date: run.date,
          branch: run.branch
        })
      }
    })
    return testCaseRuns
  }, [selectedTestCase, filteredData])

  // Plot padding to keep strokes/circles within bounds (in SVG viewBox units)
  const xPad = 4
  const yPad = 8

  // Visual sizing (SVG viewBox units; 100 units height)
  const size = {
    line: { normal: 0.8, selected: 1.2 },
    point: { radius: 1.0, stroke: 0.5 }
  }

  // Calculate Y position for a category and percentage within padded area (0..100 SVG units)
  const getYPosition = (category: string, percentage: number) => {
    const effectiveHeight = 100 - 2 * yPad
    const bandHeight = effectiveHeight / categories.length
    const categoryIndex = categories.indexOf(category)
    const bandStart = yPad + categoryIndex * bandHeight
    const y = bandStart + (percentage / 100) * bandHeight
    return Math.max(yPad, Math.min(100 - yPad, y))
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "unknown": return "#6B7280"
      case "bug": return "#EF4444"
      case "ui-change": return "#3B82F6"
      case "flaky": return "#F59E0B"
      default: return "#6B7280"
    }
  }

  // Get test case color
  const getTestCaseColor = (testName: string) => {
    const colors = ["#8B5CF6", "#EC4899", "#10B981", "#F97316", "#06B6D4", "#84CC16"]
    const index = allTestCases.indexOf(testName) % colors.length
    return colors[index]
  }

  // Build a simple straight-line path (cleaner look)
  function buildStraightPath(points: Array<{ x: number; y: number }>): string {
    if (points.length < 2) return ""
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header - Keep existing */}
      <div className="bg-white border-b border-gray-200 p-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                Onpath testing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                CruiseControl
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Insights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title and Description */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Insights</h1>
          <p className="text-gray-600">Test Failure Category Migration Graph - Track test stability trends over time</p>
        </div>

        {/* Filter and Action Buttons */}
        <div className="flex items-center space-x-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="14days">14 days</SelectItem>
              <SelectItem value="1month">1 month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="main">
            <SelectTrigger className="w-[140px]">
              <GitBranch className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">main</SelectItem>
              <SelectItem value="develop">develop</SelectItem>
              <SelectItem value="feature/test-improvements">feature/test-improvements</SelectItem>
              <SelectItem value="hotfix/urgent-fix">hotfix/urgent-fix</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Content (Tabs) */}
      <div className="p-6 space-y-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Failure / Branch Trends</TabsTrigger>
          </TabsList>
        <TabsContent value="overview">
          {/* Overview summary cards (last 7 days) */}
          <SummaryCards summaryCards={summaryCards} categories={categories} />

        
          <MigrationGraph 
            testData={testData} 
            categories={categories} 
            selectedTestCase={selectedTestCase} 
            allTestCases={allTestCases} 
            filteredData={filteredData} 
          />

        {/* Persistent Failures & Emerging (last 7 days) */}
        <FailureAnalysis filteredData={filteredData} />

         {/* Migration Graph (Recharts) -- commented out for now */}
         {false && (
           <Card>
             <CardHeader>
               <CardTitle>Test Failure Category Migration Graph</CardTitle>
               <CardDescription>
                 Interactive visualization showing how test cases migrate between failure categories across test runs
               </CardDescription>
             </CardHeader>
             <CardContent>
               <div className="relative h-[560px] bg-white rounded-lg border overflow-hidden">
                 {/* full graph code kept here but gated off */}
               </div>
             </CardContent>
           </Card>
         )}
        </TabsContent>

        <TabsContent value="trends">
          <FailureBranchTrends data={filteredData} categories={categories} branches={branches.slice(1)} />
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 