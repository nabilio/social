import React from 'react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Search, Filter } from 'lucide-react'

interface AdminFiltersProps {
  filters: {
    search: string
    status: 'all' | 'active' | 'inactive' | 'unconfirmed'
    sortBy: 'created_at' | 'last_sign_in_at' | 'email'
    sortOrder: 'asc' | 'desc'
  }
  onFiltersChange: (filters: any) => void
  userCount: number
}

export function AdminFilters({ filters, onFiltersChange, userCount }: AdminFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters & Search
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="unconfirmed">Unconfirmed Only</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="created_at">Sort by Created Date</option>
            <option value="last_sign_in_at">Sort by Last Sign In</option>
            <option value="email">Sort by Email</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {userCount} user{userCount !== 1 ? 's' : ''}
          {filters.search && ` matching "${filters.search}"`}
          {filters.status !== 'all' && ` with status "${filters.status}"`}
        </p>
      </div>
    </Card>
  )
}