"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"

interface PersistentFailureItem {
  title: string
  totalFailures: number
}

interface EmergingFailureItem {
  title: string
  totalFailures?: number
  delta?: number
}

interface PersistentEmergingTablesProps {
  persistentFailures: PersistentFailureItem[]
  emergingFailures: EmergingFailureItem[]
}

function getSeverityColor(count: number) {
  if (count >= 10) return 'bg-red-100 text-red-800'
  if (count >= 5) return 'bg-orange-100 text-orange-800'
  return 'bg-yellow-100 text-yellow-800'
}

function getTrendColor(delta: number) {
  if (delta >= 3) return 'bg-red-100 text-red-800'
  if (delta >= 2) return 'bg-orange-100 text-orange-800'
  return 'bg-yellow-100 text-yellow-800'
}

export function PersistentEmergingTables({ persistentFailures, emergingFailures }: PersistentEmergingTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div key={failure.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  <div>
                    <div className="font-medium text-gray-900">{failure.title}</div>
                    {/* <div className="text-sm text-gray-500">Most frequent failure</div> */}
                  </div>
                </div>
                <Badge className={getSeverityColor(failure.totalFailures)}>
                  {failure.totalFailures} failures
                </Badge>
              </div>
            ))}
            {persistentFailures.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No persistent failures</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
              <div key={failure.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  <div>
                    <div className="font-medium text-gray-900">{failure.title}</div>
                    <div className="text-sm text-gray-500">Increasing trend</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {typeof failure.delta === 'number' && (
                    <Badge className={getTrendColor(failure.delta)}>
                      +{failure.delta} ↑
                    </Badge>
                  )}
                  {typeof failure.totalFailures === 'number' && (
                    <Badge variant="outline" className="text-gray-600">
                      {failure.totalFailures} recent
                    </Badge>
                  )}
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


