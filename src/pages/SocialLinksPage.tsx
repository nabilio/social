import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, SocialLink } from '../lib/supabase'
import { SocialLinkForm } from '../components/profile/SocialLinkForm'
import { SocialLinkCard } from '../components/profile/SocialLinkCard'
import { Button } from '../components/ui/Button'
import { ArrowLeft, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export function SocialLinksPage() {
  const { user, userProfiles } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  useEffect(() => {
    if (userProfiles.length > 0) {
      // Get profile ID from location state or use first profile
      const profileId = location.state?.profileId
      const profile = profileId ? userProfiles.find(p => p.id === profileId) : userProfiles[0]
      setSelectedProfile(profile)
      
      if (user && profile) {
        loadSocialLinks(profile)
      }
    } else if (user) {
      // If no profiles exist but user is logged in, stop loading
      setLoading(false)
    }
  }, [user, userProfiles, location.state])

  const loadSocialLinks = async (profile = selectedProfile) => {
    if (!profile) {
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profile.id)
        .order('order_index', { ascending: true })

      if (error) throw error
      setSocialLinks(data || [])
    } catch (error) {
      console.error('Error loading social links:', error)
      toast.error('Failed to load social links')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: { platform: string; url: string; displayName?: string }) => {
    setSubmitting(true)
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
        const { error } = await supabase
          .from('social_links')
          .insert({
            user_id: user!.id,
            profile_id: selectedProfile!.id,
            platform: data.platform,
            url: data.url,
            display_name: data.displayName || '',
            order_index: socialLinks.length,
          })

        if (error) throw error
        toast.success('Link added successfully')
      }

      setShowForm(false)
      setEditingLink(null)
      loadSocialLinks(selectedProfile)
    } catch (error: any) {
      console.error('Error saving link:', error)
      toast.error(error.message || 'Failed to save link')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link)
    setShowForm(true)
  }

  const handleToggleVisibility = async (link: SocialLink) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ is_visible: !link.is_visible })
        .eq('id', link.id)

      if (error) throw error

      setSocialLinks(links => 
        links.map(l => l.id === link.id ? { ...l, is_visible: !l.is_visible } : l)
      )
      
      toast.success(`Link ${link.is_visible ? 'hidden' : 'made visible'}`)
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast.error('Failed to update visibility')
    }
  }

  const handleDelete = async (link: SocialLink) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', link.id)

      if (error) throw error

      setSocialLinks(links => links.filter(l => l.id !== link.id))
      toast.success('Link deleted successfully')
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingLink(null)
  }

  // Show loading only if we're actually loading data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If no user profiles exist, show a message to create one first
  if (userProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Manage Social Links
            </h1>
          </div>

          <div className="text-center py-12">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No profiles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to create a profile first before adding social links.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Manage Social Links
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedProfile ? `Managing links for "${selectedProfile.name}" profile` : 'Select a profile to manage links'}
              </p>
            </div>
            
            {!showForm && selectedProfile && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            )}
          </div>
        </div>

        {/* Profile Selector if multiple profiles exist */}
        {userProfiles.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Profile
            </label>
            <select
              value={selectedProfile?.id || ''}
              onChange={(e) => {
                const profile = userProfiles.find(p => p.id === e.target.value)
                setSelectedProfile(profile)
                if (profile) {
                  loadSocialLinks(profile)
                }
              }}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              {userProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} {profile.is_default ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <SocialLinkForm
              initialData={editingLink ? {
                platform: editingLink.platform,
                url: editingLink.url,
                display_name: editingLink.display_name
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={submitting}
            />
          </div>
        )}

        {/* Social Links Grid */}
        {!selectedProfile ? (
          <div className="text-center py-12">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No profile selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please go back to the dashboard and select a profile to manage its social links.
            </p>
          </div>
        ) : socialLinks.length === 0 ? (
          <div className="text-center py-12">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No social links yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start building your social presence by adding your first link to this profile.
            </p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialLinks.map((link) => (
              <SocialLinkCard
                key={link.id}
                link={link}
                isOwner={true}
                onEdit={handleEdit}
                onToggleVisibility={handleToggleVisibility}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}