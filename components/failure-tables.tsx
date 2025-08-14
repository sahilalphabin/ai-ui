"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface FailureTablesProps {
  testData: any[]
}

export function FailureTables({ testData }: FailureTablesProps) {
  // Calculate persistent failures (most failing tests in last 7 days)
  const last7Days = testData.slice(-7)
  const testCaseFailures = last7Days.reduce((acc: { [key: string]: number }, run) => {
    run.testCases.forEach((tc: any) => {
      acc[tc.testName] = (acc[tc.testName] || 0) + 1
    })
    return acc
  }, {})

  const persistentFailures = Object.entries(testCaseFailures)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ testName: name, count }))

  // Calculate emerging failures (tests with increasing failures in recent days)
  const firstHalf = last7Days.slice(0, Math.floor(last7Days.length / 2))
  const secondHalf = last7Days.slice(Math.floor(last7Days.length / 2))

  const getFailuresInWindow = (window: any[]) => {
    return window.reduce((acc: { [key: string]: number }, run) => {
      run.testCases.forEach((tc: any) => {
        acc[tc.testName] = (acc[tc.testName] || 0) + 1
      })
      return acc
    }, {})
  }

  const firstHalfFailures = getFailuresInWindow(firstHalf)
  const secondHalfFailures = getFailuresInWindow(secondHalf)

  const emergingFailures = Object.keys(testCaseFailures)
    .map(testName => {
      const firstCount = firstHalfFailures[testName] || 0
      const secondCount = secondHalfFailures[testName] || 0
      const delta = secondCount - firstCount
      return { testName, delta, recentCount: secondCount }
    })
    .filter(item => item.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 6)

  const getSeverityColor = (count: number) => {
    if (count >= 5) return 'bg-red-100 text-red-800'
    if (count >= 3) return 'bg-orange-100 text-orange-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getTrendColor = (delta: number) => {
    if (delta >= 3) return 'bg-red-100 text-red-800'
    if (delta >= 2) return 'bg-orange-100 text-orange-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6">
      {/* Persistent Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Persistent Failures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {persistentFailures.map((failure, index) => (
              <div key={failure.testName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  <div>
                    <div className="font-medium text-gray-900">{failure.testName}</div>
                    <div className="text-sm text-gray-500">Most frequent failure</div>
                  </div>
                </div>
                <Badge className={getSeverityColor(failure.count)}>
                  {failure.count} failures
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Emerging Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Recent Emerging Failures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergingFailures.map((failure, index) => (
              <div key={failure.testName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  <div>
                    <div className="font-medium text-gray-900">{failure.testName}</div>
                    <div className="text-sm text-gray-500">Increasing trend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTrendColor(failure.delta)}>
                    +{failure.delta} ↑
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    {failure.recentCount} recent
                  </Badge>
                </div>
              </div>
            ))}
            {emergingFailures.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No emerging failures detected</p>
                <p className="text-sm">All test cases are stable or improving</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
