import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Profile } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { AdminUserCard } from '../components/admin/AdminUserCard'
import { AdminStats } from '../components/admin/AdminStats'
import { AdminFilters } from '../components/admin/AdminFilters'
import { AdminBulkActions } from '../components/admin/AdminBulkActions'
import { AdminCreateUser } from '../components/admin/AdminCreateUser'
import { 
  Shield, Users, Search, Plus, Download, Upload, 
  AlertTriangle, CheckCircle, XCircle, Settings,
  ArrowLeft, RefreshCw
} from 'lucide-react'
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

interface AdminFilters {
  search: string
  status: 'all' | 'active' | 'inactive' | 'unconfirmed'
  sortBy: 'created_at' | 'last_sign_in_at' | 'email'
  sortOrder: 'asc' | 'desc'
}

export function AdminPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filters, setFilters] = useState<AdminFilters>({
    search: '',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    unconfirmed: 0,
    newToday: 0
  })

  // Check if user is admin (you can implement your own admin logic)
  const isAdmin = user?.email === 'admin@SocialID.com' || 
                  user?.email === 'rouijel.nabil@gmail.com' ||
                  user?.email === 'contact@nrinfra.fr' ||
                  user?.email === 'rouijel.nabil.cp@gmail.com'
  
  console.log('🔍 AdminPage: Admin check:', {
    userEmail: user?.email,
    isAdmin: isAdmin,
    adminEmails: [
      'admin@SocialID.com',
      'rouijel.nabil@gmail.com', 
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    ]
  })

  useEffect(() => {
    console.log('🔍 AdminPage: useEffect triggered', { 
      userEmail: user?.email, 
      isAdmin, 
      hasUser: !!user 
    })
    
    if (!isAdmin) {
      console.log('❌ AdminPage: User is not admin, redirecting...')
      navigate('/dashboard')
      toast.error('Access denied: Admin privileges required')
      return
    }
    
    console.log('🔍 AdminPage: User is admin, loading users...')
    loadUsers()
  }, [isAdmin, filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      console.log('🔍 AdminPage: Loading users...')
      
      // Use AdminService to get users
      const { AdminService } = await import('../lib/adminService')
      const adminUsers = await AdminService.getAllUsers()
      
      console.log('✅ AdminPage: Users loaded:', {
        isArray: Array.isArray(adminUsers),
        length: Array.isArray(adminUsers) ? adminUsers.length : 'not array',
        type: typeof adminUsers,
        sample: Array.isArray(adminUsers) ? adminUsers[0] : adminUsers
      })
      
      // Ensure adminUsers is an array
      if (!Array.isArray(adminUsers)) {
        console.error('❌ AdminPage: adminUsers is not an array:', adminUsers)
        throw new Error('Invalid user data format received')
      }
      
      // Convert to AdminUser format
      const combinedUsers: AdminUser[] = adminUsers.map(adminUser => ({
        id: adminUser.id,
        email: adminUser.email,
        created_at: adminUser.created_at,
        last_sign_in_at: adminUser.last_sign_in_at,
        email_confirmed_at: adminUser.email_confirmed_at,
        profile: adminUser.profile,
        is_active: !adminUser.banned_until && !!adminUser.email_confirmed_at
      }))

      // Apply filters
      let filteredUsers = combinedUsers

      // Search filter
      if (filters.search) {
        console.log('🔍 AdminPage: Applying search filter:', filters.search)
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.profile?.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.profile?.display_name?.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      // Status filter
      switch (filters.status) {
        case 'active':
          filteredUsers = filteredUsers.filter(user => user.is_active)
          break
        case 'inactive':
          filteredUsers = filteredUsers.filter(user => !user.is_active)
          break
        case 'unconfirmed':
          filteredUsers = filteredUsers.filter(user => !user.email_confirmed_at)
          break
      }

      // Sort
      filteredUsers.sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (filters.sortBy) {
          case 'email':
            aValue = a.email
            bValue = b.email
            break
          case 'last_sign_in_at':
            aValue = a.last_sign_in_at || '1970-01-01'
            bValue = b.last_sign_in_at || '1970-01-01'
            break
          default:
            aValue = a.created_at
            bValue = b.created_at
        }

        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      console.log('✅ AdminPage: Filtered users ready:', filteredUsers.length)
      setUsers(filteredUsers)

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const newToday = combinedUsers.filter(user => 
        user.created_at.startsWith(today)
      ).length

      setStats({
        total: combinedUsers.length,
        active: combinedUsers.filter(user => user.is_active).length,
        inactive: combinedUsers.filter(user => !user.is_active).length,
        unconfirmed: combinedUsers.filter(user => !user.email_confirmed_at).length,
        newToday
      })

    } catch (error) {
      console.error('❌ AdminPage: Error loading users:', error)
      
      // Show more helpful error message
      if (error.message?.includes('JWT')) {
        toast.error('Admin access denied: Invalid permissions')
      } else if (error.message?.includes('network')) {
        toast.error('Network error: Please check your connection')
      } else {
        toast.error(`Failed to load users: ${error.message || 'Unknown error'}`)
      }
      
      console.log('🔍 AdminPage: Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    setUserToDelete({ id: userId, email: userEmail })
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    setActionLoading(userToDelete.id)
    setShowDeleteModal(false)

    try {
      console.log('🗑️ AdminPage: Using Edge Function to delete user:', userToDelete.email)

      // Use AdminService which now calls Edge Function
      const { AdminService } = await import('../lib/adminService')
      await AdminService.deleteUser(userToDelete.id)

      toast.success(`Utilisateur ${userToDelete.email} supprimé avec succès`)
      await loadUsers()
    } catch (error: any) {
      console.error('❌ AdminPage: Error deleting user via Edge Function:', error)
      toast.error(`❌ Erreur: ${error.message || 'Échec de la suppression'}`)
    } finally {
      setActionLoading(null)
      setUserToDelete(null)
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId)
    try {
      console.log('🔄 AdminPage: Using Edge Function to toggle user status...', { userId, currentStatus })

      const { AdminService } = await import('../lib/adminService')
      await AdminService.toggleUserBan(userId, currentStatus)

      toast.success(`Utilisateur ${currentStatus ? 'banni' : 'débanni'} avec succès`)
      await loadUsers()
    } catch (error: any) {
      console.error('Error toggling user status via Edge Function:', error)
      toast.error(`❌ Erreur: ${error.message || 'Échec de la modification du statut'}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleConfirmEmail = async (userId: string) => {
    setActionLoading(userId)
    try {
      console.log('✉️ AdminPage: Using Edge Function to confirm email for user:', userId)

      const { AdminService } = await import('../lib/adminService')
      await AdminService.confirmUserEmail(userId)

      toast.success('Email confirmé avec succès')
      await loadUsers()
    } catch (error: any) {
      console.error('Error confirming email via Edge Function:', error)
      toast.error(`❌ Erreur: ${error.message || 'Échec de la confirmation'}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkAction = async (action: string, userIds: string[]) => {
    try {
      switch (action) {
        case 'delete':
          for (const userId of userIds) {
            await handleDeleteUser(userId, users.find(u => u.id === userId)?.email || '')
          }
          break
        case 'ban':
          for (const userId of userIds) {
            await handleToggleUserStatus(userId, true)
          }
          break
        case 'unban':
          for (const userId of userIds) {
            await handleToggleUserStatus(userId, false)
          }
          break
        case 'confirm':
          for (const userId of userIds) {
            await handleConfirmEmail(userId)
          }
          break
      }
      await loadUsers()
    } catch (error) {
      throw error
    }
  }

  const exportUsers = () => {
    try {
      const csvData = users.map(user => ({
        email: user.email,
        username: user.profile?.username || '',
        display_name: user.profile?.display_name || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at || '',
        email_confirmed: user.email_confirmed_at ? 'Yes' : 'No',
        is_active: user.is_active ? 'Yes' : 'No',
        is_public: user.profile?.is_public ? 'Yes' : 'No'
      }))

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `SocialID_users_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Users exported successfully')
    } catch (error) {
      console.error('Error exporting users:', error)
      toast.error('Failed to export users')
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have admin privileges to access this page.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage SocialID users and system settings
              </p>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadUsers()}
                loading={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportUsers}
                disabled={users.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Filters */}
        <AdminFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          userCount={users.length}
        />

        {/* Bulk Actions */}
        <AdminBulkActions
          users={users}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onBulkAction={handleBulkAction}
        />

        {/* Users List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Users Management
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {users.length} user{users.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filters.search ? 'Try adjusting your search criteria.' : 'No users in the system yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <AdminUserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.includes(user.id)}
                  onSelect={(selected) => {
                    if (selected) {
                      setSelectedUsers(prev => [...prev, user.id])
                    } else {
                      setSelectedUsers(prev => prev.filter(id => id !== user.id))
                    }
                  }}
                  onDelete={handleDeleteUser}
                  onToggleStatus={handleToggleUserStatus}
                  onConfirmEmail={handleConfirmEmail}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </Card>
        
        {/* Create User Modal */}
        <AdminCreateUser
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onUserCreated={loadUsers}
        />

        {/* Delete Confirmation Modal */}
        {userToDelete && (
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false)
              setUserToDelete(null)
            }}
            onConfirm={confirmDeleteUser}
            title="Confirmer la suppression"
            message={`⚠️ ATTENTION: Suppression définitive de l'utilisateur

Email: ${userToDelete.email}
ID: ${userToDelete.id}

Cette action va supprimer:
• Le compte utilisateur
• Tous ses profils
• Tous ses liens sociaux
• Toutes ses connexions d'amis
• Toutes ses données

Cette action est IRRÉVERSIBLE.

Êtes-vous absolument sûr de vouloir continuer ?`}
            confirmText="Oui, supprimer définitivement"
            cancelText="Annuler"
            variant="danger"
            loading={actionLoading === userToDelete.id}
          />
        )}
      </div>
    </div>
  )
}