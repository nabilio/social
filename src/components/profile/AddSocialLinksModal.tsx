import React, { useState, useMemo } from 'react'
import { Instagram, Facebook, Twitter, Youtube, Music2, Globe, MessageCircle, Camera, Linkedin, Github, Send, DollarSign, Video, ShoppingBag, Palette, BookOpen, Mail, Phone, Lock, Wallet, Calendar, Users, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface AddSocialLinksModalProps {
  isOpen: boolean
  onClose: () => void
  profileId: string
  userId: string
  onSuccess: () => void
}

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-600 to-pink-600', placeholder: 'Username', category: 'social' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'from-green-500 to-green-600', placeholder: 'WhatsApp phone number', category: 'messaging' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'from-black to-gray-800', placeholder: '@username', category: 'social' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-600 to-red-700', placeholder: 'Username', category: 'video' },
  { id: 'website', name: 'Website', icon: Globe, color: 'from-gray-600 to-gray-700', placeholder: 'https://yourwebsite.com', category: 'other' },
  { id: 'spotify', name: 'Spotify', icon: Music2, color: 'from-green-500 to-green-600', placeholder: 'Username', category: 'music' },
  { id: 'threads', name: 'Threads', icon: MessageCircle, color: 'from-black to-gray-700', placeholder: '@username', category: 'social' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', placeholder: 'Facebook.com/username', category: 'social' },
  { id: 'twitter', name: 'X', icon: Twitter, color: 'from-black to-gray-800', placeholder: '@username', category: 'social' },
  { id: 'soundcloud', name: 'SoundCloud', icon: Music2, color: 'from-orange-500 to-orange-600', placeholder: 'Username', category: 'music' },
  { id: 'snapchat', name: 'Snapchat', icon: Camera, color: 'from-yellow-400 to-yellow-500', placeholder: 'Username', category: 'social' },
  { id: 'pinterest', name: 'Pinterest', icon: Camera, color: 'from-red-600 to-red-700', placeholder: 'Username', category: 'social' },
  { id: 'patreon', name: 'Patreon', icon: DollarSign, color: 'from-orange-600 to-red-600', placeholder: 'Username', category: 'payment' },
  { id: 'twitch', name: 'Twitch', icon: Video, color: 'from-purple-600 to-purple-700', placeholder: 'Username', category: 'video' },
  { id: 'apple-music', name: 'Apple Music', icon: Music2, color: 'from-red-500 to-pink-600', placeholder: 'Username', category: 'music' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700', placeholder: 'Username', category: 'professional' },
  { id: 'discord', name: 'Discord', icon: MessageCircle, color: 'from-indigo-600 to-blue-600', placeholder: 'Username#1234', category: 'messaging' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'from-blue-400 to-blue-600', placeholder: '@username', category: 'messaging' },
  { id: 'reddit', name: 'Reddit', icon: MessageCircle, color: 'from-orange-600 to-red-600', placeholder: 'u/username', category: 'social' },
  { id: 'github', name: 'GitHub', icon: Github, color: 'from-gray-700 to-black', placeholder: 'Username', category: 'professional' },
  { id: 'behance', name: 'Behance', icon: Palette, color: 'from-blue-600 to-blue-800', placeholder: 'Username', category: 'creative' },
  { id: 'dribbble', name: 'Dribbble', icon: Palette, color: 'from-pink-500 to-pink-700', placeholder: 'Username', category: 'creative' },
  { id: 'medium', name: 'Medium', icon: BookOpen, color: 'from-black to-gray-800', placeholder: '@username', category: 'content' },
  { id: 'substack', name: 'Substack', icon: Mail, color: 'from-orange-500 to-orange-700', placeholder: 'yourname.substack.com', category: 'content' },
  { id: 'vimeo', name: 'Vimeo', icon: Video, color: 'from-blue-500 to-blue-700', placeholder: 'Username', category: 'video' },
  { id: 'flickr', name: 'Flickr', icon: Camera, color: 'from-pink-500 to-blue-600', placeholder: 'Username', category: 'creative' },
  { id: 'tumblr', name: 'Tumblr', icon: BookOpen, color: 'from-blue-800 to-indigo-900', placeholder: 'yourblog.tumblr.com', category: 'content' },
  { id: 'mastodon', name: 'Mastodon', icon: Users, color: 'from-purple-600 to-blue-600', placeholder: '@username@instance.social', category: 'social' },
  { id: 'bluesky', name: 'Bluesky', icon: MessageCircle, color: 'from-blue-400 to-blue-600', placeholder: '@username.bsky.social', category: 'social' },
  { id: 'clubhouse', name: 'Clubhouse', icon: MessageCircle, color: 'from-yellow-500 to-orange-500', placeholder: '@username', category: 'social' },
  { id: 'cash-app', name: 'Cash App', icon: DollarSign, color: 'from-green-500 to-green-700', placeholder: '$username', category: 'payment' },
  { id: 'venmo', name: 'Venmo', icon: DollarSign, color: 'from-blue-500 to-blue-700', placeholder: '@username', category: 'payment' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, color: 'from-blue-600 to-blue-800', placeholder: 'paypal.me/username', category: 'payment' },
  { id: 'ko-fi', name: 'Ko-fi', icon: DollarSign, color: 'from-red-500 to-pink-600', placeholder: 'ko-fi.com/username', category: 'payment' },
  { id: 'buy-me-coffee', name: 'Buy Me a Coffee', icon: DollarSign, color: 'from-yellow-500 to-orange-500', placeholder: 'buymeacoffee.com/username', category: 'payment' },
  { id: 'gofundme', name: 'GoFundMe', icon: DollarSign, color: 'from-green-600 to-teal-600', placeholder: 'gofundme.com/f/your-campaign', category: 'payment' },
  { id: 'linktree', name: 'Linktree', icon: Globe, color: 'from-green-400 to-green-600', placeholder: 'linktr.ee/username', category: 'other' },
  { id: 'calendly', name: 'Calendly', icon: Calendar, color: 'from-blue-500 to-blue-700', placeholder: 'calendly.com/username', category: 'business' },
  { id: 'zoom', name: 'Zoom', icon: Video, color: 'from-blue-500 to-blue-700', placeholder: 'zoom.us/j/your-meeting-id', category: 'business' },
  { id: 'whatsapp-business', name: 'WhatsApp Business', icon: MessageCircle, color: 'from-green-600 to-teal-700', placeholder: 'Phone number', category: 'business' },
  { id: 'line', name: 'LINE', icon: MessageCircle, color: 'from-green-500 to-green-600', placeholder: 'LINE ID', category: 'messaging' },
  { id: 'wechat', name: 'WeChat', icon: MessageCircle, color: 'from-green-600 to-green-700', placeholder: 'WeChat ID', category: 'messaging' },
  { id: 'viber', name: 'Viber', icon: Phone, color: 'from-purple-600 to-purple-700', placeholder: 'Phone number', category: 'messaging' },
  { id: 'signal', name: 'Signal', icon: Lock, color: 'from-blue-600 to-blue-800', placeholder: 'Phone number', category: 'messaging' },
  { id: 'skype', name: 'Skype', icon: Video, color: 'from-blue-500 to-blue-700', placeholder: 'Skype ID', category: 'business' },
  { id: 'etsy', name: 'Etsy', icon: ShoppingBag, color: 'from-orange-500 to-orange-700', placeholder: 'etsy.com/shop/yourshop', category: 'shopping' },
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: 'from-green-600 to-green-800', placeholder: 'yourstore.myshopify.com', category: 'shopping' },
  { id: 'amazon', name: 'Amazon', icon: ShoppingBag, color: 'from-orange-400 to-yellow-600', placeholder: 'amazon.com/shops/yourshop', category: 'shopping' },
]

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'social', name: 'Social Media' },
  { id: 'messaging', name: 'Messaging' },
  { id: 'video', name: 'Video' },
  { id: 'music', name: 'Music' },
  { id: 'payment', name: 'Payment' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' },
  { id: 'content', name: 'Content' },
  { id: 'business', name: 'Business' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'other', name: 'Other' },
]

export function AddSocialLinksModal({ isOpen, onClose, profileId, userId, onSuccess }: AddSocialLinksModalProps) {
  const [step, setStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [platformData, setPlatformData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPlatforms = useMemo(() => {
    return SOCIAL_PLATFORMS.filter(platform => {
      const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId)
      } else {
        return [...prev, platformId]
      }
    })
  }

  const handleNext = () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }
    setStep(2)
  }

  const handleUpdateData = (platformId: string, value: string) => {
    setPlatformData(prev => ({
      ...prev,
      [platformId]: value
    }))
  }

  // Helper function to build URL from username
  const buildUrlFromUsername = (platform: string, username: string): string => {
    if (!username) return ''

    // Clean username
    const cleanUsername = username.trim()

    // If it's already a full URL, return it
    if (cleanUsername.startsWith('http://') || cleanUsername.startsWith('https://')) {
      return cleanUsername
    }

    // Platform-specific URL templates
    const templates: Record<string, string> = {
      instagram: `https://instagram.com/${cleanUsername.replace('@', '')}`,
      tiktok: `https://tiktok.com/@${cleanUsername.replace('@', '')}`,
      twitter: `https://x.com/${cleanUsername.replace('@', '')}`,
      youtube: `https://youtube.com/@${cleanUsername.replace('@', '')}`,
      facebook: `https://facebook.com/${cleanUsername}`,
      linkedin: `https://linkedin.com/in/${cleanUsername}`,
      github: `https://github.com/${cleanUsername}`,
      spotify: `https://open.spotify.com/user/${cleanUsername}`,
      snapchat: `https://snapchat.com/add/${cleanUsername}`,
      pinterest: `https://pinterest.com/${cleanUsername}`,
      reddit: `https://reddit.com/u/${cleanUsername.replace('u/', '')}`,
      discord: `https://discord.gg/${cleanUsername}`,
      telegram: `https://t.me/${cleanUsername.replace('@', '')}`,
      whatsapp: `https://wa.me/${cleanUsername.replace(/\D/g, '')}`,
      twitch: `https://twitch.tv/${cleanUsername}`,
      threads: `https://threads.net/@${cleanUsername.replace('@', '')}`,
      medium: `https://medium.com/@${cleanUsername.replace('@', '')}`,
      behance: `https://behance.net/${cleanUsername}`,
      dribbble: `https://dribbble.com/${cleanUsername}`,
      'cash-app': `https://cash.app/$${cleanUsername.replace('$', '')}`,
      venmo: `https://venmo.com/${cleanUsername.replace('@', '')}`,
      mastodon: cleanUsername.includes('@') ? `https://${cleanUsername.split('@')[2]}/@${cleanUsername.split('@')[1]}` : cleanUsername,
      bluesky: cleanUsername.includes('.') ? `https://bsky.app/profile/${cleanUsername}` : `https://bsky.app/profile/${cleanUsername}.bsky.social`,
    }

    return templates[platform] || cleanUsername
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data: existingLinks } = await supabase
        .from('social_links')
        .select('order_index')
        .eq('profile_id', profileId)
        .order('order_index', { ascending: false })
        .limit(1)

      let nextOrderIndex = existingLinks && existingLinks.length > 0
        ? existingLinks[0].order_index + 1
        : 0

      for (const platformId of selectedPlatforms) {
        const username = platformData[platformId]
        if (!username || !username.trim()) continue

        // Build full URL from username
        const fullUrl = buildUrlFromUsername(platformId, username)

        const { error } = await supabase
          .from('social_links')
          .insert({
            user_id: userId,
            profile_id: profileId,
            platform: platformId,
            url: fullUrl,
            display_name: platformId,
            is_visible: true,
            order_index: nextOrderIndex++
          })

        if (error) throw error
      }

      toast.success('Social links added successfully!')
      handleReset()
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Error adding social links:', error)
      toast.error(error.message || 'Failed to add social links')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setSelectedPlatforms([])
    setPlatformData({})
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Select Platforms' : 'Add Your Links'}
      size="large"
    >
      {step === 1 ? (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Choose the social platforms you want to add
          </p>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search platforms..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-2">
            {filteredPlatforms.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No platforms found</p>
              </div>
            ) : (
              filteredPlatforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.id)

                return (
                  <button
                    key={platform.id}
                    onClick={() => handleTogglePlatform(platform.id)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                      {platform.name}
                    </span>
                    {isSelected && (
                      <div className="mt-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={selectedPlatforms.length === 0}>
              Next ({selectedPlatforms.length} selected)
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Enter your username or URL for each platform
          </p>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
            {selectedPlatforms.map((platformId) => {
              const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId)
              if (!platform) return null

              const Icon = platform.icon

              const currentUsername = platformData[platformId] || ''
              const previewUrl = currentUsername ? buildUrlFromUsername(platformId, currentUsername) : ''

              return (
                <div key={platformId} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {platform.name}
                      </label>
                      <Input
                        type="text"
                        placeholder={platform.placeholder}
                        value={currentUsername}
                        onChange={(e) => handleUpdateData(platformId, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* URL Preview */}
                  {previewUrl && (
                    <div className="ml-16 pl-4 border-l-2 border-blue-500">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        URL Preview:
                      </p>
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {previewUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Add Links
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
