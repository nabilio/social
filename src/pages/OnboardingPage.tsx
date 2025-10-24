import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingStep1 } from '../components/onboarding/OnboardingStep1'
import { OnboardingStep2 } from '../components/onboarding/OnboardingStep2'
import { OnboardingStep3 } from '../components/onboarding/OnboardingStep3'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<'creator' | 'standard' | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [platformUsernames, setPlatformUsernames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { user, profile, updateProfile, userProfiles, createUserProfile } = useAuth()

  const handleSelectType = (type: 'creator' | 'standard') => {
    setUserType(type)
  }

  const handleTogglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform)
      }
      return [...prev, platform]
    })
  }

  const handleUpdateUsername = (platform: string, username: string) => {
    setPlatformUsernames(prev => ({
      ...prev,
      [platform]: username
    }))
  }

  const handleSkip = async () => {
    if (user && profile) {
      try {
        await updateProfile({ onboarding_completed: true })
      } catch (error) {
        console.error('Error updating onboarding status:', error)
      }
    }
    navigate('/dashboard')
  }

  const handleNext = () => {
    if (step === 1 && userType) {
      setStep(2)
    } else if (step === 2 && selectedPlatforms.length > 0) {
      setStep(3)
    } else if (step === 3) {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Helper function to build URL from username
  const buildUrlFromUsername = (platform: string, username: string): string => {
    if (!username) return ''

    const cleanUsername = username.trim()

    if (cleanUsername.startsWith('http://') || cleanUsername.startsWith('https://')) {
      return cleanUsername
    }

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
      'cash-app': `https://cash.app/$${cleanUsername.replace('$', '')}`,
      venmo: `https://venmo.com/${cleanUsername.replace('@', '')}`,
      patreon: `https://patreon.com/${cleanUsername}`,
    }

    return templates[platform] || cleanUsername
  }

  const handleComplete = async () => {
    if (!user || !profile) {
      console.warn('User or profile not loaded yet, waiting...')
      return
    }

    setLoading(true)

    try {
      console.log('Starting onboarding completion...')

      let personalProfile = userProfiles.find(p => p.name.toLowerCase().includes('personal') || p.is_default)
      let professionalProfile = userProfiles.find(p => p.name.toLowerCase().includes('professional') || p.name.toLowerCase().includes('pro'))

      if (!personalProfile) {
        console.log('Creating personal profile...')
        personalProfile = await createUserProfile('Personal', true)
      }

      if (userType === 'creator' && !professionalProfile) {
        console.log('Creating professional profile...')
        professionalProfile = await createUserProfile('Professional', true)
      }

      for (const platformId of selectedPlatforms) {
        const username = platformUsernames[platformId]
        if (!username) continue

        const isProfessional = userType === 'creator' &&
          (platformId === 'youtube' || platformId === 'twitch' || platformId === 'patreon')

        const targetProfileId = isProfessional ? professionalProfile?.id : personalProfile?.id

        if (targetProfileId) {
          // Build full URL from username
          const fullUrl = buildUrlFromUsername(platformId, username)
          console.log(`Saving social link: ${platformId} -> ${fullUrl}`)

          await supabase
            .from('onboarding_social_links')
            .insert({
              user_id: user.id,
              platform: platformId,
              username: username,
              profile_id: targetProfileId
            })

          const { data: existingLinks } = await supabase
            .from('social_links')
            .select('order_index')
            .eq('profile_id', targetProfileId)
            .order('order_index', { ascending: false })
            .limit(1)

          const nextOrderIndex = existingLinks && existingLinks.length > 0
            ? existingLinks[0].order_index + 1
            : 0

          await supabase
            .from('social_links')
            .insert({
              user_id: user.id,
              profile_id: targetProfileId,
              platform: platformId,
              url: fullUrl,
              display_name: platformId,
              is_visible: true,
              order_index: nextOrderIndex
            })
        }
      }

      console.log('Updating profile with onboarding completion...')
      await updateProfile({
        user_type: userType!,
        onboarding_completed: true
      })

      console.log('Onboarding completed successfully!')
      toast.success('Welcome to your dashboard!')

      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Error completing onboarding:', error)
      toast.error(error.message || 'Failed to complete onboarding')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {step === 1 && (
            <OnboardingStep1
              selectedType={userType}
              onSelectType={handleSelectType}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
          {step === 2 && (
            <OnboardingStep2
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={handleTogglePlatform}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}
          {step === 3 && (
            <OnboardingStep3
              selectedPlatforms={selectedPlatforms}
              platformUsernames={platformUsernames}
              onUpdateUsername={handleUpdateUsername}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}
        </>
      )}
    </div>
  )
}
