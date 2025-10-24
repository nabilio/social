import React from 'react'
import { Instagram, Facebook, Twitter, Youtube, Music2, Globe, MessageCircle, Camera, Linkedin, Github, Send, DollarSign, Video, ShoppingBag, Palette, BookOpen, Mail, Phone, Lock, Wallet, Calendar, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface OnboardingStep3Props {
  selectedPlatforms: string[]
  platformUsernames: Record<string, string>
  onUpdateUsername: (platform: string, username: string) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

const PLATFORM_CONFIG: Record<string, { name: string, icon: any, placeholder: string, color: string }> = {
  instagram: { name: 'Instagram', icon: Instagram, placeholder: 'Username', color: 'from-purple-600 to-pink-600' },
  whatsapp: { name: 'WhatsApp', icon: MessageCircle, placeholder: 'WhatsApp phone number', color: 'from-green-500 to-green-600' },
  tiktok: { name: 'TikTok', icon: Music2, placeholder: '@username', color: 'from-black to-gray-800' },
  youtube: { name: 'YouTube', icon: Youtube, placeholder: 'Username', color: 'from-red-600 to-red-700' },
  website: { name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com', color: 'from-gray-600 to-gray-700' },
  spotify: { name: 'Spotify', icon: Music2, placeholder: 'Username', color: 'from-green-500 to-green-600' },
  threads: { name: 'Threads', icon: MessageCircle, placeholder: '@username', color: 'from-black to-gray-700' },
  facebook: { name: 'Facebook', icon: Facebook, placeholder: 'Facebook.com/username', color: 'from-blue-600 to-blue-700' },
  twitter: { name: 'X', icon: Twitter, placeholder: '@username', color: 'from-black to-gray-800' },
  soundcloud: { name: 'SoundCloud', icon: Music2, placeholder: 'Username', color: 'from-orange-500 to-orange-600' },
  snapchat: { name: 'Snapchat', icon: Camera, placeholder: 'Username', color: 'from-yellow-400 to-yellow-500' },
  pinterest: { name: 'Pinterest', icon: Camera, placeholder: 'Username', color: 'from-red-600 to-red-700' },
  patreon: { name: 'Patreon', icon: DollarSign, placeholder: 'Username', color: 'from-orange-600 to-red-600' },
  twitch: { name: 'Twitch', icon: Video, placeholder: 'Username', color: 'from-purple-600 to-purple-700' },
  'apple-music': { name: 'Apple Music', icon: Music2, placeholder: 'Username', color: 'from-red-500 to-pink-600' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, placeholder: 'Username', color: 'from-blue-600 to-blue-700' },
  discord: { name: 'Discord', icon: MessageCircle, placeholder: 'Username#1234', color: 'from-indigo-600 to-blue-600' },
  telegram: { name: 'Telegram', icon: Send, placeholder: '@username', color: 'from-blue-400 to-blue-600' },
  reddit: { name: 'Reddit', icon: MessageCircle, placeholder: 'u/username', color: 'from-orange-600 to-red-600' },
  github: { name: 'GitHub', icon: Github, placeholder: 'Username', color: 'from-gray-700 to-black' },
  behance: { name: 'Behance', icon: Palette, placeholder: 'Username', color: 'from-blue-600 to-blue-800' },
  dribbble: { name: 'Dribbble', icon: Palette, placeholder: 'Username', color: 'from-pink-500 to-pink-700' },
  medium: { name: 'Medium', icon: BookOpen, placeholder: '@username', color: 'from-black to-gray-800' },
  substack: { name: 'Substack', icon: Mail, placeholder: 'yourname.substack.com', color: 'from-orange-500 to-orange-700' },
  vimeo: { name: 'Vimeo', icon: Video, placeholder: 'Username', color: 'from-blue-500 to-blue-700' },
  flickr: { name: 'Flickr', icon: Camera, placeholder: 'Username', color: 'from-pink-500 to-blue-600' },
  tumblr: { name: 'Tumblr', icon: BookOpen, placeholder: 'yourblog.tumblr.com', color: 'from-blue-800 to-indigo-900' },
  mastodon: { name: 'Mastodon', icon: Users, placeholder: '@username@instance.social', color: 'from-purple-600 to-blue-600' },
  bluesky: { name: 'Bluesky', icon: MessageCircle, placeholder: '@username.bsky.social', color: 'from-blue-400 to-blue-600' },
  clubhouse: { name: 'Clubhouse', icon: MessageCircle, placeholder: '@username', color: 'from-yellow-500 to-orange-500' },
  'cash-app': { name: 'Cash App', icon: DollarSign, placeholder: '$username', color: 'from-green-500 to-green-700' },
  venmo: { name: 'Venmo', icon: DollarSign, placeholder: '@username', color: 'from-blue-500 to-blue-700' },
  paypal: { name: 'PayPal', icon: Wallet, placeholder: 'paypal.me/username', color: 'from-blue-600 to-blue-800' },
  'ko-fi': { name: 'Ko-fi', icon: DollarSign, placeholder: 'ko-fi.com/username', color: 'from-red-500 to-pink-600' },
  'buy-me-coffee': { name: 'Buy Me a Coffee', icon: DollarSign, placeholder: 'buymeacoffee.com/username', color: 'from-yellow-500 to-orange-500' },
  gofundme: { name: 'GoFundMe', icon: DollarSign, placeholder: 'gofundme.com/f/your-campaign', color: 'from-green-600 to-teal-600' },
  linktree: { name: 'Linktree', icon: Globe, placeholder: 'linktr.ee/username', color: 'from-green-400 to-green-600' },
  calendly: { name: 'Calendly', icon: Calendar, placeholder: 'calendly.com/username', color: 'from-blue-500 to-blue-700' },
  zoom: { name: 'Zoom', icon: Video, placeholder: 'zoom.us/j/your-meeting-id', color: 'from-blue-500 to-blue-700' },
  'whatsapp-business': { name: 'WhatsApp Business', icon: MessageCircle, placeholder: 'Phone number', color: 'from-green-600 to-teal-700' },
  line: { name: 'LINE', icon: MessageCircle, placeholder: 'LINE ID', color: 'from-green-500 to-green-600' },
  wechat: { name: 'WeChat', icon: MessageCircle, placeholder: 'WeChat ID', color: 'from-green-600 to-green-700' },
  viber: { name: 'Viber', icon: Phone, placeholder: 'Phone number', color: 'from-purple-600 to-purple-700' },
  signal: { name: 'Signal', icon: Lock, placeholder: 'Phone number', color: 'from-blue-600 to-blue-800' },
  skype: { name: 'Skype', icon: Video, placeholder: 'Skype ID', color: 'from-blue-500 to-blue-700' },
  etsy: { name: 'Etsy', icon: ShoppingBag, placeholder: 'etsy.com/shop/yourshop', color: 'from-orange-500 to-orange-700' },
  shopify: { name: 'Shopify', icon: ShoppingBag, placeholder: 'yourstore.myshopify.com', color: 'from-green-600 to-green-800' },
  amazon: { name: 'Amazon', icon: ShoppingBag, placeholder: 'amazon.com/shops/yourshop', color: 'from-orange-400 to-yellow-600' },
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
    soundcloud: `https://soundcloud.com/${cleanUsername}`,
    vimeo: `https://vimeo.com/${cleanUsername}`,
    flickr: `https://flickr.com/people/${cleanUsername}`,
    tumblr: cleanUsername.includes('.') ? `https://${cleanUsername}` : `https://${cleanUsername}.tumblr.com`,
    'cash-app': `https://cash.app/$${cleanUsername.replace('$', '')}`,
    venmo: `https://venmo.com/${cleanUsername.replace('@', '')}`,
    paypal: cleanUsername.includes('paypal.me') ? `https://${cleanUsername}` : `https://paypal.me/${cleanUsername}`,
    'ko-fi': cleanUsername.includes('ko-fi.com') ? `https://${cleanUsername}` : `https://ko-fi.com/${cleanUsername}`,
    'buy-me-coffee': cleanUsername.includes('buymeacoffee.com') ? `https://${cleanUsername}` : `https://buymeacoffee.com/${cleanUsername}`,
    gofundme: cleanUsername.includes('gofundme.com') ? `https://${cleanUsername}` : cleanUsername,
    linktree: cleanUsername.includes('linktr.ee') ? `https://${cleanUsername}` : `https://linktr.ee/${cleanUsername}`,
    calendly: cleanUsername.includes('calendly.com') ? `https://${cleanUsername}` : `https://calendly.com/${cleanUsername}`,
    mastodon: cleanUsername.includes('@') ? `https://${cleanUsername.split('@')[2]}/@${cleanUsername.split('@')[1]}` : cleanUsername,
    bluesky: cleanUsername.includes('.') ? `https://bsky.app/profile/${cleanUsername}` : `https://bsky.app/profile/${cleanUsername}.bsky.social`,
    'apple-music': `https://music.apple.com/profile/${cleanUsername}`,
    patreon: `https://patreon.com/${cleanUsername}`,
    'whatsapp-business': `https://wa.me/${cleanUsername.replace(/\D/g, '')}`,
    line: cleanUsername,
    wechat: cleanUsername,
    viber: cleanUsername,
    signal: cleanUsername,
    skype: `skype:${cleanUsername}?chat`,
    etsy: cleanUsername.includes('etsy.com') ? `https://${cleanUsername}` : `https://etsy.com/shop/${cleanUsername}`,
    shopify: cleanUsername.includes('.') ? `https://${cleanUsername}` : `https://${cleanUsername}.myshopify.com`,
    amazon: cleanUsername.includes('amazon.com') ? `https://${cleanUsername}` : cleanUsername,
    zoom: cleanUsername.includes('zoom.us') ? `https://${cleanUsername}` : cleanUsername,
  }

  return templates[platform] || cleanUsername
}

export function OnboardingStep3({ selectedPlatforms, platformUsernames, onUpdateUsername, onNext, onBack, onSkip }: OnboardingStep3Props) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        Your selections
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Add your usernames for each platform
      </p>

      <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto px-2">
        {selectedPlatforms.map((platformId) => {
          const config = PLATFORM_CONFIG[platformId]
          if (!config) return null

          const Icon = config.icon

          const currentUsername = platformUsernames[platformId] || ''
          const previewUrl = currentUsername ? buildUrlFromUsername(platformId, currentUsername) : ''

          return (
            <div key={platformId} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {config.name}
                  </label>
                  <Input
                    type="text"
                    placeholder={config.placeholder}
                    value={currentUsername}
                    onChange={(e) => onUpdateUsername(platformId, e.target.value)}
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

      <Button
        onClick={onNext}
        className="w-full py-4 text-lg"
      >
        Continue
      </Button>
    </div>
  )
}
