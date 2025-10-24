import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { CheckCircle, XCircle, Loader2, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [validToken, setValidToken] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    verifyResetToken()
  }, [])

  const verifyResetToken = async () => {
    try {
      const token = searchParams.get('token')
      
      if (!token) {
        setValidToken(false)
        setVerifying(false)
        return
      }
      
      // Find the stored token data
      let tokenData = null
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('reset_token_')) {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          if (data.token === token) {
            tokenData = data
            setUserEmail(data.email)
            break
          }
        }
      }
      
      if (!tokenData) {
        setValidToken(false)
        setVerifying(false)
        return
      }
      
      // Check if token is expired
      if (Date.now() > tokenData.expires) {
        setValidToken(false)
        setVerifying(false)
        // Clean up expired token
        localStorage.removeItem(`reset_token_${tokenData.email}`)
        return
      }
      
      // Token is valid
      setValidToken(true)
      
    } catch (error) {
      console.error('Token verification error:', error)
      setValidToken(false)
    } finally {
      setVerifying(false)
    }
  }

  const updatePasswordDirectly = async (email: string, newPassword: string) => {
    try {
      // Use Supabase Admin API to update password directly
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) throw listError
      
      const user = users.users.find(u => u.email === email)
      if (!user) throw new Error('User not found')
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
      })
      
      if (updateError) throw updateError
      
      return true
    } catch (error) {
      console.error('Direct password update failed:', error)
      return false
    }
  }

  const signInAndUpdatePassword = async (email: string, newPassword: string) => {
    try {
      // Try to sign in with any password to get a session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'any_password' // This will fail but might give us a session
      })
      
      // Now try to update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (updateError) {
        // If regular update fails, try direct update
        return await updatePasswordDirectly(email, newPassword)
      }
      
      return true
    } catch (error) {
      console.error('Sign in and update failed:', error)
      return await updatePasswordDirectly(email, newPassword)
    }
  }

  const resetPasswordWithEmail = async (email: string, newPassword: string) => {
    try {
      // Method 1: Try to reset password using email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login'
      })
      
      if (!error) {
        // If successful, we need to handle the session manually
        // For now, we'll use a different approach
        return await signInAndUpdatePassword(email, newPassword)
      }
      
      return false
    } catch (error) {
      console.error('Email reset failed:', error)
      return await signInAndUpdatePassword(email, newPassword)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const token = searchParams.get('token')
      if (!token || !userEmail) {
        throw new Error('Invalid reset session')
      }
      
      // Try multiple methods to update the password
      let success = false
      
      // Method 1: Direct admin update
      success = await updatePasswordDirectly(userEmail, password)
      
      if (!success) {
        // Method 2: Sign in and update
        success = await signInAndUpdatePassword(userEmail, password)
      }
      
      if (!success) {
        // Method 3: Email reset flow
        success = await resetPasswordWithEmail(userEmail, password)
      }
      
      if (!success) {
        throw new Error('Failed to update password. Please try again or contact support.')
      }
      
      // Clean up the reset token
      localStorage.removeItem(`reset_token_${userEmail}`)
      
      setSuccess(true)
      toast.success('Password updated successfully!')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (error: any) {
      console.error('Password update error:', error)
      toast.error(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'password') {
      setPassword(value)
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value)
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Verifying...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're verifying your reset link.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This reset link is no longer valid. Please request a new reset link.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Back to Sign In
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Password Updated! ✅
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your password has been updated successfully.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to sign in...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <img 
            src="/logo-social.png" 
            alt="SocialID" 
            className="w-12 h-12 rounded-xl mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            New Password
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Choose a new secure password
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Tips for a secure password:
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• At least 6 characters</li>
                <li>• Mix of letters and numbers</li>
                <li>• Avoid common words</li>
              </ul>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}