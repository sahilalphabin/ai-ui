"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Clock, Zap } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Conversation {
  id: string
  title: string
  timeAgo: string
}

interface AssistantProps {
  onViewConversations: () => void
}

const suggestedQuestions = [
  "How do I write better unit tests?",
  "Help with test automation setup",
  "Explain API testing strategies",
  "Performance testing best practices"
]

const recentConversations: Conversation[] = [
  { id: "1", title: "Test Automation Help", timeAgo: "2 hours ago" },
  { id: "2", title: "API Testing Questions", timeAgo: "1 day ago" },
  { id: "3", title: "Performance Testing", timeAgo: "3 days ago" },
  { id: "4", title: "CI/CD Integration", timeAgo: "1 week ago" },
  { id: "5", title: "Unit Testing Best Practices", timeAgo: "2 weeks ago" },
  { id: "6", title: "Database Testing", timeAgo: "3 weeks ago" }
]

export function Assistant({ onViewConversations }: AssistantProps) {
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message logic here
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question)
  }

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
              <BreadcrumbPage>Chat</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Assistant</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6">
        {/* Testdino Logo and Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Image
              src="/testdino.svg"
              alt="Testdino"
              width={120}
              height={40}
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Chat Input - Centered */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative">
            <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow focus-within:shadow-md focus-within:border-blue-500">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about testing, automation, or quality assurance..."
                className="w-full h-14 pl-6 pr-16 text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto px-3 py-2 text-left justify-start border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs"
                onClick={() => handleSuggestedQuestion(question)}
              >
                <Zap className="mr-2 h-3 w-3 text-blue-600 flex-shrink-0" />
                <span>{question}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="w-full max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {recentConversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">{conversation.title}</span>
                    <span className="text-xs text-gray-500">{conversation.timeAgo}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              className="border-gray-300 hover:border-gray-400"
              onClick={onViewConversations}
            >
              <Clock className="mr-2 h-4 w-4" />
              View More Conversations
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 