"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface ErrorDataPoint {
  date: string
  category_key?: string
  display_name?: string
  error_message?: string
  count: number
}

interface ErrorAreaChartProps {
  data?: ErrorDataPoint[]
}

const sampleData: ErrorDataPoint[] = [
  { date: "2024-01-15", error_message: "Element not found: #submit-button", count: 5 },
  { date: "2024-01-15", error_message: "Timeout: waiting for element to be visible", count: 3 },
  { date: "2024-01-15", error_message: "Assertion failed: expected true to be false", count: 2 },
  { date: "2024-01-16", error_message: "Element not found: #submit-button", count: 2 },
  { date: "2024-01-16", error_message: "Timeout: waiting for element to be visible", count: 8 },
  { date: "2024-01-17", error_message: "Element not found: #submit-button", count: 6 },
  { date: "2024-01-17", error_message: "Network error: ECONNRESET", count: 3 },
  { date: "2024-01-18", error_message: "Timeout: waiting for element to be visible", count: 4 },
  { date: "2024-01-18", error_message: "Assertion failed: expected true to be false", count: 5 },
  { date: "2024-01-19", error_message: "Network error: ECONNRESET", count: 4 },
  { date: "2024-01-19", error_message: "Timeout: waiting for element to be visible", count: 2 },
]

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate)
  const month = d.toLocaleDateString(undefined, { month: "short" })
  const day = d.getDate()
  return `${month} ${String(day).padStart(2, "0")}`
}

export function ErrorAreaChart({ data }: ErrorAreaChartProps) {
  const points = (data && data.length > 0 ? data : sampleData)
    // Map new backend schema to legacy shape for chart processing
    .map(p => ({
      date: p.date,
      error_message: p.error_message || p.display_name || p.category_key || 'Unknown',
      count: p.count,
    }))

  const uniqueErrors = useMemo(() => {
    const set = new Set<string>()
    points.forEach(p => set.add(p.error_message))
    return Array.from(set)
  }, [points])

  const rows = useMemo(() => {
    const byDate = new Map<string, Record<string, number>>()
    points.forEach(p => {
      const entry = byDate.get(p.date) || {}
      entry[p.error_message] = (entry[p.error_message] ?? 0) + p.count
      byDate.set(p.date, entry)
    })
    
    // Preserve the chronological order from the API by using the order from points
    const dateOrder = Array.from(new Set(points.map(p => p.date)))
    
    return dateOrder.map(date => {
      const counts = byDate.get(date) || {}
      const row: Record<string, unknown> = { date, label: date } // Use original date format as label
      uniqueErrors.forEach(err => { row[err] = counts[err] ?? 0 })
      return row
    })
  }, [points, uniqueErrors])

  // Count range filter (half-open intervals [min, max))
  const ranges = [
    { id: "all", label: "All counts", min: 0, max: Number.POSITIVE_INFINITY },
    { id: "0-9", label: "0–9", min: 0, max: 10 },
    { id: "10-19", label: "10–19", min: 10, max: 20 },
    { id: "20-29", label: "20–29", min: 20, max: 30 },
    { id: "30-49", label: "30–49", min: 30, max: 50 },
    { id: "50+", label: "50+", min: 50, max: Number.POSITIVE_INFINITY },
  ] as const
  const [rangeId, setRangeId] = useState<(typeof ranges)[number]["id"]>("all")
  const activeRange = ranges.find(r => r.id === rangeId) ?? ranges[0]
  const inRange = (v: number) => v >= activeRange.min && v < activeRange.max

  const filteredRows = useMemo(() => {
    if (activeRange.id === "all") return rows
    return rows.map((r) => {
      const next: Record<string, unknown> = { ...r }
      uniqueErrors.forEach(err => {
        const v = Number((r as any)[err] ?? 0)
        next[err] = inRange(v) ? v : 0
      })
      return next
    })
  }, [rows, uniqueErrors, activeRange])

  // Multi-select of error messages (max 10). Empty selection means "all".
  const totals = useMemo(() => {
    const m = new Map<string, number>()
    rows.forEach(r => uniqueErrors.forEach(err => {
      const v = Number((r as any)[err] ?? 0)
      m.set(err, (m.get(err) ?? 0) + v)
    }))
    return m
  }, [rows, uniqueErrors])

  const [selected, setSelected] = useState<string[]>([])
  function toggleError(err: string, checked: boolean) {
    setSelected(prev => {
      if (checked) {
        if (prev.includes(err)) return prev
        if (prev.length >= 10) return prev
        return [...prev, err]
      }
      return prev.filter(e => e !== err)
    })
  }

  const effectiveErrors = selected.length > 0 ? selected : uniqueErrors

  const visibleErrors = useMemo(() => {
    return effectiveErrors.filter(err => filteredRows.some(r => Number((r as any)[err] ?? 0) > 0))
  }, [effectiveErrors, filteredRows])

  const colors = [
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#e11d48", // rose-600
    "#a855f7", // purple-500
  ]

  const colorFor = (name: string) => colors[Math.abs(hashString(name)) % colors.length]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Error messages over time</CardTitle>
          <CardDescription>Stacked area by error message (fake data)</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Count range</span>
          <Select value={rangeId} onValueChange={(v) => setRangeId(v as any)}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="All counts" />
            </SelectTrigger>
            <SelectContent>
              {ranges.map(r => (
                <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8">Errors ({selected.length > 0 ? selected.length : 'all'})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-[320px] overflow-auto">
              <DropdownMenuLabel>Select errors (max 10)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[...uniqueErrors].sort((a,b)=> (totals.get(b) ?? 0) - (totals.get(a) ?? 0)).map(err => {
                const disabled = !selected.includes(err) && selected.length >= 10
                const color = colorFor(err)
                return (
                  <DropdownMenuCheckboxItem
                    key={err}
                    checked={selected.includes(err)}
                    disabled={disabled}
                    onCheckedChange={(c) => toggleError(err, Boolean(c))}
                  >
                    <span className="inline-block h-2.5 w-2.5 rounded-sm mr-2" style={{ backgroundColor: color }} />
                    <span className="truncate" title={err}>{err}</span>
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredRows} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <defs>
                {visibleErrors.map((err) => {
                  const c = colorFor(err)
                  const id = `grad-${slugify(err)}`
                  return (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={c} stopOpacity={0.05} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <Tooltip content={<StackedTooltip />} />
              {visibleErrors.map((err) => (
                <Area
                  key={err}
                  type="monotone"
                  dataKey={err}
                  stackId="1"
                  stroke={colorFor(err)}
                  fill={`url(#grad-${slugify(err)})`}
                  strokeWidth={1.5}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function StackedTooltip({ active, payload, label, hideSeriesNames = false }: any) {
  if (!active || !payload || payload.length === 0) return null
  const items = payload
    .filter((p: any) => typeof p.value === "number" && p.value > 0)
    .sort((a: any, b: any) => b.value - a.value)
  const total = items.reduce((acc: number, p: any) => acc + (p.value as number), 0)
  return (
    <div className="rounded-md border bg-white shadow p-2 text-xs">
      <div className="font-medium mb-1">{label}</div>
      <div className="space-y-0.5">
        {items.map((it: any) => (
          <div key={it.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: it.color }} />
              <span className="truncate max-w-[220px]" title={String(it.dataKey)}>{String(it.dataKey)}</span>
            </div>
            <span className="tabular-nums">{it.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 pt-1 border-t text-gray-700">Total: {total}</div>
    </div>
  )
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i)
  return h | 0
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

export type { ErrorDataPoint }


