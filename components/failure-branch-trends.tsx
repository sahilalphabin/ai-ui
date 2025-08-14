"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GeneratedRun } from "./ai-insights"
import { Fragment } from "react"
import { ErrorAreaChart, ErrorDataPoint } from "@/components/insights/overview/error-area-chart"

interface Props {
  data: GeneratedRun[]
  categories: string[]
  branches: string[]
  errorData?: ErrorDataPoint[]
}

export function FailureBranchTrends({ data, categories, branches, errorData }: Props) {
  // Simple computed summaries for last 7 days
  const parse = (s: string) => new Date(s as string)
  const dates = data.map(r => parse(r.date)).sort((a,b)=>a.getTime()-b.getTime())
  const max = dates[dates.length-1]
  const windowStart = new Date(max)
  windowStart.setDate(max.getDate() - 6)
  const windowRuns = data.filter(r => {
    const d = parse(r.date)
    return d >= windowStart && d <= max
  })

  // Build branch x day matrix of failures
  const dayKeys = Array.from(new Set(windowRuns.map(r => r.date))).sort()
  const branchDayToCount: Record<string, number> = {}
  windowRuns.forEach(run => {
    const keyBase = `${run.branch}|${run.date}`
    branchDayToCount[keyBase] = (branchDayToCount[keyBase] ?? 0) + run.testCases.length
  })

  const maxCount = Math.max(1, ...Object.values(branchDayToCount))
  const summary = summarizeTop(windowRuns)

  return (
    <div className="space-y-6">
      <ErrorAreaChart data={errorData} />
      {/* AI Error Analysis (last 7 days) */}
      {(() => {
        const mid = Math.floor(windowRuns.length/2) || 1
        const first = windowRuns.slice(0, mid)
        const second = windowRuns.slice(mid)
        type ErrAgg = { first: number; second: number; tests: Set<string>; branches: Set<string> }
        const byError: Record<string, ErrAgg> = {}
        const addRun = (arr: typeof windowRuns, isFirst: boolean) => {
          arr.forEach(run => {
            run.testCases.forEach(tc => {
              const key = tc.error || 'Unknown Error'
              if (!byError[key]) byError[key] = { first: 0, second: 0, tests: new Set(), branches: new Set() }
              byError[key].tests.add(tc.testName)
              byError[key].branches.add(run.branch)
              if (isFirst) byError[key].first += 1
              else byError[key].second += 1
            })
          })
        }
        addRun(first, true)
        addRun(second, false)

        const rows = Object.entries(byError)
          .map(([err, a]) => ({
            error: err,
            first: a.first,
            second: a.second,
            total: a.first + a.second,
            tests: a.tests.size,
            branches: Array.from(a.branches),
          }))
          .sort((x,y)=>y.total - x.total)
          .slice(0,5)
          .map(r => {
            let trend = '↔ Stable'
            if (r.first === 0 && r.second > 0) trend = '🆕 New'
            else if (r.second > r.first) trend = `↑ ${Math.round(((r.second - r.first) / Math.max(1,r.first)) * 100)}%`
            else if (r.second < r.first) trend = `↓ ${Math.round(((r.first - r.second) / Math.max(1,r.first)) * 100)}%`
            const impact = `${r.tests} tests, ${r.branches.length === 1 ? `${r.branches[0]} only` : r.branches.length > 1 ? 'multiple branches' : 'n/a'}`
            const lower = r.error.toLowerCase()
            const insight = lower.includes('timeout')
              ? 'Spike after recent changes, likely API delay'
              : lower.includes('element not found')
              ? 'Persistent post UI changes'
              : lower.includes('network')
              ? 'Appeared around config/network updates'
              : 'Recurring across runs'
            const action = lower.includes('timeout')
              ? 'Optimize API or increase timeout'
              : lower.includes('element not found')
              ? 'Update selectors & enable locator healing'
              : lower.includes('network')
              ? 'Verify backend/staging network'
              : 'Investigate logs & recent merges'
            return { ...r, trend, impact, insight, action }
          })

        return (
          <Card>
            <CardHeader>
              <CardTitle>AI Error Analysis</CardTitle>
              <CardDescription>How errors impacted the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-600">
                    <tr>
                      <th className="text-left py-2">Error Cluster</th>
                      <th className="text-left py-2">Trend</th>
                      <th className="text-left py-2">Impact</th>
                      <th className="text-left py-2">AI Insight</th>
                      <th className="text-left py-2">Suggested Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map(r => (
                      <tr key={r.error}>
                        <td className="py-2 pr-3 whitespace-nowrap text-gray-900">{r.error}</td>
                        <td className="py-2 pr-3">{r.trend}</td>
                        <td className="py-2 pr-3">{r.impact}</td>
                        <td className="py-2 pr-3 text-gray-700">{r.insight}</td>
                        <td className="py-2 pr-3 text-gray-700">{r.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      })()}


      <div className="space-y-4">
        

        <Card>
        <CardHeader>
          <CardTitle>Branches Heatmap</CardTitle>
          <CardDescription>Failures count per branch by day (last 7 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <div className="min-w-[700px]">
              <div className="grid" style={{ gridTemplateColumns: `140px repeat(${dayKeys.length}, minmax(80px,1fr))` }}>
                <div className="text-xs text-gray-500"></div>
                {dayKeys.map(d => (
                  <div key={d} className="text-[11px] text-gray-600 text-center pb-2">{d}</div>
                ))}
                {branches.map(br => (
                  <Fragment key={br}>
                    <div className="text-sm font-medium text-gray-700 pr-2 flex items-center">{br}</div>
                    {dayKeys.map(d => {
                      const v = branchDayToCount[`${br}|${d}`] ?? 0
                      const intensity = v / maxCount
                      const bg = `rgba(239,68,68, ${0.08 + intensity * 0.6})`
                      return (
                        <div key={`${br}-${d}`} className="h-8 rounded-sm border border-gray-100 flex items-center justify-center" style={{ background: bg }}>
                          <span className="text-[10px] text-gray-700">{v}</span>
                        </div>
                      )
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

function summarizeTop(runs: GeneratedRun[]) {
  const byTest: Record<string, number> = {}
  runs.forEach(r => r.testCases.forEach(tc => { byTest[tc.testName] = (byTest[tc.testName] ?? 0) + 1 }))
  const tests = Object.entries(byTest).map(([name, count]) => ({ name, count }))
  tests.sort((a,b)=>b.count-a.count)
  const topFailures = tests.slice(0, 6)

  // crude emerging/recovered signals using first/last half deltas
  const mid = Math.floor(runs.length/2)
  const first = runs.slice(0, mid)
  const second = runs.slice(mid)
  const countIn = (arr: GeneratedRun[], name: string) => arr.reduce((acc, r) => acc + r.testCases.filter(tc => tc.testName===name).length, 0)
  const deltas = topFailures.map(t => ({ name: t.name, delta: countIn(second, t.name) - countIn(first, t.name) }))
  const emerging = deltas.filter(d=>d.delta>0).slice(0,6)
  const recovered = deltas.filter(d=>d.delta<0).slice(0,6)
  return { topFailures, emerging, recovered }
}


