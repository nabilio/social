import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { NotificationService } from '../../lib/notifications'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { UserPlus, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminCreateUserProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
}

export function AdminCreateUser({ isOpen, onClose, onUserCreated }: AdminCreateUserProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    bio: '',
    isPublic: true,
    sendWelcomeEmail: true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, hyphens, and underscores'
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
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
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Auto-confirm email for admin-created users
        user_metadata: {
          username: formData.username.toLowerCase(),
          display_name: formData.displayName
        }
      })

      if (authError) throw authError

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: formData.username.toLowerCase(),
          display_name: formData.displayName,
          bio: formData.bio,
          is_public: formData.isPublic
        })

      if (profileError) throw profileError

      // Send welcome email if requested
      if (formData.sendWelcomeEmail) {
        try {
          await NotificationService.notifyUserEvent('welcome', formData.email, {
            displayName: formData.displayName,
            username: formData.username.toLowerCase()
          }, false)
          console.log('✅ Admin-created user welcome email sent')
        } catch (emailError) {
          console.warn('Failed to send welcome email:', emailError)
        }
      }

      toast.success('User created successfully')
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        username: '',
        displayName: '',
        bio: '',
        isPublic: true,
        sendWelcomeEmail: true
      })
      
      onClose()
      onUserCreated()
    } catch (error: any) {
      console.error('Error creating user:', error)
      
      if (error.message?.includes('User already registered')) {
        setErrors({ email: 'Email already exists' })
      } else if (error.message?.includes('username')) {
        setErrors({ username: 'Username already exists' })
      } else {
        toast.error(error.message || 'Failed to create user')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <UserPlus className="w-4 h-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Admin User Creation:</strong> This will create a new user account with email auto-confirmed.
            </p>
          </div>
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="user@example.com"
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={generateRandomPassword}
              className="text-xs"
            >
              Generate Random
            </Button>
          </div>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            placeholder="Minimum 6 characters"
          />
        </div>

        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          error={errors.username}
          placeholder="unique_username"
          helperText="Will be converted to lowercase"
        />

        <Input
          label="Display Name"
          value={formData.displayName}
          onChange={(e) => handleInputChange('displayName', e.target.value)}
          error={errors.displayName}
          placeholder="John Doe"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio (Optional)
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Tell us about this user..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Make profile public
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendWelcomeEmail"
              checked={formData.sendWelcomeEmail}
              onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendWelcomeEmail" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Send welcome email
            </label>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" loading={loading} className="flex-1">
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}