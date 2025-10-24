import React, { useState, useMemo } from 'react'
import { Instagram, Facebook, Twitter, Youtube, Music2, Globe, MessageCircle, Camera, Linkedin, Github, Send, DollarSign, Video, ShoppingBag, Code, Palette, BookOpen, Mail, Phone, Lock, Wallet, Calendar, Users, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface OnboardingStep2Props {
  selectedPlatforms: string[]
  onTogglePlatform: (platform: string) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-600 to-pink-600', category: 'social' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'from-green-500 to-green-600', category: 'messaging' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'from-black to-gray-800', category: 'social' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-600 to-red-700', category: 'video' },
  { id: 'website', name: 'Website', icon: Globe, color: 'from-gray-600 to-gray-700', category: 'other' },
  { id: 'spotify', name: 'Spotify', icon: Music2, color: 'from-green-500 to-green-600', category: 'music' },
  { id: 'threads', name: 'Threads', icon: MessageCircle, color: 'from-black to-gray-700', category: 'social' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', category: 'social' },
  { id: 'twitter', name: 'X', icon: Twitter, color: 'from-black to-gray-800', category: 'social' },
  { id: 'soundcloud', name: 'SoundCloud', icon: Music2, color: 'from-orange-500 to-orange-600', category: 'music' },
  { id: 'snapchat', name: 'Snapchat', icon: Camera, color: 'from-yellow-400 to-yellow-500', category: 'social' },
  { id: 'pinterest', name: 'Pinterest', icon: Camera, color: 'from-red-600 to-red-700', category: 'social' },
  { id: 'patreon', name: 'Patreon', icon: DollarSign, color: 'from-orange-600 to-red-600', category: 'payment' },
  { id: 'twitch', name: 'Twitch', icon: Video, color: 'from-purple-600 to-purple-700', category: 'video' },
  { id: 'apple-music', name: 'Apple Music', icon: Music2, color: 'from-red-500 to-pink-600', category: 'music' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700', category: 'professional' },
  { id: 'discord', name: 'Discord', icon: MessageCircle, color: 'from-indigo-600 to-blue-600', category: 'messaging' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'from-blue-400 to-blue-600', category: 'messaging' },
  { id: 'reddit', name: 'Reddit', icon: MessageCircle, color: 'from-orange-600 to-red-600', category: 'social' },
  { id: 'github', name: 'GitHub', icon: Github, color: 'from-gray-700 to-black', category: 'professional' },
  { id: 'behance', name: 'Behance', icon: Palette, color: 'from-blue-600 to-blue-800', category: 'creative' },
  { id: 'dribbble', name: 'Dribbble', icon: Palette, color: 'from-pink-500 to-pink-700', category: 'creative' },
  { id: 'medium', name: 'Medium', icon: BookOpen, color: 'from-black to-gray-800', category: 'content' },
  { id: 'substack', name: 'Substack', icon: Mail, color: 'from-orange-500 to-orange-700', category: 'content' },
  { id: 'vimeo', name: 'Vimeo', icon: Video, color: 'from-blue-500 to-blue-700', category: 'video' },
  { id: 'flickr', name: 'Flickr', icon: Camera, color: 'from-pink-500 to-blue-600', category: 'creative' },
  { id: 'tumblr', name: 'Tumblr', icon: BookOpen, color: 'from-blue-800 to-indigo-900', category: 'content' },
  { id: 'mastodon', name: 'Mastodon', icon: Users, color: 'from-purple-600 to-blue-600', category: 'social' },
  { id: 'bluesky', name: 'Bluesky', icon: MessageCircle, color: 'from-blue-400 to-blue-600', category: 'social' },
  { id: 'clubhouse', name: 'Clubhouse', icon: MessageCircle, color: 'from-yellow-500 to-orange-500', category: 'social' },
  { id: 'cash-app', name: 'Cash App', icon: DollarSign, color: 'from-green-500 to-green-700', category: 'payment' },
  { id: 'venmo', name: 'Venmo', icon: DollarSign, color: 'from-blue-500 to-blue-700', category: 'payment' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, color: 'from-blue-600 to-blue-800', category: 'payment' },
  { id: 'ko-fi', name: 'Ko-fi', icon: DollarSign, color: 'from-red-500 to-pink-600', category: 'payment' },
  { id: 'buy-me-coffee', name: 'Buy Me a Coffee', icon: DollarSign, color: 'from-yellow-500 to-orange-500', category: 'payment' },
  { id: 'gofundme', name: 'GoFundMe', icon: DollarSign, color: 'from-green-600 to-teal-600', category: 'payment' },
  { id: 'linktree', name: 'Linktree', icon: Globe, color: 'from-green-400 to-green-600', category: 'other' },
  { id: 'calendly', name: 'Calendly', icon: Calendar, color: 'from-blue-500 to-blue-700', category: 'business' },
  { id: 'zoom', name: 'Zoom', icon: Video, color: 'from-blue-500 to-blue-700', category: 'business' },
  { id: 'whatsapp-business', name: 'WhatsApp Business', icon: MessageCircle, color: 'from-green-600 to-teal-700', category: 'business' },
  { id: 'line', name: 'LINE', icon: MessageCircle, color: 'from-green-500 to-green-600', category: 'messaging' },
  { id: 'wechat', name: 'WeChat', icon: MessageCircle, color: 'from-green-600 to-green-700', category: 'messaging' },
  { id: 'viber', name: 'Viber', icon: Phone, color: 'from-purple-600 to-purple-700', category: 'messaging' },
  { id: 'signal', name: 'Signal', icon: Lock, color: 'from-blue-600 to-blue-800', category: 'messaging' },
  { id: 'skype', name: 'Skype', icon: Video, color: 'from-blue-500 to-blue-700', category: 'business' },
  { id: 'etsy', name: 'Etsy', icon: ShoppingBag, color: 'from-orange-500 to-orange-700', category: 'shopping' },
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: 'from-green-600 to-green-800', category: 'shopping' },
  { id: 'amazon', name: 'Amazon', icon: ShoppingBag, color: 'from-orange-400 to-yellow-600', category: 'shopping' },
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

export function OnboardingStep2({ selectedPlatforms, onTogglePlatform, onNext, onBack, onSkip }: OnboardingStep2Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPlatforms = useMemo(() => {
    return SOCIAL_PLATFORMS.filter(platform => {
      const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '66%' }}></div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        Select your social networks
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        You can update at any time.
      </p>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
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

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12 max-h-[60vh] overflow-y-auto px-2">
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
                onClick={() => onTogglePlatform(platform.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-md`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {platform.name}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>

      <Button
        onClick={onNext}
        disabled={selectedPlatforms.length === 0}
        className="w-full py-4 text-lg"
      >
        Continue
      </Button>
    </div>
  )
}
