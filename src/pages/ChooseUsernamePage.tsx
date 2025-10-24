import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function ChooseUsernamePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (profile) {
      navigate('/onboarding')
    }
  }, [user, profile, navigate])

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null)
      return
    }

    const timer = setTimeout(async () => {
      await checkUsername(username)
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  const checkUsername = async (value: string) => {
    if (value.length < 3) return

    const cleanUsername = value.toLowerCase().replace(/[^a-z0-9._\-]/g, '')
    if (cleanUsername !== value) {
      setUsername(cleanUsername)
      return
    }

    setChecking(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', cleanUsername)
        .maybeSingle()

      if (error) throw error
      setIsAvailable(!data)
    } catch (error) {
      console.error('Error checking username:', error)
      setIsAvailable(null)
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in first')
      return
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    if (!isAvailable) {
      toast.error('Please choose an available username')
      return
    }

    setIsCreating(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email || ''
      const userMetadata = userData.user?.user_metadata || {}

      const profileData = {
        id: user.id,
        username: username.toLowerCase(),
        display_name: userMetadata?.full_name || userMetadata?.name || email.split('@')[0] || 'User',
        bio: '',
        avatar_url: userMetadata?.avatar_url || userMetadata?.picture || '',
        is_public: true,
        onboarding_completed: false
      }

      const { error } = await supabase
        .from('profiles')
        .insert(profileData)

      if (error) {
        if (error.code === '23505') {
          toast.error('This username is already taken')
          setIsAvailable(false)
        } else {
          throw error
        }
        return
      }

      toast.success('Username created successfully!')

      window.location.href = '/onboarding'
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    } finally {
      setIsCreating(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Your Username
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This will be your unique identifier on SocialID
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="pr-10"
                disabled={isCreating}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking && (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                )}
                {!checking && isAvailable === true && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {!checking && isAvailable === false && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-2 text-sm">
              {username.length > 0 && username.length < 3 && (
                <p className="text-orange-600 dark:text-orange-400">
                  Username must be at least 3 characters
                </p>
              )}
              {isAvailable === true && (
                <p className="text-green-600 dark:text-green-400">
                  Username is available!
                </p>
              )}
              {isAvailable === false && (
                <p className="text-red-600 dark:text-red-400">
                  Username is already taken
                </p>
              )}
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Only letters, numbers, dots, underscores, and hyphens
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isAvailable || isCreating || checking}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Continue to Onboarding'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
