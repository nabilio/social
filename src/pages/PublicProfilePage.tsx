import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Profile, SocialLink, UserProfile, Friendship } from '../lib/supabase'
import { SocialLinkCard } from '../components/profile/SocialLinkCard'
import { QRCodeGenerator } from '../components/profile/QRCodeGenerator'
import { SocialShareMeta } from '../components/profile/SocialShareMeta'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  Share2, UserPlus, ArrowLeft, Lock, Eye, Users, MessageCircle, LogIn, UserCheck,
  Instagram, Linkedin, Github, Youtube, Facebook, Globe, Music, Twitch, MessageCircle as MessageCircleIcon,
  Camera, Play, Headphones, Gamepad2, Briefcase, Code,
  ShoppingBag, Heart, Palette, BookOpen, Zap, Hash
} from 'lucide-react'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

// Custom Pinterest icon
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
  </svg>
)

// Custom Snapchat icon
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
  </svg>
)

const platformIcons: Record<string, React.ComponentType<any>> = {
  instagram: Instagram,
  x: XIcon,
  twitter: XIcon,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  spotify: Music,
  twitch: Twitch,
  tiktok: TikTokIcon,
  pinterest: PinterestIcon,
  snapchat: SnapchatIcon,
  discord: MessageCircleIcon,
  telegram: MessageCircleIcon,
  whatsapp: MessageCircleIcon,
  reddit: MessageCircleIcon,
  medium: BookOpen,
  behance: Palette,
  dribbble: Palette,
  figma: Palette,
  deviantart: Palette,
  etsy: ShoppingBag,
  shopify: ShoppingBag,
  amazon: ShoppingBag,
  patreon: Heart,
  kofi: Heart,
  buymeacoffee: Heart,
  soundcloud: Headphones,
  bandcamp: Headphones,
  apple_music: Music,
  deezer: Music,
  steam: Gamepad2,
  xbox: Gamepad2,
  playstation: Gamepad2,
  nintendo: Gamepad2,
  epic_games: Gamepad2,
  vimeo: Play,
  dailymotion: Play,
  rumble: Play,
  odysee: Play,
  bitchute: Play,
  mastodon: Hash,
  threads: Hash,
  bluesky: Hash,
  clubhouse: Headphones,
  calendly: Briefcase,
  linktree: Globe,
  beacons: Globe,
  carrd: Globe,
  notion: BookOpen,
  substack: BookOpen,
  newsletter: BookOpen,
  blog: BookOpen,
  portfolio: Briefcase,
  resume: Briefcase,
  cv: Briefcase,
  email: MessageCircleIcon,
  phone: MessageCircleIcon,
  contact: MessageCircleIcon,
  booking: Briefcase,
  appointment: Briefcase,
  consultation: Briefcase,
  store: ShoppingBag,
  shop: ShoppingBag,
  marketplace: ShoppingBag,
  other: Globe,
}

// Simple QR Code component (just the canvas with border)
const SimpleQRCode = ({ url, size = 120, showScanButton = false, onScanClick }: { url: string; size?: number; showScanButton?: boolean; onScanClick?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showModal, setShowModal] = useState(false)

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

  const handleScanClick = () => {
    if (onScanClick) {
      onScanClick()
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm">
        <canvas
          ref={canvasRef}
          className="block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Simple Scan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4">
            <canvas
              ref={(canvas) => {
                if (canvas) {
                  QRCode.toCanvas(canvas, url, {
                    width: 300,
                    margin: 3,
                    color: { dark: '#000000', light: '#FFFFFF' },
                    errorCorrectionLevel: 'H'
                  })
                }
              }}
              className="mx-auto mb-4"
            />
            <Button size="sm" onClick={() => setShowModal(false)} className="w-full">
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const platformColors: Record<string, string> = {
  instagram: 'from-pink-500 to-purple-600',
  x: 'from-black to-gray-800',
  twitter: 'from-black to-gray-800',
  linkedin: 'from-blue-600 to-blue-800',
  github: 'from-gray-700 to-gray-900',
  youtube: 'from-red-500 to-red-600',
  facebook: 'from-blue-600 to-blue-700',
  website: 'from-gray-600 to-gray-800',
  spotify: 'from-green-500 to-green-600',
  twitch: 'from-purple-500 to-purple-600',
  tiktok: 'from-black to-gray-800',
  pinterest: 'from-red-600 to-red-700',
  snapchat: 'from-yellow-400 to-yellow-500',
  discord: 'from-indigo-500 to-purple-600',
  telegram: 'from-blue-400 to-blue-600',
  whatsapp: 'from-green-500 to-green-600',
  reddit: 'from-orange-500 to-red-600',
  medium: 'from-gray-800 to-black',
  behance: 'from-blue-600 to-purple-600',
  dribbble: 'from-pink-500 to-rose-600',
  figma: 'from-purple-500 to-pink-500',
  deviantart: 'from-green-600 to-teal-600',
  etsy: 'from-orange-500 to-red-600',
  shopify: 'from-green-600 to-emerald-600',
  amazon: 'from-orange-400 to-yellow-500',
  patreon: 'from-orange-500 to-red-600',
  kofi: 'from-blue-500 to-cyan-500',
  buymeacoffee: 'from-yellow-500 to-orange-500',
  soundcloud: 'from-orange-500 to-red-500',
  bandcamp: 'from-blue-600 to-cyan-600',
  apple_music: 'from-pink-500 to-red-500',
  deezer: 'from-purple-600 to-pink-600',
  steam: 'from-blue-800 to-gray-900',
  xbox: 'from-green-600 to-emerald-600',
  playstation: 'from-blue-600 to-indigo-700',
  nintendo: 'from-red-600 to-pink-600',
  epic_games: 'from-gray-800 to-black',
  vimeo: 'from-blue-500 to-teal-500',
  dailymotion: 'from-blue-600 to-indigo-600',
  rumble: 'from-green-600 to-emerald-600',
  odysee: 'from-purple-600 to-pink-600',
  bitchute: 'from-red-600 to-orange-600',
  mastodon: 'from-purple-600 to-indigo-600',
  threads: 'from-gray-800 to-black',
  bluesky: 'from-blue-500 to-cyan-500',
  clubhouse: 'from-yellow-500 to-orange-500',
  calendly: 'from-blue-600 to-indigo-600',
  linktree: 'from-green-500 to-emerald-500',
  beacons: 'from-purple-500 to-pink-500',
  carrd: 'from-gray-600 to-gray-800',
  notion: 'from-gray-800 to-black',
  substack: 'from-orange-500 to-red-500',
  newsletter: 'from-blue-600 to-indigo-600',
  blog: 'from-gray-700 to-gray-900',
  portfolio: 'from-indigo-600 to-purple-600',
  resume: 'from-blue-600 to-indigo-600',
  cv: 'from-blue-600 to-indigo-600',
  email: 'from-red-500 to-pink-500',
  phone: 'from-green-500 to-emerald-500',
  contact: 'from-blue-500 to-indigo-500',
  booking: 'from-purple-500 to-indigo-500',
  appointment: 'from-blue-500 to-cyan-500',
  consultation: 'from-teal-500 to-green-500',
  store: 'from-emerald-500 to-teal-500',
  shop: 'from-green-500 to-emerald-500',
  marketplace: 'from-orange-500 to-red-500',
  other: 'from-gray-600 to-gray-800',
}

export function PublicProfilePage() {
  const { username, profileSlug } = useParams<{ username: string; profileSlug?: string }>()
  const { user: currentUser } = useAuth()
  
  // Check if we're in preview mode
  const isPreviewMode = new URLSearchParams(window.location.search).get('preview') === 'public'
  const effectiveCurrentUser = isPreviewMode ? null : currentUser
  
  console.log('🔍 PublicProfilePage Debug:', {
    username,
    profileSlug,
    isPreviewMode,
    hasCurrentUser: !!currentUser,
    effectiveCurrentUser: !!effectiveCurrentUser
  })
  
  // Check if we should only show public profiles
  const showOnlyPublic = isPreviewMode || !effectiveCurrentUser
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [socialLinksData, setSocialLinksData] = useState<{[key: string]: SocialLink[]}>({})
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [friendship, setFriendship] = useState<Friendship | null>(null)
  const [friendshipLoading, setFriendshipLoading] = useState(false)
  const [privateLinksCount, setPrivateLinksCount] = useState(0)

  useEffect(() => {
    if (username) {
      console.log('🔍 PUBLIC_PROFILE: Starting loadUserData with params:', { 
        username, 
        profileSlug,
        isPreviewMode,
        hasCurrentUser: !!currentUser,
        effectiveCurrentUser: !!effectiveCurrentUser
      })
      loadUserData()
    }
  }, [username, profileSlug, effectiveCurrentUser?.id])

  const loadUserData = async () => {
    try {
      console.log('🔍 PUBLIC_PROFILE: Loading main profile for username:', username)
      // Load main profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (profileError) {
        console.error('🔍 PUBLIC_PROFILE: Profile error:', profileError)
        if (profileError.code === 'PGRST116') {
          console.log('🔍 PUBLIC_PROFILE: Profile not found (PGRST116)')
          setNotFound(true)
        } else {
          throw profileError
        }
        return
      }

      console.log('🔍 PUBLIC_PROFILE: Main profile loaded:', profileData)
      setProfile(profileData)
      
      // Set owner status
      const ownerStatus = effectiveCurrentUser?.id === profileData.id
      setIsOwner(ownerStatus)
      console.log('🔍 PUBLIC_PROFILE: Owner check:', { 
        currentUserId: effectiveCurrentUser?.id, 
        profileId: profileData.id, 
        isOwner: ownerStatus, 
        isPreview: isPreviewMode 
      })

      // Load friendship status if user is logged in and not the owner
      if (effectiveCurrentUser && effectiveCurrentUser.id !== profileData.id) {
        await loadFriendshipStatus(profileData.id)
      }

      console.log('🔍 PUBLIC_PROFILE: Loading user profiles for user_id:', profileData.id)
      // Load user profiles
      const { data: userProfilesData, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: true })

      if (userProfilesError) {
        console.error('🔍 PUBLIC_PROFILE: User profiles error:', userProfilesError)
        throw userProfilesError
      }

      const allProfiles = userProfilesData || []
      console.log('🔍 PUBLIC_PROFILE: All profiles from DB:', allProfiles.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        is_default: p.is_default,
        is_public: p.is_public
      })))
      
      // IMPORTANT: For specific profile access via slug, we need to check ALL profiles first
      // Then apply access control AFTER finding the profile
      let filteredProfiles = allProfiles // Start with all profiles
      
      console.log('🔍 PUBLIC_PROFILE: Filtered profiles:', filteredProfiles.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        is_default: p.is_default,
        is_public: p.is_public
      })))
      
      setUserProfiles(filteredProfiles)

      // Count private links for non-logged users
      if (!ownerStatus && !effectiveCurrentUser) {
        await countPrivateLinks(allProfiles.filter(p => !p.is_public))
      }

      // If accessing a specific profile via slug
      if (profileSlug) {
        console.log('🔍 PUBLIC_PROFILE: Looking for profile with slug:', profileSlug)
        console.log('🔍 PUBLIC_PROFILE: Available profiles for matching:', allProfiles.map(p => ({ 
          name: p.name, 
          slug: p.slug, 
          isPublic: p.is_public
        })))
        
        console.log('🔍 PUBLIC_PROFILE: Searching for slug:', `"${profileSlug}"`)
        console.log('🔍 PUBLIC_PROFILE: Available slugs:', allProfiles.map(p => `"${p.slug}"`))
        
        // Debug each profile match
        allProfiles.forEach(p => {
          console.log(`🔍 PUBLIC_PROFILE: Checking profile "${p.name}": slug="${p.slug}" === "${profileSlug}" ? ${p.slug === profileSlug}`)
        })
        
        // Try to find the profile in ALL profiles (not just filtered ones)
        let specificProfile = allProfiles.find(p => p.slug === profileSlug)
        if (!specificProfile) {
          specificProfile = allProfiles.find(p => p.slug?.trim() === profileSlug?.trim())
        }
        
        console.log('🔍 PUBLIC_PROFILE: Found specific profile:', specificProfile)
        
        // Now apply access control AFTER finding the profile
        if (specificProfile) {
          const hasAccess = ownerStatus || specificProfile.is_public
          console.log('🔍 PUBLIC_PROFILE: Access check:', { 
            profileName: specificProfile.name,
            isPublic: specificProfile.is_public,
            ownerStatus,
            hasAccess
          })
          
          if (hasAccess) {
            console.log('✅ PUBLIC_PROFILE: Access granted to profile:', specificProfile.name)
            setSelectedProfile(specificProfile)
            await loadSocialLinks(specificProfile.id)
          } else {
            console.log('❌ PUBLIC_PROFILE: Access denied to private profile:', specificProfile.name)
            setNotFound(true)
            return
          }
        } else {
          console.log('❌ PUBLIC_PROFILE: Profile with slug not found:', profileSlug)
          setNotFound(true)
          return
        }
      } else {
        console.log('🔍 PUBLIC_PROFILE: No specific profile slug - showing overview')
        
        // For overview page, filter profiles based on viewing context
        if (ownerStatus) {
          // Owner sees ALL profiles (public + private)
          filteredProfiles = allProfiles
          console.log('🔍 PUBLIC_PROFILE: Owner - showing all profiles:', filteredProfiles.length)
        } else {
          // Non-owners only see public profiles
          filteredProfiles = allProfiles.filter(p => p.is_public)
          console.log('🔍 PUBLIC_PROFILE: Non-owner - showing only public profiles:', filteredProfiles.length)
        }
        
        setUserProfiles(filteredProfiles)
        await loadAllSocialLinks(filteredProfiles)
      }

    } catch (error) {
      console.error('🔍 PUBLIC_PROFILE: Error loading user data:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const countPrivateLinks = async (privateProfiles: UserProfile[]) => {
    try {
      let totalPrivateLinks = 0
      
      for (const profile of privateProfiles) {
        const { data, error } = await supabase
          .from('social_links')
          .select('id')
          .eq('profile_id', profile.id)
          .eq('is_visible', true)

        if (error) throw error
        totalPrivateLinks += data?.length || 0
      }
      
      setPrivateLinksCount(totalPrivateLinks)
    } catch (error) {
      console.error('Error counting private links:', error)
    }
  }

  const loadSocialLinks = async (profileId: string) => {
    try {
      console.log('🔗 Loading social links for profile ID:', profileId, 'isOwner:', isOwner)
      
      // Pour le propriétaire : charger TOUS les liens (visibles et cachés)
      // Pour les autres : seulement les liens visibles
      let query = supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profileId)
        .order('order_index', { ascending: true })

      // Si ce n'est pas le propriétaire, ne charger que les liens visibles
      if (!isOwner) {
        query = query.eq('is_visible', true)
      }

      const { data, error } = await query

      if (error) throw error
      
      console.log('🔗 Loaded social links:', data?.length || 0, 'links for profile:', profileId)
      console.log('🔗 Links details:', data?.map(link => ({
        id: link.id,
        platform: link.platform,
        isVisible: link.is_visible,
        profileId: link.profile_id
      })))
      
      setSocialLinksData({ [profileId]: data || [] })
    } catch (error) {
      console.error('Error loading social links:', error)
    }
  }

  const loadAllSocialLinks = async (profiles: UserProfile[]) => {
    try {
      const linksData: {[key: string]: SocialLink[]} = {}
      
      for (const userProfile of profiles) {
        console.log('🔗 Loading links for profile:', userProfile.name, 'isOwner:', isOwner, 'isPublic:', userProfile.is_public)
        
        let query = supabase
          .from('social_links')
          .select('*')
          .eq('profile_id', userProfile.id)
          .order('order_index', { ascending: true })

        // Si ce n'est pas le propriétaire, ne charger que les liens visibles
        if (!isOwner) {
          query = query.eq('is_visible', true)
        }

        const { data, error } = await query

        if (error) throw error
        
        linksData[userProfile.id] = data || []
        console.log(`🔗 Loaded ${data?.length || 0} links for profile: ${userProfile.name} (isOwner: ${isOwner})`)
      }
      
      setSocialLinksData(linksData)
    } catch (error) {
      console.error('Error loading social links:', error)
    }
  }

  const loadFriendshipStatus = async (friendId: string) => {
    try {
      setFriendshipLoading(true)
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${effectiveCurrentUser?.id},friend_id.eq.${effectiveCurrentUser?.id}`)
        .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setFriendship(data || null)
    } catch (error) {
      console.error('Error loading friendship status:', error)
    } finally {
      setFriendshipLoading(false)
    }
  }

  const handleSendFriendRequest = async () => {
    if (!currentUser || !profile) {
      toast.error('Please sign in to send friend requests')
      return
    }

    try {
      setFriendshipLoading(true)
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUser.id,
          friend_id: profile.id,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Friend request sent!')
      await loadFriendshipStatus(profile.id)
    } catch (error) {
      console.error('Error sending friend request:', error)
      toast.error('Failed to send friend request')
    } finally {
      setFriendshipLoading(false)
    }
  }

  const canViewLinkDetails = (userProfile: UserProfile) => {
    // Owner can always view their own profiles
    console.log('🔐 canViewLinkDetails check:', { 
      profileName: userProfile.name,
      isOwner, 
      userProfilePublic: userProfile.is_public, 
      currentUser: !!currentUser, 
      friendshipStatus: friendship?.status 
    })
    
    if (isOwner) return true
    
    // Public profiles: anyone can see details (no login required)
    if (userProfile.is_public) return true
    
    // Private profiles: need to be friends
    if (!userProfile.is_public && effectiveCurrentUser && friendship?.status === 'accepted') return true
    
    return false
  }

  const canViewProfileIcons = (userProfile: UserProfile) => {
    // Owner can always see their own profiles
    console.log('👁️ canViewProfileIcons check:', { 
      profileName: userProfile.name,
      isOwner, 
      userProfilePublic: userProfile.is_public, 
      currentUser: !!currentUser, 
      friendshipStatus: friendship?.status 
    })
    if (isOwner) return true
    
    // Public profiles: everyone can see icons
    if (userProfile.is_public) return true
    
    // Private profiles: only friends can see icons
    if (!userProfile.is_public && effectiveCurrentUser && friendship?.status === 'accepted') return true
    
    return false
  }

  const needsLoginForPrivate = (userProfile: UserProfile) => {
    return !userProfile.is_public && !effectiveCurrentUser
  }

  const needsFriendshipForPrivate = (userProfile: UserProfile) => {
    return !userProfile.is_public && effectiveCurrentUser && (!friendship || friendship.status !== 'accepted')
  }

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name} - SocialID`,
          text: `Check out ${profile?.display_name}'s profiles on SocialID`,
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

  const handleRequestAccess = (userProfile: UserProfile) => {
    if (!effectiveCurrentUser) {
      toast.error('Please sign in to request access to private profiles')
      return
    }
    
    // TODO: Implement access request system
    toast.info('Access request feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (notFound || !profile) {
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
            The profile you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // If viewing a specific profile
  if (selectedProfile) {
    const profileLinks = socialLinksData[selectedProfile.id] || []
    
    const profileUrl = selectedProfile.is_default 
      ? `https://SocialID.one/u/${profile.username}`
      : `https://SocialID.one/u/${profile.username}/${selectedProfile.slug}`
    
    const profileDescription = profile.bio || `Discover all ${profile.display_name}'s social links on SocialID`
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <SocialShareMeta
          title={`${profile.display_name} (${selectedProfile.name})`}
          description={profileDescription}
          image={profile.avatar_url}
          url={profileUrl}
          type="profile"
          username={profile.username}
        />
        
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Back to main profile */}
          <div className="mb-6">
            <button
              onClick={() => {
                if (isOwner) {
                  window.location.href = '/dashboard'
                } else {
                  window.location.href = `/u/${profile.username}`
                }
              }}
              className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {isOwner ? 'Back to Dashboard' : `Back to ${profile.display_name}'s profiles`}
            </button>
          </div>

          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {profile.display_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.display_name}
            </h1>
            
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-1">
              {selectedProfile.name}
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              @{profile.username}
            </p>
            
            {profile.bio && (
              <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
                {profile.bio}
              </p>
            )}

            <div className="flex justify-center space-x-3 mb-6">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              {!isOwner && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSendFriendRequest}
                  loading={friendshipLoading}
                  disabled={friendship?.status === 'pending'}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {friendship?.status === 'pending' ? 'Request Sent' : 
                   friendship?.status === 'accepted' ? 'Friends' : 'Add Friend'}
                </Button>
              )}
            </div>
          </div>

          {/* Social Links */}
          {profileLinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No public links yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.display_name} hasn't added any public social links to this profile yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                Social Links
              </h2>
              <div className="grid gap-4">
                {profileLinks.map((link) => (
                  <SocialLinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          )}

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

  // Main profile page showing all profiles
  const mainProfileUrl = `https://SocialID.one/u/${profile.username}`
  const mainDescription = profile.bio || `Discover all ${profile.display_name}'s profiles on SocialID`
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <SocialShareMeta
        title={profile.display_name}
        description={mainDescription}
        image={profile.avatar_url}
        url={mainProfileUrl}
        type="profile"
        username={profile.username}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
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

                {/* Action Buttons */}
                {!isOwner && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendFriendRequest}
                      loading={friendshipLoading}
                      disabled={friendship?.status === 'pending'}
                      className="w-full sm:w-auto"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {friendship?.status === 'pending' ? 'Sent' :
                       friendship?.status === 'accepted' ? 'Friends' : 'Add Friend'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right: QR Code + URL + Buttons (hidden on mobile, visible on large screens) */}
              <div className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0">
                <SimpleQRCode
                  url={`https://SocialID.one/u/${profile.username}`}
                  size={100}
                />
                <code className="text-xs font-mono text-blue-600 dark:text-blue-400 text-center">
                  SocialID.one/u/{profile.username}
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
                      QRCode.toCanvas(canvas, `https://SocialID.one/u/${profile.username}`, {
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
            </div>
          </div>
        </Card>

        {/* Profiles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {isOwner ? 'My Profiles' : `${profile.display_name}'s Profiles`}
              </h2>
            </div>
          </div>

          {userProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
                No public profiles
              </h3>
              <p className="text-gray-600 dark:text-gray-400 px-4">
                {profile.display_name} hasn't created any public profiles yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProfiles.map((userProfile) => {
                const profileLinks = socialLinksData[userProfile.id] || []
                const canViewDetails = canViewLinkDetails(userProfile)
                const hasLinks = profileLinks.length > 0
                
                console.log('🔍 Rendering profile:', userProfile.name, 'isPublic:', userProfile.is_public, 'canViewDetails:', canViewDetails)
                
                return (
                  <Card key={userProfile.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                      {/* Profile Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                              {userProfile.name}
                            </h3>
                            <div className="flex space-x-2">
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
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all">
                            {userProfile.is_default 
                              ? `/u/${profile.username}`
                              : `/u/${profile.username}/${userProfile.slug}`
                            }
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-2">
                          {userProfile.is_public ? (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Profile Content */}
                      {!userProfile.is_public && !isOwner ? (
                        // Private profile - show placeholder without links
                        <div className="text-center py-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Private profile content
                          </p>
                          {needsLoginForPrivate(userProfile) ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Sign in to request access
                            </p>
                          ) : needsFriendshipForPrivate(userProfile) ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Add as friend to view content
                            </p>
                          ) : (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              You have access to this profile
                            </p>
                          )}
                        </div>
                      ) : !hasLinks ? (
                        <div className="text-center py-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-base sm:text-lg">🔗</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            No social links yet
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {profileLinks.length} social link{profileLinks.length !== 1 ? 's' : ''}
                          </p>
                          
                          <div className="grid gap-2">
                            {profileLinks.slice(0, 3).map((link) => (
                              <SocialLinkCard key={link.id} link={link} />
                            ))}
                            {profileLinks.length > 3 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                +{profileLinks.length - 3} more links
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* View Full Profile Button */}
                      {canViewDetails && hasLinks && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Si c'est le propriétaire, utiliser la route /my/ pour voir ses propres profils
                              if (isOwner) {
                                window.location.href = `/my/${userProfile.slug}`
                              } else {
                                const slug = userProfile.slug || userProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                                window.location.href = `/u/${profile?.username}/${slug}`
                              }
                            }}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                      )}
                      
                      {/* Private Profile Actions */}
                      {!userProfile.is_public && !isOwner && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          {needsLoginForPrivate(userProfile) ? (
                            <div className="text-center">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                🔒 Private profile - Sign in to request access
                              </p>
                              <Link to="/login">
                                <Button variant="outline" size="sm" className="w-full">
                                  <LogIn className="w-4 h-4 mr-2" />
                                  Sign In
                                </Button>
                              </Link>
                            </div>
                          ) : needsFriendshipForPrivate(userProfile) ? (
                            <div className="text-center">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {friendship?.status === 'pending' 
                                  ? 'Friend request pending...'
                                  : 'Add as friend to view private content'
                                }
                              </p>
                              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full min-h-[44px]"
                                  onClick={handleSendFriendRequest}
                                  loading={friendshipLoading}
                                  disabled={friendship?.status === 'pending'}
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  {friendship?.status === 'pending' ? 'Request Sent' : 'Add Friend'}
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* QR Code Section - Mobile Only */}
        <div className="mb-8 lg:hidden flex flex-col items-center gap-2">
          <SimpleQRCode
            url={`https://SocialID.one/u/${profile.username}`}
            size={140}
          />
          <code className="text-xs font-mono text-blue-600 dark:text-blue-400 text-center">
            SocialID.one/u/{profile.username}
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
                QRCode.toCanvas(canvas, `https://SocialID.one/u/${profile.username}`, {
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

        {/* Private Content Summary for non-logged users */}
        {showOnlyPublic && privateLinksCount > 0 && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-gray-200 dark:border-gray-700">
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {privateLinksCount} private links available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-4">
                  {profile.display_name} has private profiles with additional content.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 px-4">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up to See More
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Call to Action for non-logged users */}
        {!effectiveCurrentUser && !showOnlyPublic && userProfiles.some(p => !p.is_public) && (
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <div className="py-6 sm:py-8 px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Some profiles are private
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  Sign up to request access to private profiles and connect with {profile?.display_name}.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">
                      Join SocialID
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 sm:py-3 z-50 shadow-lg">
            <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium">
                  🔍 PUBLIC PREVIEW MODE - You see exactly what non-logged visitors see
                </p>
              </div>
              <Link
                to="/settings"
                className="ml-4 p-2 hover:bg-orange-600 rounded-full transition-colors flex-shrink-0"
                title="Back to Settings"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
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