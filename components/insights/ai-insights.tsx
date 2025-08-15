import { InsightsView } from "@/components/insights/insights-view"
import { generateTestData } from "@/lib/insights/generate-test-data"

interface SummaryCardData {
  count: number
  topTestCases: { title: string; count: number }[]
}

interface PersistentFailureItem {
  title: string
  totalFailures: number
}

interface EmergingFailureItem {
  title: string
  totalFailures?: number
  delta?: number
}

interface InsightsData {
  summaryCards: {
    uichange: SummaryCardData
    bug: SummaryCardData
    flaky: SummaryCardData
    unknown: SummaryCardData
  }
}

interface InsightsProps {
  summaryCards: InsightsData['summaryCards'] | null
  persistentFailures: PersistentFailureItem[]
  emergingFailures: EmergingFailureItem[]
  // If provided by the server, use real migration data; otherwise fall back to generated data
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

export function Insights({ summaryCards, persistentFailures, emergingFailures, testData, categories, errorData, categoryDetails }: InsightsProps) {
  // Keep fake generation logic, but prefer real API data when provided
  const fallbackTestData = generateTestData(20, 10, 1337)
  const fallbackCategories = ["unknown", "bug", "ui-change", "flaky"] as const

  const dataToUse = (testData && testData.length > 0 ? testData : fallbackTestData)
  const categoriesToUse = (categories && categories.length > 0 ? categories : (fallbackCategories as unknown as string[]))

  const branches = ["All", "devA", "devB", "devC", "staging", "prod"]
  return (
    <InsightsView
      summaryCards={summaryCards}
      persistentFailures={persistentFailures}
      emergingFailures={emergingFailures}
      testData={dataToUse}
      categories={categoriesToUse}
      branches={branches}
      errorData={errorData}
      categoryDetails={categoryDetails}
    />
  )
}


