import React, { useState } from 'react'
import {
  Instagram, Linkedin, Github, Youtube,
  Facebook, Globe, Music, Twitch, Eye, EyeOff, MessageCircle,
  Camera, Play, Headphones, Gamepad2, Briefcase, Code,
  ShoppingBag, Heart, Palette, BookOpen, Zap, Hash, AlertTriangle
} from 'lucide-react'
import { SocialLink } from '../../lib/supabase'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

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
  twitter: XIcon, // Backward compatibility
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
  discord: MessageCircle,
  telegram: MessageCircle,
  whatsapp: MessageCircle,
  reddit: MessageCircle,
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
  onlyfans: Heart,
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
  email: MessageCircle,
  phone: MessageCircle,
  contact: MessageCircle,
  booking: Briefcase,
  appointment: Briefcase,
  consultation: Briefcase,
  store: ShoppingBag,
  shop: ShoppingBag,
  marketplace: ShoppingBag,
  other: Globe,
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

interface SocialLinkCardProps {
  link: SocialLink
  isOwner?: boolean
  onEdit?: (link: SocialLink) => void
  onToggleVisibility?: (link: SocialLink) => void
  onDelete?: (link: SocialLink) => void
}

export function SocialLinkCard({
  link,
  isOwner = false,
  onEdit,
  onToggleVisibility,
  onDelete
}: SocialLinkCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const Icon = platformIcons[link.platform] || Globe
  const colorClass = platformColors[link.platform] || 'from-gray-600 to-gray-800'
  
  const displayName = link.display_name || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

  return (
    <div className="group relative">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {link.url.replace(/^https?:\/\//, '')}
            </p>
          </div>
          {!link.is_visible && (
            <EyeOff className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
        </div>
      </a>

      {isOwner && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleVisibility?.(link)
              }}
              className="p-1 sm:p-1.5 bg-gray-800 bg-opacity-80 rounded text-white hover:bg-opacity-100 transition-colors"
            >
              {link.is_visible ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                onEdit?.(link)
              }}
              className="p-1 sm:p-1.5 bg-blue-600 bg-opacity-80 rounded text-white hover:bg-opacity-100 transition-colors"
            >
              <span className="text-xs sm:text-sm">✎</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowDeleteModal(true)
              }}
              className="p-1 sm:p-1.5 bg-red-600 bg-opacity-80 rounded text-white hover:bg-opacity-100 transition-colors"
            >
              <span className="text-xs sm:text-sm">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Social Link"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Are you sure you want to delete this link?
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {link.url}
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete?.(link)
                setShowDeleteModal(false)
              }}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}