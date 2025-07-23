"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  X, 
  Upload, 
  Image as ImageIcon,
  AlertTriangle,
  User,
  FolderOpen,
  Flag,
  Send,
  Brain,
  ArrowLeft
} from "lucide-react"

interface TestRunData {
  id: string
  title: string
  status: string
  failureReason: string
  errorDetails: {
    message: string
    callLog: string
  }
}

interface BugReportPanelProps {
  testRunData: TestRunData
  onBack: () => void
}

export function BugReportPanel({ testRunData, onBack }: BugReportPanelProps) {
  const [formData, setFormData] = useState({
    title: `Test Failure: ${testRunData.title}`,
    description: generateAIDescription(testRunData),
    project: "",
    priority: "",
    assignee: "",
    screenshots: [] as File[]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  function generateAIDescription(testRun: TestRunData): string {
    return `## Bug Report

### Observed Behavior
• Test case "${testRun.title}" failed with status: ${testRun.status}
• Failure reason: ${testRun.failureReason}
• Error message: ${testRun.errorDetails.message}
• Call log: ${testRun.errorDetails.callLog}

### Expected Behavior
• The test should pass successfully
• The application should handle the scenario without errors
• No network resolution errors should occur

### Steps to Reproduce
1. Run the test case "${testRun.title}"
2. The test attempts to navigate to the target URL
3. Network error occurs during page navigation

### Environment
• Test Run ID: #${testRun.id}
• Browser: Chromium
• Branch: master

### Additional Notes
• This appears to be a network connectivity issue
• The target URL may be unreachable or misconfigured
• Consider checking DNS resolution and network connectivity`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, ...files] }))
  }

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call to Jira
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Bug report submitted:", formData)
      onBack()
    } catch (error) {
      console.error("Error submitting bug report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const projects = [
    { id: "PROJ", name: "Project Alpha" },
    { id: "TEST", name: "Test Project" },
    { id: "DEV", name: "Development" }
  ]

  const priorities = [
    { value: "highest", label: "Highest", color: "bg-red-100 text-red-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "lowest", label: "Lowest", color: "bg-blue-100 text-blue-800" }
  ]

  const assignees = [
    { id: "user1", name: "John Doe", email: "john@example.com" },
    { id: "user2", name: "Jane Smith", email: "jane@example.com" },
    { id: "user3", name: "Mike Johnson", email: "mike@example.com" }
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 bg-gray-50">
        <div className="flex-1 flex flex-col">
          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-8 flex-1">
            {/* First Column - Title and Description */}
            <div className="col-span-2 flex flex-col space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Bug Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter a descriptive title for the bug"
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 flex-1 flex flex-col">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="font-mono text-sm flex-1 resize-none"
                  placeholder="Describe the bug in detail..."
                />
                <p className="text-xs text-gray-500">
                  Supports Markdown formatting. The description has been pre-filled with AI-generated content based on the test failure.
                </p>
              </div>
            </div>

            {/* Second Column - Form Fields */}
            <div className="space-y-6">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">Project *</Label>
                <Select value={formData.project} onValueChange={(value) => handleInputChange("project", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="h-4 w-4" />
                          <span>{project.name}</span>
                          <Badge variant="outline">{project.id}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Selection */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4" />
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee Selection */}
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee.id} value={assignee.id}>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{assignee.name}</span>
                          <span className="text-gray-500">({assignee.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Screenshots */}
              <div className="space-y-4">
                <Label>Screenshots</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => document.getElementById('screenshot-upload')?.click()}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Screenshots
                      </Button>
                      <input
                        id="screenshot-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload screenshots, error logs, or other relevant files
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {formData.screenshots.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Uploaded Files:</h4>
                    <div className="space-y-2">
                      {formData.screenshots.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScreenshot(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Bug Report
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onBack} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 