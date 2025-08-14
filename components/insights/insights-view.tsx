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
  errorData?: { date: string; error_message: string; count: number }[]
}

export function InsightsView({ summaryCards, persistentFailures, emergingFailures, testData, categories, branches, errorData }: InsightsViewProps) {
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
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


