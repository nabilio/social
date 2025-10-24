import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { NotificationService } from '../lib/notifications'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loadUserProfiles } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      console.log('🔄 Processing auth callback...', window.location.href)
      
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Erreur lors de l\'authentification.')
        return
      }

      if (data.session?.user) {
        const user = data.session.user
        console.log('✅ User authenticated:', {
          id: user.id,
          email: user.email,
          provider: user.app_metadata?.provider,
          metadata: user.user_metadata
        })

        // Vérifier si le profil existe déjà
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          // Le profil n'existe pas encore, le créer
          const email = user.email || ''

          // Pour Google OAuth, récupérer les métadonnées
          const googleData = user.user_metadata

          console.log('🔍 Google OAuth metadata:', {
            email,
            full_name: googleData?.full_name,
            name: googleData?.name,
            avatar_url: googleData?.avatar_url,
            picture: googleData?.picture,
            allMetadata: googleData
          })

          // Nouveau utilisateur Google -> rediriger vers la page de choix de username
          console.log('✅ New Google user, redirecting to username selection...')
          // Redirection immédiate sans message
          window.location.href = '/choose-username'
        } else {
          console.log('Profile already exists')
          console.log('✅ Existing profile loaded, onboarding_completed:', existingProfile.onboarding_completed)

          // Redirection immédiate sans message
          if (existingProfile.onboarding_completed) {
            window.location.href = '/dashboard'
          } else {
            window.location.href = '/onboarding'
          }
        }

        return
      }

      setStatus('error')
      setMessage('Aucune session trouvée.')
    } catch (error) {
      console.error('Unexpected error:', error)
      setStatus('error')
      setMessage('Une erreur inattendue s\'est produite.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <div className="text-center py-8">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authenticating...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we sign you in.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Success!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to your dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentication Error
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/signup')} className="w-full">
                  Create New Account
                </Button>
                <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
                  Sign In
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}