import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { 
  Instagram, Linkedin, Github, Youtube, 
  Facebook, Globe, Music, Twitch, ExternalLink, MessageCircle,
  Camera, Play, Headphones, Gamepad2, Briefcase, Code,
  ShoppingBag, Heart, Palette, BookOpen, Zap, Hash
} from 'lucide-react'

interface SocialLinkFormProps {
  initialData?: {
    platform: string
    url: string
    display_name: string
  }
  onSubmit: (data: { platform: string; url: string; displayName?: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

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

const platformTemplates: Record<string, { 
  template: string
  placeholder: string
  label: string
  extractUsername: (input: string) => string
}> = {
  instagram: {
    template: 'https://instagram.com/{username}',
    placeholder: 'your_username',
    label: 'Instagram Username',
    extractUsername: (input) => {
      const match = input.match(/(?:instagram\.com\/|@)?([a-zA-Z0-9_.]+)/i)
      return match ? match[1] : input
    }
  },
  x: {
    template: 'https://x.com/{username}',
    placeholder: 'your_handle',
    label: 'X (Twitter) Handle',
    extractUsername: (input) => {
      const match = input.match(/(?:twitter\.com\/|x\.com\/|@)?([a-zA-Z0-9_]+)/i)
      return match ? match[1] : input
    }
  },
  twitter: {
    template: 'https://x.com/{username}',
    placeholder: 'your_handle',
    label: 'X (Twitter) Handle',
    extractUsername: (input) => {
      const match = input.match(/(?:twitter\.com\/|x\.com\/|@)?([a-zA-Z0-9_]+)/i)
      return match ? match[1] : input
    }
  },
  linkedin: {
    template: 'https://www.linkedin.com/in/{username}',
    placeholder: 'your-profile-name',
    label: 'LinkedIn Profile Name',
    extractUsername: (input) => {
      const match = input.match(/(?:linkedin\.com\/in\/)?([a-zA-Z0-9-]+)/i)
      return match ? match[1] : input
    }
  },
  github: {
    template: 'https://github.com/{username}',
    placeholder: 'your_username',
    label: 'GitHub Username',
    extractUsername: (input) => {
      const match = input.match(/(?:github\.com\/)?([a-zA-Z0-9-]+)/i)
      return match ? match[1] : input
    }
  },
  youtube: {
    template: 'https://youtube.com/@{username}',
    placeholder: 'your_channel',
    label: 'YouTube Channel Handle',
    extractUsername: (input) => {
      const match = input.match(/(?:youtube\.com\/(?:@|c\/|channel\/|user\/)?)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  facebook: {
    template: 'https://facebook.com/{username}',
    placeholder: 'your.profile',
    label: 'Facebook Profile',
    extractUsername: (input) => {
      const match = input.match(/(?:facebook\.com\/)?([a-zA-Z0-9.]+)/i)
      return match ? match[1] : input
    }
  },
  tiktok: {
    template: 'https://tiktok.com/@{username}',
    placeholder: 'your_username',
    label: 'TikTok Username',
    extractUsername: (input) => {
      const match = input.match(/(?:tiktok\.com\/(?:@)?)?([a-zA-Z0-9_.]+)/i)
      return match ? match[1] : input
    }
  },
  pinterest: {
    template: 'https://pinterest.com/{username}',
    placeholder: 'your_username',
    label: 'Pinterest Username',
    extractUsername: (input) => {
      const match = input.match(/(?:pinterest\.com\/)?([a-zA-Z0-9_]+)/i)
      return match ? match[1] : input
    }
  },
  snapchat: {
    template: 'https://snapchat.com/add/{username}',
    placeholder: 'your_username',
    label: 'Snapchat Username',
    extractUsername: (input) => {
      const match = input.match(/(?:snapchat\.com\/add\/)?([a-zA-Z0-9._-]+)/i)
      return match ? match[1] : input
    }
  },
  discord: {
    template: 'https://discord.gg/{username}',
    placeholder: 'server_invite_or_username',
    label: 'Discord Server/Username',
    extractUsername: (input) => {
      const match = input.match(/(?:discord\.gg\/|discord\.com\/invite\/)?([a-zA-Z0-9]+)/i)
      return match ? match[1] : input
    }
  },
  telegram: {
    template: 'https://t.me/{username}',
    placeholder: 'your_username',
    label: 'Telegram Username',
    extractUsername: (input) => {
      const match = input.match(/(?:t\.me\/|@)?([a-zA-Z0-9_]+)/i)
      return match ? match[1] : input
    }
  },
  whatsapp: {
    template: 'https://wa.me/{username}',
    placeholder: '1234567890',
    label: 'WhatsApp Number (with country code)',
    extractUsername: (input) => {
      const match = input.match(/(?:wa\.me\/)?(\d+)/i)
      return match ? match[1] : input.replace(/\D/g, '')
    }
  },
  reddit: {
    template: 'https://reddit.com/u/{username}',
    placeholder: 'your_username',
    label: 'Reddit Username',
    extractUsername: (input) => {
      const match = input.match(/(?:reddit\.com\/u\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  medium: {
    template: 'https://medium.com/@{username}',
    placeholder: 'your_username',
    label: 'Medium Username',
    extractUsername: (input) => {
      const match = input.match(/(?:medium\.com\/@)?([a-zA-Z0-9._-]+)/i)
      return match ? match[1] : input
    }
  },
  behance: {
    template: 'https://behance.net/{username}',
    placeholder: 'your_username',
    label: 'Behance Username',
    extractUsername: (input) => {
      const match = input.match(/(?:behance\.net\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  dribbble: {
    template: 'https://dribbble.com/{username}',
    placeholder: 'your_username',
    label: 'Dribbble Username',
    extractUsername: (input) => {
      const match = input.match(/(?:dribbble\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  figma: {
    template: 'https://figma.com/@{username}',
    placeholder: 'your_username',
    label: 'Figma Username',
    extractUsername: (input) => {
      const match = input.match(/(?:figma\.com\/@)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  deviantart: {
    template: 'https://{username}.deviantart.com',
    placeholder: 'your_username',
    label: 'DeviantArt Username',
    extractUsername: (input) => {
      const match = input.match(/(?:([a-zA-Z0-9_-]+)\.deviantart\.com|deviantart\.com\/([a-zA-Z0-9_-]+))/i)
      return match ? (match[1] || match[2]) : input
    }
  },
  etsy: {
    template: 'https://etsy.com/shop/{username}',
    placeholder: 'your_shop_name',
    label: 'Etsy Shop Name',
    extractUsername: (input) => {
      const match = input.match(/(?:etsy\.com\/shop\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  shopify: {
    template: 'https://{username}.myshopify.com',
    placeholder: 'your_store_name',
    label: 'Shopify Store Name',
    extractUsername: (input) => {
      const match = input.match(/(?:([a-zA-Z0-9_-]+)\.myshopify\.com|myshopify\.com\/([a-zA-Z0-9_-]+))/i)
      return match ? (match[1] || match[2]) : input
    }
  },
  amazon: {
    template: 'https://amazon.com/dp/{username}',
    placeholder: 'product_id_or_store',
    label: 'Amazon Product/Store',
    extractUsername: (input) => input
  },
  patreon: {
    template: 'https://patreon.com/{username}',
    placeholder: 'your_username',
    label: 'Patreon Username',
    extractUsername: (input) => {
      const match = input.match(/(?:patreon\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  kofi: {
    template: 'https://ko-fi.com/{username}',
    placeholder: 'your_username',
    label: 'Ko-fi Username',
    extractUsername: (input) => {
      const match = input.match(/(?:ko-fi\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  buymeacoffee: {
    template: 'https://buymeacoffee.com/{username}',
    placeholder: 'your_username',
    label: 'Buy Me a Coffee Username',
    extractUsername: (input) => {
      const match = input.match(/(?:buymeacoffee\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  soundcloud: {
    template: 'https://soundcloud.com/{username}',
    placeholder: 'your_username',
    label: 'SoundCloud Username',
    extractUsername: (input) => {
      const match = input.match(/(?:soundcloud\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  bandcamp: {
    template: 'https://{username}.bandcamp.com',
    placeholder: 'your_username',
    label: 'Bandcamp Username',
    extractUsername: (input) => {
      const match = input.match(/(?:([a-zA-Z0-9_-]+)\.bandcamp\.com|bandcamp\.com\/([a-zA-Z0-9_-]+))/i)
      return match ? (match[1] || match[2]) : input
    }
  },
  apple_music: {
    template: 'https://music.apple.com/profile/{username}',
    placeholder: 'your_username',
    label: 'Apple Music Username',
    extractUsername: (input) => {
      const match = input.match(/(?:music\.apple\.com\/profile\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  deezer: {
    template: 'https://deezer.com/profile/{username}',
    placeholder: 'your_username',
    label: 'Deezer Username',
    extractUsername: (input) => {
      const match = input.match(/(?:deezer\.com\/profile\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  steam: {
    template: 'https://steamcommunity.com/id/{username}',
    placeholder: 'your_username',
    label: 'Steam Username',
    extractUsername: (input) => {
      const match = input.match(/(?:steamcommunity\.com\/id\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  xbox: {
    template: 'https://account.xbox.com/profile?gamertag={username}',
    placeholder: 'your_gamertag',
    label: 'Xbox Gamertag',
    extractUsername: (input) => input
  },
  playstation: {
    template: 'https://psnprofiles.com/{username}',
    placeholder: 'your_psn_id',
    label: 'PlayStation Network ID',
    extractUsername: (input) => {
      const match = input.match(/(?:psnprofiles\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  nintendo: {
    template: 'https://nintendo.com/us/switch/friend/{username}',
    placeholder: 'your_friend_code',
    label: 'Nintendo Friend Code',
    extractUsername: (input) => input
  },
  epic_games: {
    template: 'https://fortnitetracker.com/profile/all/{username}',
    placeholder: 'your_epic_username',
    label: 'Epic Games Username',
    extractUsername: (input) => input
  },
  vimeo: {
    template: 'https://vimeo.com/{username}',
    placeholder: 'your_username',
    label: 'Vimeo Username',
    extractUsername: (input) => {
      const match = input.match(/(?:vimeo\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  dailymotion: {
    template: 'https://dailymotion.com/{username}',
    placeholder: 'your_username',
    label: 'Dailymotion Username',
    extractUsername: (input) => {
      const match = input.match(/(?:dailymotion\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  rumble: {
    template: 'https://rumble.com/c/{username}',
    placeholder: 'your_channel',
    label: 'Rumble Channel',
    extractUsername: (input) => {
      const match = input.match(/(?:rumble\.com\/c\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  odysee: {
    template: 'https://odysee.com/@{username}',
    placeholder: 'your_channel',
    label: 'Odysee Channel',
    extractUsername: (input) => {
      const match = input.match(/(?:odysee\.com\/@)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  bitchute: {
    template: 'https://bitchute.com/channel/{username}',
    placeholder: 'your_channel',
    label: 'BitChute Channel',
    extractUsername: (input) => {
      const match = input.match(/(?:bitchute\.com\/channel\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  mastodon: {
    template: 'https://mastodon.social/@{username}',
    placeholder: 'your_username',
    label: 'Mastodon Username',
    extractUsername: (input) => {
      const match = input.match(/(?:mastodon\.social\/@|@)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  threads: {
    template: 'https://threads.net/@{username}',
    placeholder: 'your_username',
    label: 'Threads Username',
    extractUsername: (input) => {
      const match = input.match(/(?:threads\.net\/@|@)?([a-zA-Z0-9_.]+)/i)
      return match ? match[1] : input
    }
  },
  bluesky: {
    template: 'https://bsky.app/profile/{username}',
    placeholder: 'your_username.bsky.social',
    label: 'Bluesky Handle',
    extractUsername: (input) => {
      const match = input.match(/(?:bsky\.app\/profile\/)?([a-zA-Z0-9._-]+)/i)
      return match ? match[1] : input
    }
  },
  clubhouse: {
    template: 'https://clubhouse.com/@{username}',
    placeholder: 'your_username',
    label: 'Clubhouse Username',
    extractUsername: (input) => {
      const match = input.match(/(?:clubhouse\.com\/@|@)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  calendly: {
    template: 'https://calendly.com/{username}',
    placeholder: 'your_username',
    label: 'Calendly Username',
    extractUsername: (input) => {
      const match = input.match(/(?:calendly\.com\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  linktree: {
    template: 'https://linktr.ee/{username}',
    placeholder: 'your_username',
    label: 'Linktree Username',
    extractUsername: (input) => {
      const match = input.match(/(?:linktr\.ee\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  beacons: {
    template: 'https://beacons.ai/{username}',
    placeholder: 'your_username',
    label: 'Beacons Username',
    extractUsername: (input) => {
      const match = input.match(/(?:beacons\.ai\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  carrd: {
    template: 'https://{username}.carrd.co',
    placeholder: 'your_username',
    label: 'Carrd Username',
    extractUsername: (input) => {
      const match = input.match(/(?:([a-zA-Z0-9_-]+)\.carrd\.co|carrd\.co\/([a-zA-Z0-9_-]+))/i)
      return match ? (match[1] || match[2]) : input
    }
  },
  notion: {
    template: 'https://notion.so/{username}',
    placeholder: 'your_page_id',
    label: 'Notion Page',
    extractUsername: (input) => {
      const match = input.match(/(?:notion\.so\/)?([a-zA-Z0-9_-]+)/i)
      return match ? match[1] : input
    }
  },
  substack: {
    template: 'https://{username}.substack.com',
    placeholder: 'your_newsletter',
    label: 'Substack Newsletter',
    extractUsername: (input) => {
      const match = input.match(/(?:([a-zA-Z0-9_-]+)\.substack\.com|substack\.com\/([a-zA-Z0-9_-]+))/i)
      return match ? (match[1] || match[2]) : input
    }
  },
  newsletter: {
    template: '{username}',
    placeholder: 'https://your-newsletter.com',
    label: 'Newsletter URL',
    extractUsername: (input) => input
  },
  blog: {
    template: '{username}',
    placeholder: 'https://your-blog.com',
    label: 'Blog URL',
    extractUsername: (input) => input
  },
  portfolio: {
    template: '{username}',
    placeholder: 'https://your-portfolio.com',
    label: 'Portfolio URL',
    extractUsername: (input) => input
  },
  resume: {
    template: '{username}',
    placeholder: 'https://your-resume.com',
    label: 'Resume URL',
    extractUsername: (input) => input
  },
  cv: {
    template: '{username}',
    placeholder: 'https://your-cv.com',
    label: 'CV URL',
    extractUsername: (input) => input
  },
  email: {
    template: 'mailto:{username}',
    placeholder: 'your@email.com',
    label: 'Email Address',
    extractUsername: (input) => {
      const match = input.match(/(?:mailto:)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      return match ? match[1] : input
    }
  },
  phone: {
    template: 'tel:{username}',
    placeholder: '+1234567890',
    label: 'Phone Number',
    extractUsername: (input) => {
      const match = input.match(/(?:tel:)?(\+?[\d\s\-\(\)]+)/i)
      return match ? match[1] : input
    }
  },
  contact: {
    template: '{username}',
    placeholder: 'https://your-contact-form.com',
    label: 'Contact Form URL',
    extractUsername: (input) => input
  },
  booking: {
    template: '{username}',
    placeholder: 'https://your-booking-page.com',
    label: 'Booking Page URL',
    extractUsername: (input) => input
  },
  appointment: {
    template: '{username}',
    placeholder: 'https://your-appointment-page.com',
    label: 'Appointment Page URL',
    extractUsername: (input) => input
  },
  consultation: {
    template: '{username}',
    placeholder: 'https://your-consultation-page.com',
    label: 'Consultation Page URL',
    extractUsername: (input) => input
  },
  store: {
    template: '{username}',
    placeholder: 'https://your-store.com',
    label: 'Online Store URL',
    extractUsername: (input) => input
  },
  shop: {
    template: '{username}',
    placeholder: 'https://your-shop.com',
    label: 'Shop URL',
    extractUsername: (input) => input
  },
  marketplace: {
    template: '{username}',
    placeholder: 'https://your-marketplace-profile.com',
    label: 'Marketplace Profile URL',
    extractUsername: (input) => input
  },
  other: {
    template: '{username}',
    placeholder: 'https://your-custom-link.com',
    label: 'Custom Link URL',
    extractUsername: (input) => input
  },
  twitch: {
    template: 'https://twitch.tv/{username}',
    placeholder: 'your_channel',
    label: 'Twitch Channel',
    extractUsername: (input) => {
      const match = input.match(/(?:twitch\.tv\/)?([a-zA-Z0-9_]+)/i)
      return match ? match[1] : input
    }
  },
  spotify: {
    template: 'https://open.spotify.com/user/{username}',
    placeholder: 'your_user_id',
    label: 'Spotify User ID',
    extractUsername: (input) => {
      const match = input.match(/(?:open\.spotify\.com\/user\/)?([a-zA-Z0-9]+)/i)
      return match ? match[1] : input
    }
  },
  website: {
    template: '{username}',
    placeholder: 'https://yourwebsite.com',
    label: 'Website URL',
    extractUsername: (input) => input // For websites, we keep the full URL
  },
}

const platforms = Object.keys(platformTemplates)

export function SocialLinkForm({ initialData, onSubmit, onCancel, loading = false }: SocialLinkFormProps) {
  const [formData, setFormData] = useState({
    platform: initialData?.platform || '',
    username: '',
    displayName: initialData?.display_name || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewUrl, setPreviewUrl] = useState('')

  // Initialize username from existing URL if editing
  useEffect(() => {
    if (initialData && initialData.platform && initialData.url) {
      const platformConfig = platformTemplates[initialData.platform]
      if (platformConfig) {
        const extractedUsername = platformConfig.extractUsername(initialData.url)
        setFormData(prev => ({ ...prev, username: extractedUsername }))
      }
    }
  }, [initialData])

  // Update preview URL when platform or username changes
  useEffect(() => {
    if (formData.platform && formData.username) {
      const platformConfig = platformTemplates[formData.platform]
      if (platformConfig) {
        const cleanUsername = platformConfig.extractUsername(formData.username)
        const url = platformConfig.template.replace('{username}', cleanUsername)
        setPreviewUrl(url)
      }
    } else {
      setPreviewUrl('')
    }
  }, [formData.platform, formData.username])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.platform) {
      newErrors.platform = 'Platform is required'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username/ID is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
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

    const platformConfig = platformTemplates[formData.platform]
    const cleanUsername = platformConfig.extractUsername(formData.username)
    const finalUrl = platformConfig.template.replace('{username}', cleanUsername)

    try {
      await onSubmit({
        platform: formData.platform,
        url: finalUrl,
        displayName: formData.displayName || undefined,
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const selectedPlatform = platformTemplates[formData.platform]
  const Icon = formData.platform ? platformIcons[formData.platform] : null

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {initialData ? 'Edit Social Link' : 'Add Social Link'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => handleInputChange('platform', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select a platform</option>
            <optgroup label="Social Media">
              <option value="x">X (Twitter)</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="snapchat">Snapchat</option>
              <option value="pinterest">Pinterest</option>
              <option value="reddit">Reddit</option>
              <option value="mastodon">Mastodon</option>
              <option value="threads">Threads</option>
              <option value="bluesky">Bluesky</option>
            </optgroup>
            <optgroup label="Messaging">
              <option value="discord">Discord</option>
              <option value="telegram">Telegram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="clubhouse">Clubhouse</option>
            </optgroup>
            <optgroup label="Professional">
              <option value="github">GitHub</option>
              <option value="behance">Behance</option>
              <option value="dribbble">Dribbble</option>
              <option value="figma">Figma</option>
              <option value="deviantart">DeviantArt</option>
              <option value="medium">Medium</option>
              <option value="portfolio">Portfolio</option>
              <option value="resume">Resume/CV</option>
              <option value="calendly">Calendly</option>
            </optgroup>
            <optgroup label="Content & Media">
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="dailymotion">Dailymotion</option>
              <option value="rumble">Rumble</option>
              <option value="odysee">Odysee</option>
              <option value="bitchute">BitChute</option>
              <option value="twitch">Twitch</option>
            </optgroup>
            <optgroup label="Music & Audio">
              <option value="spotify">Spotify</option>
              <option value="apple_music">Apple Music</option>
              <option value="soundcloud">SoundCloud</option>
              <option value="bandcamp">Bandcamp</option>
              <option value="deezer">Deezer</option>
            </optgroup>
            <optgroup label="Gaming">
              <option value="steam">Steam</option>
              <option value="xbox">Xbox</option>
              <option value="playstation">PlayStation</option>
              <option value="nintendo">Nintendo</option>
              <option value="epic_games">Epic Games</option>
            </optgroup>
            <optgroup label="E-commerce">
              <option value="etsy">Etsy</option>
              <option value="shopify">Shopify</option>
              <option value="amazon">Amazon</option>
              <option value="store">Online Store</option>
              <option value="shop">Shop</option>
              <option value="marketplace">Marketplace</option>
            </optgroup>
            <optgroup label="Support & Funding">
              <option value="patreon">Patreon</option>
              <option value="kofi">Ko-fi</option>
              <option value="buymeacoffee">Buy Me a Coffee</option>
            </optgroup>
            <optgroup label="Publishing">
              <option value="substack">Substack</option>
              <option value="medium">Medium</option>
              <option value="newsletter">Newsletter</option>
              <option value="blog">Blog</option>
              <option value="notion">Notion</option>
            </optgroup>
            <optgroup label="Link Tools">
              <option value="linktree">Linktree</option>
              <option value="beacons">Beacons</option>
              <option value="carrd">Carrd</option>
            </optgroup>
            <optgroup label="Contact">
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="contact">Contact Form</option>
              <option value="booking">Booking</option>
              <option value="appointment">Appointment</option>
              <option value="consultation">Consultation</option>
            </optgroup>
            <optgroup label="Other">
              <option value="website">Website</option>
              <option value="other">Custom Link</option>
            </optgroup>
          </select>
          {errors.platform && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.platform}</p>
          )}
        </div>

        {selectedPlatform && (
          <Input
            label={selectedPlatform.label}
            placeholder={selectedPlatform.placeholder}
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            error={errors.username}
            helperText={formData.platform === 'website' ? 'Enter your full website URL' : 'Enter just your username/handle (we\'ll build the full URL)'}
          />
        )}

        {previewUrl && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {formData.displayName || (formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1))}
                </p>
                <a 
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center"
                >
                  {previewUrl}
                  <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                </a>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Custom Display Name (Optional)"
          placeholder="Leave empty to use platform name"
          value={formData.displayName}
          onChange={(e) => handleInputChange('displayName', e.target.value)}
        />

        <div className="flex space-x-3 pt-2">
          <Button type="submit" loading={loading}>
            {initialData ? 'Update Link' : 'Add Link'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}