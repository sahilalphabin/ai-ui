"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Zap, Target, ArrowRight } from "lucide-react"

export function Recommendations() {
  const recommendations = [
    {
      category: "Test Suite Optimization",
      priority: "High",
      impact: "High",
      effort: "Medium",
      items: [
        {
          title: "Implement Parallel Test Execution",
          description: "Run authentication and file upload tests in parallel to reduce execution time by 40%",
          estimatedTime: "2-3 days",
          impact: "Reduces CI/CD pipeline time from 45min to 27min",
        },
        {
          title: "Add Test Data Factories",
          description: "Create reusable test data generators to eliminate duplicate setup code",
          estimatedTime: "1-2 days",
          impact: "Improves test maintainability and reduces flakiness",
        },
      ],
    },
    {
      category: "Quality Gate Enhancement",
      priority: "High",
      impact: "High",
      effort: "Low",
      items: [
        {
          title: "Implement Coverage Thresholds",
          description: "Set minimum 80% coverage requirement for critical modules before deployment",
          estimatedTime: "4 hours",
          impact: "Prevents deployment of under-tested code",
        },
        {
          title: "Add Flaky Test Detection",
          description: "Automatically identify and quarantine tests with >10% failure rate",
          estimatedTime: "1 day",
          impact: "Improves CI reliability and developer confidence",
        },
      ],
    },
    {
      category: "Performance Optimization",
      priority: "Medium",
      impact: "Medium",
      effort: "High",
      items: [
        {
          title: "Optimize Database Test Setup",
          description: "Use database transactions and rollbacks instead of full cleanup",
          estimatedTime: "3-4 days",
          impact: "Reduces test execution time by 60%",
        },
        {
          title: "Implement Smart Test Selection",
          description: "Run only tests affected by code changes in PR builds",
          estimatedTime: "5-7 days",
          impact: "Reduces PR build time from 30min to 8min",
        },
      ],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI-Powered Recommendations</h2>
        <p className="text-gray-600">Actionable insights to improve test quality, performance, and reliability</p>
      </div>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Quick Wins</span>
            <Badge className="bg-green-500 text-white">High Impact, Low Effort</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">Implement Coverage Thresholds</h4>
                <Badge variant="outline" className="text-xs">
                  4 hours
                </Badge>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Set minimum 80% coverage requirement for critical modules before deployment
              </p>
              <Button size="sm" className="w-full">
                Implement Now <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>

            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">Add Flaky Test Detection</h4>
                <Badge variant="outline" className="text-xs">
                  1 day
                </Badge>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Automatically identify and quarantine tests with {">"} 10% failure rate
              </p>
              <Button size="sm" className="w-full">
                Implement Now <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        {recommendations.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{category.category}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-white ${getPriorityColor(category.priority)}`}>
                    {category.priority} Priority
                  </Badge>
                  <Badge variant="outline">{category.impact} Impact</Badge>
                  <Badge className={getEffortColor(category.effort)}>{category.effort} Effort</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{item.estimatedTime}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">{item.impact}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Implementation Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Week 1: Quick Wins</h4>
                <p className="text-sm text-gray-600">Implement coverage thresholds and flaky test detection</p>
              </div>
              <Badge className="bg-green-500 text-white">Ready</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Week 2-3: Test Optimization</h4>
                <p className="text-sm text-gray-600">Add parallel execution and test data factories</p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Week 4-6: Performance Improvements</h4>
                <p className="text-sm text-gray-600">Optimize database setup and implement smart test selection</p>
              </div>
              <Badge variant="outline">Future</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
