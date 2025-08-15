import { InsightsView } from "@/components/insights/insights-view"
import { generateTestData } from "@/lib/insights/generate-test-data"

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

interface FailureItem {
  testName: string
  specFile: string
  branch: string
  testRunIds: string
  failureTrend: {
    type: 'persistent' | 'emerging'
    confidence: number
    reason: string
  }
  totalFailures: number
  primaryCategory: string
}

interface FailuresTable {
  persistentFailures: FailureItem[]
  emergingFailures: FailureItem[]
  allFailures: FailureItem[]
}

interface InsightsProps {
  summaryCards: InsightsData['summaryCards'] | null
  failuresTable: FailuresTable | null
  testData?: GeneratedRun[]
  categories?: string[]
  errorData?: { date: string; category_key: string; display_name: string; count: number }[]
  categoryDetails?: any[]
}

// Local copies of migration data interfaces for prop typing
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

export function Insights({ summaryCards, failuresTable, testData, categories, errorData, categoryDetails }: InsightsProps) {
  // Keep fake generation logic, but prefer real API data when provided
  const fallbackTestData = generateTestData(20, 10, 1337)
  const fallbackCategories = ["unknown", "bug", "ui_change", "flaky"] as const

  const dataToUse = (testData && testData.length > 0 ? testData : fallbackTestData)
  const categoriesToUse = (categories && categories.length > 0 ? categories : (fallbackCategories as unknown as string[]))

  const branches = ["All", "devA", "devB", "devC", "staging", "prod"]
  return (
    <InsightsView
      summaryCards={summaryCards}
      failuresTable={failuresTable}
      testData={dataToUse}
      categories={categoriesToUse}
      branches={branches}
      errorData={errorData}
      categoryDetails={categoryDetails}
    />
  )
}


