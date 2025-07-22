"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { AIInsights } from "@/components/ai-insights"
import { Assistant } from "@/components/assistant"
import { Conversations } from "@/components/conversations"

export default function TestdinoApp() {
  const [activeTab, setActiveTab] = useState("patterns")
  const [currentPage, setCurrentPage] = useState("test-run-insights") // "test-run-insights", "ai-insights", "assistant", or "conversations"

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentPage === "test-run-insights" ? (
          <>
            <Header />
            <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        ) : currentPage === "ai-insights" ? (
          <AIInsights />
        ) : currentPage === "conversations" ? (
          <Conversations onBack={handleBackToAssistant} onChatSelect={handleChatSelect} />
        ) : (
          <Assistant onViewConversations={handleViewConversations} />
        )}
      </div>
    </div>
  )
}
