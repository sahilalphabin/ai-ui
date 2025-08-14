"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from "recharts"

interface MigrationGraphProps {
  testData: any[]
  categories: string[]
  selectedTestCase: string
  allTestCases: string[]
  filteredData: any[]
}

export function MigrationGraph({ testData, categories, selectedTestCase, allTestCases, filteredData }: MigrationGraphProps) {
  const [hoveredDot, setHoveredDot] = useState<{ name: string; meta: any } | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Bug': return '#ef4444'
      case 'UI-Change': return '#3b82f6'
      case 'Flaky': return '#eab308'
      case 'Unknown': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getTestCaseColor = (testName: string) => {
    const colors = [
      '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
      '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
      '#10b981', '#059669', '#0d9488', '#0891b2', '#0ea5e9',
      '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
      '#f97316', '#fb923c', '#fbbf24', '#fde047', '#bef264'
    ]
    const index = allTestCases.indexOf(testName) % colors.length
    return colors[index]
  }

  // Only render on client side
  if (typeof window === 'undefined') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Failure Category Migration Graph</CardTitle>
          <CardDescription>
            Interactive visualization showing how test cases migrate between failure categories across test runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[560px] bg-white rounded-lg border overflow-hidden">
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading chart...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare recharts-friendly data and helpers
  const runDomainMax = categories.length * 100
  const linesToShow = (selectedTestCase === "All" ? allTestCases.slice(1) : [selectedTestCase]) as string[]

  const data = filteredData.map(run => {
    const row: any = { runId: run.testRunId, name: run.testRunId, date: run.date }
    run.testCases.forEach(tc => {
      const idx = categories.indexOf(tc.category)
      const y = idx * 100 + tc.percentage
      row[tc.testName] = y
      row[`meta:${tc.testName}`] = { ...tc, testRunId: run.testRunId, date: run.date, branch: run.branch }
    })
    return row
  })

  const bandAreas = categories.map((c, i) => ({
    y1: i * 100,
    y2: (i + 1) * 100,
    color: getCategoryColor(c),
    label: c.replace('-', ' ')
  }))

  // Y ticks: show only band starts (0, 100, 200, ...) for category labels
  const yTicks = categories.map((_, i) => i * 100)

  // Y tick: category label + 0% under it except last band (we can add 50% as reference lines)
  const Tick = ({ x, y, payload }: any) => {
    const i = Math.floor(payload.value / 100)
    const label = categories[i] ? categories[i].replace('-', ' ') : ''
    return (
      <g transform={`translate(${x - 10},${y})`}>
        <text dy={-2} textAnchor="end" className="fill-gray-700 text-[11px] font-medium">{label}</text>
        <text dy={12} textAnchor="end" className="fill-gray-500 text-[10px]">0%</text>
      </g>
    )
  }

  const XTick = ({ x, y, payload }: any) => {
    const row = data[payload.index]
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={14} textAnchor="middle" className="fill-gray-700 text-[11px]">
          {row?.name}
        </text>
        <text dy={28} textAnchor="middle" className="fill-gray-500 text-[10px]">
          {row?.date}
        </text>
      </g>
    )
  }

  // Tooltip shows ONLY the hovered dot's series item
  const CustomTooltip = ({ active }: any) => {
    const meta = hoveredDot?.meta
    if (!active || !hoveredDot || !meta) return null
    return (
      <div className="rounded-md border bg-white shadow-md p-3">
        <div className="text-xs font-medium mb-1">Test Run: {meta.testRunId}</div>
        <div className="text-xs mb-1">{hoveredDot.name}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div>Category: {meta.category.replace('-', ' ')}</div>
          <div>Position: {meta.percentage}%</div>
          <div>Branch: {meta.branch}</div>
          <div>Duration: {meta.duration}</div>
          <div className="col-span-2 truncate">Error: {meta.error}</div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Failure Category Migration Graph</CardTitle>
        <CardDescription>
          Interactive visualization showing how test cases migrate between failure categories across test runs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[560px] bg-white rounded-lg border overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 24, right: 24, left: 24, bottom: 48 }}>
              {/* Bands */}
              {bandAreas.map((b, i) => (
                <ReferenceArea key={i} y1={b.y1} y2={b.y2} fill={b.color} fillOpacity={0.04} strokeOpacity={0} />
              ))}

              {/* Keep only midline (50%) inside each band for clarity */}
              {categories.map((_, i) => (
                <ReferenceLine key={`ref-${i}-50`} y={i * 100 + 50} stroke="#E5E7EB" strokeDasharray="3 3" strokeWidth={1} />
              ))}

              {/* Axes */}
              <CartesianGrid vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={<XTick />} interval={0} tickLine={false} axisLine={{ stroke: '#111827', strokeWidth: 1 }} height={50} />
              <YAxis domain={[0, runDomainMax]} ticks={yTicks} tick={<Tick />} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} width={70} interval={0} allowDecimals={false} />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94A3B8', strokeDasharray: '4 4' }} />

              {linesToShow.map(tc => (
                <Line
                  key={tc}
                  type="monotone"
                  dataKey={tc}
                  stroke={getTestCaseColor(tc)}
                  strokeWidth={1.2}
                  activeDot={false}
                  dot={(props: any) => {
                    const { cx, cy, payload, stroke } = props
                    const value = payload?.[tc]
                    if (value == null || !Number.isFinite(cx) || !Number.isFinite(cy)) return <g key={`empty-${tc}-${payload?.index}`} />
                    const meta = payload?.[`meta:${tc}`]
                    const handleEnter = () => meta && setHoveredDot({ name: tc, meta })
                    const handleLeave = () => setHoveredDot(null)
                    return (
                      <circle 
                        key={`${tc}-${payload?.index}-${cx}-${cy}`}
                        cx={cx} 
                        cy={cy} 
                        r={5} 
                        fill={stroke} 
                        stroke="#fff" 
                        strokeWidth={1} 
                        onMouseEnter={handleEnter} 
                        onMouseMove={handleEnter} 
                        onMouseLeave={handleLeave} 
                      />
                    )
                  }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
