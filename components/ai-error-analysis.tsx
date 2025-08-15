"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

interface InsightIssue {
  error_message: string
  affected_tests: number
  total_branch_failures: number
  branch_counts: Record<string, number>
  primary_branch: string
  top_affected_tests: string[]
}

interface BranchImpact {
  percentage: number
  branch: string
  total_branches: number
  primary_branch_count: number
  total_failures: number
}

interface PatternCoverage {
  percentage: number
  top_patterns_count: number
  total_failures: number
  top_3_failures: number
}

interface CategoryMetrics {
  unique_errors: number
  tests_affected: number
  branch_impact: BranchImpact
  pattern_coverage: PatternCoverage
}

interface CategoryInsights {
  critical_issues: InsightIssue[]
  medium_issues: InsightIssue[]
  low_issues: InsightIssue[]
  metrics: CategoryMetrics
}

interface ErrorCategory {
  id: string
  name: string
  icon: string
  total_tests_affected: number
  branch_summary: string
  expanded: boolean
  insights: CategoryInsights
  branch_details: Record<string, number>
}

interface AIErrorAnalysisProps {
  data?: {
    totalTestsAffected: number
    branchesImpacted: number
    totalFailures: number
    errorCategories: ErrorCategory[]
  }
}

const sampleData = {
  totalTestsAffected: 443,
  branchesImpacted: 52,
  totalFailures: 3454,
  errorCategories: [
    {
      id: "timeout_issues",
      name: "Timeout Issues",
      icon: "red",
      total_tests_affected: 222,
      branch_summary: "eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks, romansever/stu-4198-add-support-imports, haiyami/stu-5273 +49 more branches",
      expanded: false,
      insights: {
        critical_issues: [
          {
            error_message: "test timeout of 240000ms exceeded.",
            affected_tests: 96,
            total_branch_failures: 804,
            branch_counts: {
              "steve/check-ci": 3,
              "eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks": 102
            },
            primary_branch: "eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks",
            top_affected_tests: [
              "Verify user can move blocks on timeline and UI reflects updated positions and limits",
              "Verify purchase flow from download button in playground"
            ]
          }
        ],
        medium_issues: [
          {
            error_message: "timeouterror locator.waitfor timeout 160000ms exceeded.",
            affected_tests: 8,
            total_branch_failures: 31,
            branch_counts: {
              "romansever/stu-4198-add-support-imports": 6,
              "eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks": 1
            },
            primary_branch: "romansever/stu-4198-add-support-imports",
            top_affected_tests: [
              "Verify if user able to import testdocx.docx file by sentence",
              "Verify if user able to import testdocx.docx file by paragraph"
            ]
          }
        ],
        low_issues: [
          {
            error_message: "timeouterror locator.waitfor timeout 60000ms exceeded.",
            affected_tests: 4,
            total_branch_failures: 15,
            branch_counts: {
              "steve/useFilesNotShasForNx": 12,
              "steve/check-ci": 3
            },
            primary_branch: "steve/useFilesNotShasForNx",
            top_affected_tests: [
              "Complete onboarding from Voice Dubbing iPhone 12",
              "Complete onboarding from Voice Generator iPhone 12"
            ]
          }
        ],
        metrics: {
          unique_errors: 91,
          tests_affected: 222,
          branch_impact: {
            percentage: 11,
            branch: "eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks",
            total_branches: 52,
            primary_branch_count: 190,
            total_failures: 1689
          },
          pattern_coverage: {
            percentage: 65,
            top_patterns_count: 3,
            total_failures: 1689,
            top_3_failures: 1104
          }
        }
      },
      branch_details: { "main": 69 }
    },
    {
      id: "assertion_failures",
      name: "Assertion Failures",
      icon: "blue",
      total_tests_affected: 209,
      branch_summary: "romansever/stu-4198-add-support-imports, kushagra/STU-6198-upgrade-from-dashboard, eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks +50 more branches",
      expanded: false,
      insights: {
        critical_issues: [
          {
            error_message: "error timed out 120000ms waiting for expect(locator).tobevisible() locator getbytestid('success-proc...",
            affected_tests: 71,
            total_branch_failures: 290,
            branch_counts: {
              "romansever/stu-4198-add-support-imports": 27,
              "eugenemirotin/stu-6210-unify-export-history-module-similar-to-assets-blocks": 21
            },
            primary_branch: "romansever/stu-4198-add-support-imports",
            top_affected_tests: [
              "Voice Over Block Editing and Playback Controls",
              "Verify that clicking on Duplicate should create a copy of the file next to it"
            ]
          }
        ],
        medium_issues: [],
        low_issues: [
          {
            error_message: "error expected status 200, got 401 with {\"entitlementquotas\"{\"studio_tokens\"600},\"context\"{\"reason\"\"...",
            affected_tests: 4,
            total_branch_failures: 4,
            branch_counts: {
              "arsa/stu-6141-fix-stitched-thumbnail-creation-failure-for-a-big-image": 4
            },
            primary_branch: "arsa/stu-6141-fix-stitched-thumbnail-creation-failure-for-a-big-image",
            top_affected_tests: [
              "Verify user is able to signup and assert upsell modal for free user during export project after exceeding credits"
            ]
          }
        ],
        metrics: {
          unique_errors: 188,
          tests_affected: 209,
          branch_impact: {
            percentage: 6,
            branch: "romansever/stu-4198-add-support-imports",
            total_branches: 53,
            primary_branch_count: 112,
            total_failures: 1687
          },
          pattern_coverage: {
            percentage: 34,
            top_patterns_count: 3,
            total_failures: 1687,
            top_3_failures: 575
          }
        }
      },
      branch_details: { "main": 35 }
    },
    {
      id: "element_not_found",
      name: "Element Not Found",
      icon: "orange",
      total_tests_affected: 7,
      branch_summary: "fatih/stu-5513-implement-sliding-window-for-script-block-regeneration, steve/stu-6006-implement-move-left-move-right-for-cross-lane-linked, kushagra/STU-6198-upgrade-from-dashboard +24 more branches",
      expanded: false,
      insights: {
        critical_issues: [],
        medium_issues: [],
        low_issues: [
          {
            error_message: "error ajs_user_id not found in localstorage",
            affected_tests: 3,
            total_branch_failures: 3,
            branch_counts: {
              "kushagra/STU-6198-upgrade-from-dashboard": 3
            },
            primary_branch: "kushagra/STU-6198-upgrade-from-dashboard",
            top_affected_tests: [
              "Verify that user should be able to listen to voice preview by clicking on the play button adjacent to voice",
              "Selected expression and remove selected expression"
            ]
          }
        ],
        metrics: {
          unique_errors: 6,
          tests_affected: 7,
          branch_impact: {
            percentage: 14,
            branch: "fatih/stu-5513-implement-sliding-window-for-script-block-regeneration",
            total_branches: 27,
            primary_branch_count: 10,
            total_failures: 71
          },
          pattern_coverage: {
            percentage: 92,
            top_patterns_count: 3,
            total_failures: 71,
            top_3_failures: 66
          }
        }
      },
      branch_details: { "main": 3 }
    },
    {
      id: "network_issues",
      name: "Network Issues",
      icon: "yellow",
      total_tests_affected: 5,
      branch_summary: "fatih/stu-5963-implement-filter-intensity-levels, kushagra/creat-free-tier-bucket, eugenemirotin/stu-6099-validate-jsonb-data-at-repository-level-before-updateinsert +3 more branches",
      expanded: false,
      insights: {
        critical_issues: [],
        medium_issues: [],
        low_issues: [
          {
            error_message: "error failed to navigate to URL page.goto ns_error_abort",
            affected_tests: 1,
            total_branch_failures: 1,
            branch_counts: {
              "kushagra/creat-free-tier-bucket": 1
            },
            primary_branch: "kushagra/creat-free-tier-bucket",
            top_affected_tests: [
              "Custom Pause"
            ]
          }
        ],
        metrics: {
          unique_errors: 6,
          tests_affected: 5,
          branch_impact: {
            percentage: 28,
            branch: "fatih/stu-5963-implement-filter-intensity-levels",
            total_branches: 6,
            primary_branch_count: 2,
            total_failures: 7
          },
          pattern_coverage: {
            percentage: 57,
            top_patterns_count: 3,
            total_failures: 7,
            top_3_failures: 4
          }
        }
      },
      branch_details: { "main": 1 }
    }
  ]
}

export function AIErrorAnalysis({ data }: AIErrorAnalysisProps) {
  const analysisData = data || sampleData

  function getColorForCategory(icon: string): string {
    switch (icon) {
      case 'red': return '#ef4444'
      case 'blue': return '#3b82f6'
      case 'orange': return '#f59e0b'
      case 'yellow': return '#eab308'
      case 'purple': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  function getPriorityColor(priority: 'critical' | 'medium' | 'low'): string {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  function getPriorityLabel(priority: 'critical' | 'medium' | 'low'): string {
    switch (priority) {
      case 'critical': return 'Critical'
      case 'medium': return 'Medium'
      case 'low': return 'Low'
      default: return 'Unknown'
    }
  }

  function formatBranches(primaryBranch: string, totalBranches: number): string {
    if (totalBranches === 1) return primaryBranch
    return `${primaryBranch} +${totalBranches - 1}`
  }

  function formatFeatures(features: string[]): string {
    if (features.length === 0) return "N/A"
    if (features.length <= 2) return features.join(", ")
    return `${features.slice(0, 2).join(", ")} +${features.length - 2}`
  }

  function truncateErrorMessage(message: string, maxLength: number = 60): string {
    if (message.length <= maxLength) return message
    return `${message.substring(0, maxLength)}...`
  }

  function renderCategoryTable(category: ErrorCategory) {
    // Combine all issues into a single array with priority info
    const allIssues = [
      ...category.insights.critical_issues.map(issue => ({ ...issue, priority: 'critical' as const })),
      ...category.insights.medium_issues.map(issue => ({ ...issue, priority: 'medium' as const })),
      ...category.insights.low_issues.map(issue => ({ ...issue, priority: 'low' as const }))
    ]

    if (allIssues.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No issues found for this category
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Quick Metrics Summary */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {category.insights.metrics.unique_errors}
            </div>
            <div className="text-sm text-blue-700">Unique Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {category.total_tests_affected}
            </div>
            <div className="text-sm text-blue-700">Tests Affected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {category.insights.metrics.branch_impact.percentage}%
            </div>
            <div className="text-sm text-blue-700">Branch Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {category.insights.metrics.pattern_coverage.percentage}%
            </div>
            <div className="text-sm text-blue-700">Pattern Coverage</div>
          </div>
        </div>

        {/* Issues Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Error Message</TableHead>
              <TableHead className="w-[15%]">Priority</TableHead>
              <TableHead className="w-[20%]">Features Affected</TableHead>
              <TableHead className="w-[25%]">Branches Affected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allIssues.map((issue, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">
                  <div 
                    className="max-w-xs cursor-help"
                    title={issue.error_message}
                  >
                    {truncateErrorMessage(issue.error_message)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}
                  >
                    {getPriorityLabel(issue.priority)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div 
                    className="text-sm text-gray-700 cursor-help"
                    title={issue.top_affected_tests.join('\n')}
                  >
                    {formatFeatures(issue.top_affected_tests)}
                  </div>
                </TableCell>
                <TableCell>
                  <div 
                    className="text-sm text-gray-700 cursor-help"
                    title={`${issue.primary_branch} (${Object.keys(issue.branch_counts).length} total branches)`}
                  >
                    {formatBranches(issue.primary_branch, Object.keys(issue.branch_counts).length)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Categories Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Error Categories and Insights</CardTitle>
          <CardDescription>Select a category to view detailed insights in a table format</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={analysisData.errorCategories[0]?.id || "timeout_issues"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              {analysisData.errorCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: getColorForCategory(category.icon) }}
                  />
                  <span className="truncate">{category.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.total_tests_affected}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {analysisData.errorCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                {renderCategoryTable(category)}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
