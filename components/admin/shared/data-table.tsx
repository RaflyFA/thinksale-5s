"use client"

import { useState, useMemo } from "react"
import { Search, ChevronUp, ChevronDown, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { TableState } from "@/lib/types/admin"

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  tableState: TableState
  onTableStateChange: (updates: Partial<TableState>) => void
  searchPlaceholder?: string
  filters?: {
    key: string
    label: string
    options: { value: string; label: string }[]
  }[]
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  tableState,
  onTableStateChange,
  searchPlaceholder = "Search...",
  filters = [],
  emptyMessage = "No data available",
  className = ""
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState(tableState.search)

  // Debounced search
  const handleSearch = (value: string) => {
    setSearchValue(value)
    onTableStateChange({ search: value, page: 1 })
  }

  // Handle sorting
  const handleSort = (key: string) => {
    const newSortOrder = tableState.sortBy === key && tableState.sortOrder === 'asc' ? 'desc' : 'asc'
    onTableStateChange({ sortBy: key, sortOrder: newSortOrder })
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    onTableStateChange({
      filters: { ...tableState.filters, [key]: value },
      page: 1
    })
  }

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (tableState.search) {
      const searchLower = tableState.search.toLowerCase()
      filtered = filtered.filter((item: any) =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      )
    }

    // Apply custom filters
    Object.entries(tableState.filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: any) => item[key] === value)
      }
    })

    // Apply sorting
    if (tableState.sortBy) {
      filtered = [...filtered].sort((a: any, b: any) => {
        const aValue = a[tableState.sortBy]
        const bValue = b[tableState.sortBy]

        if (aValue < bValue) return tableState.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return tableState.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, tableState.search, tableState.filters, tableState.sortBy, tableState.sortOrder])

  // Pagination
  const startIndex = (tableState.page - 1) * tableState.limit
  const endIndex = startIndex + tableState.limit
  const paginatedData = processedData.slice(startIndex, endIndex)
  const totalPages = Math.ceil(processedData.length / tableState.limit)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          {filters.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={tableState.filters[filter.key] || ""}
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {processedData.length} of {data.length} items
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width }}
                  className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && tableState.sortBy === column.key && (
                      tableState.sortOrder === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {tableState.page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTableStateChange({ page: tableState.page - 1 })}
              disabled={tableState.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTableStateChange({ page: tableState.page + 1 })}
              disabled={tableState.page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 