"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle } from "lucide-react"

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
      functional: 95,
      edgeCases: 60,
      integration: 30,
      endToEnd: 70,
      tests: "2 / 2",
      status: "Complete",
      statusColor: "bg-green-500",
      critical: false,
    },
    {
      module: "Task Management",
      functional: 85,
      edgeCases: 65,
      integration: 45,
      endToEnd: 25,
      tests: "38 / 47",
      status: "In Progress",
      statusColor: "bg-orange-500",
      critical: true,
    },
    {
      module: "Scope of Work",
      functional: 75,
      edgeCases: 40,
      integration: 55,
      endToEnd: 35,
      tests: "16 / 21",
      status: "In Progress",
      statusColor: "bg-orange-500",
      critical: true,
    },
    {
      module: "Project Management",
      functional: 80,
      edgeCases: 50,
      integration: 40,
      endToEnd: 30,
      tests: "2 / 5",
      status: "In Progress",
      statusColor: "bg-orange-500",
      critical: false,
    },
    {
      module: "Product Management",
      functional: 90,
      edgeCases: 55,
      integration: 35,
      endToEnd: 25,
      tests: "3 / 3",
      status: "Complete",
      statusColor: "bg-green-500",
      critical: false,
    },
  ]

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
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
      <div className="grid grid-cols-4 gap-6">
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
                  <th className="text-left py-3 px-4 font-medium">Integration</th>
                  <th className="text-left py-3 px-4 font-medium">End-to-End</th>
                  <th className="text-left py-3 px-4 font-medium">Tests</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {moduleData.map((module) => (
                  <tr key={module.module} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {module.critical && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                        <span className="font-medium">{module.module}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{module.functional}%</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(module.functional)}`}
                            style={{ width: `${module.functional}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{module.edgeCases}%</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(module.edgeCases)}`}
                            style={{ width: `${module.edgeCases}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{module.integration}%</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(module.integration)}`}
                            style={{ width: `${module.integration}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{module.endToEnd}%</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(module.endToEnd)}`}
                            style={{ width: `${module.endToEnd}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{module.tests}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`text-white ${module.statusColor}`}>{module.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Gaps */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Critical Coverage Gaps</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">File Upload Operations</h4>
                <Badge variant="destructive">High Impact</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Multiple file upload tests failing or skipped</p>
              <div className="text-xs text-gray-500 mb-2">
                <strong>Affected Tests:</strong> sow.spec.js, task.spec.js
              </div>
              <p className="text-xs text-gray-600">
                <strong>Recommendation:</strong> Implement retry mechanism and better error handling
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Task State Transitions</h4>
                <Badge variant="destructive">High Impact</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Edge cases in task movement between states not fully covered</p>
              <div className="text-xs text-gray-500 mb-2">
                <strong>Affected Tests:</strong> task.spec.js
              </div>
              <p className="text-xs text-gray-600">
                <strong>Recommendation:</strong> Add more test cases for complex state transitions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Moderate Coverage Gaps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Project Operations</h4>
                <Badge className="bg-orange-500 text-white">Medium Impact</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Several project management tests skipped</p>
              <div className="text-xs text-gray-500 mb-2">
                <strong>Affected Tests:</strong> project.spec.js
              </div>
              <p className="text-xs text-gray-600">
                <strong>Recommendation:</strong> Complete implementation of skipped tests
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
