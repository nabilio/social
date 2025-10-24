import { supabase } from './supabase'

export interface AdminUserData {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  banned_until: string | null
  profile?: {
    id: string
    username: string
    display_name: string
    bio: string
    avatar_url: string
    is_public: boolean
    created_at: string
    updated_at: string
  }
}

export class AdminService {
  // Check if user has admin privileges
  static isAdmin(userEmail: string): boolean {
    const adminEmails = [
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    ]
    return adminEmails.includes(userEmail)
  }

  // Get all users with real emails from auth.users
  static async getAllUsers(): Promise<AdminUserData[]> {
    try {
      console.log('📋 AdminService: Getting all users via Edge Function...')
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-get-users`
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(apiUrl, { 
        method: 'GET',
        headers 
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ AdminService: Edge Function error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`Failed to fetch users (${response.status}): ${errorText}`)
      }
      
      const responseData = await response.json()
      console.log('✅ AdminService: Response received:', {
        isArray: Array.isArray(responseData),
        length: Array.isArray(responseData) ? responseData.length : 'not array',
        type: typeof responseData
      })
      
      // Ensure we return an array
      if (!Array.isArray(responseData)) {
        console.error('❌ AdminService: Response is not an array:', responseData)
        throw new Error('Invalid response format: expected array of users')
      }
      
      return responseData
    } catch (error) {
      console.error('❌ AdminService: Error fetching users:', error)
      throw error
    }
  }

  // Delete user via direct database operations
  static async deleteUser(userId: string): Promise<void> {
    try {
      console.log('🗑️ AdminService: Deleting user via Edge Function:', userId)
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-delete-user`
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ AdminService: Delete user error:', errorText)
        throw new Error(`Failed to delete user: ${errorText}`)
      }
      
      console.log('✅ AdminService: User deleted successfully')
    } catch (error) {
      console.error('❌ AdminService: Error deleting user:', error)
      throw error
    }
  }

  // Toggle user ban via profile updates
  static async toggleUserBan(userId: string, ban: boolean): Promise<void> {
    try {
      console.log(`🔄 AdminService: ${ban ? 'Banning' : 'Unbanning'} user via Edge Function:`, userId)
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-toggle-ban`
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, ban })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ AdminService: Toggle ban error:', errorText)
        throw new Error(`Failed to ${ban ? 'ban' : 'unban'} user: ${errorText}`)
      }
      
      console.log(`✅ User ${ban ? 'banned' : 'unbanned'} successfully`)
    } catch (error) {
      console.error(`❌ AdminService: Error ${ban ? 'banning' : 'unbanning'} user:`, error)
      throw error
    }
  }

  // Confirm user email (simulated via profile update)
  static async confirmUserEmail(userId: string): Promise<void> {
    try {
      console.log('✉️ AdminService: Confirming email via Edge Function:', userId)
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-confirm-email`
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ AdminService: Confirm email error:', errorText)
        throw new Error(`Failed to confirm email: ${errorText}`)
      }
      
      console.log('✅ Email confirmed successfully')
    } catch (error) {
      console.error('❌ AdminService: Error confirming email:', error)
      throw error
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    unconfirmed: number
    newToday: number
    newThisWeek: number
    newThisMonth: number
  }> {
    try {
      const users = await this.getAllUsers()
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      return {
        total: users.length,
        active: users.filter(u => !u.banned_until && u.email_confirmed_at).length,
        inactive: users.filter(u => u.banned_until || !u.email_confirmed_at).length,
        unconfirmed: users.filter(u => !u.email_confirmed_at).length,
        newToday: users.filter(u => new Date(u.created_at) >= today).length,
        newThisWeek: users.filter(u => new Date(u.created_at) >= weekAgo).length,
        newThisMonth: users.filter(u => new Date(u.created_at) >= monthAgo).length
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      throw error
    }
  }

  // Bulk operations
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    try {
      for (const userId of userIds) {
        await this.deleteUser(userId)
      }
    } catch (error) {
      console.error('Error in bulk delete:', error)
      throw error
    }
  }

  static async bulkBanUsers(userIds: string[]): Promise<void> {
    try {
      for (const userId of userIds) {
        await this.toggleUserBan(userId, true)
      }
    } catch (error) {
      console.error('Error in bulk ban:', error)
      throw error
    }
  }

}