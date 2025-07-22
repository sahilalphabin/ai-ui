"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatternsAnomalies } from "@/components/patterns-anomalies"
import { CoverageGaps } from "@/components/coverage-gaps"
import { PredictiveAnalysis } from "@/components/predictive-analysis"
import { Recommendations } from "@/components/recommendations"
import { BusinessImpact } from "@/components/business-impact"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MainContent({ activeTab, setActiveTab }: MainContentProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns" className="flex items-center space-x-2">
            <span>⚡</span>
            <span>Patterns & Anomalies</span>
          </TabsTrigger>
          <TabsTrigger value="coverage" className="flex items-center space-x-2">
            <span>🎯</span>
            <span>Coverage & Gaps</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center space-x-2" disabled>
            <span>🔮</span>
            <span>Predictive Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2" disabled>
            <span>💡</span>
            <span>Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2" disabled>
            <span>💼</span>
            <span>Business Impact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="mt-6">
          <PatternsAnomalies />
        </TabsContent>

        <TabsContent value="coverage" className="mt-6">
          <CoverageGaps />
        </TabsContent>

        <TabsContent value="predictive" className="mt-6">
          <PredictiveAnalysis />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Recommendations />
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <BusinessImpact />
        </TabsContent>
      </Tabs>
    </div>
  )
}
