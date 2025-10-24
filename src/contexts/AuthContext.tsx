import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile, UserProfile } from '../lib/supabase'
import { NotificationService } from '../lib/notifications'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  userProfiles: UserProfile[]
  currentProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  loadUserProfiles: () => Promise<void>
  setCurrentProfile: (profile: UserProfile) => void
  createUserProfile: (name: string, isPublic?: boolean) => Promise<UserProfile>
  updateUserProfile: (profileId: string, updates: Partial<UserProfile>) => Promise<void>
  deleteUserProfile: (profileId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('Session error:', error.message)
          // If refresh token is invalid, clear everything and start fresh
          if (error.message?.includes('refresh_token_not_found') || 
              error.message?.includes('Invalid Refresh Token')) {
            await signOut()
            return
          }
        }
        
        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error: any) {
        console.warn('Auth initialization error:', error.message)
        // Clear auth state on any initialization error
        await signOut()
      }
    }
    
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          setProfile(null)
          setUserProfiles([])
          setCurrentProfile(null)
          setLoading(false)
        } else {
          setUser(session.user)
          if (session.user) {
            loadProfile(session.user.id)
          }
        }
      } catch (error: any) {
        console.warn('Auth state change error:', error.message)
        // Clear auth state on error
        await signOut()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    try {
      console.log('Loading profile for user:', userId) // Debug log
      
      // Add a small delay to ensure the database transaction is complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      let data, error
      
      try {
        // Test connection first
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (testError) {
          console.error('❌ Supabase connection test failed:', testError)
          throw new Error('Unable to connect to Supabase. Please check your configuration.')
        }
        
        // Now load the actual profile
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        data = result.data
        error = result.error
      } catch (fetchError) {
        console.error('Network error loading profile:', fetchError)
        
        // More specific error handling
        if (fetchError.message?.includes('Failed to fetch')) {
          throw new Error('Unable to connect to the database. Please check your internet connection and try refreshing the page.')
        } else if (fetchError.message?.includes('CORS')) {
          throw new Error('Configuration error: CORS policy issue. Please contact support.')
        } else {
          throw new Error(`Database connection error: ${fetchError.message}`)
        }
      }

      if (error) {
        console.log('Profile loading error:', error) // Debug log
        if (error.code === 'PGRST116') {
          // Profile doesn't exist
          console.log('⚠️ Profile not found for user:', userId)

          // Vérifier si c'est un utilisateur Google OAuth
          const { data: userData } = await supabase.auth.getUser()
          const isGoogleUser = userData.user?.app_metadata?.provider === 'google'

          if (isGoogleUser) {
            console.log('🔵 Google OAuth user without profile - waiting for username selection')
            // Ne pas créer le profil automatiquement pour Google OAuth
            setProfile(null)
            return
          }

          // Pour les autres utilisateurs (email/password), créer le profil automatiquement
          console.log('🔄 Creating profile now...')
          await createMissingProfile(userId)
          return
        } else {
          throw error
        }
      }

      if (data) {
        console.log('Profile loaded:', data) // Debug log
        setProfile(data)
        await loadUserProfiles(data.id)
      } else {
        // Profile doesn't exist
        console.log('⚠️ Profile not found for user:', userId)

        // Vérifier si c'est un utilisateur Google OAuth
        const { data: userData } = await supabase.auth.getUser()
        const isGoogleUser = userData.user?.app_metadata?.provider === 'google'

        if (isGoogleUser) {
          console.log('🔵 Google OAuth user without profile - waiting for username selection')
          // Ne pas créer le profil automatiquement pour Google OAuth
          setProfile(null)
          return
        }

        // Pour les autres utilisateurs (email/password), créer le profil automatiquement
        console.log('🔄 Creating profile now...')
        await createMissingProfile(userId)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Try to reload profile data after a short delay
      setTimeout(() => {
        if (!profile) {
          console.log('Retrying profile load...')
          loadProfile(userId)
        }
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  async function loadUserProfiles(userId?: string) {
    const targetUserId = userId || user?.id
    if (!targetUserId) return

    try {
      console.log('🔄 Loading user profiles for:', targetUserId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      console.log('📋 Found profiles:', data?.length || 0)
      
      if (data && data.length > 0) {
        setUserProfiles(data)
        
        // Set current profile to default if not already set
        if (!currentProfile) {
          const defaultProfile = data.find(p => p.is_default) || data[0]
          setCurrentProfile(defaultProfile)
          console.log('✅ Set current profile:', defaultProfile?.name)
        }
      } else {
        // No profiles exist, create a default one
        console.log('No user profiles found, creating default profile...')
        await createDefaultProfile(targetUserId)
      }
    } catch (error) {
      console.error('Error loading user profiles:', error)
      setUserProfiles([])
    }
  }

  async function createDefaultProfile(userId: string) {
    try {
      // First check if profiles already exist
      const { data: existingProfiles } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)

      if (existingProfiles && existingProfiles.length > 0) {
        console.log('✅ Profiles already exist, using existing ones:', existingProfiles.length)
        setUserProfiles(existingProfiles)
        
        if (!currentProfile) {
          const defaultProfile = existingProfiles.find(p => p.is_default) || existingProfiles[0]
          setCurrentProfile(defaultProfile)
        }
        return
      }

      // Get the user's profile info for the default profile name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single()

      const defaultName = profileData?.display_name || 'Main Profile'
      const slug = defaultName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      
      // Generate unique slug if needed
      let uniqueSlug = slug
      let counter = 1
      
      while (true) {
        const { data: existingSlug } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', userId)
          .eq('slug', uniqueSlug)
          .limit(1)
        
        if (!existingSlug || existingSlug.length === 0) {
          break
        }
        
        uniqueSlug = `${slug}-${counter}`
        counter++
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          name: defaultName,
          slug: uniqueSlug,
          is_public: true,
          is_default: true,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating default profile:', error)
        // If still a duplicate error, try to load existing profiles
        if (error.code === '23505') {
          console.log('Duplicate detected, loading existing profiles...')
          await loadUserProfiles(userId)
          return
        }
        throw error
      }
      
      const newProfiles = [data]
      setUserProfiles(newProfiles)
      
      if (!currentProfile) {
        const defaultProfile = newProfiles.find(p => p.is_default) || newProfiles[0]
        setCurrentProfile(defaultProfile)
      }
      
      console.log('Default profile created successfully:', data)
      
      // 📧 Envoyer email de création de profil par défaut
      if (profile) {
        try {
          const { data: userData } = await supabase.auth.getUser()
          if (userData.user?.email) {
            await NotificationService.notifyUserEvent('profile_created', userData.user.email, {
              displayName: profile.display_name,
              username: profile.username,
              profileName: defaultName,
              profileSlug: uniqueSlug,
              isPublic: true
            }, false)
          }
        } catch (error) {
          console.error('Failed to send profile creation email:', error)
        }
      }
    } catch (error) {
      console.error('Error creating default profile:', error)
      setUserProfiles([])
    }
  }

  async function createMissingProfile(userId: string) {
    try {
      // Attendre un peu pour que les métadonnées OAuth soient disponibles
      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email || ''
      const userMetadata = userData.user?.user_metadata || {}

      console.log('📝 createMissingProfile - User metadata:', {
        email,
        full_name: userMetadata?.full_name,
        name: userMetadata?.name,
        avatar_url: userMetadata?.avatar_url,
        picture: userMetadata?.picture,
        allMetadata: userMetadata
      })

      // Si pas d'email, attendre encore un peu et réessayer
      if (!email) {
        console.log('⚠️ No email found, waiting and retrying...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: retryData } = await supabase.auth.getUser()
        if (!retryData.user?.email) {
          throw new Error('Unable to get user email after retry')
        }
      }

      // Générer le username à partir de l'email (partie avant @)
      const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._\-]/g, '')
      const username = baseUsername || `user${Math.floor(Math.random() * 10000)}`

      console.log('📝 Generated username:', username, 'from email:', email, 'baseUsername:', baseUsername)

      const profileData = {
        id: userId,
        username: username,
        display_name: userMetadata?.full_name || userMetadata?.name || email.split('@')[0] || 'User',
        bio: '',
        avatar_url: userMetadata?.avatar_url || userMetadata?.picture || '',
        is_public: true,
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      // Si le username existe déjà, essayer avec des chiffres aléatoires
      if (error?.code === '23505' && error.message?.includes('username')) {
        for (let i = 0; i < 5; i++) {
          const randomSuffix = Math.floor(Math.random() * 10000)
          const uniqueUsername = `${username}${randomSuffix}`

          const result = await supabase
            .from('profiles')
            .insert({
              ...profileData,
              username: uniqueUsername
            })
            .select()
            .single()

          if (!result.error) {
            setProfile(result.data)
            console.log('Profile created with unique username:', uniqueUsername)
            await loadUserProfiles(userId)
            return
          }
        }
        throw new Error('Could not create unique username')
      }

      if (error) throw error
      setProfile(data)
      console.log('Profile created successfully:', data)
      await loadUserProfiles(userId)
    } catch (error) {
      console.error('Error creating missing profile:', error)
      setProfile(null)
      setUserProfiles([])
      setCurrentProfile(null)
    }
  }
  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    console.log('Signing up with:', { email, username, displayName }) // Debug log
    
    // Vérifier d'abord si le username existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .limit(1)
    
    if (existingProfile && existingProfile.length > 0) {
      throw new Error('Username already exists')
    }
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          display_name: displayName
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }

    console.log('✅ User created successfully')
    
    // Créer le profil immédiatement
    if (authData.user) {
      try {
        const profileData = {
          id: authData.user.id,
          username: username.toLowerCase(),
          display_name: displayName,
          bio: '',
          avatar_url: '',
          is_public: true,
          onboarding_completed: false,
        }
        
        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw profileError
        }

        console.log('Profile created successfully:', profileResult)
        
        // Créer le profil par défaut
        await createDefaultProfile(authData.user.id)
        
        // 📧 Envoyer l'email de bienvenue après création réussie
        try {
          await NotificationService.notifyUserEvent('welcome', email, {
            displayName,
            username: username.toLowerCase()
          }, false)
          console.log('✅ Welcome email sent successfully')
        } catch (error) {
          console.error('❌ Failed to send welcome email:', error)
        }
        
      } catch (error) {
        console.error('Error creating profile after signup:', error)
      }
    }
    
    return
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // Ne pas forcer la redirection ici - laisser App.tsx gérer la redirection
    // vers /onboarding ou /dashboard selon l'état de onboarding_completed
  }

  const signInWithGoogle = async () => {
    console.log('🔄 Starting Google OAuth flow...')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
        scopes: 'email profile',
      }
    })

    if (error) {
      console.error('❌ Google OAuth error:', error)
      throw error
    }

    console.log('✅ Google OAuth initiated successfully:', data)
  }
  const signOut = async () => {
    try {
      // Clear all Supabase-related items from localStorage first
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // Also clear sessionStorage
      const sessionKeysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          sessionKeysToRemove.push(key)
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))

      const { error } = await supabase.auth.signOut()
      if (error) {
        // Ignorer les erreurs de session non trouvée
        if (!error.message?.includes('session_not_found') &&
            !error.message?.includes('Session from session_id claim in JWT does not exist') &&
            !error.message?.includes('refresh_token_not_found') &&
            !error.message?.includes('Invalid Refresh Token')) {
          console.warn('Sign out error:', error.message)
        }
      }
    } catch (error: any) {
      // Ignorer les erreurs de déconnexion
      console.warn('Sign out error (ignoring):', error.message)
    } finally {
      // Toujours nettoyer l'état local
      setUser(null)
      setProfile(null)
      setUserProfiles([])
      setCurrentProfile(null)
      setLoading(false)

      // Rediriger vers la page d'accueil
      window.location.href = '/'
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    console.log('Updating profile with:', updates) // Debug log

    // Ensure we have the required fields
    const email = user.email || ''
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._\-]/g, '')
    const fallbackUsername = baseUsername || `user${Math.floor(Math.random() * 10000)}`

    const profileUpdates: any = {
      username: String(updates.username || profile?.username || fallbackUsername).toLowerCase(),
      display_name: String(updates.display_name || profile?.display_name || 'User'),
      bio: String(updates.bio !== undefined ? updates.bio : (profile?.bio || '')),
      avatar_url: String(updates.avatar_url !== undefined ? updates.avatar_url : (profile?.avatar_url || '')),
      is_public: Boolean(updates.is_public !== undefined ? updates.is_public : (profile?.is_public ?? true)),
    }

    if (updates.user_type !== undefined) {
      profileUpdates.user_type = updates.user_type
    }

    if (updates.onboarding_completed !== undefined) {
      profileUpdates.onboarding_completed = updates.onboarding_completed
    }

    console.log('Final profile updates:', profileUpdates) // Debug log

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .limit(1)

    let data, error

    if (existingProfile && existingProfile.length > 0) {
      // Update existing profile
      const result = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id)
        .select()
        .limit(1)

      data = result.data?.[0]
      error = result.error
    } else {
      // Create new profile
      const newProfileData = {
        id: user.id,
        ...profileUpdates
      }

      const result = await supabase
        .from('profiles')
        .insert(newProfileData)
        .select()
        .limit(1)

      data = result.data?.[0]
      error = result.error
    }

    if (error) {
      console.error('Supabase error:', error) // Debug log
      throw error
    }
    setProfile(data)
    await loadUserProfiles()
  }

  const createUserProfile = async (name: string, isPublic = true): Promise<UserProfile> => {
    if (!user) throw new Error('No user logged in')

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        name,
        slug,
        is_public: isPublic,
        is_default: userProfiles.length === 0, // First profile is default
      })
      .select()
      .single()

    if (error) throw error
    
    await loadUserProfiles()
    
    // 📧 Envoyer l'email de notification de création de profil
    if (profile) {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user?.email) {
          await NotificationService.notifyUserEvent('profile_created', userData.user.email, {
            displayName: profile.display_name,
            username: profile.username,
            profileName: name,
            profileSlug: slug,
            isPublic
          }, false)
          console.log('✅ Profile creation email sent successfully')
        }
      } catch (error) {
        console.error('Failed to send profile creation email:', error)
      }
    }
    
    return data
  }

  const updateUserProfile = async (profileId: string, updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', profileId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    
    await loadUserProfiles()
    
    // Update current profile if it was the one being updated
    if (currentProfile?.id === profileId) {
      setCurrentProfile(data)
    }
  }

  const deleteUserProfile = async (profileId: string) => {
    if (!user) throw new Error('No user logged in')
    
    // Don't allow deleting the last profile
    if (userProfiles.length <= 1) {
      throw new Error('Cannot delete the last profile')
    }
    
    // Don't allow deleting default profile if there are others
    const profileToDelete = userProfiles.find(p => p.id === profileId)
    if (profileToDelete?.is_default && userProfiles.length > 1) {
      throw new Error('Cannot delete default profile. Set another profile as default first.')
    }

    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', profileId)
      .eq('user_id', user.id)

    if (error) throw error
    
    await loadUserProfiles()
    
    // If we deleted the current profile, switch to default
    if (currentProfile?.id === profileId) {
      const defaultProfile = userProfiles.find(p => p.is_default && p.id !== profileId)
      setCurrentProfile(defaultProfile || userProfiles[0] || null)
    }
  }

  const value = {
    user,
    profile,
    userProfiles,
    currentProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    loadUserProfiles,
    setCurrentProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}