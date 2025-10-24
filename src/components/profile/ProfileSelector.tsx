import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Plus, Check, Settings, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export function ProfileSelector() {
  const { userProfiles, currentProfile, setCurrentProfile, createUserProfile } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newProfileName.trim()) {
      toast.error('Profile name is required')
      return
    }

    setLoading(true)
    try {
      await createUserProfile(newProfileName.trim(), isPublic)
      setNewProfileName('')
      setShowCreateForm(false)
      toast.success('Profile created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Profiles
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Profile
        </Button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateProfile} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Input
            label="Profile Name"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="e.g., Professional, Personal, Event"
            className="mb-3"
          />
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Make this profile public
            </label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" size="sm" loading={loading}>
              Create Profile
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCreateForm(false)
                setNewProfileName('')
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {userProfiles.map((profile) => (
          <div
            key={profile.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              currentProfile?.id === profile.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setCurrentProfile(profile)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {currentProfile?.id === profile.id && (
                  <Check className="w-4 h-4 text-blue-600 mr-2" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {profile.name}
                </span>
                {profile.is_default && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Default
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {profile.is_public ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
              <Settings className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {userProfiles.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No profiles yet. Create your first profile to get started.
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Profile
          </Button>
        </div>
      )}
    </Card>
  )
}