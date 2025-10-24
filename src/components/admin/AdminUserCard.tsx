import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Profile } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { User, Mail, Calendar, Clock, Eye, EyeOff, CreditCard as Edit, Trash2, Shield, ShieldOff, CheckCircle, ExternalLink, Settings, AlertTriangle, Square, CheckSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  profile?: Profile
  is_active: boolean
}

interface AdminUserCardProps {
  user: AdminUser
  isSelected?: boolean
  onSelect?: (selected: boolean) => void
  onDelete: (userId: string, userEmail: string) => void
  onToggleStatus: (userId: string, currentStatus: boolean) => void
  onConfirmEmail: (userId: string) => void
  actionLoading: string | null
}

export function AdminUserCard({
  user,
  isSelected = false,
  onSelect,
  onDelete,
  onToggleStatus,
  onConfirmEmail,
  actionLoading
}: AdminUserCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    email: user.email,
    username: user.profile?.username || '',
    displayName: user.profile?.display_name || '',
    bio: user.profile?.bio || '',
    isPublic: user.profile?.is_public ?? true
  })
  const [editLoading, setEditLoading] = useState(false)

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)

    try {
      // Update auth user email if changed
      if (editData.email !== user.email) {
        const { error: emailError } = await supabase.auth.admin.updateUserById(user.id, {
          email: editData.email
        })
        if (emailError) throw emailError
      }

      // Update profile if exists
      if (user.profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            username: editData.username.toLowerCase(),
            display_name: editData.displayName,
            bio: editData.bio,
            is_public: editData.isPublic
          })
          .eq('id', user.id)

        if (profileError) throw profileError
      }

      toast.success('User updated successfully')
      setShowEditModal(false)
      // Trigger parent refresh
      window.location.reload()
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
    } finally {
      setEditLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = () => {
    if (!user.email_confirmed_at) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
          <Mail className="w-3 h-3 mr-1" />
          Unconfirmed
        </span>
      )
    }
    
    if (user.is_active) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">
        <ShieldOff className="w-3 h-3 mr-1" />
        Banned
      </span>
    )
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect?.(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
          </div>

          {/* User Info */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              {user.profile?.avatar_url ? (
                <img 
                  src={user.profile.avatar_url} 
                  alt={user.profile.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold">
                  {user.profile?.display_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.profile?.display_name || 'No Profile'}
                </h3>
                {getStatusBadge()}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                {user.profile?.username && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>@{user.profile.username}</span>
                    {user.profile.is_public ? (
                      <Eye className="w-3 h-3 text-green-600" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(user.created_at)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Last sign in: {formatDate(user.last_sign_in_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 lg:flex-col lg:w-auto">
            <div className="flex space-x-2">
              {user.profile?.username && (
                <Link to={`/u/${user.profile.username}`} target="_blank">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="flex space-x-2">
              {!user.email_confirmed_at && (
                <Button
                  size="sm"
                  onClick={() => onConfirmEmail(user.id)}
                  loading={actionLoading === user.id}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Email
                </Button>
              )}
              
              <Button
                size="sm"
                variant={user.is_active ? "outline" : "secondary"}
                onClick={() => onToggleStatus(user.id, user.is_active)}
                loading={actionLoading === user.id}
              >
                {user.is_active ? (
                  <>
                    <ShieldOff className="w-4 h-4 mr-2" />
                    Ban
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Unban
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(user.id, user.email)}
                loading={actionLoading === user.id}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Edit User"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> Changing email or username may affect user's ability to sign in.
              </p>
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            value={editData.email}
            onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
          />

          <Input
            label="Username"
            value={editData.username}
            onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
            helperText="Will be converted to lowercase"
          />

          <Input
            label="Display Name"
            value={editData.displayName}
            onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="User bio..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={editData.isPublic}
              onChange={(e) => setEditData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Public profile
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" loading={editLoading} className="flex-1">
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}