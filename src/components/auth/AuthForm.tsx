import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { AlertCircle, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

// Helper function to check if input is email or username
function isEmail(input: string): boolean {
  return /\S+@\S+\.\S+/.test(input)
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp, signInWithGoogle, profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    username: '',
    displayName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showEmailExistsHelp, setShowEmailExistsHelp] = useState(false)
  const [showUsernameExistsHelp, setShowUsernameExistsHelp] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const isSignUp = mode === 'signup'

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      toast.error('Invalid email address')
      return
    }

    setResetLoading(true)
    try {
      // Use our custom email service for password reset
      const { EmailService } = await import('../../lib/emailService')
      
      // Generate a secure reset token
      const resetToken = crypto.randomUUID()
      
      // Store the reset token temporarily
      localStorage.setItem(`reset_token_${resetEmail}`, JSON.stringify({
        token: resetToken,
        email: resetEmail,
        expires: Date.now() + (60 * 60 * 1000) // 1 hour
      }))
      
      // 📧 Send custom reset email
      const success = await NotificationService.notifyUserEvent('password_reset', resetEmail, {
        displayName: resetEmail.split('@')[0],
        resetToken: resetToken
      }, false)
      
      if (!success) {
        throw new Error('Failed to send reset email')
      }
      
      setResetEmailSent(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error: any) {
      console.error('Password reset error:', error)
      toast.error(error.message || 'Failed to send password reset email. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false)
    setResetEmail('')
    setResetEmailSent(false)
  }
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email or username validation
    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = isSignUp ? 'Email is required' : 'Email or username is required'
    } else if (isSignUp && !isEmail(formData.emailOrUsername)) {
      newErrors.emailOrUsername = 'Valid email address is required for signup'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!formData.username) {
        newErrors.username = 'Username is required'
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters'
      } else if (!/^[a-zA-Z0-9._\-]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, dots, hyphens, and underscores'
      }

      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required'
      } else if (formData.displayName.length < 2) {
        newErrors.displayName = 'Display name must be at least 2 characters'
      }
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

    // Reset help states
    setShowEmailExistsHelp(false)
    setShowUsernameExistsHelp(false)

    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(formData.emailOrUsername, formData.password, formData.username.toLowerCase(), formData.displayName)
        // Toujours afficher l'écran de confirmation après inscription
        setEmailSent(true)
      } else {
        // For signin, check if input is email or username
        if (isEmail(formData.emailOrUsername)) {
          await signIn(formData.emailOrUsername, formData.password)
        } else {
          // Find user by username first
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', formData.emailOrUsername.toLowerCase())
            .single()
          
          if (!profile) {
            throw new Error('Username not found')
          }
          
          // Get user email from auth.users
          const { data: users } = await supabase.auth.admin.listUsers()
          const user = users.users.find(u => u.id === profile.id)
          
          if (!user?.email) {
            throw new Error('User email not found')
          }
          
          await signIn(user.email, formData.password)
        }

        // Vérifier si l'utilisateur doit passer par l'onboarding
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single()

        if (userProfile && !userProfile.onboarding_completed) {
          navigate('/onboarding')
          toast.success('👋 Welcome! Please complete your profile.')
        } else {
          navigate('/dashboard')
          toast.success('👋 Bon retour !')
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      // Gestion spécifique des erreurs
      if (error.message?.includes('User already registered') || error.message?.includes('user_already_exists')) {
        setShowEmailExistsHelp(true)
        setErrors(prev => ({ ...prev, emailOrUsername: 'Cette adresse email est déjà utilisée' }))
        toast.error('📧 Cette adresse email est déjà utilisée')
      } else if (error.message?.includes('Username already exists') || error.message?.includes('duplicate key value violates unique constraint "profiles_username_key"')) {
        setShowUsernameExistsHelp(true)
        setErrors(prev => ({ ...prev, username: 'Ce nom d\'utilisateur est déjà pris' }))
        toast.error('👤 Ce nom d\'utilisateur est déjà pris')
      } else if (error.message?.includes('Invalid login credentials') || error.message?.includes('Username not found')) {
        setErrors(prev => ({ ...prev, emailOrUsername: 'Email/nom d\'utilisateur ou mot de passe incorrect', password: 'Email/nom d\'utilisateur ou mot de passe incorrect' }))
        toast.error('🔐 Email ou mot de passe incorrect')
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('📧 Veuillez confirmer votre email avant de vous connecter')
      } else if (error.message?.includes('Signup requires a valid password')) {
        setErrors(prev => ({ ...prev, password: 'Le mot de passe doit contenir au moins 6 caractères' }))
        toast.error('🔐 Le mot de passe doit contenir au moins 6 caractères')
      } else {
        toast.error(error.message || 'Une erreur est survenue')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      console.log('🔄 Initiating Google sign-in...')
      
      // Clear any existing auth state first
      await supabase.auth.signOut()
      
      await signInWithGoogle()
      console.log('✅ Google sign-in initiated successfully')
    } catch (error: any) {
      console.error('Google sign in error:', error)
      if (error.message?.includes('popup_closed_by_user')) {
        console.log('User closed Google sign-in popup')
      } else {
        toast.error(`Erreur Google OAuth: ${error.message}`)
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  // Si l'email de confirmation a été envoyé, afficher le message
  if (emailSent && isSignUp) {
    return (
      <>
      <Card className="max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Check Your Email! 📧
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a confirmation link to:
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              {formData.emailOrUsername}
            </p>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">1.</span>
              <p>Open your email inbox (check spam folder too)</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">2.</span>
              <p>Click the confirmation link</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">3.</span>
              <p>Come back here to sign in</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Ready to sign in?
            </p>
            <div className="space-y-2">
              <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                Sign in now
              </Link>
              <br />
              <Link to="/signup" className="text-gray-600 hover:text-gray-500 text-sm">
                Create another account
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Forgot Password Modal */}
      <Modal 
        isOpen={showForgotPassword} 
        onClose={closeForgotPasswordModal} 
        title="Reset Password"
      >
        {!resetEmailSent ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" loading={resetLoading} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Send Reset Link
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeForgotPasswordModal}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Reset Link Generated! 🔐
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A reset link has been generated for:
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {resetEmail}
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p>• Check the browser console for the reset link</p>
              <p>• Copy and open the link in a new tab</p>
              <p>• Create a new password</p>
            </div>
            
            <Button onClick={closeForgotPasswordModal} className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>
      </>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isSignUp ? 'Create your SocialID' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {isSignUp 
            ? 'Join the community and share your social presence'
            : 'Sign in to your account'
          }
        </p>
        {!isSignUp && (
          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-500 underline"
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={isSignUp ? "Email" : "Email or Username"}
          type={isSignUp ? "email" : "text"}
          value={formData.emailOrUsername}
          onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
          error={errors.emailOrUsername}
          autoComplete={isSignUp ? "email" : "username"}
          placeholder={isSignUp ? "your@email.com" : "your@email.com or username"}
        />
        
        {/* Help for existing email */}
        {showEmailExistsHelp && (
          <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                  Cette adresse email est déjà utilisée
                </p>
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 font-medium"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Se connecter avec ce compte
                  </Link>
                  <br />
                  <button 
                    type="button"
                    onClick={() => {
                      // TODO: Implémenter la réinitialisation de mot de passe
                      toast('🔄 Fonctionnalité de réinitialisation bientôt disponible')
                    }}
                    className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
        />

        {isSignUp && (
          <>
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              error={errors.username}
              autoComplete="username"
              helperText="This will be your unique URL: SocialID.one/u/username"
            />
            
            {/* Help for existing username */}
            {showUsernameExistsHelp && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                      Ce nom d'utilisateur est déjà pris
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Essayez : {formData.username}2, {formData.username}_official, ou {formData.username}{new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              error={errors.displayName}
              autoComplete="name"
              helperText="This is how your name will appear on your profile"
            />
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          loading={googleLoading}
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Connecting...' : (isSignUp ? 'Sign up with Google' : 'Sign in with Google')}
        </Button>
      </form>

      {/* Forgot Password Modal */}
      <Modal 
        isOpen={showForgotPassword} 
        onClose={closeForgotPasswordModal} 
        title="Reset Password"
      >
        {!resetEmailSent ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" loading={resetLoading} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Send Reset Link
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeForgotPasswordModal}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Reset Link Generated! 🔐
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A reset link has been generated for:
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {resetEmail}
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p>• Check the browser console for the reset link</p>
              <p>• Copy and open the link in a new tab</p>
              <p>• Create a new password</p>
            </div>
            
            <Button onClick={closeForgotPasswordModal} className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>
    </Card>
  )
}