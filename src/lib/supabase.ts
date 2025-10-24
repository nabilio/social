import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase Configuration Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'missing'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? 'configured' : 'missing',
    key: supabaseAnonKey ? 'configured' : 'missing'
  })
  throw new Error('Supabase configuration is incomplete. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          bio: string
          avatar_url: string
          is_public: boolean
          user_type: 'creator' | 'standard'
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          bio?: string
          avatar_url?: string
          is_public?: boolean
          user_type?: 'creator' | 'standard'
          onboarding_completed?: boolean
        }
        Update: {
          username?: string
          display_name?: string
          bio?: string
          avatar_url?: string
          is_public?: boolean
          user_type?: 'creator' | 'standard'
          onboarding_completed?: boolean
        }
      }
      social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          url: string
          display_name: string
          is_visible: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          user_id: string
          platform: string
          url: string
          display_name?: string
          is_visible?: boolean
          order_index?: number
        }
        Update: {
          platform?: string
          url?: string
          display_name?: string
          is_visible?: boolean
          order_index?: number
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at: string
        }
        Insert: {
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'blocked'
        }
        Update: {
          status?: 'pending' | 'accepted' | 'blocked'
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          is_default: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          slug: string
          is_default?: boolean
          is_public?: boolean
        }
        Update: {
          name?: string
          slug?: string
          is_default?: boolean
          is_public?: boolean
        }
      }
      onboarding_social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          username: string
          profile_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          platform: string
          username: string
          profile_id?: string | null
        }
        Update: {
          platform?: string
          username?: string
          profile_id?: string | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type OnboardingSocialLink = Database['public']['Tables']['onboarding_social_links']['Row']