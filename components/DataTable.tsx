'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateDummyData, type DataRow } from '@/lib/dummyData'

export default function DataTable() {
  const [data, setData] = useState<DataRow[]>([])
  const [sortColumn, setSortColumn] = useState<keyof DataRow>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const itemsPerPage = 20

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setData(generateDummyData(500))
      setIsLoading(false)
    }, 500)
  }, [])

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      let comparison = 0
      if (aVal > bVal) comparison = 1
      if (aVal < bVal) comparison = -1

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredData, sortColumn, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (column: keyof DataRow) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((row) => row.id)))
    }
  }

  const handleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const handleExpandRow = (id: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const defaultColumnWidths: Record<string, number> = {
    id: 80,
    name: 180,
    email: 220,
    role: 140,
    department: 140,
    status: 100,
    salary: 120,
    startDate: 140,
    performance: 140,
  }

  const columns: { key: keyof DataRow; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' },
    { key: 'salary', label: 'Salary' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'performance', label: 'Performance' },
  ]

  // Initialize column widths on mount
  useEffect(() => {
    setColumnWidths(defaultColumnWidths)
  }, [])

  // Handle column resize
  const handleMouseDown = (columnKey: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(columnKey)
    const startX = e.clientX
    const startWidth = columnWidths[columnKey] || defaultColumnWidths[columnKey]

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX
      const newWidth = Math.max(50, startWidth + diff) // Minimum width of 50px
      setColumnWidths(prev => ({ ...prev, [columnKey]: newWidth }))
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full md:w-80 dark:bg-gray-700"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear
            </motion.button>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedRows.size} selected | {sortedData.length} total rows
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              onClick={() => setColumnWidths(defaultColumnWidths)}
            >
              Reset Columns
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => setData(generateDummyData(500))}
            >
              Refresh Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="relative" style={{ tableLayout: 'fixed', width: 'max-content' }}>
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="p-4" style={{ width: '48px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded"
                  />
                </th>
                <th className="p-4" style={{ width: '48px' }}></th>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className="relative p-4 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    style={{ width: `${columnWidths[column.key] || defaultColumnWidths[column.key]}px` }}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2 pr-4">
                      {column.label}
                      {sortColumn === column.key && (
                        <motion.span
                          initial={{ rotate: 0 }}
                          animate={{ rotate: sortDirection === 'asc' ? 0 : 180 }}
                          className="text-blue-500"
                        >
                          ▲
                        </motion.span>
                      )}
                    </div>
                    {/* Resize Handle */}
                    {index < columns.length - 1 && (
                      <div
                        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors ${
                          isResizing === column.key ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        onMouseDown={handleMouseDown(column.key)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.02 }}
                    className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      selectedRows.has(row.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="p-4" style={{ width: '48px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="p-4" style={{ width: '48px' }}>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleExpandRow(row.id)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <motion.span
                          animate={{ rotate: expandedRows.has(row.id) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          ▶
                        </motion.span>
                      </motion.button>
                    </td>
                    <td className="p-4 font-medium truncate" style={{ width: `${columnWidths.id || defaultColumnWidths.id}px` }}>{row.id}</td>
                    <td className="p-4 truncate" style={{ width: `${columnWidths.name || defaultColumnWidths.name}px` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                        <span className="truncate">{row.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm truncate" style={{ width: `${columnWidths.email || defaultColumnWidths.email}px` }} title={row.email}>{row.email}</td>
                    <td className="p-4 truncate" style={{ width: `${columnWidths.role || defaultColumnWidths.role}px` }}>{row.role}</td>
                    <td className="p-4 truncate" style={{ width: `${columnWidths.department || defaultColumnWidths.department}px` }}>{row.department}</td>
                    <td className="p-4" style={{ width: `${columnWidths.status || defaultColumnWidths.status}px` }}>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : row.status === 'Inactive'
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {row.status}
                      </motion.span>
                    </td>
                    <td className="p-4 truncate" style={{ width: `${columnWidths.salary || defaultColumnWidths.salary}px` }}>${row.salary.toLocaleString()}</td>
                    <td className="p-4 text-sm truncate" style={{ width: `${columnWidths.startDate || defaultColumnWidths.startDate}px` }}>{row.startDate}</td>
                    <td className="p-4" style={{ width: `${columnWidths.performance || defaultColumnWidths.performance}px` }}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${row.performance}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className={`h-full rounded-full ${
                              row.performance >= 80
                                ? 'bg-green-500'
                                : row.performance >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="text-sm font-medium w-10">{row.performance}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Expanded Row Content */}
        <AnimatePresence>
          {Array.from(expandedRows).map((id) => {
            const row = paginatedData.find((r) => r.id === id)
            if (!row) return null

            return (
              <motion.div
                key={`expanded-${id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Projects</h4>
                    <p className="mt-1">{row.projects} active</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Tasks</h4>
                    <p className="mt-1">{row.tasks} completed</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Team Size</h4>
                    <p className="mt-1">{row.teamSize} members</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Location</h4>
                    <p className="mt-1">{row.location}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            })}

            {totalPages > 5 && <span className="px-2">...</span>}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}