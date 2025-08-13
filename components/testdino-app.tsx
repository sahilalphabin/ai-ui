"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { AIInsights } from "@/components/ai-insights"
import { Assistant } from "@/components/assistant"
import { Conversations } from "@/components/conversations"
import { Settings } from "@/components/settings"
import { BugReportPanel } from "@/components/bug-report-panel"

export default function TestdinoApp() {
  const [activeTab, setActiveTab] = useState("patterns")
  const [headerTab, setHeaderTab] = useState("Summary")
  const [currentPage, setCurrentPage] = useState("ai-insights") // "test-run-insights", "ai-insights", "assistant", or "conversations"

  const handleViewConversations = () => {
    setCurrentPage("conversations")
  }

  const handleBackToAssistant = () => {
    setCurrentPage("assistant")
  }

  const handleChatSelect = (sessionId: string) => {
    // Handle chat selection - could navigate to a specific chat session
    console.log("Selected chat session:", sessionId)
    // For now, just go back to assistant
    setCurrentPage("assistant")
  }

  const testRunData = {
    id: "1145",
    title: "chore: move some logic around",
    status: "Failed",
    failureReason: "Network Issues",
    errorDetails: {
      message: "Error: page.goto: net::ERR_NAME_NOT_RESOLVED",
      callLog: "Navigation to target URL"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentPage === "test-run-insights" ? (
          <>
            <Header activeTab={headerTab} onTabChange={setHeaderTab} />
            {headerTab === "Bug Report" ? (
              <BugReportPanel 
                testRunData={testRunData}
                onBack={() => setHeaderTab("Summary")}
              />
            ) : (
              <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </>
        ) : currentPage === "ai-insights" ? (
          <AIInsights />
        ) : currentPage === "settings" ? (
          <Settings />
        ) : currentPage === "conversations" ? (
          <Conversations onBack={handleBackToAssistant} onChatSelect={handleChatSelect} />
        ) : (
          <Assistant onViewConversations={handleViewConversations} />
        )}
      </div>
    </div>
  )
}
