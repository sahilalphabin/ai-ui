"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Trash2, GitBranch, Hash, User, Clock, Timer, FileText } from "lucide-react"

export function Header() {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                Speechify Inc.
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                Speechify
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                Test Runs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#1145</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Test Run Info */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <GitBranch className="h-4 w-4 text-gray-500" />
          <span className="text-lg font-medium">chore: move some logic around</span>
          <span className="text-gray-500">- #1145</span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <Badge variant="secondary">DEV</Badge>
            <div className="flex items-center space-x-1">
              <GitBranch className="h-3 w-3" />
              <span>faith/tu-5940-playhead-does-not-move-to-the-first</span>
            </div>
            <div className="flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>249adf7</span>
            </div>
            <span>#8754</span>
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Faith20</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>23 minutes ago</span>
            </div>
            <div className="flex items-center space-x-1">
              <Timer className="h-3 w-3" />
              <span>5m 30s</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>HTML Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-gray-200">
        {["Summary", "Specs", "History", "Configuration", "AI Insights", "Trends"].map((tab) => (
          <button
            key={tab}
            className={`pb-3 px-1 text-sm font-medium border-b-2 ${
              tab === "AI Insights"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
