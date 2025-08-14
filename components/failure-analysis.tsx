"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GeneratedRun } from "@/components/ai-insights"

interface FailureAnalysisProps {
  filteredData: GeneratedRun[]
}

export function FailureAnalysis({ filteredData }: FailureAnalysisProps) {
  const parse = (s: string) => new Date(s as string)
  const dates = filteredData.map(r => parse(r.date)).sort((a, b) => a.getTime() - b.getTime())
  
  if (dates.length === 0) {
    return (
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Persistent Failures</CardTitle>
            <CardDescription>Most failing tests (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-sm">No data available for persistent failures.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Emerging Failures</CardTitle>
            <CardDescription>Increasing failures vs previous half-window</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-sm">No data available for emerging failures.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const max = dates[dates.length - 1]
  const windowStart = new Date(max)
  windowStart.setDate(max.getDate() - 6)
  const windowRuns = filteredData.filter(r => {
    const d = parse(r.date)
    return d >= windowStart && d <= max
  })

  // summarize
  const byTest: Record<string, number> = {}
  windowRuns.forEach(r => r.testCases.forEach(tc => { byTest[tc.testName] = (byTest[tc.testName] ?? 0) + 1 }))
  const tests = Object.entries(byTest).map(([name, count]) => ({ name, count }))
  tests.sort((a, b) => b.count - a.count)
  const topFailures = tests.slice(0, 6)

  const mid = Math.floor(windowRuns.length / 2)
  const firstHalfRuns = windowRuns.slice(0, mid)
  const secondHalfRuns = windowRuns.slice(mid)
  const countIn = (arr: typeof windowRuns, name: string) => arr.reduce((acc, r) => acc + r.testCases.filter(tc => tc.testName === name).length, 0)
  const deltas = topFailures.map(t => ({ name: t.name, delta: countIn(secondHalfRuns, t.name) - countIn(firstHalfRuns, t.name) }))
  const emerging = deltas.filter(d => d.delta > 0).slice(0, 6)

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Persistent Failures</CardTitle>
          <CardDescription>Most failing tests (last 7 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-gray-600">
              <tr>
                <th className="text-left py-2">Test Case</th>
                <th className="text-right py-2">Failures</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topFailures.length > 0 ? (
                topFailures.map(item => (
                  <tr key={item.name}>
                    <td className="py-2 pr-2 truncate">{item.name}</td>
                    <td className="py-2 text-right text-gray-700">{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-2 text-center text-gray-500">No persistent failures found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Emerging Failures</CardTitle>
          <CardDescription>Increasing failures vs previous half-window</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-gray-600">
              <tr>
                <th className="text-left py-2">Test Case</th>
                <th className="text-right py-2">Δ Failures</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {emerging.length > 0 ? (
                emerging.map(item => (
                  <tr key={item.name}>
                    <td className="py-2 pr-2 truncate">{item.name}</td>
                    <td className="py-2 text-right text-gray-700">+{item.delta}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-2 text-center text-gray-500">No emerging failures found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
