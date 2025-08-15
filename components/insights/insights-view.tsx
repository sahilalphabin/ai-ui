"use client"

import { useMemo } from "react"
import { useQueryState } from "nuqs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, GitBranch, RefreshCw } from "lucide-react"
import { SummaryCards } from "@/components/insights/overview/summary-cards"
// import { MigrationGraph } from "@/components/insights/overview/migration-graph"
// import { FailureAnalysis } from "@/components/insights/overview/failure-analysis"
import { FailureBranchTrends } from "@/components/insights/trends/failure-branch-trends"
import { PersistentEmergingTables } from "./overview/persistent-emerging-tables"
// import { AIErrorAnalysis } from "@/components/ai-error-analysis"
// import { ErrorAreaChart } from "./overview/error-area-chart"

interface SummaryCardData {
  count: number
  topTestCases: { title: string; count: number }[]
}

interface InsightsData {
  summaryCards: {
    uichange: SummaryCardData
    bug: SummaryCardData
    flaky: SummaryCardData
    unknown: SummaryCardData
  }
}

interface GeneratedTestCase {
  testName: string
  category: string
  percentage: number
  duration: string
  error: string
  author: string
  retryCount: string
}

interface GeneratedRun {
  testRunId: string
  date: string
  branch: string
  testCases: GeneratedTestCase[]
}

interface InsightsViewProps {
  summaryCards: InsightsData['summaryCards'] | null
  persistentFailures: { title: string; totalFailures: number }[]
  emergingFailures: { title: string; totalFailures?: number; delta?: number }[]
  testData: GeneratedRun[]
  categories: string[]
  branches: string[]
  errorData?: { date: string; category_key: string; display_name: string; count: number }[]
  categoryDetails?: any[]
}

export function InsightsView({ summaryCards, persistentFailures, emergingFailures, testData, categories, branches, errorData, categoryDetails }: InsightsViewProps) {
  // Transform API category details to component format
  function transformCategoryDetails(apiData: any[]) {
    return {
      totalTestsAffected: apiData.reduce((sum, cat) => sum + (cat.total_tests_affected || 0), 0),
      branchesImpacted: new Set(apiData.flatMap(cat => Object.keys(cat.branch_details || {}))).size,
      totalFailures: apiData.reduce((sum, cat) => sum + Object.values(cat.branch_details || {}).reduce((a: any, b: any) => a + b, 0), 0),
      errorCategories: apiData.map(cat => ({
        name: cat.name,
        color: getColorForCategory(cat.icon),
        branches: Object.keys(cat.branch_details || {}),
        testsAffected: cat.total_tests_affected || 0,
        tests: cat.sub_errors?.flatMap((subError: any) => 
          subError.test_occurrences?.map((test: any) => ({
            testName: test.test_name,
            errorMessage: subError.error_message,
            frequency: test.frequency || 1,
            branch: test.branches?.[0] || 'unknown'
          })) || []
        ) || []
      }))
    }
  }

  function getColorForCategory(icon: string): string {
    switch (icon) {
      case 'red': return '#ef4444'
      case 'blue': return '#3b82f6'
      case 'orange': return '#f59e0b'
      case 'purple': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const [tab, setTab] = useQueryState('tab', { defaultValue: 'overview' })
  const [selectedBranch, setSelectedBranch] = useQueryState('branch', { defaultValue: 'All' })
  const [selectedTestCase, setSelectedTestCase] = useQueryState('test', { defaultValue: 'All' })

  const allTestCases = useMemo(() => {
    const testCaseSet = new Set<string>()
    testData.forEach(run => run.testCases.forEach(t => testCaseSet.add(t.testName)))
    return ["All", ...Array.from(testCaseSet).sort()]
  }, [testData])

  const filteredData = useMemo(() => {
    if (selectedBranch === "All") return testData
    return testData.filter(run => run.branch === selectedBranch)
  }, [selectedBranch, testData])

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-white border-b border-gray-200 p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">Onpath testing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">CruiseControl</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Insights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Insights</h1>
          <p className="text-gray-600">Test Failure Category Migration Graph - Track test stability trends over time</p>
        </div>

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

          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[140px]">
              <GitBranch className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Failure / Branch Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <SummaryCards summaryCards={summaryCards} categories={categories} />
            {/* <AIErrorAnalysis data={categoryDetails ? transformCategoryDetails(categoryDetails) : undefined} /> */}
            <PersistentEmergingTables
              persistentFailures={persistentFailures}
              emergingFailures={emergingFailures}
            />
            {false && (
              <div>
                {/* ErrorAreaChart moved to Trends tab */}
                {/* <ErrorAreaChart /> */}
              </div>
            )}
            {false && (
              <div>
                {/* MigrationGraph temporarily disabled */}
                {/* <MigrationGraph
                  testData={filteredData}
                  categories={categories}
                  selectedTestCase={selectedTestCase}
                  allTestCases={allTestCases}
                  filteredData={filteredData}
                /> */}
              </div>
            )}
            {false && (
              <div>
                {/* FailureAnalysis tables temporarily disabled */}
                {/* <FailureAnalysis filteredData={filteredData} /> */}
              </div>
            )}
            {false && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Failure Category Migration Graph</CardTitle>
                  <CardDescription>Interactive visualization showing how test cases migrate between failure categories across test runs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[560px] bg-white rounded-lg border overflow-hidden" />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="trends">
            <FailureBranchTrends
              data={filteredData}
              categories={categories}
              branches={branches.slice(1)}
              errorData={errorData}
              categoryDetails={categoryDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


