"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"


interface TestError {
  testName: string
  errorMessage: string
  frequency: number
  branch: string
}

interface ErrorCategory {
  name: string
  color: string
  branches: string[]
  testsAffected: number
  tests: TestError[]
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
  totalTestsAffected: 47,
  branchesImpacted: 12,
  totalFailures: 158,
  errorCategories: [
    {
      name: "Timeout: waiting for element",
      color: "#ef4444", // red-500
      branches: ["main", "feature/auth", "develop/ui", "feature/dashboard", "hotfix/login", "feature/settings"],
      testsAffected: 10,
      tests: [
        {
          testName: "Login Form Validation",
          errorMessage: "Timeout waiting for #submit-button to be visible",
          frequency: 25,
          branch: "feature/auth"
        },
        {
          testName: "Dashboard Loading",
          errorMessage: "Timeout waiting for .widget-container to appear",
          frequency: 18,
          branch: "develop/ui"
        },
        {
          testName: "User Profile Update",
          errorMessage: "Timeout waiting for #save-button to be clickable",
          frequency: 12,
          branch: "feature/settings"
        }
      ]
    },
    {
      name: "Assertion Failed",
      color: "#3b82f6", // blue-500
      branches: ["main", "hotfix/payment", "feature/checkout", "feature/billing", "develop/api"],
      testsAffected: 8,
      tests: [
        {
          testName: "Verify Tooltip Display",
          errorMessage: "expect(tooltip).toBe('Expected text') // Received: null",
          frequency: 15,
          branch: "feature/checkout"
        },
        {
          testName: "Payment Validation",
          errorMessage: "Expected \"Success\" but received \"Error: Invalid card\"",
          frequency: 11,
          branch: "hotfix/payment"
        },
        {
          testName: "API Response Check",
          errorMessage: "Expected status 200 but received 500",
          frequency: 8,
          branch: "develop/api"
        }
      ]
    },
    {
      name: "Network Timeout",
      color: "#f59e0b", // amber-500
      branches: ["api-tests", "integration/staging", "feature/external-api", "develop/network", "test/load"],
      testsAffected: 6,
      tests: [
        {
          testName: "External API Call",
          errorMessage: "Network timeout after 30 seconds",
          frequency: 9,
          branch: "feature/external-api"
        },
        {
          testName: "Database Connection",
          errorMessage: "Connection timeout to database server",
          frequency: 7,
          branch: "integration/staging"
        }
      ]
    },
    {
      name: "Database Error",
      color: "#8b5cf6", // violet-500
      branches: ["backend-tests", "data-migration", "feature/database"],
      testsAffected: 4,
      tests: [
        {
          testName: "User Data Migration",
          errorMessage: "Database constraint violation: duplicate key",
          frequency: 5,
          branch: "data-migration"
        },
        {
          testName: "Transaction Rollback",
          errorMessage: "Database deadlock detected",
          frequency: 3,
          branch: "backend-tests"
        }
      ]
    }
  ]
}

export function AIErrorAnalysis({ data }: AIErrorAnalysisProps) {
  const analysisData = data || sampleData

  function formatBranches(branches: string[]): string {
    if (branches.length === 0) return "No branches"
    if (branches.length === 1) return branches[0]
    
    // For multiple branches, show first 2-3 with count
    const maxVisible = branches.length <= 3 ? branches.length : 2
    const visibleBranches = branches.slice(0, maxVisible)
    const remaining = branches.length - maxVisible
    
    if (remaining === 0) {
      return visibleBranches.join(", ")
    }
    
    return `${visibleBranches.join(", ")} +${remaining}`
  }



  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
     

      {/* Error Categories Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Error Categories and Details</CardTitle>
          <CardDescription>Expand to view test details for each error category</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {analysisData.errorCategories.map((category, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="text-left min-w-0 flex-1">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div 
                          className="text-sm text-gray-600 cursor-help"
                          title={category.branches.join(", ")}
                        >
                          <span className="truncate block">
                            {formatBranches(category.branches)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <Badge variant="secondary" className="text-xs">
                        {category.testsAffected} tests affected
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Test Name</TableHead>
                          <TableHead>Error Message</TableHead>
                          <TableHead className="w-[80px] text-center">Frequency</TableHead>
                          <TableHead className="w-[200px]">Branch</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.tests.map((test, testIndex) => (
                          <TableRow key={testIndex}>
                            <TableCell className="font-medium">{test.testName}</TableCell>
                            <TableCell>
                              <div 
                                className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm font-mono cursor-help"
                                title={test.errorMessage}
                              >
                                {test.errorMessage.length > 50 
                                  ? `${test.errorMessage.substring(0, 50)}...` 
                                  : test.errorMessage
                                }
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {test.frequency}
                            </TableCell>
                            <TableCell 
                              className="cursor-help"
                              title={test.branch}
                            >
                              {test.branch}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
