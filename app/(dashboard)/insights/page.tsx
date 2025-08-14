import { unstable_noStore as noStore } from 'next/cache'
import { Insights } from '@/components/insights/ai-insights'

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
  persistentFailures: PersistentFailureItem[]
  emergingFailures: EmergingFailureItem[]
}

async function getInsightsData(): Promise<InsightsData | null> {
  noStore()
  try {
    const response = await fetch('http://localhost:8000/api/insights/project/overview/project_68497b2346dd1403362abe05?environment=Production&dateRange=7days', { cache: 'no-store' })
    if (!response.ok) return null
    const result = await response.json()
    return result.data || null
  } catch {
    return null
  }
}

interface MigrationTestCase {
  testName: string
  category: string
  percentage: number
  duration: string
  error: string
  author: string
  retryCount: string
}

interface MigrationRun {
  testRunId: string
  date: string
  branch: string
  testCases: MigrationTestCase[]
}

interface MigrationResponseData {
  categories: string[]
  runs: MigrationRun[]
}

async function getMigrationData(): Promise<MigrationResponseData | null> {
  noStore()
  try {
    const response = await fetch('http://localhost:8000/api/insights/project/migration/project_68497b2346dd1403362abe05?environment=Production&dateRange=7days', { cache: 'no-store' })
    if (!response.ok) return null
    const result = await response.json()
    const raw: MigrationResponseData | undefined = result?.data
    if (!raw) return null
    // Normalize category naming: backend may send underscores (e.g., ui_change)
    const normalizeCategory = (c: string) => c.replaceAll('_', '-')
    const categories = (raw.categories || []).map(normalizeCategory)
    const runs = (raw.runs || []).map(run => ({
      ...run,
      testCases: (run.testCases || []).map(tc => ({
        ...tc,
        category: normalizeCategory(tc.category),
      }))
    }))
    return { categories, runs }
  } catch {
    return null
  }
}

// Error analysis (for stacked area chart)
interface ErrorDataPoint {
  date: string
  error_message: string
  count: number
}

async function getErrorAnalysisData(): Promise<ErrorDataPoint[]> {
  noStore()
  try {
    const response = await fetch('http://localhost:8000/api/insights/project/analysis/project_68497b2346dd1403362abe05?environment=Development&dateRange=7days', { cache: 'no-store' })
    if (!response.ok) return []
    const result = await response.json()
    console.log("result", result)
    // Support either { data: { points: [...] }} or { data: [...] }
    const data = result?.data
    if (Array.isArray(data)) return data as ErrorDataPoint[]
    if (data && Array.isArray(data.points)) return data.points as ErrorDataPoint[]
    return []
  } catch {
    return []
  }
}

export default async function Page() {
  const [insightsData, errorData] = await Promise.all([
    getInsightsData(),
    getErrorAnalysisData(),
  ])
  // const migrationData = await getMigrationData()
  return (
    <Insights
      summaryCards={insightsData?.summaryCards || null}
      persistentFailures={insightsData?.persistentFailures || []}
      emergingFailures={insightsData?.emergingFailures || []}
      errorData={errorData}
      // testData={migrationData?.runs || []}
      // categories={migrationData?.categories || []}
    />
  )
}


