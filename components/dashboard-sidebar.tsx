"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings as SettingsIcon, TestTube, GitPullRequest, Brain, TrendingUp, MessageCircle } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/insights") return pathname === "/insights"
  return pathname.startsWith(href)
}

export function DashboardSidebar() {
  const pathname = usePathname()

  const dashboardItems: NavItem[] = [
    { href: "/test-runs", label: "Test Runs", icon: <TestTube className="mr-3 h-4 w-4" /> },
    { href: "/pull-requests", label: "Pull Requests", icon: <GitPullRequest className="mr-3 h-4 w-4" /> },
  ]
  const insightsItems: NavItem[] = [
    { href: "/insights", label: "AI Insights", icon: <Brain className="mr-3 h-4 w-4" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart3 className="mr-3 h-4 w-4" /> },
  ]
  const generalItems: NavItem[] = [
    { href: "/settings", label: "Settings", icon: <SettingsIcon className="mr-3 h-4 w-4" /> },
    { href: "/assistant", label: "Assistant", icon: <MessageCircle className="mr-3 h-4 w-4" /> },
    { href: "/test-runs/insight", label: "Test Run Insights", icon: <TrendingUp className="mr-3 h-4 w-4" /> },
  ]

  function Section({ title, items }: { title: string; items: NavItem[] }) {
    return (
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
        <div className="space-y-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link key={item.href} href={item.href} className="block">
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={`w-full justify-start ${active ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : ""}`}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦕</span>
          <span className="text-xl font-semibold text-gray-900">Testdino</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-6">
        <Section title="Dashboard" items={dashboardItems} />
        <Section title="Insights" items={insightsItems} />
        <Section title="General" items={generalItems} />
      </nav>
    </div>
  )
}


