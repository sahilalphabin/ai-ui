"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, AlertTriangle } from "lucide-react"

export function PredictiveAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Predictive Analysis</h2>
        <p className="text-gray-600">AI-powered predictions and forecasting for test quality and maintenance</p>
      </div>

      {/* Failure Prediction Model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Failure Prediction Model</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">23%</div>
              <div className="text-sm text-gray-600 mb-2">Predicted Failure Rate</div>
              <Badge variant="destructive">High Risk</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
              <div className="text-sm text-gray-600 mb-2">Model Confidence</div>
              <Badge variant="secondary">Reliable</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5.2</div>
              <div className="text-sm text-gray-600 mb-2">Days to Next Failure</div>
              <Badge className="bg-orange-500 text-white">Medium Risk</Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Prediction Alert</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Based on current patterns, the authentication module is likely to experience failures in the next
                  sprint. Consider increasing test coverage for OAuth token handling.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Effort Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Effort Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4">Resource Planning</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Test Maintenance</span>
                    <span className="text-sm font-medium">32 hours/week</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Bug Fixing</span>
                    <span className="text-sm font-medium">18 hours/week</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">New Test Development</span>
                    <span className="text-sm font-medium">24 hours/week</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Trend Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Test Flakiness</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">-15%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Maintenance Time</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">+23%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Coverage Growth</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800 mb-2">3.2x</div>
              <div className="text-sm text-gray-600">Failure Rate Increase</div>
              <div className="text-xs text-gray-500 mt-1">During feature releases</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800 mb-2">67%</div>
              <div className="text-sm text-gray-600">Pattern Consistency</div>
              <div className="text-xs text-gray-500 mt-1">Across last 6 months</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800 mb-2">4.5</div>
              <div className="text-sm text-gray-600">Days Average Recovery</div>
              <div className="text-xs text-gray-500 mt-1">From critical failures</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-800">High Risk Areas</h4>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Authentication module showing increased timeout patterns</li>
                <li>• File upload operations with 40% failure rate trend</li>
                <li>• Task state transitions lacking edge case coverage</li>
              </ul>
            </div>

            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-yellow-800">Medium Risk Areas</h4>
                <Badge className="bg-yellow-500 text-white">Monitor</Badge>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Project management tests showing inconsistent results</li>
                <li>• Integration test coverage below recommended threshold</li>
                <li>• Performance degradation in scope of work operations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
