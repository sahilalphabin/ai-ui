"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Calendar, GitBranch, RefreshCw, TrendingUp, TrendingDown, RotateCcw, Play, Bug, Palette, AlertTriangle, MoreHorizontal, Search } from "lucide-react"
import { useState } from "react"

export function AIInsights() {
  const [fileNameFilter, setFileNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [failureFilter, setFailureFilter] = useState("all")

  const categorizationData = [
    { file: "auth.spec.ts", test: "should login user", category: "Bug", failures: 3, trend: "increasing" },
    { file: "dashboard.spec.ts", test: "should render dashboard", category: "Bug", failures: 2, trend: "stable" },
    { file: "user.spec.ts", test: "should update profile", category: "Bug", failures: 3, trend: "decreasing" },
    { file: "profile.spec.ts", test: "should update avatar", category: "UI Change", failures: 2, trend: "increasing" },
    { file: "settings.spec.ts", test: "should save settings", category: "UI Change", failures: 3, trend: "stable" },
    { file: "checkout.spec.ts", test: "should complete checkout", category: "Unstable", failures: 5, trend: "increasing" },
    { file: "payment.spec.ts", test: "should process payment", category: "Unstable", failures: 4, trend: "decreasing" },
    { file: "order.spec.ts", test: "should create order", category: "Unstable", failures: 3, trend: "stable" },
    { file: "notification.spec.ts", test: "should send notification", category: "Miscellaneous", failures: 3, trend: "decreasing" },
    { file: "export.spec.ts", test: "should export data", category: "Miscellaneous", failures: 1, trend: "stable" },
    { file: "import.spec.ts", test: "should import data", category: "Bug", failures: 4, trend: "increasing" },
    { file: "search.spec.ts", test: "should search results", category: "UI Change", failures: 2, trend: "decreasing" },
  ]

  const filteredData = categorizationData.filter(item => {
    const matchesFileName = fileNameFilter === "" || 
      item.file.toLowerCase().includes(fileNameFilter.toLowerCase()) ||
      item.test.toLowerCase().includes(fileNameFilter.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || 
      item.category.toLowerCase().replace(" ", "-") === categoryFilter
    
    const matchesFailures = (() => {
      if (failureFilter === "all") return true
      switch (failureFilter) {
        case "low": return item.failures <= 2
        case "medium": return item.failures > 2 && item.failures <= 4
        case "high": return item.failures > 4
        default: return true
      }
    })()
    
    return matchesFileName && matchesCategory && matchesFailures
  })

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Bug":
        return <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">Bug</Badge>
      case "UI Change":
        return <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">UI Change</Badge>
      case "Unstable":
        return <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">Unstable</Badge>
      case "Miscellaneous":
        return <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50">Miscellaneous</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-3 w-3 text-green-500" />
      case "stable":
        return <RotateCcw className="h-3 w-3 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                Onpath testing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                CruiseControl
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Insights</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title and Description */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Insights</h1>
          <p className="text-gray-600">Intelligent analysis of test patterns and predictive recommendations</p>
        </div>

        {/* Filter and Action Buttons */}
        <div className="flex items-center space-x-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="14days">14 days</SelectItem>
              <SelectItem value="1month">1 month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="main">
            <SelectTrigger className="w-[140px]">
              <GitBranch className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">main</SelectItem>
              <SelectItem value="develop">develop</SelectItem>
              <SelectItem value="feature/test-improvements">feature/test-improvements</SelectItem>
              <SelectItem value="hotfix/urgent-fix">hotfix/urgent-fix</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Key Metrics - Updated to match the image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">+2.3%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-sm text-gray-600 mt-1">Pass Rate</p>
              <p className="text-xs text-gray-500 mt-1">Highest in R431</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">-1.1%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15%</div>
              <p className="text-sm text-gray-600 mt-1">Fail Rate</p>
              <p className="text-xs text-gray-500 mt-1">Consistent failures in dashboard.spec.ts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600 font-medium">±0.9%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5%</div>
              <p className="text-sm text-gray-600 mt-1">Flaky Rate</p>
              <p className="text-xs text-gray-500 mt-1">Test X flaked in 3 of 5 runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">-0.5%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2%</div>
              <p className="text-sm text-gray-600 mt-1">Skipped Rate</p>
              <p className="text-xs text-gray-500 mt-1">Tests consistently skipped: exportFlow.spec.ts</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Error Categorization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>AI Error Categorization</span>
            </CardTitle>
            <CardDescription>
              AI-powered classification of test failures and flaky tests by root cause
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  key: "bug",
                  icon: <Bug className="h-5 w-5 text-red-600" />,
                  title: "Bug",
                  trend: "-12%",
                  trendClass: "text-red-600",
                  iconTrend: <TrendingDown className="h-4 w-4 text-red-600" />,
                  value: 8,
                  desc: "tests affected",
                },
                {
                  key: "ui-change",
                  icon: <Palette className="h-5 w-5 text-blue-600" />,
                  title: "UI Change",
                  trend: "+8%",
                  trendClass: "text-blue-600",
                  iconTrend: <TrendingUp className="h-4 w-4 text-blue-600" />,
                  value: 5,
                  desc: "tests affected",
                },
                {
                  key: "unstable",
                  icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
                  title: "Unstable",
                  trend: "±3%",
                  trendClass: "text-orange-600",
                  iconTrend: <RotateCcw className="h-4 w-4 text-orange-600" />,
                  value: 12,
                  desc: "tests affected",
                },
                {
                  key: "misc",
                  icon: <MoreHorizontal className="h-5 w-5 text-gray-600" />,
                  title: "Miscellaneous",
                  trend: "-5%",
                  trendClass: "text-gray-600",
                  iconTrend: <TrendingDown className="h-4 w-4 text-gray-600" />,
                  value: 3,
                  desc: "tests affected",
                },
              ].map(
                ({
                  key,
                  icon,
                  title,
                  trend,
                  trendClass,
                  iconTrend,
                  value,
                  desc,
                }) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {icon}
                        <h3 className="font-semibold">{title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {iconTrend}
                        <span className={`text-sm font-medium ${trendClass}`}>{trend}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">{value}</div>
                    <p className="text-sm mb-1">{desc}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Error Categorization Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>AI Categorization Details</span>
            </CardTitle>
            <CardDescription>
              Breakdown of test failures by file, test name, and AI category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Enhanced Filters */}
            <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4">
              {/* File Name Filter */}
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter by file name or test name..."
                  value={fileNameFilter}
                  onChange={(e) => setFileNameFilter(e.target.value)}
                  className="h-8 w-64 text-xs"
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
                    <SelectItem value="unstable">Unstable</SelectItem>
                    <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Failure Count Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600">Failures:</span>
                <Select value={failureFilter} onValueChange={setFailureFilter}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low (&le;2)</SelectItem>
                    <SelectItem value="medium">Medium (3-4)</SelectItem>
                    <SelectItem value="high">High (&gt;4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(fileNameFilter !== "" || categoryFilter !== "all" || failureFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFileNameFilter("")
                    setCategoryFilter("all")
                    setFailureFilter("all")
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">AI Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Failures</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData
                    .sort((a, b) => a.file.localeCompare(b.file)) // Sort by file name
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">
                            {item.test}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-sm text-gray-900 font-mono">
                            {item.file}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {getCategoryBadge(item.category)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {item.failures}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(item.trend)}
                            <span className="text-xs text-gray-500 capitalize">
                              {item.trend}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found. Try adjusting your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 