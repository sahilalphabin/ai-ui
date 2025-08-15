"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Palette, AlertTriangle, HelpCircle } from "lucide-react"

interface SummaryCardData {
  count: number;
  topTestCases: { title: string; count: number }[];
}

interface SummaryCardsProps {
  summaryCards: {
    ui_change: SummaryCardData;
    bug: SummaryCardData;
    flaky: SummaryCardData;
    unknown: SummaryCardData;
  } | null;
  categories: string[];
}

export function SummaryCards({ summaryCards, categories }: SummaryCardsProps) {
  // If summaryCards is null, render a loading/no data state
  if (!summaryCards) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {categories.map((category) => (
          <Card key={category} className="border-l-4 border-l-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {category.replace('-', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-400 mb-3">--</div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Loading data...</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <Bug className="h-5 w-5 text-red-500" />
      case 'ui-change': return <Palette className="h-5 w-5 text-blue-500" />
      case 'flaky': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'unknown': return <HelpCircle className="h-5 w-5 text-gray-500" />
      default: return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'text-red-600'
      case 'ui-change': return 'text-blue-600'
      case 'flaky': return 'text-yellow-600'
      case 'unknown': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const cards = [
    { title: 'Bug', data: summaryCards.bug, icon: 'bug', color: 'text-red-600', bgColor: 'bg-red-50' },
    { title: 'UI Change', data: summaryCards.ui_change, icon: 'ui-change', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Flaky', data: summaryCards.flaky, icon: 'flaky', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Unknown', data: summaryCards.unknown, icon: 'unknown', color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-l-4 border-l-current" style={{ borderLeftColor: getCategoryColor(card.icon).includes('red') ? '#dc2626' : getCategoryColor(card.icon).includes('blue') ? '#2563eb' : getCategoryColor(card.icon).includes('yellow') ? '#ca8a04' : '#6b7280' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-sm font-medium ${card.color}`}>
                {card.title}
              </CardTitle>
              {getCategoryIcon(card.icon)}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-3">
              {card.data.count}
            </div>
            <div className="space-y-1">
              {card.data.topTestCases.map((tc, index) => (
                <div key={tc.title} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 truncate flex-1 mr-2">{tc.title}</span>
                  <span className={`font-medium ${card.color}`}>{tc.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
