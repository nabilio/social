import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, SocialLink } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { SocialLinkCard } from '../components/profile/SocialLinkCard'
import { SocialLinkForm } from '../components/profile/SocialLinkForm'
import { QRCodeGenerator } from '../components/profile/QRCodeGenerator'
import { AddSocialLinksModal } from '../components/profile/AddSocialLinksModal'
import { Plus, ExternalLink, Users, Eye, Settings, Share2, CreditCard as Edit, QrCode } from 'lucide-react'
import { QRCodeModal } from '../components/profile/QRCodeModal'
import toast from 'react-hot-toast'

// New Profile Modal Component
function NewProfileModal({ isOpen, onClose, onSubmit }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, isPublic: boolean) => Promise<void>
}) {
  const [profileName, setProfileName] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profileName.trim()) {
      setError('Profile name is required')
      return
    }

    if (profileName.trim().length < 2) {
      setError('Profile name must be at least 2 characters')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await onSubmit(profileName.trim(), isPublic)
      setProfileName('')
      setIsPublic(true)
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setProfileName('')
    setIsPublic(true)
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Profile Name"
          value={profileName}
          onChange={(e) => {
            setProfileName(e.target.value)
            setError('')
          }}
          placeholder="e.g., Professional, Personal, Creative"
          error={error}
          autoFocus
        />
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-white">
            Make this profile public
          </label>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Public profiles are visible to everyone and discoverable in search.
        </p>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" loading={loading} className="flex-1">
            Create Profile
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Component to display all profiles with their links
function AllProfilesSection() {
  const { user, profile, userProfiles, createUserProfile } = useAuth()
  const [allProfilesData, setAllProfilesData] = useState<{[key: string]: SocialLink[]}>({})
  const [loading, setLoading] = useState(true)
  const [showNewProfileModal, setShowNewProfileModal] = useState(false)
  const [showSocialLinkModal, setShowSocialLinkModal] = useState(false)
  const [showAddLinksModal, setShowAddLinksModal] = useState(false)
  const [selectedProfileForModal, setSelectedProfileForModal] = useState<any>(null)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [submittingLink, setSubmittingLink] = useState(false)

  useEffect(() => {
    if (user && userProfiles.length > 0) {
      loadAllProfilesData()
    }
  }, [user, userProfiles])

  const loadAllProfilesData = async () => {
    try {
      const profilesData: {[key: string]: SocialLink[]} = {}
      
      for (const userProfile of userProfiles) {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('profile_id', userProfile.id)
          .order('order_index', { ascending: true })

        if (error) throw error
        profilesData[userProfile.id] = data || []
      }
      
      setAllProfilesData(profilesData)
    } catch (error) {
      console.error('Error loading profiles data:', error)
      toast.error('Failed to load profiles data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (link: SocialLink) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ is_visible: !link.is_visible })
        .eq('id', link.id)

      if (error) throw error

      // Update local state
      setAllProfilesData(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(profileId => {
          updated[profileId] = updated[profileId].map(l => 
            l.id === link.id ? { ...l, is_visible: !l.is_visible } : l
          )
        })
        return updated
      })
      
      toast.success(`Link ${link.is_visible ? 'hidden' : 'made visible'}`)
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast.error('Failed to update visibility')
    }
  }

  const handleDeleteLink = async (link: SocialLink) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', link.id)

      if (error) throw error

      // Update local state
      setAllProfilesData(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(profileId => {
          updated[profileId] = updated[profileId].filter(l => l.id !== link.id)
        })
        return updated
      })
      
      toast.success('Link deleted successfully')
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
    }
  }

  const handleEditLink = (link: SocialLink) => {
    setEditingLink(link)
    // Find which profile this link belongs to
    const profileId = Object.keys(allProfilesData).find(id => 
      allProfilesData[id].some(l => l.id === link.id)
    )
    const profile = userProfiles.find(p => p.id === profileId)
    setSelectedProfileForModal(profile)
    setShowSocialLinkModal(true)
  }

  const handleSubmitSocialLink = async (data: { platform: string; url: string; displayName?: string }) => {
    if (!selectedProfileForModal) return

    setSubmittingLink(true)
    try {
      if (editingLink) {
        // Update existing link
        const { error } = await supabase
          .from('social_links')
          .update({
            platform: data.platform,
            url: data.url,
            display_name: data.displayName || '',
          })
          .eq('id', editingLink.id)

        if (error) throw error
        toast.success('Link updated successfully')
      } else {
        // Create new link
        const profileLinks = allProfilesData[selectedProfileForModal.id] || []
        const { error } = await supabase
          .from('social_links')
          .insert({
            user_id: user!.id,
            profile_id: selectedProfileForModal.id,
            platform: data.platform,
            url: data.url,
            display_name: data.displayName || '',
            order_index: profileLinks.length,
          })

        if (error) throw error
        toast.success('Link added successfully')
      }

      setShowSocialLinkModal(false)
      setEditingLink(null)
      setSelectedProfileForModal(null)
      loadAllProfilesData()
    } catch (error: any) {
      console.error('Error saving link:', error)
      toast.error(error.message || 'Failed to save link')
    } finally {
      setSubmittingLink(false)
    }
  }

  const handleCancelSocialLink = () => {
    setShowSocialLinkModal(false)
    setEditingLink(null)
    setSelectedProfileForModal(null)
  }

  const getProfileUrl = (userProfile: any) => {
    if (!profile) return ''
    return userProfile.is_default 
      ? `${window.location.origin}/u/${profile.username}`
      : `${window.location.origin}/u/${profile.username}/${userProfile.slug}`
  }

  const handleShare = async (userProfile: any) => {
    const url = getProfileUrl(userProfile)
    
    const shareData = {
      title: `${profile?.display_name} (${userProfile.name}) - SocialID`,
      text: `Check out ${profile?.display_name}'s ${userProfile.name} profile on SocialID`,
      url: url,
    }
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(url)
        }
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Profile link copied to clipboard!')
    } catch (error) {
      alert(`Your profile URL: ${url}`)
    }
  }

  const handleCreateProfile = async (name: string, isPublic: boolean) => {
    await createUserProfile(name, isPublic)
    toast.success('Profil créé avec succès ! Un email de confirmation a été envoyé.')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (userProfiles.length === 0) {
    return (
      <>
        <Card>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No profiles yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first profile to get started with SocialID.
            </p>
            <Button onClick={() => setShowNewProfileModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Profile
            </Button>
          </div>
        </Card>
        
        <NewProfileModal
          isOpen={showNewProfileModal}
          onClose={() => setShowNewProfileModal(false)}
          onSubmit={handleCreateProfile}
        />
      </>
    )
  }

  return (
    <div className="space-y-6">
      {userProfiles.map((userProfile) => {
        const profileLinks = allProfilesData[userProfile.id] || []
        
        return (
          <Card key={userProfile.id} className="p-4 sm:p-6">
            {/* Profile Header */}
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {userProfile.name}
                </h2>
                {userProfile.is_default && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Default
                  </span>
                )}
                {!userProfile.is_public && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                    Private
                  </span>
                )}
              </div>
              
              {/* Mobile-optimized action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleShare(userProfile)}
                  className="flex-1 min-w-0 sm:flex-none"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  <span className="text-xs">Share</span>
                </Button>
                
                <Link 
                  to="/dashboard/social-links" 
                  state={{ profileId: userProfile.id }}
                  className="flex-1 min-w-0 sm:flex-none"
                >
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    <span className="text-xs">Manage</span>
                  </Button>
                </Link>
                
                <Button
                  size="sm" 
                  variant="outline"
                  className="flex-1 min-w-0 sm:flex-none"
                  onClick={() => {
                    window.location.href = `/my/${userProfile.slug}`
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="text-xs">View</span>
                </Button>
                
                <Button
                  size="sm"
                  className="flex-1 min-w-0 sm:flex-none"
                  onClick={() => {
                    setSelectedProfileForModal(userProfile)
                    setShowAddLinksModal(true)
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  <span className="text-xs">Add Link</span>
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              {profileLinks.map((link) => (
                <SocialLinkCard
                  key={link.id}
                  link={link}
                  isOwner={true}
                  onEdit={handleEditLink}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>

            {/* Profile Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {profileLinks.length} total • {profileLinks.filter(l => l.is_visible).length} visible
                </span>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  /u/{profile?.username}{!userProfile.is_default ? `/${userProfile.slug}` : ''}
                </code>
              </div>
            </div>
          </Card>
        )
      })}

      {/* Add New Profile Button */}
      <div className="flex justify-center py-8">
        <Button
          size="lg"
          onClick={() => setShowNewProfileModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-semibold"
        >
          <Plus className="w-6 h-6 mr-3" />
          Add New Profile
        </Button>
      </div>

      {/* Add Social Links Modal (New 2-step flow) */}
      {selectedProfileForModal && (
        <AddSocialLinksModal
          isOpen={showAddLinksModal}
          onClose={() => {
            setShowAddLinksModal(false)
            setSelectedProfileForModal(null)
          }}
          profileId={selectedProfileForModal.id}
          userId={user!.id}
          onSuccess={loadAllProfilesData}
        />
      )}

      {/* Social Link Modal (Edit single link) */}
      <Modal
        isOpen={showSocialLinkModal}
        onClose={handleCancelSocialLink}
        title={editingLink ? 'Edit Social Link' : 'Add Social Link'}
      >
        <SocialLinkForm
          initialData={editingLink ? {
            platform: editingLink.platform,
            url: editingLink.url,
            display_name: editingLink.display_name
          } : undefined}
          onSubmit={handleSubmitSocialLink}
          onCancel={handleCancelSocialLink}
          loading={submittingLink}
        />
      </Modal>

      {/* New Profile Modal */}
      <NewProfileModal
        isOpen={showNewProfileModal}
        onClose={() => setShowNewProfileModal(false)}
        onSubmit={handleCreateProfile}
      />
    </div>
  )
}

export function DashboardPage() {
  const { user, profile, userProfiles, createUserProfile } = useAuth()
  const [showNewProfileModal, setShowNewProfileModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const getProfileUrl = () => {
    if (!profile) return ''
    return `https://SocialID.one/u/${profile.username}`
  }
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [urlToCopy, setUrlToCopy] = useState('')

  const handleCreateProfile = async (name: string, isPublic: boolean) => {
    await createUserProfile(name, isPublic)
    toast.success('Profil créé avec succès ! Un email de confirmation a été envoyé.')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {profile?.display_name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your profiles and social links
              </p>
            </div>
            
            {/* Header action buttons - mobile optimized */}
            <div className="flex flex-wrap gap-2">
              <Link to={`/u/${profile?.username}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="text-xs">View Profile</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewProfileModal(true)}
                className="flex-1 sm:flex-none"
              >
                <Plus className="w-3 h-3 mr-1" />
                <span className="text-xs">New Profile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQRModal(true)}
                className="flex-1 sm:flex-none"
              >
                <QrCode className="w-3 h-3 mr-1" />
                <span className="text-xs">QR Code</span>
              </Button>
            </div>
          </div>
        </div>

        {/* New Profile Modal */}
        <NewProfileModal
          isOpen={showNewProfileModal}
          onClose={() => setShowNewProfileModal(false)}
          onSubmit={handleCreateProfile}
        />
        
        {/* QR Code Modal */}
        {profile && (
          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            url={getProfileUrl()}
            title={`${profile.display_name} - SocialID`}
          />
        )}

        {/* All Profiles Section */}
        <AllProfilesSection />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Share Profile Card with QR Code */}
          <Card className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Share Your Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your unique SocialID URL and QR code.
                </p>
                {profile && (
                  <div className="flex flex-col space-y-2 mb-4">
                    <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs break-all">
                      SocialID.one/u/{profile.username}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`)
                        toast.success('Link copied to clipboard!')
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                )}
              </div>
              
              {/* QR Code Section */}
              {profile && (
                <div className="flex justify-center">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <QRCodeGenerator 
                      url={getProfileUrl()}
                      title={`${profile.display_name} - SocialID`}
                      size={window.innerWidth < 640 ? 100 : 120}
                      showScanButton={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Discover Users Card */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Discover Users
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Find and connect with other SocialID users in the community.
            </p>
            <Link to="/discover" className="block">
              <Button variant="outline" size="sm" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Explore Community
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}