import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { 
  Trash2, Shield, ShieldOff, Mail, Download,
  AlertTriangle, CheckSquare, Square
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  email: string
  profile?: {
    username: string
    display_name: string
  }
  is_active: boolean
}

interface AdminBulkActionsProps {
  users: AdminUser[]
  selectedUsers: string[]
  onSelectionChange: (userIds: string[]) => void
  onBulkAction: (action: string, userIds: string[]) => Promise<void>
}

export function AdminBulkActions({ 
  users, 
  selectedUsers, 
  onSelectionChange, 
  onBulkAction 
}: AdminBulkActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState<{
    action: string
    title: string
    message: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(users.map(u => u.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected')
      return
    }

    let title = ''
    let message = ''

    switch (action) {
      case 'delete':
        title = 'Delete Selected Users'
        message = `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone and will remove all their data.`
        break
      case 'ban':
        title = 'Ban Selected Users'
        message = `Are you sure you want to ban ${selectedUsers.length} user(s)? They will not be able to sign in.`
        break
      case 'unban':
        title = 'Unban Selected Users'
        message = `Are you sure you want to unban ${selectedUsers.length} user(s)? They will be able to sign in again.`
        break
      case 'confirm':
        title = 'Confirm Selected Users'
        message = `Are you sure you want to confirm the email addresses of ${selectedUsers.length} user(s)?`
        break
      default:
        return
    }

    setShowConfirmModal({ action, title, message })
  }

  const confirmBulkAction = async () => {
    if (!showConfirmModal) return

    setLoading(true)
    try {
      await onBulkAction(showConfirmModal.action, selectedUsers)
      onSelectionChange([]) // Clear selection
      setShowConfirmModal(null)
      toast.success(`Bulk ${showConfirmModal.action} completed successfully`)
    } catch (error: any) {
      console.error('Bulk action error:', error)
      toast.error(error.message || `Failed to ${showConfirmModal.action} users`)
    } finally {
      setLoading(false)
    }
  }

  if (users.length === 0) return null

  const allSelected = selectedUsers.length === users.length
  const someSelected = selectedUsers.length > 0

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Selection */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                {allSelected ? 'Deselect All' : 'Select All'}
              </span>
            </button>
            
            {someSelected && (
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>

          {/* Bulk Actions */}
          {someSelected && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('confirm')}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Confirm Emails
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('ban')}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <ShieldOff className="w-4 h-4 mr-2" />
                Ban Users
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('unban')}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Unban Users
              </Button>
              
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Users
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!showConfirmModal}
        onClose={() => setShowConfirmModal(null)}
        title={showConfirmModal?.title || ''}
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-red-800 dark:text-red-200 text-sm">
                {showConfirmModal?.message}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Selected Users:
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedUsers.map(userId => {
                const user = users.find(u => u.id === userId)
                return (
                  <div key={userId} className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email} {user?.profile?.username && `(@${user.profile.username})`}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="danger"
              onClick={confirmBulkAction}
              loading={loading}
              className="flex-1"
            >
              Confirm {showConfirmModal?.action}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(null)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}