"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FailureItem {
  testName: string
  specFile: string
  branch: string
  testRunIds: string
  totalFailures: number
}

interface PersistentEmergingTablesProps {
  failuresTable: {
    persistentFailures: FailureItem[]
    emergingFailures: FailureItem[]
    allFailures: FailureItem[]
  } | null
}

export function PersistentEmergingTables({ failuresTable }: PersistentEmergingTablesProps) {
  const [failureTypeFilter, setFailureTypeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Transform the data into a unified format
  const unifiedFailures: (FailureItem & { priority: 'critical' | 'medium' | 'low'; failureType: 'persistent' | 'emerging' })[] = [
    // Transform persistent failures
    ...(failuresTable?.persistentFailures?.map(failure => ({ ...failure, priority: 'critical' as const, failureType: 'persistent' as const })) || []),
    // Transform emerging failures
    ...(failuresTable?.emergingFailures?.map(failure => ({ ...failure, priority: 'medium' as const, failureType: 'emerging' as const })) || [])
  ]

  // Filter data based on selected failure type
  const filteredFailures = failureTypeFilter === 'all' 
    ? unifiedFailures 
    : unifiedFailures.filter(failure => failure.failureType === failureTypeFilter)

  // Pagination
  const totalPages = Math.ceil(filteredFailures.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFailures = filteredFailures.slice(startIndex, endIndex)

  const getFailureTypeBadge = (failure: FailureItem & { failureType: 'persistent' | 'emerging' }) => {
    if (failure.failureType === 'persistent') {
      return <Badge variant="destructive" className="text-xs">Persistent failure</Badge>
    } else {
      return <Badge variant="secondary" className="text-xs">Emerging failure</Badge>
    }
  }

  const formatTestRunIds = (testRunIds: string) => {
    // Parse the testRunIds string like "#125 #126 #127 #128 +5"
    const parts = testRunIds.split(' ')
    const ids = parts.filter(part => part.startsWith('#'))
    const countPart = parts.find(part => part.startsWith('+'))
    
    if (ids.length <= 3) return testRunIds
    return `${ids.slice(0, 3).join(' ')} +${countPart ? countPart.substring(1) : ids.length - 3}`
  }

  const formatBranch = (branch: string) => {
    if (branch.length > 25) {
      return `${branch.substring(0, 25)}... +6`
    }
    return branch
  }

  const getBranchTooltip = (branch: string) => {
    if (branch.length > 25) {
      return `${branch} (and 6 more branches)`
    }
    return branch
  }

  const getTestRunTooltip = (testRunIds: string) => {
    return testRunIds
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Emerging Failures</CardTitle>
            <CardDescription>Top optimization targets by execution time</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={failureTypeFilter} onValueChange={setFailureTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Failure trends" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All failures</SelectItem>
                <SelectItem value="persistent">Persistent failures</SelectItem>
                <SelectItem value="emerging">Emerging failures</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentPage} / {totalPages}</span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Test Name</TableHead>
              <TableHead className="w-[20%]">Branch</TableHead>
              <TableHead className="w-[20%]">Test Run ID</TableHead>
              <TableHead className="w-[20%]">Failure trends</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFailures.map((failure, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{failure.testName}</div>
                    {failure.specFile && (
                      <div className="text-xs text-gray-500 font-mono">{failure.specFile}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div 
                    className="text-sm text-gray-700 cursor-help"
                    title={getBranchTooltip(failure.branch)}
                  >
                    {formatBranch(failure.branch)}
                  </div>
                </TableCell>
                <TableCell>
                  <div 
                    className="text-sm text-gray-700 font-mono cursor-help"
                    title={getTestRunTooltip(failure.testRunIds)}
                  >
                    {formatTestRunIds(failure.testRunIds)}
                  </div>
                </TableCell>
                <TableCell>
                  {getFailureTypeBadge(failure)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredFailures.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No failures found for the selected filter
          </div>
        )}
      </CardContent>
    </Card>
  )
}


