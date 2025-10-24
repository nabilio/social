import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, Mail } from 'lucide-react'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'email'
  title: string
  message?: string
  onClose: () => void
}

export function Toast({ type, title, message, onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    email: Mail,
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    email: 'bg-purple-50 border-purple-200 text-purple-800',
  }

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    email: 'text-purple-400',
  }

  const Icon = icons[type]

  return (
    <div className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${colors[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColors[type]}`} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}