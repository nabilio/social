import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Friendship, Profile } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { 
  Users, UserPlus, UserCheck, UserX, Search, 
  Mail, Clock, Check, X, ArrowLeft 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface FriendshipWithProfile extends Friendship {
  friend_profile?: Profile
  user_profile?: Profile
}

export function FriendsPage() {
  const { user, profile } = useAuth()
  const [friendships, setFriendships] = useState<FriendshipWithProfile[]>([])
  const [pendingRequests, setPendingRequests] = useState<FriendshipWithProfile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadFriendships()
    }
  }, [user])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const loadFriendships = async () => {
    if (!user) return

    try {
      // Load accepted friendships
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:profiles!friendships_friend_id_fkey(*),
          user_profile:profiles!friendships_user_id_fkey(*)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted')

      if (friendshipsError) throw friendshipsError

      // Load pending requests (received)
      const { data: pendingData, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          *,
          user_profile:profiles!friendships_user_id_fkey(*)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending')

      if (pendingError) throw pendingError

      setFriendships(friendshipsData || [])
      setPendingRequests(pendingData || [])
    } catch (error) {
      console.error('Error loading friendships:', error)
      toast.error('Failed to load friends')
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
        .neq('id', user?.id || '')
        .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .limit(10)

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Failed to search users')
    } finally {
      setSearching(false)
    }
  }

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return

    setActionLoading(friendId)
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Friend request sent!')
      setSearchResults(prev => prev.filter(p => p.id !== friendId))
    } catch (error: any) {
      console.error('Error sending friend request:', error)
      if (error.code === '23505') {
        toast.error('Friend request already exists')
      } else {
        toast.error('Failed to send friend request')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const respondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
    setActionLoading(requestId)
    try {
      if (action === 'accept') {
        const { error } = await supabase
          .from('friendships')
          .update({ status: 'accepted' })
          .eq('id', requestId)

        if (error) throw error
        toast.success('Friend request accepted!')
        
        // 📧 Envoyer notification email à celui qui a envoyé la demande
        try {
          const request = pendingRequests.find(r => r.id === requestId)
          if (request?.user_profile && profile) {
            const { data: senderAuth } = await supabase.auth.admin.listUsers()
            const senderUser = senderAuth.users.find(u => u.id === request.user_id)

            if (senderUser?.email) {
              await NotificationService.notifyUserEvent('friend_accepted', senderUser.email, {
                senderName: request.user_profile.display_name,
                friendName: profile.display_name,
                friendUsername: profile.username
              }, false)
              console.log('✅ Friend accepted email sent')
            }
          }
        } catch (emailError) {
          console.error('Failed to send friend accepted email:', emailError)
        }
      } else {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('id', requestId)

        if (error) throw error
        toast.success('Friend request rejected')
      }

      await loadFriendships()
    } catch (error) {
      console.error('Error responding to request:', error)
      toast.error(`Failed to ${action} friend request`)
    } finally {
      setActionLoading(null)
    }
  }

  const removeFriend = async (friendshipId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return

    setActionLoading(friendshipId)
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)

      if (error) throw error

      toast.success('Friend removed')
      await loadFriendships()
    } catch (error) {
      console.error('Error removing friend:', error)
      toast.error('Failed to remove friend')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Friends & Connections
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your SocialID connections and discover new people
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-6 sm:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Find New Friends
          </h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((searchProfile) => (
                <div key={searchProfile.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {searchProfile.avatar_url ? (
                        <img 
                          src={searchProfile.avatar_url} 
                          alt={searchProfile.display_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {searchProfile.display_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {searchProfile.display_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{searchProfile.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/u/${searchProfile.username}`}>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => sendFriendRequest(searchProfile.id)}
                      loading={actionLoading === searchProfile.id}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Friend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card className="mb-6 sm:mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-500" />
              Pending Friend Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {request.user_profile?.avatar_url ? (
                        <img 
                          src={request.user_profile.avatar_url} 
                          alt={request.user_profile.display_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {request.user_profile?.display_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {request.user_profile?.display_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{request.user_profile?.username}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Sent {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => respondToRequest(request.id, 'accept')}
                      loading={actionLoading === request.id}
                      className="flex-1 sm:flex-none"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respondToRequest(request.id, 'reject')}
                      loading={actionLoading === request.id}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Friends List */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            My Friends ({friendships.length})
          </h2>

          {friendships.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No friends yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start building your network! Search for people above or discover users in the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/discover">
                  <Button className="w-full sm:w-auto">
                    <Search className="w-4 h-4 mr-2" />
                    Discover Users
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
                    searchInput?.focus()
                  }}
                  className="w-full sm:w-auto"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Search Friends
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friendships.map((friendship) => {
                // Determine which profile to show (the friend, not the current user)
                const friendProfile = friendship.user_id === user?.id 
                  ? friendship.friend_profile 
                  : friendship.user_profile

                if (!friendProfile) return null

                return (
                  <div key={friendship.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        {friendProfile.avatar_url ? (
                          <img 
                            src={friendProfile.avatar_url} 
                            alt={friendProfile.display_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xl font-bold">
                            {friendProfile.display_name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {friendProfile.display_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{friendProfile.username}
                      </p>
                      {friendProfile.bio && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                          {friendProfile.bio}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Link to={`/u/${friendProfile.username}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFriend(friendship.id)}
                        loading={actionLoading === friendship.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}