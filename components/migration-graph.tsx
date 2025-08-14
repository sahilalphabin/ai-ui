"use client"

import { useMemo, useState } from "react"
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
  const [hoveredGroup, setHoveredGroup] = useState<{
    runId: string
    date: string
    items: Array<{ name: string; meta: any; color: string }>
  } | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return '#ef4444'
      case 'ui-change': return '#3b82f6'
      case 'flaky': return '#eab308'
      case 'unknown': return '#6b7280'
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
    run.testCases.forEach((tc: any) => {
      const idx = categories.indexOf(tc.category)
      const y = idx * 100 + tc.percentage
      row[tc.testName] = y
      row[`meta:${tc.testName}`] = { ...tc, testRunId: run.testRunId, date: run.date, branch: run.branch }
    })
    return row
  })

  // Build fast lookup from runId to index
  const runIdToIndex = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((row: any, idx: number) => map.set(row.runId, idx))
    return map
  }, [data])

  // Precompute collisions per run row
  const collisions = useMemo(() => {
    return data.map((row: any) => {
      const groups = new Map<number, string[]>()
      linesToShow.forEach((name) => {
        const v = row?.[name]
        if (typeof v !== 'number') return
        const arr = groups.get(v) || []
        arr.push(name)
        groups.set(v, arr)
      })
      groups.forEach((arr) => arr.sort())
      return groups
    })
  }, [data, linesToShow])

  function computeClusterOffsets(count: number): Array<{ dx: number; dy: number }> {
    if (count <= 1) return [{ dx: 0, dy: 0 }]
    if (count === 2) return [{ dx: -6, dy: 0 }, { dx: 6, dy: 0 }]
    if (count === 3) return [{ dx: -6, dy: 0 }, { dx: 6, dy: 0 }, { dx: 0, dy: 6 }]
    if (count === 4) return [{ dx: -7, dy: 0 }, { dx: 7, dy: 0 }, { dx: 0, dy: -7 }, { dx: 0, dy: 7 }]
    const radius = 8
    const result: Array<{ dx: number; dy: number }> = []
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count
      result.push({ dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius })
    }
    return result
  }

  const bandAreas = categories.map((c, i) => ({
    y1: i * 100,
    y2: (i + 1) * 100,
    color: getCategoryColor(c),
    label: c.replace('-', ' ')
  }))

  // Y ticks: show only band starts (0, 100, 200, ...) for category labels
  const yTicks = categories.map((_, i) => i * 100)

  // Y tick: category label only
  const Tick = ({ x, y, payload }: any) => {
    const i = Math.floor(payload.value / 100)
    const label = categories[i] ? categories[i].replace('-', ' ') : ''
    return (
      <g transform={`translate(${x - 10},${y})`}>
        <text dy={4} textAnchor="end" className="fill-gray-700 text-[11px] font-medium">{label}</text>
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

  // Tooltip shows ALL tests in the hovered collision group
  const CustomTooltip = ({ active }: any) => {
    if (!active || !hoveredGroup) return null
    return (
      <div className="rounded-md border bg-white shadow-md p-3 max-w-[340px]">
        <div className="text-xs font-medium mb-1">Test Run: {hoveredGroup.runId}</div>
        <div className="text-xs text-gray-500 mb-2">{hoveredGroup.date}</div>
        <div className="space-y-2">
          {hoveredGroup.items.map(({ name, meta, color }) => (
            <div key={name} className="text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-medium truncate" title={name}>{name}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1 text-[11px] text-gray-700">
                <div>Category: {meta.category.replace('-', ' ')}</div>
                <div>Position: {meta.percentage}%</div>
                <div>Branch: {meta.branch}</div>
                <div>Duration: {meta.duration}</div>
                <div className="col-span-2 truncate" title={meta.error}>Error: {meta.error}</div>
              </div>
            </div>
          ))}
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

              {linesToShow.map((tc: string) => (
                <Line
                  key={tc}
                  type="monotone"
                  dataKey={tc}
                  stroke={getTestCaseColor(tc)}
                  strokeWidth={1.2}
                  activeDot={false}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props
                    const value = payload?.[tc]
                    if (value == null || !Number.isFinite(cx) || !Number.isFinite(cy)) return <g key={`empty-${tc}-${payload?.index}`} />

                    const runId = payload?.runId as string
                    const rowIndex = runIdToIndex.get(runId) ?? 0
                    const group = collisions[rowIndex]?.get(value) || []

                    if (group.length <= 1) {
                      const meta = payload?.[`meta:${tc}`]
                      const color = getTestCaseColor(tc)
                      const enter = () => meta && setHoveredGroup({
                        runId: payload?.runId,
                        date: payload?.date,
                        items: [{ name: tc, meta, color }],
                      })
                      const leave = () => setHoveredGroup(null)
                      return (
                        <circle
                          key={`${tc}-${rowIndex}-${cx}-${cy}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={1}
                          onMouseEnter={enter}
                          onMouseMove={enter}
                          onMouseLeave={leave}
                        />
                      )
                    }

                    const anchor = group[0]
                    if (tc !== anchor) return <g key={`skip-${tc}-${rowIndex}`} />

                    const offsets = computeClusterOffsets(group.length)
                    const items = group.map((name) => ({ name, meta: payload?.[`meta:${name}`], color: getTestCaseColor(name) }))
                    const enterGroup = () => setHoveredGroup({ runId: payload?.runId, date: payload?.date, items })
                    const leaveGroup = () => setHoveredGroup(null)
                    return (
                      <g key={`cluster-${rowIndex}-${value}`} onMouseEnter={enterGroup} onMouseMove={enterGroup} onMouseLeave={leaveGroup} style={{ pointerEvents: 'all' }}>
                        {group.map((name, i) => {
                          const { dx, dy } = offsets[i]
                          const color = getTestCaseColor(name)
                          return (
                            <circle
                              key={`pt-${name}-${rowIndex}`}
                              cx={cx + dx}
                              cy={cy + dy}
                              r={5}
                              fill={color}
                              stroke="#fff"
                              strokeWidth={1}
                            />
                          )
                        })}
                      </g>
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
