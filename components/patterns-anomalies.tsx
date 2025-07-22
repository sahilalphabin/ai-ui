"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Clock, Zap, Monitor, Search, ChevronDown, ChevronUp, Filter, Key } from "lucide-react"

interface TestPattern {
  type: "execution" | "performance" | "environment"
  severity: "critical" | "warning" | "info" | "medium" | "high" | "low"
  description: string
  recommendation: string
}

interface TestCase {
  id: string
  name: string
  duration: number
  spec: string
  status: "passed" | "failed" | "flaky"
  riskLevel: "high" | "medium" | "low"
  patterns: TestPattern[]
  severity?: "medium" | "high" | "low" //optional
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
  const [riskFilters, setRiskFilters] = useState<Set<string>>(new Set())
  const [patternFilters, setPatternFilters] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState("riskLevel")
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set())
  const [expandedErrorCluster, setExpandedErrorCluster] = useState<string | null>("Timeout error")
  const [fileNameFilter, setFileNameFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [timeoutFilter, setTimeoutFilter] = useState<string>("all")

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

  const toggleErrorCluster = (clusterName: string) => {
    setExpandedErrorCluster(expandedErrorCluster === clusterName ? null : clusterName)
  }

  const filteredAndSortedTests = useMemo(() => {
    const filtered = mockTestData.filter((test) => {
      // Search filter
      const matchesSearch = searchTerm === "" || test.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Risk filter - if no risks are selected, show all; otherwise show only selected risks
      const matchesRisk = riskFilters.size === 0 || riskFilters.has(test.riskLevel)
      
      // Pattern filter - if no patterns are selected, show all; otherwise show only tests with selected patterns
      const matchesPattern = patternFilters.size === 0 || test.patterns.some((p) => patternFilters.has(p.type))

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

  // Enhanced breakdown data for top cards
  const cardBreakdowns = {
    errorClusters: {
      total: 2,
      details: [
        { label: "Timeout errors", count: 1, color: "text-red-600" },
        { label: "Assertion errors", count: 1, color: "text-orange-600" }
      ]
    },
    failures: {
      total: 5,
      details: [
        { label: "Bugs", count: 3, color: "text-red-600" },
        { label: "UI Changes", count: 2, color: "text-blue-600" }
      ]
    },
    newFailures: {
      total: 3,
      details: [
        { label: "Regressions", count: 2, color: "text-red-600" },
        { label: "New Features", count: 1, color: "text-green-600" }
      ]
    }
  }

  const errorClusters = [
    { 
      name: "Timeout error", 
      count: 7, 
      icon: Clock,
      relatedTests: [
        { file: "sow.spec.js", testName: "duplicate SoW name", duration: "4.2m", category: "bug", link: "#test-sow-duplicate" },
        { file: "sow.spec.js", testName: "Pause Upload", duration: "4.2m", category: "bug", link: "#test-sow-upload" },
        { file: "task.spec.js", testName: "Move to Done", duration: "4.2m", category: "bug", link: "#test-task-done" },
        { file: "project.spec.js", testName: "Create new project", duration: "3.1m", category: "ui-change", link: "#test-project-create" },
        { file: "workstream.spec.js", testName: "Archive workstream", duration: "5.0m", category: "bug", link: "#test-workstream-archive" },
        { file: "upload.spec.js", testName: "File upload process", duration: "2.8m", category: "ui-change", link: "#test-upload-process" },
        { file: "auth.spec.js", testName: "User authentication", duration: "1.9m", category: "bug", link: "#test-auth" }
      ]
    },
    { 
      name: "Assertions error", 
      count: 2, 
      icon: Key,
      relatedTests: [
        { file: "validation.spec.js", testName: "Form validation", duration: "0.5s", category: "bug", link: "#test-validation" },
        { file: "api.spec.js", testName: "API response check", duration: "1.2s", category: "ui-change", link: "#test-api" }
      ]
    },
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
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Error Clusters</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{cardBreakdowns.errorClusters.total}</div>
            </div>
            <div className="space-y-2">
              {cardBreakdowns.errorClusters.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{detail.label}</span>
                  <span className={`font-semibold ${detail.color}`}>{detail.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Failures</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{cardBreakdowns.failures.total}</div>
            </div>
            <div className="space-y-2">
              {cardBreakdowns.failures.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{detail.label}</span>
                  <span className={`font-semibold ${detail.color}`}>{detail.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">New Failures</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{cardBreakdowns.newFailures.total}</div>
            </div>
            <div className="space-y-2">
              {cardBreakdowns.newFailures.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{detail.label}</span>
                  <span className={`font-semibold ${detail.color}`}>{detail.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Error Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error Type Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
                {errorClusters.map((cluster) => (
              <button
                key={cluster.name}
                onClick={() => toggleErrorCluster(cluster.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  expandedErrorCluster === cluster.name
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <cluster.icon className="h-3 w-3" />
                  <span>{cluster.name}</span>
                  <Badge variant="secondary" className="text-xs h-4 px-1.5">
                    {cluster.count}
                  </Badge>
                </div>
              </button>
            ))}
                    </div>

          {/* Test Cases Table */}
          {expandedErrorCluster && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">
                  {expandedErrorCluster} - {errorClusters.find(c => c.name === expandedErrorCluster)?.count} test cases
                </h4>
                <div className="text-sm text-gray-500">
                  Grouped by file name
                  </div>
              </div>

              {/* Enhanced Filters */}
              <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
                {/* File Name Filter */}
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filter by file name..."
                    value={fileNameFilter}
                    onChange={(e) => setFileNameFilter(e.target.value)}
                    className="h-8 w-48 text-xs"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-600">Category:</span>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="ui-change">UI Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-600">Duration:</span>
                  <Select value={timeoutFilter} onValueChange={setTimeoutFilter}>
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="short">Short (&lt; 1s)</SelectItem>
                      <SelectItem value="medium">Medium (1-5s)</SelectItem>
                      <SelectItem value="long">Long (&gt; 5s)</SelectItem>
                    </SelectContent>
                  </Select>
            </div>

                {/* Clear Filters */}
                {(fileNameFilter !== "" || categoryFilter !== "all" || timeoutFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFileNameFilter("")
                      setCategoryFilter("all")
                      setTimeoutFilter("all")
                    }}
                    className="h-8 text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
                  </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Test Case</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">File</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {errorClusters
                      .find(cluster => cluster.name === expandedErrorCluster)
                      ?.relatedTests
                      .filter(test => {
                        // File name filter
                        const matchesFileName = fileNameFilter === "" || 
                          test.file.toLowerCase().includes(fileNameFilter.toLowerCase())
                        
                        // Category filter
                        const matchesCategory = categoryFilter === "all" || 
                          test.category === categoryFilter
                        
                        // Duration filter
                        const matchesDuration = (() => {
                          if (timeoutFilter === "all") return true
                          
                          const durationValue = parseFloat(test.duration.replace(/[^0-9.]/g, ''))
                          const durationUnit = test.duration.includes('m') ? 'minutes' : 'seconds'
                          const durationInSeconds = durationUnit === 'minutes' ? durationValue * 60 : durationValue
                          
                          switch (timeoutFilter) {
                            case "short": return durationInSeconds < 1
                            case "medium": return durationInSeconds >= 1 && durationInSeconds <= 5
                            case "long": return durationInSeconds > 5
                            default: return true
                          }
                        })()
                        
                        return matchesFileName && matchesCategory && matchesDuration
                      })
                      .sort((a, b) => a.file.localeCompare(b.file)) // Sort by file name
                      .map((test, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">
                              {test.testName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-sm text-gray-900 font-mono">
                              {test.file}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-xs ${
                              test.category === 'bug' ? 'border-red-300 text-red-700 bg-red-50' :
                              test.category === 'ui-change' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                              'border-gray-300 text-gray-700 bg-gray-50'
                            }`}>
                              {test.category === 'bug' ? 'Bug' : 
                               test.category === 'ui-change' ? 'UI Change' : 
                               test.category}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500 font-mono">
                              {test.duration}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
          {/* Enhanced Summary */}
          <div className="flex items-center space-x-6 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Total: {summaryStats.total}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-600">High: {summaryStats.highRisk}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-600">Medium: {summaryStats.mediumRisk}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600">Low: {summaryStats.lowRisk}</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-gray-500" />
              <span>Execution: {summaryStats.timeoutCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3 text-gray-500" />
              <span>Performance: {summaryStats.performanceCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Monitor className="h-3 w-3 text-gray-500" />
              <span>Environment: {summaryStats.environmentCount}</span>
            </div>
          </div>

          {/* Enhanced Filters and Search */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Risk Level Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Risk: {riskFilters.size === 0 ? "All" : `${riskFilters.size} selected`}
              </span>
              {["high", "medium", "low"].map((risk) => (
                <Button
                  key={risk}
                  variant={riskFilters.has(risk) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRiskFilter(risk)}
                  className={`h-8 px-3 text-xs ${
                    risk === "high" ? "border-red-300 hover:bg-red-50" : 
                    risk === "medium" ? "border-yellow-300 hover:bg-yellow-50" : 
                    "border-green-300 hover:bg-green-50"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      risk === "high" ? "bg-red-500" : 
                      risk === "medium" ? "bg-yellow-500" : 
                      "bg-green-500"
                    }`} />
                    <span className="capitalize">{risk}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Pattern Type Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">
                Patterns: {patternFilters.size === 0 ? "All" : `${patternFilters.size} selected`}
              </span>
              {["execution", "performance", "environment"].map((pattern) => (
                <Button
                  key={pattern}
                  variant={patternFilters.has(pattern) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePatternFilter(pattern)}
                  className="h-8 px-3 text-xs"
                >
                  <div className="flex items-center space-x-1">
                    {pattern === "execution" ? (
                      <Clock className="h-3 w-3" />
                    ) : pattern === "performance" ? (
                      <Zap className="h-3 w-3" />
                    ) : (
                      <Monitor className="h-3 w-3" />
                    )}
                    <span className="capitalize">{pattern}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search test cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-8 text-sm"
                />
              </div>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="riskLevel">Risk Level</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchTerm !== "" || riskFilters.size > 0 || patternFilters.size > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setRiskFilters(new Set())
                  setPatternFilters(new Set())
                }}
                className="h-8 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Test Cases Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Test Case</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">File</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Risk</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Patterns</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {filteredAndSortedTests.map((test) => (
                  <React.Fragment key={test.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700 font-medium">
                          {test.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-gray-900 font-mono">
                          {test.spec}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 font-mono">
                          {test.duration}s
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(test.status)}</span>
                          <span className="text-xs text-gray-600 capitalize">
                            {test.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${getRiskColor(test.riskLevel)}`}>
                          {test.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {test.patterns.map((pattern, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs h-5 px-1">
                              {getPatternIcon(pattern.type)}
                              <span className="ml-1">{pattern.type}</span>
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                  {expandedTests.has(test.id) && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-gray-50">
                          <div className="space-y-3">
                            {/* Environment Info */}
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <span><strong>Environment:</strong> {test.environment.os} - {test.environment.browser} {test.environment.version}</span>
                              <span><strong>Last Run:</strong> {new Date(test.lastRun).toLocaleDateString()}</span>
                      </div>

                            {/* Pattern Details */}
                            <div className="space-y-3">
                      {test.patterns.map((pattern, idx) => (
                                <div key={idx} className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center space-x-2 mb-1">
                            {getPatternIcon(pattern.type)}
                                    <span className="font-medium text-sm capitalize">{pattern.type} Issue</span>
                            <Badge variant="outline" className="text-xs h-4">
                              {pattern.severity}
                            </Badge>
                          </div>
                                  <p className="text-sm text-gray-600 mb-1">{pattern.description}</p>
                                  <p className="text-sm text-blue-600">
                            <strong>Recommendation:</strong> {pattern.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                          </div>
                        </td>
                      </tr>
                  )}
                  </React.Fragment>
              ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
