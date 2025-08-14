import TestdinoApp from "@/components/testdino-app"
import { unstable_noStore as noStore } from 'next/cache'

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

async function getSummaryCardsData(): Promise<InsightsData | null> {
  noStore();
  try {
    const response = await fetch('http://localhost:8000/api/insights/project/overview/project_6880b08d8ec0e40df52b9778?environment=Production&dateRange=14days');
    if (!response.ok) {
      console.error("Failed to fetch summary cards data:", response.statusText);
      return null;
    }
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching summary cards data:", error);
    return null;
  }
}

export default async function Home() {
  const insightsData = await getSummaryCardsData();
  const summaryCards = insightsData?.summaryCards || null;

  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <TestdinoApp summaryCards={summaryCards} />
    </main>
  );
}
