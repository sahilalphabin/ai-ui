"use client"

import { useMemo } from "react"
import { useQueryState } from "nuqs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, GitBranch, RefreshCw, AlertTriangle, TrendingUp, Settings, CalendarDays } from "lucide-react"
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
    ui_change: {
      count: number
      topTestCases: { title: string; count: number }[]
    }
    bug: {
      count: number
      topTestCases: { title: string; count: number }[]
    }
    flaky: {
      count: number
      topTestCases: { title: string; count: number }[]
    }
    unknown: {
      count: number
      topTestCases: { title: string; count: number }[]
    }
  }
}

interface FailureTrend {
  type: 'persistent' | 'emerging'
  confidence: number
  reason: string
}

interface FailureItem {
  testName: string
  specFile: string
  branch: string
  testRunIds: string
  failureTrend: FailureTrend
  totalFailures: number
  primaryCategory: string
}

interface FailuresTable {
  persistentFailures: FailureItem[]
  emergingFailures: FailureItem[]
  allFailures: FailureItem[]
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
  failuresTable: FailuresTable | null
  testData: GeneratedRun[]
  categories: string[]
  branches: string[]
  errorData?: { date: string; category_key: string; display_name: string; count: number }[]
  categoryDetails?: any[]
}

export function InsightsView({ summaryCards, failuresTable, testData, categories, branches, errorData, categoryDetails }: InsightsViewProps) {
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

  function generateDailyInsights(testData: GeneratedRun[], categories: string[]): { date: string; events: string[] }[] {
    const insights: { date: string; events: string[] }[] = [];
    const testCaseMap = new Map<string, string>();

    // Create a map of test names to their categories
    testData.forEach(run => {
      run.testCases.forEach(test => {
        testCaseMap.set(test.testName, test.category);
      });
    });

    // Group test runs by date
    const dateMap = new Map<string, GeneratedRun[]>();
    testData.forEach(run => {
      const date = new Date(run.date).toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, []);
      }
      dateMap.get(date)?.push(run);
    });

    // Sort dates in descending order
    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (const date of sortedDates) {
      const runsOnDate = dateMap.get(date) || [];
      const events: string[] = [];

      // Analyze test failures and generate meaningful events
      const failureCounts = new Map<string, number>();
      const branchSet = new Set<string>();
      const categoryFailures = new Map<string, number>();

      runsOnDate.forEach(run => {
        branchSet.add(run.branch);
        run.testCases.forEach(test => {
          if (test.error) {
            const category = testCaseMap.get(test.testName) || 'Unknown';
            categoryFailures.set(category, (categoryFailures.get(category) || 0) + 1);
            
            // Count specific error types
            if (test.error.toLowerCase().includes('timeout')) {
              failureCounts.set('timeout', (failureCounts.get('timeout') || 0) + 1);
            } else if (test.error.toLowerCase().includes('assertion')) {
              failureCounts.set('assertion', (failureCounts.get('assertion') || 0) + 1);
            } else if (test.error.toLowerCase().includes('element not found')) {
              failureCounts.set('element_not_found', (failureCounts.get('element_not_found') || 0) + 1);
            } else if (test.error.toLowerCase().includes('network')) {
              failureCounts.set('network', (failureCounts.get('network') || 0) + 1);
            }
          }
        });
      });

      // Generate meaningful events based on analysis
      if (failureCounts.get('timeout') && failureCounts.get('timeout')! > 5) {
        events.push(`⏰ ${failureCounts.get('timeout')} timeout failures detected - potential performance regression`);
      }
      
      if (failureCounts.get('assertion') && failureCounts.get('assertion')! > 3) {
        events.push(`❌ ${failureCounts.get('assertion')} assertion failures - new feature integration issues`);
      }
      
      if (failureCounts.get('element_not_found') && failureCounts.get('element_not_found')! > 2) {
        events.push(`🔍 ${failureCounts.get('element_not_found')} element not found errors - UI changes detected`);
      }
      
      if (failureCounts.get('network') && failureCounts.get('network')! > 1) {
        events.push(`🌐 ${failureCounts.get('network')} network failures - backend connectivity issues`);
      }

      // Check for new branches
      if (branchSet.size > 1) {
        events.push(`🌿 ${branchSet.size} branches tested - new feature development`);
      }

      // Check for specific test categories that might indicate new features
      if (categoryFailures.get('uichange') && categoryFailures.get('uichange')! > 3) {
        events.push(`🎨 UI changes detected - new interface features being tested`);
      }
      
      if (categoryFailures.get('bug') && categoryFailures.get('bug')! > 5) {
        events.push(`🐛 ${categoryFailures.get('bug')} bug-related failures - regression testing in progress`);
      }

      // Add general insights
      const totalTests = runsOnDate.reduce((sum, run) => sum + run.testCases.length, 0);
      if (totalTests > 50) {
        events.push(`📊 High test volume (${totalTests} tests) - comprehensive testing cycle`);
      }

      // If no specific events, add a general summary
      if (events.length === 0) {
        events.push(`✅ Stable test run - no significant issues detected`);
      }

      // Limit to 3 most important events
      insights.push({ 
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }), 
        events: events.slice(0, 3) 
      });
    }

    return insights;
  }

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
            <SummaryCards 
              summaryCards={summaryCards}
              categories={categories} 
            />
                {/* AI Insights Card */}
                <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <CalendarDays className="h-5 w-5" />
                  At a glance Timelines
                </CardTitle>
                <CardDescription>Key insights and trends from the last 7 days of test runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generateDailyInsights(testData, categories).map((dayInsight, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="h-4 w-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">{dayInsight.date}</h4>
                        <Badge variant="outline" className="text-xs">
                          {dayInsight.events.length} events
                        </Badge>
                      </div>
                      <ul className="space-y-2">
                        {dayInsight.events.map((event, eventIndex) => (
                          <li key={eventIndex} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-gray-500 mt-1">•</span>
                            <span>{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <PersistentEmergingTables
              failuresTable={failuresTable}
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


