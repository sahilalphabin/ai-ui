"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Clock, Zap, Monitor, Search, ChevronDown, ChevronUp, Filter, Key } from "lucide-react"

interface TestPattern {
  type: "execution" | "performance" | "environment"
  severity: "critical" | "warning" | "info"
  description: string
  recommendation: string
}

interface TestCase {
  id: string
  name: string
  duration: number
  status: "passed" | "failed" | "flaky"
  riskLevel: "high" | "medium" | "low"
  patterns: TestPattern[]
  environment: {
    os: string
    browser: string
    version: string
  }
  lastRun: string
}

const mockTestData: TestCase[] = [
  {
    id: "test_001",
    name: "Verify that user can't create an SoW with duplicate name",
    spec: "sow.spec.js",
    duration: 252.0,
    status: "failed",
    riskLevel: "high",
    patterns: [
      {
        type: "execution",
        severity: "critical",
        description: "Consistent failure across all 4 runs with timeout error",
        recommendation: "Critical bug - investigate database query performance and duplicate validation logic",
      },
      {
        type: "performance",
        severity: "critical",
        description: "Extreme performance degradation - 252s vs normal 12s execution",
        recommendation: "Database query optimization required, add proper indexing",
      },
    ],
    environment: { os: "Windows", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T10:30:00Z",
  },
  {
    id: "test_002",
    name: "Verify that user is able to cancel the upload before starting",
    spec: "sow.spec.js",
    duration: 252.0,
    status: "failed",
    riskLevel: "high",
    patterns: [
      {
        type: "execution",
        severity: "critical",
        description: "Intermittent failure - flaky test with 75% failure rate",
        recommendation: "Flaky test - add proper wait conditions and stabilize UI interactions",
      },
      {
        type: "performance",
        severity: "high",
        description: "Inconsistent timing - varies between 24s (pass) and 252s (timeout)",
        recommendation: "Performance instability indicates race conditions",
      },
    ],
    environment: { os: "macOS", browser: "Safari", version: "17.1" },
    lastRun: "2024-01-15T09:45:00Z",
  },
  {
    id: "test_003",
    name: "Verify user can archive a task for Workstream 4",
    spec: "task.spec.js",
    duration: 49.0,
    status: "failed",
    riskLevel: "high",
    patterns: [
      {
        type: "execution",
        severity: "high",
        description: "New failure - regression detected, previously stable test now failing",
        recommendation: "Recent code change introduced bug - investigate Workstream 4 archiving logic",
      },
      {
        type: "performance",
        severity: "medium",
        description: "Performance degradation - increased from 22s to 49s",
        recommendation: "Monitor performance trend - 2x slower execution time",
      },
    ],
    environment: { os: "Linux", browser: "Firefox", version: "121.0" },
    lastRun: "2024-01-15T11:20:00Z",
  },
  {
    id: "test_004",
    name: "Verify relevant results display for Scope of Work by searching",
    spec: "sow.spec.js",
    duration: 12.4,
    status: "passed",
    riskLevel: "medium",
    patterns: [
      {
        type: "performance",
        severity: "low",
        description: "Stable performance - consistent 12-13s execution time",
        recommendation: "Performance is stable within acceptable range",
      },
    ],
    environment: { os: "Windows", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T10:00:00Z",
  },
  {
    id: "test_005",
    name: "Verify user can create a new Project",
    spec: "project.spec.js",
    duration: 0,
    status: "failed",
    riskLevel: "high",
    patterns: [
      {
        type: "environment",
        severity: "high",
        description: "Windows-specific issue - test runs fine on macOS/Linux but skips on Windows",
        recommendation: "Environment compatibility problem - check Windows-specific dependencies",
      },
    ],
    environment: { os: "Windows", browser: "Edge", version: "119.0" },
    lastRun: "2024-01-15T09:30:00Z",
  },
  {
    id: "test_006",
    name: "Verify that user can able to login with valid credentials",
    spec: "login.spec.js",
    duration: 8.8,
    status: "passed",
    riskLevel: "low",
    patterns: [],
    environment: { os: "Windows", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T10:15:00Z",
  },
  {
    id: "test_007",
    name: "Verify that after giving due date task is going to first milestone",
    spec: "task.spec.js",
    duration: 51.9,
    status: "passed",
    riskLevel: "medium",
    patterns: [
      {
        type: "performance",
        severity: "medium",
        description: "High timing variance - execution time varies by ±30s across runs",
        recommendation: "Performance inconsistency indicates timing dependencies or resource contention",
      },
    ],
    environment: { os: "macOS", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T10:30:00Z",
  },
  {
    id: "test_008",
    name: "Verify that user can upload a file from Tasks module for Attachment",
    spec: "task.spec.js",
    duration: 29.6,
    status: "passed",
    riskLevel: "medium",
    patterns: [
      {
        type: "environment",
        severity: "medium",
        description: "Browser-specific behavior - passes on Chrome/Firefox but fails on Safari",
        recommendation: "Cross-browser compatibility issue - test Safari-specific file upload implementation",
      },
    ],
    environment: { os: "macOS", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T10:45:00Z",
  },
  {
    id: "test_009",
    name: "Verify Scope of Work Creation with Assigned Due Dates in Production Workstream 4",
    spec: "sow.spec.js",
    duration: 50.3,
    status: "passed",
    riskLevel: "medium",
    patterns: [
      {
        type: "performance",
        severity: "medium",
        description: "Slow execution - consistently takes 50+ seconds",
        recommendation: "Performance optimization needed - test is significantly slower than similar tests",
      },
    ],
    environment: { os: "Linux", browser: "Firefox", version: "121.0" },
    lastRun: "2024-01-15T11:20:00Z",
  },
  {
    id: "test_010",
    name: "Verify that the user can move a Production Workstream 5 ticket from New to Done lane",
    spec: "task.spec.js",
    duration: 648.0,
    status: "failed",
    riskLevel: "high",
    patterns: [
      {
        type: "execution",
        severity: "critical",
        description: "Consistent failure with same timeout error - UI element not found",
        recommendation: "UI bug - element selector issue or page load problem in Production Workstream 5",
      },
      {
        type: "performance",
        severity: "critical",
        description: "Extreme slow execution - 10+ minute timeout indicating complete hang",
        recommendation: "Critical performance issue - test completely hanging, needs immediate attention",
      },
    ],
    environment: { os: "Windows", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T11:00:00Z",
  },
  {
    id: "test_011",
    name: "Verify that a design workstream task is created using the API",
    spec: "task.spec.js",
    duration: 19.0,
    status: "passed",
    riskLevel: "low",
    patterns: [],
    environment: { os: "Linux", browser: "Chrome", version: "120.0" },
    lastRun: "2024-01-15T11:00:00Z",
  },
]

export function PatternsAnomalies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilters, setRiskFilters] = useState<Set<string>>(new Set(["high", "medium", "low"]))
  const [patternFilters, setPatternFilters] = useState<Set<string>>(new Set(["Execution", "performance", "environment"]))
  const [sortBy, setSortBy] = useState("riskLevel")
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set())

  const toggleRiskFilter = (risk: string) => {
    const newFilters = new Set(riskFilters)
    if (newFilters.has(risk)) {
      newFilters.delete(risk)
    } else {
      newFilters.add(risk)
    }
    setRiskFilters(newFilters)
  }

  const togglePatternFilter = (pattern: string) => {
    const newFilters = new Set(patternFilters)
    if (newFilters.has(pattern)) {
      newFilters.delete(pattern)
    } else {
      newFilters.add(pattern)
    }
    setPatternFilters(newFilters)
  }

  const toggleTestExpansion = (testId: string) => {
    const newExpanded = new Set(expandedTests)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedTests(newExpanded)
  }

  const filteredAndSortedTests = useMemo(() => {
    const filtered = mockTestData.filter((test) => {
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRisk = riskFilters.has(test.riskLevel)
      const matchesPattern = test.patterns.length === 0 || test.patterns.some((p) => patternFilters.has(p.type))

      return matchesSearch && matchesRisk && matchesPattern
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "riskLevel":
          const riskOrder = { high: 3, medium: 2, low: 1 }
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
        case "duration":
          return b.duration - a.duration
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [searchTerm, riskFilters, patternFilters, sortBy])

  const summaryStats = useMemo(() => {
    const total = mockTestData.length
    const highRisk = mockTestData.filter((t) => t.riskLevel === "high").length
    const mediumRisk = mockTestData.filter((t) => t.riskLevel === "medium").length
    const lowRisk = mockTestData.filter((t) => t.riskLevel === "low").length
    const failures = mockTestData.filter((t) => t.status === "failed").length
    const newFailures = 3 // Mock data for new failures
    const errorClusters = 2 // Mock data for error clusters

    const timeoutCount = mockTestData.filter((t) => t.patterns.some((p) => p.type === "execution")).length
    const performanceCount = mockTestData.filter((t) => t.patterns.some((p) => p.type === "performance")).length
    const environmentCount = mockTestData.filter((t) => t.patterns.some((p) => p.type === "environment")).length

    return {
      total,
      highRisk,
      mediumRisk,
      lowRisk,
      failures,
      newFailures,
      errorClusters,
      timeoutCount,
      performanceCount,
      environmentCount,
    }
  }, [])

  const errorClusters = [
    { name: "Timeout error ", count: 7, icon: Clock },
    { name: "Asseertions error", count: 2, icon: Key },
  ]

  const relatedTestcases = [
    { file: "sow.spec.js", description: "duplicate SoW name", timeout: "4.2m timeout" },
    { file: "sow.spec.js", description: "Pause Upload", timeout: "4.2m timeout" },
    { file: "task.spec.js", description: "Move to Done", timeout: "4.2m timeout" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPatternIcon = (type: string) => {
    switch (type) {
      case "timeout":
        return <Clock className="h-3 w-3" />
      case "performance":
        return <Zap className="h-3 w-3" />
      case "environment":
        return <Monitor className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return "🟢"
      case "failed":
        return "🔴"
      case "flaky":
        return "🟡"
      default:
        return "⚪"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{summaryStats.errorClusters}</div>
              <div className="text-sm text-gray-600">Error Clusters</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{summaryStats.failures}</div>
              <div className="text-sm text-gray-600">Failures</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{summaryStats.newFailures}</div>
              <div className="text-sm text-gray-600">New Failures</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Error Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4">Error Clusters</h4>
              <div className="space-y-3">
                {errorClusters.map((cluster) => (
                  <div key={cluster.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <cluster.icon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{cluster.name}</span>
                    </div>
                    <Badge variant="secondary">{cluster.count} cases</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Related Testcases</h4>
              <div className="space-y-2">
                {relatedTestcases.map((testcase, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-red-500">→ {testcase.file}</span>
                    <span className="text-gray-500">{testcase.description}</span>
                    <span className="text-gray-400">{testcase.timeout}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Case Patterns & Anomalies */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Test Case Patterns & Anomalies</CardTitle>
            <span className="text-sm text-gray-500">{filteredAndSortedTests.length} cases with patterns</span>
          </div>
          <p className="text-sm text-gray-600">Failed or problematic test cases with identified patterns</p>
        </CardHeader>
        <CardContent>
          {/* Compact Summary */}
          <div className="flex items-center space-x-6 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            <span>📊 Total: {summaryStats.total}</span>
            <span className="text-red-600">🔴 High: {summaryStats.highRisk}</span>
            <span className="text-yellow-600">🟡 Medium: {summaryStats.mediumRisk}</span>
            <span className="text-green-600">🟢 Low: {summaryStats.lowRisk}</span>
            <span className="text-gray-500">|</span>
            <span>⏱️ Execution: {summaryStats.timeoutCount}</span>
            <span>🏃 Performance: {summaryStats.performanceCount}</span>
            <span>💻 Environment: {summaryStats.environmentCount}</span>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Risk Level Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Risk:</span>
              {["high", "medium", "low"].map((risk) => (
                <Button
                  key={risk}
                  variant={riskFilters.has(risk) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRiskFilter(risk)}
                  className={`h-7 px-2 text-xs ${
                    risk === "high" ? "border-red-300" : risk === "medium" ? "border-yellow-300" : "border-green-300"
                  }`}
                >
                  {risk === "high" ? "🔴" : risk === "medium" ? "🟡" : "🟢"} {risk}
                </Button>
              ))}
            </div>

            {/* Pattern Type Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Patterns:</span>
              {["execution", "performance", "environment"].map((pattern) => (
                <Button
                  key={pattern}
                  variant={patternFilters.has(pattern) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePatternFilter(pattern)}
                  className="h-7 px-2 text-xs"
                >
                  {pattern === "execution" ? "⏱️" : pattern === "performance" ? "🏃" : "💻"} {pattern}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-7 text-xs"
                />
              </div>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="riskLevel">Risk Level</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Test List */}
          <div className="space-y-2">
            <div className="border rounded-lg divide-y divide-gray-100 max-h-200 overflow-y-auto">
              {filteredAndSortedTests.map((test) => (
                <div key={test.id} className="p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-lg">{getStatusIcon(test.status)}</span>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{test.name}</span>
                          <span className="text-xs text-gray-500 font-mono">({test.duration}s)</span>
                        </div>

                        <div className="flex items-center space-x-2 mt-1">
                          {test.patterns.map((pattern, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs h-5 px-1">
                              {getPatternIcon(pattern.type)}
                              <span className="ml-1">{pattern.type}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getRiskColor(test.riskLevel)}`}>{test.riskLevel} Risk</Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTestExpansion(test.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedTests.has(test.id) ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedTests.has(test.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <div className="text-xs text-gray-600">
                        <strong>Environment:</strong> {test.environment.os} - {test.environment.browser}{" "}
                        {test.environment.version}
                      </div>

                      {test.patterns.map((pattern, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded text-xs">
                          <div className="flex items-center space-x-2 mb-1">
                            {getPatternIcon(pattern.type)}
                            <span className="font-medium capitalize">{pattern.type} Issue</span>
                            <Badge variant="outline" className="text-xs h-4">
                              {pattern.severity}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">{pattern.description}</p>
                          <p className="text-blue-600">
                            <strong>Recommendation:</strong> {pattern.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
