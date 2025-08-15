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
    ui_change: SummaryCardData
    bug: SummaryCardData
    flaky: SummaryCardData
    unknown: SummaryCardData
  }
  failuresTable: {
    persistentFailures: any[]
    emergingFailures: any[]
    allFailures: any[]
  }
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

// Error analysis (new backend schema → normalize here for chart)
interface ErrorSeriesPoint {
  date: string
  category_key: string
  display_name: string
  count: number
}

async function getErrorAnalysisData(): Promise<{ graphData: ErrorSeriesPoint[], categoryDetails: any[] }> {
  noStore()
  try {
    const response = await fetch('http://localhost:8000/api/insights/project/analysis/project_68497b2346dd1403362abe05?environment=Development&dateRange=7days', { cache: 'no-store' })
    if (!response.ok) return { graphData: [], categoryDetails: [] }
    const result = await response.json()
    console.log("result", result)
    
    const data = result?.data
    if (!data) return { graphData: [], categoryDetails: [] }

    // Extract graph data for ErrorAreaChart
    const graphData: ErrorSeriesPoint[] = []
    if (data.graph_data?.dates && data.graph_data?.categories) {
      const { dates, categories } = data.graph_data
      // Process dates in their original order (chronological)
      dates.forEach((date: string, index: number) => {
        categories.forEach((category: any) => {
          graphData.push({
            date: date,
            category_key: category.name,
            display_name: category.label,
            count: category.data[index] || 0,
          })
        })
      })
    }

    // Extract category details for AIErrorAnalysis
    const categoryDetails = data.category_details || []

    return { graphData, categoryDetails }
  } catch {
    return { graphData: [], categoryDetails: [] }
  }
}

export default async function Page() {
  const [insightsData, errorAnalysisData] = await Promise.all([
    getInsightsData(),
    getErrorAnalysisData(),
  ])
  
  const { graphData, categoryDetails } = errorAnalysisData
  // const migrationData = await getMigrationData()
  return (
    <Insights
      summaryCards={insightsData?.summaryCards || null}
      failuresTable={insightsData?.failuresTable || null}
      errorData={graphData}
      categoryDetails={categoryDetails}
      // testData={migrationData?.runs || []}
      // categories={migrationData?.categories || []}
    />
  )
}


