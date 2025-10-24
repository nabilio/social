import React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'success' | 'info'
  loading?: boolean
  logo?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
  logo = false
}: ConfirmModalProps) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <XCircle className="w-12 h-12 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-12 h-12 text-yellow-600" />
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />
      case 'info':
        return <Info className="w-12 h-12 text-blue-600" />
    }
  }

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
      case 'warning':
        return 'danger'
      case 'success':
        return 'primary'
      case 'info':
        return 'primary'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          {getIcon()}
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={onConfirm}
            loading={loading}
            className="flex-1 order-1 sm:order-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
