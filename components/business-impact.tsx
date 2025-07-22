"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, AlertTriangle, Shield, Clock, Users } from "lucide-react"

export function BusinessImpact() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Impact Analysis</h2>
        <p className="text-gray-600">Financial and operational impact assessment of test quality and failures</p>
      </div>

      {/* Quality Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Production Deployment Risk</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">High</div>
              <div className="text-sm text-gray-600 mb-2">Risk Level</div>
              <Badge variant="destructive">Critical Issues</Badge>
            </div>
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">67%</div>
              <div className="text-sm text-gray-600 mb-2">Confidence Score</div>
              <Badge className="bg-yellow-500 text-white">Below Threshold</Badge>
            </div>
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600 mb-2">Blocking Issues</div>
              <Badge variant="outline">Requires Attention</Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Deployment Recommendation</h4>
                <p className="text-sm text-red-700 mt-1">
                  <strong>DO NOT DEPLOY</strong> - Critical test failures in authentication and file upload modules pose
                  significant risk to production stability. Address failing tests before deployment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost-Benefit Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Cost-Benefit Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4 text-red-600">Current Costs (Monthly)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm">Bug Fixing Time</span>
                  <span className="font-medium text-red-600">$12,400</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm">Production Incidents</span>
                  <span className="font-medium text-red-600">$8,200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm">Customer Support</span>
                  <span className="font-medium text-red-600">$3,600</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg border-2 border-red-200">
                  <span className="font-medium">Total Monthly Cost</span>
                  <span className="font-bold text-red-600">$24,200</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-green-600">Projected Savings (Monthly)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Reduced Bug Fixing</span>
                  <span className="font-medium text-green-600">$7,400</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Fewer Incidents</span>
                  <span className="font-medium text-green-600">$6,100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Support Reduction</span>
                  <span className="font-medium text-green-600">$2,200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-200">
                  <span className="font-medium">Total Monthly Savings</span>
                  <span className="font-bold text-green-600">$15,700</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-800">ROI Projection</h4>
                <p className="text-sm text-blue-700">Investment in test improvements pays back in 2.3 months</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">312%</div>
                <div className="text-sm text-blue-600">Annual ROI</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Revenue Impact Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4">Risk Factors</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Customer Churn Risk</span>
                    <span className="text-sm font-medium text-red-600">High</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Authentication failures affecting user experience</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Feature Adoption Impact</span>
                    <span className="text-sm font-medium text-yellow-600">Medium</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">File upload issues limiting feature usage</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Market Reputation</span>
                    <span className="text-sm font-medium text-orange-600">Medium</span>
                  </div>
                  <Progress value={55} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Reliability concerns in enterprise segment</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Financial Projections</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Potential Revenue Loss</span>
                    <span className="font-medium text-red-600">$45K/month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Based on current failure rates</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Acquisition Cost</span>
                    <span className="font-medium text-blue-600">+$8K/customer</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Additional cost due to reputation impact</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Protection</span>
                    <span className="font-medium text-green-600">$38K/month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">With improved test quality</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Productivity Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Productivity Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 mb-1">32%</div>
              <div className="text-sm text-gray-600">Time Lost to Debugging</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 mb-1">18</div>
              <div className="text-sm text-gray-600">Hours/Week Bug Fixing</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 mb-1">5</div>
              <div className="text-sm text-gray-600">Developers Affected</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Productivity Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Implement automated test healing to reduce maintenance overhead</li>
              <li>• Add better error reporting to reduce debugging time by 40%</li>
              <li>• Create test environment isolation to prevent cross-test interference</li>
              <li>• Establish clear test ownership to improve accountability</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Items Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary & Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Immediate Actions Required</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Block current deployment due to critical test failures</li>
                <li>• Allocate 2 developers to fix authentication timeout issues</li>
                <li>• Implement emergency monitoring for file upload operations</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Short-term Investments (1-2 weeks)</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Invest $15K in test infrastructure improvements</li>
                <li>• Hire 1 additional QA engineer for 3 months</li>
                <li>• Implement automated test quality gates</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Expected Outcomes (3 months)</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 65% reduction in production incidents</li>
                <li>• $47K monthly cost savings</li>
                <li>• 40% improvement in deployment confidence</li>
                <li>• 25% increase in team productivity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
