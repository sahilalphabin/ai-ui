"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { AIInsights } from "@/components/ai-insights"

export default function TestdinoApp() {
  const [activeTab, setActiveTab] = useState("patterns")
  const [currentPage, setCurrentPage] = useState("test-run-insights") // "test-run-insights" or "ai-insights"

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentPage === "test-run-insights" ? (
          <>
            <Header />
            <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        ) : (
          <AIInsights />
        )}
      </div>
    </div>
  )
}
