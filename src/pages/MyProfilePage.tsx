import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, SocialLink, UserProfile } from '../lib/supabase'
import { SocialLinkCard } from '../components/profile/SocialLinkCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, Share2, Settings, Plus, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

export function MyProfilePage() {
  const { profileSlug } = useParams<{ profileSlug: string }>()
  const { user, profile, userProfiles } = useAuth()
  
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    console.log('🔍 MY_PROFILE: Starting with params:', { 
      profileSlug, 
      hasUser: !!user, 
      hasProfile: !!profile, 
      userProfilesCount: userProfiles.length 
    })
    
    if (user && profile && userProfiles.length > 0 && profileSlug) {
      loadMyProfile()
    } else if (user && profile && profileSlug) {
      // Wait a bit for userProfiles to load
      const timeout = setTimeout(() => {
        if (userProfiles.length > 0) {
          loadMyProfile()
        } else {
          console.log('❌ MY_PROFILE: No user profiles found after timeout')
          setNotFound(true)
          setLoading(false)
        }
      }, 1000)
      
      return () => clearTimeout(timeout)
    }
  }, [user, profile, userProfiles, profileSlug])

  const loadMyProfile = async () => {
    try {
      console.log('🔍 MY_PROFILE: Looking for profile with slug:', profileSlug)
      console.log('🔍 MY_PROFILE: Available profiles:', userProfiles.map(p => ({ 
        id: p.id,
        name: p.name, 
        slug: p.slug, 
        isPublic: p.is_public,
        isDefault: p.is_default
      })))
      
      // Chercher le profil dans MES profils (tous, publics et privés)
      const myProfile = userProfiles.find(p => p.slug === profileSlug)
      
      if (!myProfile) {
        console.log('❌ MY_PROFILE: Profile not found in my profiles')
        console.log('🔍 MY_PROFILE: Searched for slug:', `"${profileSlug}"`)
        console.log('🔍 MY_PROFILE: Available slugs:', userProfiles.map(p => `"${p.slug}"`))
        setNotFound(true)
        return
      }

      console.log('✅ MY_PROFILE: Found my profile:', {
        id: myProfile.id,
        name: myProfile.name,
        slug: myProfile.slug,
        isPublic: myProfile.is_public,
        isDefault: myProfile.is_default
      })
      
      setSelectedProfile(myProfile)
      
      // Charger les liens sociaux (tous, visibles et cachés car c'est mon profil)
      await loadSocialLinks(myProfile.id)
      
    } catch (error) {
      console.error('🔍 MY_PROFILE: Error loading profile:', error)
      toast.error('Failed to load profile')
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const loadSocialLinks = async (profileId: string) => {
    try {
      console.log('🔗 MY_PROFILE: Loading social links for profile ID:', profileId)
      console.log('🔗 MY_PROFILE: Current user ID:', user?.id)
      
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profileId)
        .order('order_index', { ascending: true })

      if (error) {
        console.error('🔗 MY_PROFILE: Error loading social links:', error)
        throw error
      }
      
      console.log('🔗 MY_PROFILE: Loaded social links:', data?.length || 0, 'links')
      console.log('🔗 MY_PROFILE: Links details:', data?.map(link => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        isVisible: link.is_visible,
        displayName: link.display_name,
        profileId: link.profile_id,
        userId: link.user_id
      })))
      
      setSocialLinks(data || [])
    } catch (error) {
      console.error('🔗 MY_PROFILE: Error loading social links:', error)
      toast.error('Failed to load social links')
      setSocialLinks([])
    }
  }

  const handleShare = async () => {
    if (!selectedProfile || !profile) return
    
    const url = selectedProfile.is_default 
      ? `${window.location.origin}/u/${profile.username}`
      : `${window.location.origin}/u/${profile.username}/${selectedProfile.slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.display_name} (${selectedProfile.name}) - SocialID`,
          text: `Check out ${profile.display_name}'s ${selectedProfile.name} profile`,
          url: url,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Profile link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy link')
      }
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
      setSocialLinks(links => 
        links.map(l => l.id === link.id ? { ...l, is_visible: !l.is_visible } : l)
      )
      
      toast.success(`Link ${link.is_visible ? 'hidden' : 'made visible'}`)
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast.error('Failed to update visibility')
    }
  }

  const handleDeleteLink = async (link: SocialLink) => {
    // La confirmation est maintenant gérée dans SocialLinkCard
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

  const handleEditLink = (link: SocialLink) => {
    // Redirect to social links management page with this profile
    window.location.href = `/dashboard/social-links?profile=${selectedProfile?.id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (notFound || !selectedProfile || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The profile you're looking for doesn't exist in your profiles.
          </p>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const visibleLinks = socialLinks.filter(link => link.is_visible)
  const hiddenLinks = socialLinks.filter(link => !link.is_visible)

  const SimpleQRCode = ({ url, size = 120 }: { url: string; size?: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      if (!canvasRef.current || !url) return

      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }).catch(err => {
        console.error('Error generating QR code:', err)
      })
    }, [url, size])

    return (
      <div className="flex flex-col items-center">
        <div className="bg-white p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    )
  }

  const profileUrl = selectedProfile.is_default
    ? `https://SocialID.one/u/${profile.username}`
    : `https://SocialID.one/u/${profile.username}/${selectedProfile.slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        {/* Back to dashboard */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Compact Modern Profile Header */}
        <Card className="mb-8 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="p-3 sm:p-4">
            {/* Top Section: Avatar + Info + QR Code */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
              {/* Left: Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl sm:text-2xl font-bold">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Center: Info + Actions */}
              <div className="flex-1 text-center lg:text-left w-full">
                {/* Name + Username */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile.display_name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  @{profile.username}
                </p>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                {/* Profile Name + Badges */}
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {selectedProfile.name}
                  </span>
                  {selectedProfile.is_default && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      Default
                    </span>
                  )}
                  {!selectedProfile.is_public && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded flex items-center">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                  <Link to="/dashboard/social-links" state={{ profileId: selectedProfile.id }}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Links
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: QR Code + URL + Buttons (hidden on mobile, visible on large screens) */}
              {selectedProfile.is_public && (
                <div className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0">
                  <SimpleQRCode
                    url={profileUrl}
                    size={100}
                  />
                  <code className="text-xs font-mono text-blue-600 dark:text-blue-400 text-center">
                    {profileUrl.replace('https://', '')}
                  </code>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const modal = document.createElement('div')
                        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'
                        modal.onclick = () => modal.remove()
                        const content = document.createElement('div')
                        content.className = 'bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4'
                        const canvas = document.createElement('canvas')
                        QRCode.toCanvas(canvas, profileUrl, {
                          width: 300,
                          margin: 3,
                          color: { dark: '#000000', light: '#FFFFFF' },
                          errorCorrectionLevel: 'H'
                        })
                        content.appendChild(canvas)
                        modal.appendChild(content)
                        document.body.appendChild(modal)
                      }}
                      className="text-xs"
                    >
                      Scan QR
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleShare}
                      className="text-xs"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* QR Code Section - Mobile Only */}
        {selectedProfile.is_public && (
          <div className="mb-8 lg:hidden flex flex-col items-center gap-2">
            <SimpleQRCode
              url={profileUrl}
              size={140}
            />
            <code className="text-xs font-mono text-blue-600 dark:text-blue-400 text-center">
              {profileUrl.replace('https://', '')}
            </code>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const modal = document.createElement('div')
                  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'
                  modal.onclick = () => modal.remove()
                  const content = document.createElement('div')
                  content.className = 'bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4'
                  const canvas = document.createElement('canvas')
                  QRCode.toCanvas(canvas, profileUrl, {
                    width: 300,
                    margin: 3,
                    color: { dark: '#000000', light: '#FFFFFF' },
                    errorCorrectionLevel: 'H'
                  })
                  content.appendChild(canvas)
                  modal.appendChild(content)
                  document.body.appendChild(modal)
                }}
              >
                Scan QR
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="space-y-8">
          {/* Visible Links */}
          {visibleLinks.length > 0 && (
            <div>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Eye className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Public Links ({visibleLinks.length})
                </h2>
              </div>
              <div className="grid gap-4">
                {visibleLinks.map((link) => (
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
            </div>
          )}

          {/* Hidden Links (only visible to owner) */}
          {hiddenLinks.length > 0 && (
            <div>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <EyeOff className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hidden Links ({hiddenLinks.length})
                </h2>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                  <EyeOff className="w-4 h-4 mr-2" />
                  These links are hidden from public view. Only you can see them.
                </p>
              </div>
              <div className="grid gap-4">
                {hiddenLinks.map((link) => (
                  <div key={link.id} className="opacity-75">
                    <SocialLinkCard 
                      link={link} 
                      isOwner={true}
                      onEdit={handleEditLink}
                      onToggleVisibility={handleToggleVisibility}
                      onDelete={handleDeleteLink}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Links */}
          {socialLinks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No social links yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add your first social link to get started with this profile.
              </p>
              <Link to="/dashboard/social-links" state={{ profileId: selectedProfile.id }}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Link
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {socialLinks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Links
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {visibleLinks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Public
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {hiddenLinks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hidden
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
              SocialID
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}