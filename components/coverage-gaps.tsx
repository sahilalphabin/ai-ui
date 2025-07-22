"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, CheckCircle, Clock, XCircle, MinusCircle } from "lucide-react"

export function CoverageGaps() {
  const coverageStats = [
    { label: "Total Tests", value: 102, color: "bg-blue-500" },
    { label: "Passing", value: 71, color: "bg-green-500" },
    { label: "Failing", value: 15, color: "bg-red-500" },
    { label: "Skipped", value: 16, color: "bg-gray-400" },
  ]

  const moduleData = [
    {
      module: "Authentication",
      functional: { total: 8, passing: 8, failing: 0, skipped: 0 },
      edgeCases: { total: 5, passing: 4, failing: 1, skipped: 0 },
      integration: { total: 3, passing: 2, failing: 0, skipped: 1 },
      endToEnd: { total: 4, passing: 4, failing: 0, skipped: 0 },
      totalTests: "20/20",
      status: "Complete",
      statusColor: "bg-green-500",
      critical: false,
      lastRun: "2024-01-15",
      failureRate: "5%",
      trend: "stable"
    },
    {
      module: "Task Management",
      functional: { total: 15, passing: 12, failing: 2, skipped: 1 },
      edgeCases: { total: 12, passing: 8, failing: 3, skipped: 1 },
      integration: { total: 8, passing: 5, failing: 2, skipped: 1 },
      endToEnd: { total: 12, passing: 7, failing: 4, skipped: 1 },
      totalTests: "47/47",
      status: "Needs Attention",
      statusColor: "bg-red-500",
      critical: true,
      lastRun: "2024-01-14",
      failureRate: "23%",
      trend: "increasing"
    },
    {
      module: "Scope of Work",
      functional: { total: 10, passing: 8, failing: 1, skipped: 1 },
      edgeCases: { total: 8, passing: 5, failing: 2, skipped: 1 },
      integration: { total: 6, passing: 4, failing: 1, skipped: 1 },
      endToEnd: { total: 7, passing: 4, failing: 2, skipped: 1 },
      totalTests: "31/31",
      status: "In Progress",
      statusColor: "bg-orange-500",
      critical: true,
      lastRun: "2024-01-13",
      failureRate: "19%",
      trend: "stable"
    },
    {
      module: "Project Management",
      functional: { total: 6, passing: 5, failing: 0, skipped: 1 },
      edgeCases: { total: 4, passing: 3, failing: 0, skipped: 1 },
      integration: { total: 3, passing: 2, failing: 0, skipped: 1 },
      endToEnd: { total: 3, passing: 2, failing: 0, skipped: 1 },
      totalTests: "16/16",
      status: "In Progress",
      statusColor: "bg-orange-500",
      critical: false,
      lastRun: "2024-01-12",
      failureRate: "6%",
      trend: "decreasing"
    },
    {
      module: "Product Management",
      functional: { total: 7, passing: 7, failing: 0, skipped: 0 },
      edgeCases: { total: 5, passing: 4, failing: 0, skipped: 1 },
      integration: { total: 4, passing: 3, failing: 0, skipped: 1 },
      endToEnd: { total: 3, passing: 2, failing: 0, skipped: 1 },
      totalTests: "19/19",
      status: "Complete",
      statusColor: "bg-green-500",
      critical: false,
      lastRun: "2024-01-15",
      failureRate: "5%",
      trend: "stable"
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "Needs Attention":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <MinusCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "↗️ Increasing"
      case "decreasing":
        return "↘️ Decreasing"
      case "stable":
        return "→ Stable"
      default:
        return "→ Stable"
    }
  }

  const getTestCategoryColor = (category: any) => {
    const passRate = (category.passing / category.total) * 100
    if (passRate >= 90) return "text-green-600"
    if (passRate >= 70) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Coverage & Gap Analysis</h2>
          <p className="text-gray-600">Automated test report analysis for quality assurance insights</p>
        </div>
        <div className="text-sm text-gray-500">Last Updated: 7/18/2025</div>
      </div>

      {/* Coverage Stats */}
      <div className="grid grid-cols-6 gap-6">
        {coverageStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-3">{stat.label}</div>
                <div className={`h-1 w-full ${stat.color} rounded`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Branch Failure Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-red-600">14.7%</div>
              <div className="text-sm text-gray-600 mb-3">Branch Failure Rate</div>
              <div className="h-1 w-full bg-red-500 rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Trend */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-orange-600">↗️</div>
              <div className="text-sm text-gray-600 mb-3">Branch Trend</div>
              <div className="h-1 w-full bg-orange-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Coverage Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Module Coverage Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium">Module</th>
                  <th className="text-left py-3 px-4 font-medium">Functional</th>
                  <th className="text-left py-3 px-4 font-medium">Edge Cases</th>
                  <th className="text-left py-3 px-4 font-medium">End-to-End</th>
                  <th className="text-left py-3 px-4 font-medium">Total Tests</th>
                  <th className="text-left py-3 px-4 font-medium">Last Run</th>
                  <th className="text-left py-3 px-4 font-medium">Failure Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Trend</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {moduleData.map((module) => (
                  <tr key={module.module} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {module.critical && <div className="w-2 h-2 bg-red-500 rounded-full" title="Critical issues requiring immediate attention"></div>}
                        <span className="font-medium">{module.module}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{module.functional.total} tests</span>
                          <span className="text-xs text-gray-500">{module.functional.passing}/{module.functional.total}</span>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" title="Green: Passing, Red: Failing, Gray: Skipped">
                          <div className="flex h-full">
                            <div className="bg-green-500" style={{ width: `${(module.functional.passing / module.functional.total) * 100}%` }}></div>
                            <div className="bg-red-500" style={{ width: `${(module.functional.failing / module.functional.total) * 100}%` }}></div>
                            <div className="bg-gray-400" style={{ width: `${(module.functional.skipped / module.functional.total) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{module.edgeCases.total} tests</span>
                          <span className="text-xs text-gray-500">{module.edgeCases.passing}/{module.edgeCases.total}</span>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" title="Green: Passing, Red: Failing, Gray: Skipped">
                          <div className="flex h-full">
                            <div className="bg-green-500" style={{ width: `${(module.edgeCases.passing / module.edgeCases.total) * 100}%` }}></div>
                            <div className="bg-red-500" style={{ width: `${(module.edgeCases.failing / module.edgeCases.total) * 100}%` }}></div>
                            <div className="bg-gray-400" style={{ width: `${(module.edgeCases.skipped / module.edgeCases.total) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{module.endToEnd.total} tests</span>
                          <span className="text-xs text-gray-500">{module.endToEnd.passing}/{module.endToEnd.total}</span>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" title="Green: Passing, Red: Failing, Gray: Skipped">
                          <div className="flex h-full">
                            <div className="bg-green-500" style={{ width: `${(module.endToEnd.passing / module.endToEnd.total) * 100}%` }}></div>
                            <div className="bg-red-500" style={{ width: `${(module.endToEnd.failing / module.endToEnd.total) * 100}%` }}></div>
                            <div className="bg-gray-400" style={{ width: `${(module.endToEnd.skipped / module.endToEnd.total) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{module.totalTests}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden" title="Green: Passing, Red: Failing, Gray: Skipped">
                          <div className="flex h-full">
                            <div className="bg-green-500" style={{ width: `${(module.functional.passing + module.edgeCases.passing + module.endToEnd.passing) / (module.functional.total + module.edgeCases.total + module.endToEnd.total) * 100}%` }}></div>
                            <div className="bg-red-500" style={{ width: `${(module.functional.failing + module.edgeCases.failing + module.endToEnd.failing) / (module.functional.total + module.edgeCases.total + module.endToEnd.total) * 100}%` }}></div>
                            <div className="bg-gray-400" style={{ width: `${(module.functional.skipped + module.edgeCases.skipped + module.endToEnd.skipped) / (module.functional.total + module.edgeCases.total + module.endToEnd.total) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{new Date(module.lastRun).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${
                        parseFloat(module.failureRate) > 20 ? 'text-red-600' :
                        parseFloat(module.failureRate) > 10 ? 'text-orange-600' : 'text-green-600'
                      }`} title="Percentage of tests that failed in the last run">
                        {module.failureRate}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-gray-500" title="Test failure trend over time">
                        {getTrendText(module.trend)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(module.status)}
                        <Badge className={`text-white ${module.statusColor}`} title={`Module status: ${module.status}`}>{module.status}</Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
