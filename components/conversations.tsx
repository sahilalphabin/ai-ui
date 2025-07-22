"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Search, ArrowLeft, Clock, ArrowRight, Filter, Calendar, X } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  messageCount: number
  date: Date
}

const allChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Test Automation Help",
    lastMessage: "How can I improve my test coverage?",
    timestamp: "2 hours ago",
    messageCount: 12,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    title: "API Testing Questions",
    lastMessage: "What are the best practices for API testing?",
    timestamp: "1 day ago",
    messageCount: 8,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "3",
    title: "Performance Testing",
    lastMessage: "Help me understand load testing metrics",
    timestamp: "3 days ago",
    messageCount: 15,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "4",
    title: "CI/CD Integration",
    lastMessage: "How to integrate tests with GitHub Actions?",
    timestamp: "1 week ago",
    messageCount: 6,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: "5",
    title: "Unit Testing Best Practices",
    lastMessage: "What makes a good unit test?",
    timestamp: "2 weeks ago",
    messageCount: 10,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
  },
  {
    id: "6",
    title: "Database Testing",
    lastMessage: "How to test database transactions?",
    timestamp: "3 weeks ago",
    messageCount: 7,
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
  },
  {
    id: "7",
    title: "Mobile App Testing",
    lastMessage: "Best practices for mobile app testing?",
    timestamp: "1 month ago",
    messageCount: 9,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
  },
  {
    id: "8",
    title: "Security Testing",
    lastMessage: "How to implement security testing?",
    timestamp: "1 month ago",
    messageCount: 11,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
  },
  {
    id: "9",
    title: "Test Data Management",
    lastMessage: "Strategies for managing test data",
    timestamp: "2 months ago",
    messageCount: 5,
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
  },
]

interface ConversationsProps {
  onBack: () => void
  onChatSelect: (sessionId: string) => void
}

export function Conversations({ onBack, onChatSelect }: ConversationsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<string>("all")
  const [messageCountFilter, setMessageCountFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const getFilteredSessions = () => {
    let filtered = allChatSessions

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()
      
      switch (timeFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(session => session.date >= filterDate)
          break
        case "week":
          filterDate.setDate(filterDate.getDate() - 7)
          filtered = filtered.filter(session => session.date >= filterDate)
          break
        case "month":
          filterDate.setMonth(filterDate.getMonth() - 1)
          filtered = filtered.filter(session => session.date >= filterDate)
          break
        case "3months":
          filterDate.setMonth(filterDate.getMonth() - 3)
          filtered = filtered.filter(session => session.date >= filterDate)
          break
      }
    }

    // Message count filter
    if (messageCountFilter !== "all") {
      switch (messageCountFilter) {
        case "low":
          filtered = filtered.filter(session => session.messageCount <= 5)
          break
        case "medium":
          filtered = filtered.filter(session => session.messageCount > 5 && session.messageCount <= 10)
          break
        case "high":
          filtered = filtered.filter(session => session.messageCount > 10)
          break
      }
    }

    return filtered
  }

  const filteredSessions = getFilteredSessions()

  const clearFilters = () => {
    setSearchQuery("")
    setTimeFilter("all")
    setMessageCountFilter("all")
  }

  const hasActiveFilters = searchQuery || timeFilter !== "all" || messageCountFilter !== "all"

  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
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
                Assistant
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Conversations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assistant
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
              <p className="text-gray-600">All your previous conversations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message Count Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Count</label>
                <Select value={messageCountFilter} onValueChange={setMessageCountFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select message count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All conversations</SelectItem>
                    <SelectItem value="low">1-5 messages</SelectItem>
                    <SelectItem value="medium">6-10 messages</SelectItem>
                    <SelectItem value="high">10+ messages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  {filteredSessions.length} conversation{filteredSessions.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Chat Sessions Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className="cursor-pointer hover:shadow-sm transition-shadow border border-gray-200 bg-white"
                onClick={() => onChatSelect(session.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{session.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{session.lastMessage}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {session.messageCount} messages
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-500">
                {hasActiveFilters ? "Try adjusting your filters" : "No conversations available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 