import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, UserProfile } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ArrowLeft, Save, Trash2, CreditCard as Edit2, Check, X, Eye, EyeOff, Star } from 'lucide-react'
import toast from 'react-hot-toast'

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Delete",
  requiresTyping = false,
  requiredText = "DELETE"
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  requiresTyping?: boolean
  requiredText?: string
}) {
  const [typedText, setTypedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (requiresTyping && typedText !== requiredText) {
      toast.error(`Please type "${requiredText}" to confirm`)
      return
    }
    
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTypedText('')
    onClose()
  }

  const canConfirm = !requiresTyping || typedText === requiredText

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm whitespace-pre-line">
            {message}
          </p>
        </div>
        
        {requiresTyping && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type "{requiredText}" to confirm:
            </label>
            <Input
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={requiredText}
              autoFocus
            />
          </div>
        )}
        
        <div className="flex space-x-3 pt-4">
          <Button 
            variant="danger" 
            onClick={handleConfirm}
            loading={loading}
            disabled={!canConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function SettingsPage() {
  const { profile, updateProfile, userProfiles, loadUserProfiles, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editingProfile, setEditingProfile] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState<{
    type: 'profile' | 'account'
    profile?: UserProfile
  } | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatarUrl: '',
    isPublic: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load profile data into form when profile changes
  React.useEffect(() => {
    if (profile) {
      console.log('Loading profile data:', profile)
      setFormData({
        username: profile.username || '',
        displayName: profile.display_name || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url || '',
        isPublic: profile.is_public ?? true
      })
    }
  }, [profile])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, hyphens, and underscores'
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters'
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      await updateProfile({
        username: formData.username.toLowerCase(),
        display_name: formData.displayName,
        bio: formData.bio,
        avatar_url: formData.avatarUrl,
        is_public: formData.isPublic,
      })
      toast.success('Profil mis à jour avec succès !')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = (userProfile: UserProfile) => {
    setEditingProfile(userProfile.id)
    setEditName(userProfile.name)
  }

  const handleSaveProfileEdit = async (profileId: string) => {
    if (!editName.trim()) {
      toast.error('Profile name cannot be empty')
      return
    }

    try {
      const slug = editName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          name: editName.trim(),
          slug: slug
        })
        .eq('id', profileId)

      if (error) throw error

      await loadUserProfiles()
      setEditingProfile(null)
      setEditName('')
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleCancelEdit = () => {
    setEditingProfile(null)
    setEditName('')
  }

  const handleTogglePublic = async (userProfile: UserProfile) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_public: !userProfile.is_public })
        .eq('id', userProfile.id)

      if (error) throw error

      await loadUserProfiles()
      toast.success(`Profile ${userProfile.is_public ? 'made private' : 'made public'}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile visibility')
    }
  }

  const handleSetDefault = async (userProfile: UserProfile) => {
    if (userProfile.is_default) return

    try {
      // First, remove default from all profiles
      const { error: removeError } = await supabase
        .from('user_profiles')
        .update({ is_default: false })
        .eq('user_id', userProfile.user_id)

      if (removeError) throw removeError

      // Then set the selected profile as default
      const { error: setError } = await supabase
        .from('user_profiles')
        .update({ is_default: true })
        .eq('id', userProfile.id)

      if (setError) throw setError

      await loadUserProfiles()
      toast.success('Default profile updated!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to set default profile')
    }
  }

  const handleDeleteProfile = async (userProfile: UserProfile) => {
    if (userProfiles.length <= 1) {
      toast.error('Cannot delete the last profile')
      return
    }

    setShowDeleteModal({ type: 'profile', profile: userProfile })
  }

  const confirmDeleteProfile = async () => {
    const userProfile = showDeleteModal?.profile
    if (!userProfile) return
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userProfile.id)

      if (error) throw error

      // If we deleted the default profile, set another one as default
      if (userProfile.is_default && userProfiles.length > 1) {
        const remainingProfiles = userProfiles.filter(p => p.id !== userProfile.id)
        if (remainingProfiles.length > 0) {
          await handleSetDefault(remainingProfiles[0])
        }
      }

      await loadUserProfiles()
      toast.success('Profile deleted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete profile')
    }
  }

  const handleDeleteAccount = async () => {
    setShowDeleteModal({ type: 'account' })
  }

  const confirmDeleteAccount = async () => {
    if (!user?.id || !profile) {
      toast.error('No user session found')
      return
    }
    
    setDeleteLoading(true)
    try {
      // Delete all user data (profiles table has CASCADE delete)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (profileError) {
        console.error('Error deleting profile:', profileError)
        throw new Error('Failed to delete profile data')
      }

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      
      // 📧 Envoyer email de confirmation de suppression
      try {
        await NotificationService.notifyUserEvent('account_deleted', email, {
          displayName: profile.display_name,
          username: profile.username
        }, false)
        console.log('✅ Account deletion email sent')
      } catch (emailError) {
        console.error('Failed to send account deletion email:', emailError)
      }
      
      if (authError) {
        console.error('Error deleting auth user:', authError)
      }

      toast.success('Account deleted successfully')
      
      await signOut()
      navigate('/')
      
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Show loading state if profile is not loaded yet
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  // Show message if profile is not loaded
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Profile...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we load your profile data.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your profile information and privacy settings
          </p>
        </div>

        {/* Profile Form */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Profile Information
          </h2>

          {/* Public Profile Preview */}
          {profile && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Test Your Public Profile
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    See exactly how your profile appears to visitors who aren't logged in
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log('🔍 Opening public preview for:', profile.username)
                    window.open(`https://SocialID.one/u/${profile.username}?preview=public`, '_blank')
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 dark:text-blue-300 dark:border-blue-700"
                >
                  👁️ View Public Profile
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your email address cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 border-gray-300"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This will be your unique URL: SocialID.one/u/username
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 border-gray-300"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayName}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This is how your name will appear on your profile
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 border-gray-300"
                placeholder="https://example.com/your-photo.jpg"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter a URL to your profile picture
              </p>
              {formData.avatarUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  <img
                    src={formData.avatarUrl}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                placeholder="Tell people about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Make my profile public
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              When enabled, your profile will be visible to everyone and discoverable in search.
            </p>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" loading={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Profiles Management */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Manage Profiles
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create and manage multiple profiles for different purposes. Each profile can have its own social links and visibility settings.
          </p>

          <div className="space-y-4">
            {userProfiles.map((userProfile) => (
              <div
                key={userProfile.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {editingProfile === userProfile.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveProfileEdit(userProfile.id)}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-500 hover:text-gray-600"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {userProfile.name}
                          </h3>
                          {userProfile.is_default && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          /u/{profile?.username}{!userProfile.is_default ? `/${userProfile.slug}` : ''}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {editingProfile !== userProfile.id && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePublic(userProfile)}
                      className={`p-2 rounded-md transition-colors ${
                        userProfile.is_public
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      title={userProfile.is_public ? 'Make private' : 'Make public'}
                    >
                      {userProfile.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleSetDefault(userProfile)}
                      className={`p-2 rounded-md transition-colors ${
                        userProfile.is_default
                          ? 'text-yellow-500 cursor-default'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      title={userProfile.is_default ? 'Default profile' : 'Set as default'}
                      disabled={userProfile.is_default}
                    >
                      <Star className={`w-4 h-4 ${userProfile.is_default ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleEditProfile(userProfile)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      title="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {userProfiles.length > 1 && (
                      <button
                        onClick={() => handleDeleteProfile(userProfile)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Delete profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Your default profile is accessible at /u/{profile?.username}. 
              Other profiles have their own URLs like /u/{profile?.username}/profile-name. 
              Private profiles are only visible to you.
            </p>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-8 border-red-200 dark:border-red-800">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleDeleteAccount}
            loading={deleteLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </Card>
      </div>
      
      {/* Delete Confirmation Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal?.type === 'profile'}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDeleteProfile}
        title="Delete Profile"
        message={`Are you sure you want to delete "${showDeleteModal?.profile?.name}"?\n\nThis will also delete all associated social links.\n\nThis action cannot be undone.`}
        confirmText="Delete Profile"
      />
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal?.type === 'account'}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message={`Are you sure you want to delete your account?\n\nThis will permanently delete:\n• Your profile (@${profile?.username})\n• All your social links\n• All your profiles\n• All your data\n\nThis action cannot be undone.`}
        confirmText="Delete Account"
        requiresTyping={true}
        requiredText="DELETE"
      />
    </div>
  )
}