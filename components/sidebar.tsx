"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Settings, TestTube, GitPullRequest, Brain } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦕</span>
          <span className="text-xl font-semibold text-gray-900">Testdino</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Dashboard Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dashboard</h3>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
              <TestTube className="mr-3 h-4 w-4" />
              Test Runs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <GitPullRequest className="mr-3 h-4 w-4" />
              Pull Requests
            </Button>
          </div>
        </div>

        {/* Insights Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Insights</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Brain className="mr-3 h-4 w-4" />
              AI Insights
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-3 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* General Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">General</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
